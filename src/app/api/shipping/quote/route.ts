import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { calculatePackageQuote, type ShippingRate } from "@/lib/shipping-quote";

const manualQuote = (reason: string, status = 200) =>
  NextResponse.json({ mode: "manual_quote", reason }, { status });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = typeof body.productId === "string" ? body.productId.trim() : "";
    const countryCode = typeof body.countryCode === "string" ? body.countryCode.trim().toUpperCase() : "";
    const quantity = Number(body.quantity);

    if (!productId || !/^[A-Z]{2}$/.test(countryCode) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return manualQuote("INVALID_REQUEST", 400);
    }

    const supabase = await getSupabaseClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id,shipping_class,packed_weight_kg,package_length_cm,package_width_cm,package_height_cm,package_count,shipping_quote_required")
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (productError) throw productError;
    if (!product) return manualQuote("PRODUCT_NOT_AVAILABLE", 404);
    if (
      product.shipping_quote_required ||
      Number(product.package_count) !== 1 ||
      product.shipping_class !== "parcel"
    ) {
      return manualQuote("PRODUCT_REQUIRES_QUOTE");
    }

    const packedWeightKg = Number(product.packed_weight_kg);
    const lengthCm = Number(product.package_length_cm);
    const widthCm = Number(product.package_width_cm);
    const heightCm = Number(product.package_height_cm);
    if (![packedWeightKg, lengthCm, widthCm, heightCm].every((value) => Number.isFinite(value) && value > 0)) {
      return manualQuote("PACKAGING_DATA_INCOMPLETE");
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: rows, error: rateError } = await supabase
      .from("shipping_templates")
      .select("*")
      .eq("country_code", countryCode)
      .eq("shipping_class", "parcel")
      .eq("is_active", true)
      .in("trade_terms", ["DDP", "DAP"])
      .or(`valid_from.is.null,valid_from.lte.${today}`)
      .or(`valid_to.is.null,valid_to.gte.${today}`)
      .order("trade_terms", { ascending: true })
      .order("base_fee", { ascending: true });

    if (rateError) throw rateError;

    for (const row of rows || []) {
      const rate: ShippingRate = {
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
      };
      const calculated = calculatePackageQuote(
        { packedWeightKg, lengthCm, widthCm, heightCm, quantity },
        rate
      );
      if (calculated) {
        return NextResponse.json({
          mode: "automatic",
          countryCode,
          templateId: rate.id,
          serviceName: rate.name,
          method: rate.method,
          tradeTerms: rate.tradeTerms,
          dutiesIncluded: rate.tradeTerms === "DDP",
          currency: rate.currency,
          estimatedDaysMin: rate.estimatedDaysMin,
          estimatedDaysMax: rate.estimatedDaysMax,
          ...calculated,
        });
      }
    }

    return manualQuote("NO_MATCHING_ACTIVE_RATE");
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (["42P01", "42703"].includes(code)) return manualQuote("SHIPPING_SETUP_PENDING");
    console.error("Shipping quote failed:", error);
    return manualQuote("QUOTE_UNAVAILABLE", 500);
  }
}
