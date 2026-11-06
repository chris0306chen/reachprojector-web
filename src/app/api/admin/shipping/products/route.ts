import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { hasIncludedShippingBrand } from "@/lib/shipping-brand-policy";

// Protected by the existing shipping permission middleware; expose identity only.
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const products: Array<{ id: string; name: string }> = [];
    for (let start = 0; ; start += 500) {
      const { data, error } = await supabase.from("products").select("id,name,brand,model,slug,specifications,detail_content")
        .order("id").range(start, start + 499);
      if (error) throw error;
      products.push(...data.filter(hasIncludedShippingBrand).map(({ id, name }) => ({ id, name })));
      if (data.length < 500) break;
    }
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Shipping product selection failed:", error);
    return NextResponse.json({ error: "Unable to load products" }, { status: 500 });
  }
}
