const allowedTerms = new Set(["DDP", "DAP", "SHIPPING_INCLUDED", "MANUAL_QUOTE", "UNAVAILABLE"]);
const allowedClasses = new Set(["parcel", "oversize", "freight"]);

export function normalizeShippingTemplate(body: Record<string, unknown>) {
  const countryCode = String(body.country_code || "").trim().toUpperCase();
  const tradeTerms = String(body.trade_terms || "MANUAL_QUOTE");
  const shippingClass = String(body.shipping_class || "parcel");
  const currency = String(body.currency || "USD").trim().toUpperCase();
  const numericFields = [
    "min_weight_kg", "max_weight_kg", "base_weight_kg", "base_fee",
    "increment_weight_kg", "increment_fee", "minimum_fee", "volumetric_divisor",
  ] as const;

  if (!String(body.name || "").trim() || !/^[A-Z]{2}$/.test(countryCode)) {
    throw new Error("INVALID_IDENTITY");
  }
  if (!allowedTerms.has(tradeTerms) || !allowedClasses.has(shippingClass) || !/^[A-Z]{3}$/.test(currency)) {
    throw new Error("INVALID_ENUM");
  }

  const normalized: Record<string, unknown> = {
    name: String(body.name).trim(),
    zone: countryCode,
    country_code: countryCode,
    method: String(body.method || "manual").trim(),
    trade_terms: tradeTerms,
    shipping_class: shippingClass,
    currency,
    is_active: body.is_active === true && ["DDP", "DAP", "SHIPPING_INCLUDED"].includes(tradeTerms),
    notes: body.notes ? String(body.notes).trim() : null,
    estimated_days_min: body.estimated_days_min || null,
    estimated_days_max: body.estimated_days_max || null,
    valid_from: body.valid_from || null,
    valid_to: body.valid_to || null,
    updated_at: new Date().toISOString(),
  };

  for (const field of numericFields) {
    const value = Number(body[field] ?? 0);
    if (!Number.isFinite(value) || value < 0) throw new Error("INVALID_NUMBER");
    normalized[field] = value;
  }
  const ids = body.product_ids ?? [];
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))) throw new Error("INVALID_PRODUCT_SCOPE");
  normalized.product_ids = [...new Set(ids)];
  if (tradeTerms === "SHIPPING_INCLUDED" && (
    ids.length === 0 || [normalized.base_fee, normalized.increment_fee, normalized.minimum_fee].some((value) => value !== 0)
  )) throw new Error("INVALID_INCLUDED_RATE");
  if (Number(normalized.max_weight_kg) < Number(normalized.min_weight_kg)) {
    throw new Error("INVALID_WEIGHT_RANGE");
  }
  if (normalized.is_active === true) {
    const validFrom = String(normalized.valid_from || "");
    const validTo = String(normalized.valid_to || "");
    if (!validFrom || !validTo || validTo < validFrom) {
      throw new Error("INVALID_VALIDITY");
    }
    if (
      Number(normalized.max_weight_kg) <= Number(normalized.min_weight_kg) ||
      Number(normalized.increment_weight_kg) <= 0 ||
      Number(normalized.volumetric_divisor) <= 0 ||
      (tradeTerms !== "SHIPPING_INCLUDED" && Number(normalized.base_fee) <= 0 && Number(normalized.increment_fee) <= 0)
    ) {
      throw new Error("INCOMPLETE_ACTIVE_RATE");
    }
  }
  return normalized;
}
