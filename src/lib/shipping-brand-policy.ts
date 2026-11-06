export function hasIncludedShippingBrand(product: {
  brand?: unknown; name?: unknown; model?: unknown; slug?: unknown;
  specifications?: unknown; detail_content?: unknown;
}) {
  const identity = JSON.stringify([
    product.brand, product.name, product.model, product.slug,
    product.specifications, product.detail_content,
  ]).normalize("NFKC").toLowerCase();
  // Exclusions take precedence, even when the catalog brand is Hisense or AWOL.
  if (identity.includes("vidda")) return false;
  const brand = typeof product.brand === "string"
    ? product.brand.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ") : "";
  return ["hisense", "海信", "hisense 海信", "awol", "awol vision"].includes(brand);
}
