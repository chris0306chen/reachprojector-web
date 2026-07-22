import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = new Set([
      "name", "slug", "brand", "category_id", "price", "compare_at_price",
      "description", "short_description", "images", "specifications", "features",
      "stock_status", "is_bestseller", "is_new_arrival", "is_featured", "is_active",
      "sort_order", "weight_kg", "oem_available", "oem_notes", "attachments",
    ]);
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.has(key))
    ) as Record<string, unknown>;

    // The legacy admin form calls compare-at price "sale_price".
    if (Object.prototype.hasOwnProperty.call(body, "sale_price")) {
      updateData.compare_at_price = body.sale_price || null;
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid product fields supplied" }, { status: 400 });
    }
    if (updateData.is_active !== undefined && typeof updateData.is_active !== "boolean") {
      return NextResponse.json({ error: "is_active must be a boolean" }, { status: 400 });
    }
    if (updateData.price !== undefined && (!Number.isFinite(Number(updateData.price)) || Number(updateData.price) <= 0)) {
      return NextResponse.json({ error: "price must be greater than zero" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // This is for creating a new product
  try {
    const _ = await params;
    const body = await request.json();

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
