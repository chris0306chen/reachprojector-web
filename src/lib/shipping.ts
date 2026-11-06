import { hasIncludedShippingBrand } from "@/lib/shipping-brand-policy";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { calculatePackageQuote, type ShippingRate } from "@/lib/shipping-quote";

export type AutomaticShippingQuote = {
  mode: "automatic";
  countryCode: string;
  templateId: string;
  serviceName: string;
  method: string;
  tradeTerms: "DDP" | "DAP" | "SHIPPING_INCLUDED";
  dutiesIncluded: boolean | null;
  currency: string;
  estimatedDaysMin: number | null;
  estimatedDaysMax: number | null;
  actualWeightPerPackageKg: number;
  volumetricWeightPerPackageKg: number;
  chargeableWeightPerPackageKg: number;
  totalChargeableWeightKg: number;
  shippingCost: number;
};

export type ManualShippingQuote = {
  mode: "manual_quote";
  reason: string;
};

export type ShippingQuote = AutomaticShippingQuote | ManualShippingQuote;

export async function getShippingQuote(
  productId: string,
  countryCodeValue: string,
  quantity: number
): Promise<ShippingQuote> {
  const countryCode = countryCodeValue.trim().toUpperCase();
  if (!productId || !/^[A-Z]{2}$/.test(countryCode) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return { mode: "manual_quote", reason: "INVALID_REQUEST" };
  }

  const supabase = getSupabaseClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id,brand,name,model,slug,specifications,detail_content,shipping_class,packed_weight_kg,package_length_cm,package_width_cm,package_height_cm,package_count,shipping_quote_required")
    .eq("id", productId)
    .eq("is_active", true)
    .maybeSingle();

  if (productError) throw productError;
  if (!product) return { mode: "manual_quote", reason: "PRODUCT_NOT_AVAILABLE" };
  if (product.shipping_quote_required || Number(product.package_count) !== 1 || product.shipping_class !== "parcel") {
    return { mode: "manual_quote", reason: "PRODUCT_REQUIRES_QUOTE" };
  }

  const packedWeightKg = Number(product.packed_weight_kg);
  const lengthCm = Number(product.package_length_cm);
  const widthCm = Number(product.package_width_cm);
  const heightCm = Number(product.package_height_cm);
  if (![packedWeightKg, lengthCm, widthCm, heightCm].every((value) => Number.isFinite(value) && value > 0)) {
    return { mode: "manual_quote", reason: "PACKAGING_DATA_INCOMPLETE" };
  }

  const today = new Date().toISOString().slice(0, 10);
  const rateQuery = supabase
    .from("shipping_templates")
    .select("*")
    .eq("country_code", countryCode)
    .eq("shipping_class", "parcel")
    .eq("is_active", true)
    .in("trade_terms", ["DDP", "DAP", "SHIPPING_INCLUDED"])
    .lte("valid_from", today)
    .gte("valid_to", today);
  const { data: rows, error: rateError } = await rateQuery
    .order("trade_terms", { ascending: true })
    .order("base_fee", { ascending: true });

  if (rateError) throw rateError;
  // Brand discounts never establish delivery coverage: first match a valid paid route.
  const scopedRows = (rows || []).filter((row) => ["DDP", "DAP"].includes(row.trade_terms)
    && (countryCode !== "MX" || row.trade_terms === "DDP"));
  const toRate = (row: (typeof scopedRows)[number]): ShippingRate => ({
      id: row.id,
      name: row.name,
      method: row.method,
      tradeTerms: row.trade_terms,
      currency: row.currency,
      minWeightKg: Number(row.min_weight_kg),
      maxWeightKg: Number(row.max_weight_kg),
      baseWeightKg: Number(row.base_weight_kg),
      baseFee: Number(row.base_fee),
      incrementWeightKg: Number(row.increment_weight_kg),
      incrementFee: Number(row.increment_fee),
      minimumFee: Number(row.minimum_fee),
      volumetricDivisor: Number(row.volumetric_divisor),
      estimatedDaysMin: row.estimated_days_min,
      estimatedDaysMax: row.estimated_days_max,
  });
  for (const row of scopedRows) {
    let rate = toRate(row);
    let calculated = calculatePackageQuote({ packedWeightKg, lengthCm, widthCm, heightCm, quantity }, rate);
    if (calculated) {
      const included = hasIncludedShippingBrand(product);
      if (included) {
        for (const candidate of rows || []) {
          if (candidate.trade_terms !== "SHIPPING_INCLUDED" || !Array.isArray(candidate.product_ids) || !candidate.product_ids.includes(productId)) continue;
          const selectedRate = toRate(candidate);
          const selectedQuote = calculatePackageQuote({ packedWeightKg, lengthCm, widthCm, heightCm, quantity }, selectedRate);
          if (selectedQuote) { rate = selectedRate; calculated = selectedQuote; break; }
        }
      }
      return {
        mode: "automatic",
        countryCode,
        templateId: rate.id,
        serviceName: rate.name,
        method: rate.method,
        tradeTerms: included ? "SHIPPING_INCLUDED" : rate.tradeTerms,
        dutiesIncluded: included ? null : rate.tradeTerms === "DDP",
        currency: rate.currency,
        estimatedDaysMin: rate.estimatedDaysMin ?? null,
        estimatedDaysMax: rate.estimatedDaysMax ?? null,
        ...calculated,
        shippingCost: included ? 0 : calculated.shippingCost,
      };
    }
  }

  return { mode: "manual_quote", reason: "NO_MATCHING_ACTIVE_RATE" };
}

export async function getActiveShippingCountries(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("shipping_templates")
    .select("country_code")
    .eq("shipping_class", "parcel")
    .eq("is_active", true)
    .in("trade_terms", ["DDP", "DAP"])
    .lte("valid_from", today)
    .gte("valid_to", today);
  if (error) throw error;
  return [...new Set((data || []).map((row) => row.country_code).filter(Boolean))].sort();
}
