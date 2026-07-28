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
  price: number | null;
  currency: string;
  images: string[];
  specifications: Array<{ name: string; value: string }>;
  warnings: string[];
}

function isPrivateAddress(address: string): boolean {
  const normalized = address.toLowerCase().replace(/^::ffff:/, "");
  if (isIP(normalized) === 4) {
    const [a, b] = normalized.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
      || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  return normalized === "::1" || normalized === "::" || normalized.startsWith("fc")
    || normalized.startsWith("fd") || normalized.startsWith("fe8")
    || normalized.startsWith("fe9") || normalized.startsWith("fea")
    || normalized.startsWith("feb");
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
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > MAX_HTML_BYTES) throw new Error("Source page is too large");
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

export async function collectProductLink(rawUrl: string): Promise<ProductLinkPreview> {
  const initial = await assertPublicUrl(rawUrl);
  const sourceType = classifySource(initial.hostname);
  const warnings: string[] = [];
  if (sourceType !== "brand_website") {
    warnings.push("Marketplace pages may restrict automated access. Use an authorized platform API or supplier export when extraction is incomplete.");
  }
  const { html, finalUrl } = await fetchHtml(initial.toString());
  const product = extractProductJsonLd(html);
  const offers = product?.offers && typeof product.offers === "object"
    ? (Array.isArray(product.offers) ? product.offers[0] : product.offers) as Record<string, unknown>
    : {};
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
  const priceNumber = Number(offers?.price);
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  const canonicalUrl = absoluteHttpUrl(canonicalMatch?.[1] || finalUrl, finalUrl) || finalUrl;
  if (!product) warnings.push("No Product JSON-LD was found; review all extracted fields.");
  if (!images.length) warnings.push("No publishable product images were found.");
  if (!title) warnings.push("Product title is missing.");

  const additional = product?.additionalProperty;
  const specifications = Array.isArray(additional) ? additional.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const name = String(record.name || "").trim();
    const value = String(record.value || "").trim();
    return name && value ? [{ name, value }] : [];
  }).slice(0, 80) : [];

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
    price: Number.isFinite(priceNumber) && priceNumber > 0 ? priceNumber : null,
    currency: String(offers?.priceCurrency || "USD").toUpperCase().slice(0, 3),
    images: [...new Set(images)].slice(0, 20),
    specifications,
    warnings,
  };
}
