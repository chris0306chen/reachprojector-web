import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const _ = await params;
    const body = await request.json();
    const {
      name,
      slug,
      brand,
      category_id,
      price,
      compare_at_price,
      description,
      short_description,
      images,
      specifications,
      features,
      stock_status,
      is_bestseller,
      is_new_arrival,
      is_featured,
    } = body;

    if (!name || !slug || !brand || !category_id || !price) {
      return NextResponse.json(
        { error: "Name, slug, brand, category_id, and price are required" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        brand,
        category_id,
        price: price.toString(),
        compare_at_price: compare_at_price?.toString() || null,
        description: description || null,
        short_description: short_description || null,
        images: images || [],
        specifications: specifications || {},
        features: features || [],
        stock_status: stock_status || "in_stock",
        is_bestseller: is_bestseller || false,
        is_new_arrival: is_new_arrival || false,
        is_featured: is_featured || false,
        is_active: false, // Start as draft
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Failed to publish product:", error);
    return NextResponse.json({ error: "Failed to publish product" }, { status: 500 });
  }
}
