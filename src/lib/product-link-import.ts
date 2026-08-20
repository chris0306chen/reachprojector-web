import { isIP, type LookupFunction } from "node:net";
import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

const MAX_HTML_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 4;

export type ProductLinkSource = "brand_website" | "amazon" | "alibaba";

export interface ProductLinkPreview {
  sourceType: ProductLinkSource;
  sourceUrl: string;
  canonicalUrl: string;
  retrievedAt: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  sku: string;
  specifications: Array<{ name: string; value: string }>;
  evidence: Array<{
    field: "title" | "description" | "brand" | "model" | "sku" | "specification";
    label: string;
    value: string;
    source: "product_json_ld" | "page_metadata" | "specification_table" | "description_pattern";
  }>;
  missingFields: string[];
  warnings: string[];
}

function isPrivateAddress(address: string): boolean {
  const normalized = address.toLowerCase().replace(/^::ffff:/, "");
  if (isIP(normalized) === 4) {
    const [a, b, c] = normalized.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 192 && b === 0 && (c === 0 || c === 2))
      || (a === 198 && (b === 18 || b === 19 || b === 51))
      || (a === 203 && b === 0 && c === 113)
      || a >= 224;
  }
  return normalized === "::1" || normalized === "::" || normalized.startsWith("fc")
    || normalized.startsWith("fd") || normalized.startsWith("fe8")
    || normalized.startsWith("fe9") || normalized.startsWith("fea")
    || normalized.startsWith("feb") || normalized.startsWith("ff")
    || normalized.startsWith("2001:db8:");
}

interface ResolvedTarget {
  url: URL;
  address: string;
  family: 4 | 6;
}

async function assertPublicUrl(rawUrl: string): Promise<ResolvedTarget> {
  const url = new URL(rawUrl);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are allowed");
  if (url.username || url.password) throw new Error("URLs with embedded credentials are not allowed");
  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("Private or reserved network addresses are not allowed");
  }
  return {
    url,
    address: addresses[0].address,
    family: addresses[0].family === 6 ? 6 : 4,
  };
}

function classifySource(hostname: string): ProductLinkSource {
  const host = hostname.toLowerCase();
  if (host === "amazon.com" || host.endsWith(".amazon.com") || /\.amazon\.[a-z.]+$/.test(host)) return "amazon";
  if (host === "alibaba.com" || host.endsWith(".alibaba.com")) return "alibaba";
  return "brand_website";
}

function requestHtml(target: ResolvedTarget): Promise<{
  status: number;
  location: string;
  contentType: string;
  declaredLength: number;
  bytes: Uint8Array;
}> {
  return new Promise((resolve, reject) => {
    const pinnedLookup: LookupFunction = (_hostname, options, callback) => {
      if (options.all) {
        callback(null, [{ address: target.address, family: target.family }]);
      } else {
        callback(null, target.address, target.family);
      }
    };
    const request = (target.url.protocol === "https:" ? httpsRequest : httpRequest)(target.url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "ReachProjectorCatalogBot/1.0 (+https://reachprojector.com)",
      },
      lookup: pinnedLookup,
      timeout: 15_000,
    }, (response) => {
      const status = response.statusCode || 0;
      const contentType = String(response.headers["content-type"] || "");
      const declaredLength = Number(response.headers["content-length"] || 0);
      const chunks: Uint8Array[] = [];
      let total = 0;
      response.on("data", (chunk: Buffer) => {
        total += chunk.byteLength;
        if (total > MAX_HTML_BYTES) {
          response.destroy(new Error("Source page is too large"));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => {
        const bytes = new Uint8Array(total);
        let offset = 0;
        for (const chunk of chunks) {
          bytes.set(chunk, offset);
          offset += chunk.byteLength;
        }
        resolve({
          status,
          location: String(response.headers.location || ""),
          contentType,
          declaredLength,
          bytes,
        });
      });
      response.on("error", reject);
    });
    request.on("timeout", () => request.destroy(new Error("Source request timed out")));
    request.on("error", reject);
    request.end();
  });
}

async function fetchHtml(rawUrl: string): Promise<{ html: string; finalUrl: string }> {
  let current = await assertPublicUrl(rawUrl);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const response = await requestHtml(current);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.location;
      if (!location || redirect === MAX_REDIRECTS) throw new Error("Too many or invalid redirects");
      current = await assertPublicUrl(new URL(location, current.url).toString());
      continue;
    }
    if (response.status < 200 || response.status >= 300) throw new Error(`Source returned HTTP ${response.status}`);
    if (!response.contentType.includes("text/html") && !response.contentType.includes("application/xhtml+xml")) {
      throw new Error("Source did not return an HTML page");
    }
    if (response.declaredLength > MAX_HTML_BYTES) throw new Error("Source page is too large");
    return { html: new TextDecoder().decode(response.bytes), finalUrl: current.url.toString() };
  }
  throw new Error("Unable to retrieve source");
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function meta(html: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtml(match[1]);
  }
  return "";
}

function findProduct(value: unknown): Record<string, unknown> | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findProduct(item);
      if (found) return found;
    }
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const types = Array.isArray(record["@type"]) ? record["@type"] : [record["@type"]];
    if (types.some((type) => String(type).toLowerCase() === "product")) return record;
    if (record["@graph"]) return findProduct(record["@graph"]);
  }
  return null;
}

function extractProductJsonLd(html: string): Record<string, unknown> | null {
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const product = findProduct(JSON.parse(match[1].trim()));
      if (product) return product;
    } catch {
      // Ignore malformed third-party JSON-LD.
    }
  }
  return null;
}

