import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

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
  mainImages: string[];
  detailImages: string[];
  specifications: Array<{ name: string; value: string }>;
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

async function assertPublicUrl(rawUrl: string): Promise<URL> {
  const url = new URL(rawUrl);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are allowed");
  if (url.username || url.password) throw new Error("URLs with embedded credentials are not allowed");
  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("Private or reserved network addresses are not allowed");
  }
  return url;
}

function classifySource(hostname: string): ProductLinkSource {
  const host = hostname.toLowerCase();
  if (host === "amazon.com" || host.endsWith(".amazon.com") || /\.amazon\.[a-z.]+$/.test(host)) return "amazon";
  if (host === "alibaba.com" || host.endsWith(".alibaba.com")) return "alibaba";
  return "brand_website";
}

async function fetchHtml(rawUrl: string): Promise<{ html: string; finalUrl: string }> {
  let current = (await assertPublicUrl(rawUrl)).toString();
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "ReachProjectorCatalogBot/1.0 (+https://reachprojector.com)",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location || redirect === MAX_REDIRECTS) throw new Error("Too many or invalid redirects");
      current = (await assertPublicUrl(new URL(location, current).toString())).toString();
      continue;
    }
    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("Source did not return an HTML page");
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_HTML_BYTES) throw new Error("Source page is too large");
    if (!response.body) throw new Error("Source returned an empty response");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_HTML_BYTES) {
        await reader.cancel();
        throw new Error("Source page is too large");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { html: new TextDecoder().decode(bytes), finalUrl: current };
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

function strings(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(strings);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  if (value && typeof value === "object" && "url" in value) return strings((value as { url: unknown }).url);
  return [];
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

function imageKey(value: string): string {
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname}`.toLowerCase();
  } catch {
    return value.toLowerCase();
  }
}

function extractDetailImages(html: string, base: string, identity: string, mainImages: string[]): string[] {
  const stopWords = new Set(["projector", "laser", "ultra", "product", "vision"]);
  const tokens = identity.toLowerCase().split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !stopWords.has(token));
  const mainKeys = new Set(mainImages.map(imageKey));
  const found = new Map<string, string>();
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const attr = (name: string) => tag.match(
      new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
    )?.slice(1).find(Boolean) || "";
    const srcset = attr("srcset");
    const source = attr("data-src") || attr("data-original") || attr("src")
      || srcset.split(",")[0]?.trim().split(/\s+/)[0] || "";
    const url = absoluteHttpUrl(decodeHtml(source), base);
    const alt = decodeHtml(attr("alt"));
    if (!url || /\.(?:svg|ico)(?:\?|$)/i.test(url) || /logo|icon|placeholder|spinner/i.test(`${url} ${alt}`)) continue;
    const haystack = `${url} ${alt}`.toLowerCase();
    if (tokens.length && !tokens.some((token) => haystack.includes(token))) continue;
    const key = imageKey(url);
    if (!mainKeys.has(key) && !found.has(key)) found.set(key, url);
    if (found.size >= 20) break;
  }
  return [...found.values()];
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
  const sourceType = classifySource(initial.hostname);
  const warnings: string[] = [];
  if (sourceType !== "brand_website") {
    warnings.push("Marketplace pages may restrict automated access. Use an authorized platform API or supplier export when extraction is incomplete.");
  }
  const { html, finalUrl } = await fetchHtml(initial.toString());
  const product = extractProductJsonLd(html);
  const brandValue = product?.brand;
  const brand = typeof brandValue === "string" ? brandValue
    : brandValue && typeof brandValue === "object" ? String((brandValue as Record<string, unknown>).name || "") : "";
  const title = String(product?.name || meta(html, "og:title") || meta(html, "twitter:title")
    || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
  const description = decodeHtml(String(product?.description || meta(html, "og:description")
    || meta(html, "description") || ""));
  const images = [...strings(product?.image), meta(html, "og:image")]
    .map((value) => absoluteHttpUrl(value, finalUrl))
    .filter((value): value is string => Boolean(value));
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  const canonicalUrl = absoluteHttpUrl(canonicalMatch?.[1] || finalUrl, finalUrl) || finalUrl;
  if (!product) warnings.push("No Product JSON-LD was found; review all extracted fields.");
  const mainImages = [...new Map(images.map((url) => [imageKey(url), url])).values()].slice(0, 10);
  const detailImages = extractDetailImages(html, finalUrl, title, mainImages);
  if (!mainImages.length) warnings.push("No product main images were found.");
  if (!detailImages.length) warnings.push("No distinct product detail images were found.");
  if (mainImages.length || detailImages.length) warnings.push("Review manufacturer media rights before publishing.");
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

  return {
    sourceType,
    sourceUrl: initial.toString(),
    canonicalUrl,
    retrievedAt: new Date().toISOString(),
    title: decodeHtml(title),
    description,
    brand: decodeHtml(brand),
    model: String(product?.model || product?.mpn || "").trim(),
    sku: String(product?.sku || "").trim(),
    mainImages,
    detailImages,
    specifications,
    warnings,
  };
}
