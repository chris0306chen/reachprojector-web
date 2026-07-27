import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { validateProductDetail } from "@/lib/product-detail";

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
      "detail_content",
      "product_length_cm", "product_width_cm", "product_height_cm", "net_weight_kg",
      "packed_weight_kg", "package_length_cm", "package_width_cm", "package_height_cm",
      "shipping_class", "package_count", "shipping_quote_required",
    ]);
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.has(key))
    ) as Record<string, unknown>;

    // The legacy admin form calls compare-at price "sale_price".
    if (Object.prototype.hasOwnProperty.call(body, "sale_price")) {
      updateData.compare_at_price = body.sale_price || null;
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "没有可保存的产品字段" }, { status: 400 });
    }
    if (updateData.is_active !== undefined && typeof updateData.is_active !== "boolean") {
      return NextResponse.json({ error: "产品启用状态格式不正确" }, { status: 400 });
    }
    if (updateData.price !== undefined && (!Number.isFinite(Number(updateData.price)) || Number(updateData.price) <= 0)) {
      return NextResponse.json({ error: "产品价格必须大于零" }, { status: 400 });
    }
    if (updateData.detail_content !== undefined) {
      const detailError = validateProductDetail(updateData.detail_content);
      if (detailError) return NextResponse.json({ error: detailError }, { status: 400 });
    }
    const positiveNumericFields = [
      "product_length_cm", "product_width_cm", "product_height_cm", "net_weight_kg",
      "packed_weight_kg", "package_length_cm", "package_width_cm", "package_height_cm",
    ];
    for (const field of positiveNumericFields) {
      if (updateData[field] !== undefined && updateData[field] !== null &&
          (!Number.isFinite(Number(updateData[field])) || Number(updateData[field]) <= 0)) {
        return NextResponse.json({ error: `${field} 必须大于零` }, { status: 400 });
      }
    }
    if (updateData.shipping_class !== undefined && !["parcel", "freight"].includes(String(updateData.shipping_class))) {
      return NextResponse.json({ error: "物流类型必须为普通包裹或大件货运" }, { status: 400 });
    }
    if (updateData.package_count !== undefined &&
        (!Number.isInteger(Number(updateData.package_count)) || Number(updateData.package_count) < 1)) {
      return NextResponse.json({ error: "包裹数量必须为正整数" }, { status: 400 });
    }
    if (updateData.shipping_quote_required === false) {
      const requiredPackaging = ["packed_weight_kg", "package_length_cm", "package_width_cm", "package_height_cm"];
      if (requiredPackaging.some((field) => !Number.isFinite(Number(updateData[field])) || Number(updateData[field]) <= 0)) {
        return NextResponse.json(
          { error: "自动计算运费需要填写包装毛重及包装长、宽、高" },
          { status: 400 }
        );
      }
      if (updateData.shipping_class !== "parcel" || Number(updateData.package_count || 1) !== 1) {
        return NextResponse.json(
          { error: "自动运费仅适用于单个普通包裹" },
          { status: 400 }
        );
      }
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
    return NextResponse.json({ error: "更新产品失败" }, { status: 500 });
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
    return NextResponse.json({ error: "删除产品失败" }, { status: 500 });
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
    return NextResponse.json({ error: "创建产品失败" }, { status: 500 });
  }
}