function absoluteHttpUrl(value: string, base: string): string | null {
  try {
    const url = new URL(value, base);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function stripTags(value: string): string {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
}

function extractHtmlSpecifications(html: string): Array<{ name: string; value: string }> {
  const result: Array<{ name: string; value: string }> = [];
  const add = (name: string, value: string) => {
    const cleanName = stripTags(name);
    const cleanValue = stripTags(value);
    if (!cleanName || !cleanValue || cleanName.length > 120 || cleanValue.length > 500) return;
    if (!result.some((item) => item.name.toLowerCase() === cleanName.toLowerCase())) {
      result.push({ name: cleanName, value: cleanValue });
    }
  };
  for (const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((cell) => cell[1]);
    if (cells.length === 2) add(cells[0], cells[1]);
  }
  for (const term of html.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi)) {
    add(term[1], term[2]);
  }
  return result;
}

function extractDescriptionSpecifications(description: string): Array<{ name: string; value: string }> {
  const patterns: Array<[string, RegExp, (match: RegExpMatchArray) => string]> = [
    ["Brightness", /\b(\d{3,5})\s*ISO\s*lumens?\b/i, (match) => `${match[1]} ISO lumens`],
    ["Native Contrast", /\b([\d,]+:\d+)\s*native contrast\b/i, (match) => match[1]],
    ["Color Gamut", /\b(\d{2,3}%\s*Rec\.?\s*2020)\b/i, (match) => match[1]],
    ["Input Lag", /\b(\d+(?:\.\d+)?)\s*ms\s*(?:latency|input lag)\b/i, (match) => `${match[1]} ms`],
    ["Throw Ratio", /\b(\d(?:\.\d+)?:1)\s*throw ratio\b/i, (match) => match[1]],
  ];
  return patterns.flatMap(([name, pattern, format]) => {
    const match = description.match(pattern);
    return match ? [{ name, value: format(match) }] : [];
  });
}

export async function collectProductLink(rawUrl: string): Promise<ProductLinkPreview> {
  const initial = await assertPublicUrl(rawUrl);
  const sourceType = classifySource(initial.url.hostname);
  const warnings: string[] = [];
  if (sourceType !== "brand_website") {
    warnings.push("Marketplace pages may restrict automated access. Use an authorized platform API or supplier export when extraction is incomplete.");
  }
  const { html, finalUrl } = await fetchHtml(initial.url.toString());
  const product = extractProductJsonLd(html);
  const brandValue = product?.brand;
  const brand = typeof brandValue === "string" ? brandValue
    : brandValue && typeof brandValue === "object" ? String((brandValue as Record<string, unknown>).name || "") : "";
  const title = String(product?.name || meta(html, "og:title") || meta(html, "twitter:title")
    || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
  const description = decodeHtml(String(product?.description || meta(html, "og:description")
    || meta(html, "description") || ""));
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  const canonicalUrl = absoluteHttpUrl(canonicalMatch?.[1] || finalUrl, finalUrl) || finalUrl;
  if (!product) warnings.push("No Product JSON-LD was found; review all extracted fields.");
  if (!title) warnings.push("Product title is missing.");

  const additional = product?.additionalProperty;
  const structuredSpecifications = Array.isArray(additional) ? additional.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const name = String(record.name || "").trim();
    const value = String(record.value || "").trim();
    return name && value ? [{ name, value }] : [];
  }) : [];
  const specifications = [
    ...structuredSpecifications,
    ...extractHtmlSpecifications(html),
    ...extractDescriptionSpecifications(description),
  ].filter((item, index, items) => items.findIndex(
    (candidate) => candidate.name.toLowerCase() === item.name.toLowerCase()
  ) === index).slice(0, 80);

  const evidence: ProductLinkPreview["evidence"] = [];
  const addEvidence = (
    field: ProductLinkPreview["evidence"][number]["field"],
    label: string,
    value: string,
    source: ProductLinkPreview["evidence"][number]["source"]
  ) => {
    const cleanValue = decodeHtml(String(value || "")).slice(0, 500);
    if (cleanValue) evidence.push({ field, label, value: cleanValue, source });
  };
  addEvidence("title", "Product name", title, product?.name ? "product_json_ld" : "page_metadata");
  addEvidence("description", "Source description", description, product?.description ? "product_json_ld" : "page_metadata");
  addEvidence("brand", "Brand", brand, product?.brand ? "product_json_ld" : "page_metadata");
  addEvidence("model", "Model", String(product?.model || product?.mpn || ""), "product_json_ld");
  addEvidence("sku", "SKU", String(product?.sku || ""), "product_json_ld");
  for (const item of specifications) {
    const inStructuredData = structuredSpecifications.some(
      (candidate) => candidate.name.toLowerCase() === item.name.toLowerCase()
    );
    addEvidence(
      "specification",
      item.name,
      item.value,
      inStructuredData ? "product_json_ld" : "specification_table"
    );
  }
  const missingFields = [
    !title ? "Product name" : "",
    !brand ? "Brand" : "",
    !(product?.model || product?.mpn) ? "Model" : "",
    !product?.sku ? "SKU" : "",
    !description ? "Source description" : "",
    !specifications.length ? "Specifications" : "",
  ].filter(Boolean);

  return {
    sourceType,
    sourceUrl: initial.url.toString(),
    canonicalUrl,
    retrievedAt: new Date().toISOString(),
    title: decodeHtml(title),
    description,
    brand: decodeHtml(brand),
    model: String(product?.model || product?.mpn || "").trim(),
    sku: String(product?.sku || "").trim(),
    specifications,
    evidence,
    missingFields,
    warnings,
  };
}
