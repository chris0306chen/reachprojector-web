const allowedTerms = new Set(["DDP", "DAP", "MANUAL_QUOTE", "UNAVAILABLE"]);
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
    is_active: body.is_active === true && ["DDP", "DAP"].includes(tradeTerms),
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
  if (Number(normalized.max_weight_kg) < Number(normalized.min_weight_kg)) {
    throw new Error("INVALID_WEIGHT_RANGE");
  }
  return normalized;
}
