import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    const [countries, conflicts, rates, products, automaticRates] = await Promise.all([
      supabase.from("shipping_country_rules").select("id", { count: "exact", head: true }),
      supabase
        .from("shipping_country_rules")
        .select("id", { count: "exact", head: true })
        .eq("validation_status", "conflict"),
      supabase.from("shipping_rate_staging").select("id", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .not("packed_weight_kg", "is", null),
      supabase
        .from("shipping_templates")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .in("trade_terms", ["DDP", "DAP"]),
    ]);
    const error = countries.error || conflicts.error || rates.error || products.error || automaticRates.error;
    if (error) throw error;

    return NextResponse.json({
      data: {
        countryRules: countries.count || 0,
        countryConflicts: conflicts.count || 0,
        stagedRates: rates.count || 0,
        productsWithPackaging: products.count || 0,
        automaticRates: automaticRates.count || 0,
      },
    });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (["42P01", "42703"].includes(code)) {
      return NextResponse.json({ data: null, setupPending: true });
    }
    console.error("Failed to load shipping import status:", error);
    return NextResponse.json({ error: "Failed to load shipping import status" }, { status: 500 });
  }
}
