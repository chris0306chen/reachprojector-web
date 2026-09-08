export type ProductSaleMode = "retail" | "retail_and_bulk" | "quote_only";

export interface ProductCommerceProfile {
  saleMode: ProductSaleMode;
  marketVersion: string;
  systemLanguage: string;
  streamingSetup: string;
  plugAndVoltage: string;
  warranty: string;
  duties: string;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getProductCommerceProfile(
  importData: Record<string, unknown> | null | undefined
): ProductCommerceProfile {
  const data = importData && typeof importData === "object" ? importData : {};
  const nested = data.commerce_profile && typeof data.commerce_profile === "object"
    ? data.commerce_profile as Record<string, unknown>
    : {};
  const requestedMode = text(nested.sale_mode || data.sale_mode);
  const saleMode: ProductSaleMode = requestedMode === "quote_only" || requestedMode === "retail_and_bulk"
    ? requestedMode
    : "retail";

  return {
    saleMode,
    marketVersion: text(nested.market_version || data.product_version),
    systemLanguage: text(nested.system_language || data.system_language),
    streamingSetup: text(nested.streaming_setup),
    plugAndVoltage: text(nested.plug_and_voltage || data.plug_type),
    warranty: text(nested.warranty || data.warranty),
    duties: text(nested.duties),
  };
}

export function getProductDecisionFacts(
  specifications: Record<string, string> | null | undefined,
  importData: Record<string, unknown> | null | undefined
): string[] {
  const specs = specifications || {};
  const normalized = Object.entries(specs).map(([name, value]) => ({
    name: name.toLowerCase(),
    value: String(value).trim(),
  }));
  const find = (...terms: string[]) => normalized.find(({ name }) => terms.some((term) => name.includes(term)))?.value;
  const profile = getProductCommerceProfile(importData);
  return [
    find("resolution"),
    find("light source", "laser"),
    find("throw ratio", "throw type"),
    find("brightness", "lumens"),
    profile.marketVersion,
  ].filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index).slice(0, 4);
}
