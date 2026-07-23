import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    const supabase = await getSupabaseClient();
    let query = supabase
      .from("products")
      // Do not depend on PostgREST's relationship cache here. Fresh databases
      // can have the foreign key in PostgreSQL before the embedded
      // `categories(name)` relationship becomes visible to PostgREST, which
      // made the whole admin product list fail after the first product import.
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) query = query.eq("category_id", category);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    const productIds = (data || []).map((product) => product.id);
    const sourcingByProduct = new Map<string, {
      purchase_price: number;
      purchase_currency: string | null;
      moq: number | null;
      supplier_url: string;
      sourcing_notes: string | null;
    }>();

    if (productIds.length > 0) {
      const { data: sourcingRows, error: sourcingError } = await supabase
        .from("product_sourcing")
        .select("product_id, purchase_price, purchase_currency, moq, supplier_url, notes")
        .in("product_id", productIds);

      if (!sourcingError) {
        for (const row of sourcingRows || []) {
          sourcingByProduct.set(row.product_id, {
            purchase_price: Number(row.purchase_price),
            purchase_currency: row.purchase_currency,
            moq: row.moq,
            supplier_url: row.supplier_url,
            sourcing_notes: row.notes,
          });
        }
      } else if (sourcingError.code !== "42P01") {
        console.error("Failed to fetch product sourcing data:", sourcingError);
      }
    }

    return NextResponse.json({
      data: (data || []).map((product) => ({
        ...product,
        ...sourcingByProduct.get(product.id),
      })),
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
