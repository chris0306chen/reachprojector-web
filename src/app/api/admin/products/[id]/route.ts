import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { normalizeProductDetail, validateProductDetail } from "@/lib/product-detail";

const OPTIONAL_PRODUCT_COLUMNS = new Set([
  "oem_available", "oem_notes", "attachments", "detail_content",
  "product_length_cm", "product_width_cm", "product_height_cm", "net_weight_kg",
  "packed_weight_kg", "package_length_cm", "package_width_cm", "package_height_cm",
  "shipping_class", "package_count", "shipping_quote_required",
  "seo_title", "meta_description", "short_description", "features",
]);

function getMissingProductColumn(error: { message?: string } | null) {
  const match = error?.message?.match(
    /Could not find the '([^']+)' column of 'products' in the schema cache/i
  );
  return match?.[1] || null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const sceneIds = Array.isArray(body.scene_ids)
      ? [...new Set(body.scene_ids.filter((value: unknown): value is string => typeof value === "string"))]
      : null;

    const allowedFields = new Set([
      "name", "slug", "brand", "category_id", "price", "compare_at_price",
      "description", "short_description", "images", "specifications", "features",
      "seo_title", "meta_description",
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

    if (Object.prototype.hasOwnProperty.call(body, "warranty")) {
      const warranty = typeof body.warranty === "string" ? body.warranty.trim() : "";
      if (warranty.length > 160) {
        return NextResponse.json({ error: "保修说明不能超过 160 个字符" }, { status: 400 });
      }
      const supabase = await getSupabaseClient();
      const { data: currentProduct, error: currentProductError } = await supabase
        .from("products")
        .select("import_data, detail_content")
        .eq("id", id)
        .single();
      if (currentProductError) throw currentProductError;
      updateData.import_data = {
        ...((currentProduct?.import_data as Record<string, unknown> | null) || {}),
        warranty,
      };
      const detail = normalizeProductDetail(updateData.detail_content ?? currentProduct?.detail_content);
      const warrantyIndex = detail.specifications.findIndex(
        (item) => item.name.toLowerCase() === "warranty"
      );
      if (warranty) {
        const warrantySpecification = { group: "Other" as const, name: "Warranty", value: warranty };
        if (warrantyIndex >= 0) detail.specifications[warrantyIndex] = warrantySpecification;
        else detail.specifications.push(warrantySpecification);
      } else if (warrantyIndex >= 0) {
        detail.specifications.splice(warrantyIndex, 1);
      }
      updateData.detail_content = detail;
    }

    // The legacy admin form calls compare-at price "sale_price".
    if (Object.prototype.hasOwnProperty.call(body, "sale_price")) {
      updateData.compare_at_price = body.sale_price || null;
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "没有可更新的产品字段" }, { status: 400 });
    }
    if (updateData.is_active !== undefined && typeof updateData.is_active !== "boolean") {
      return NextResponse.json({ error: "上架状态必须为布尔值" }, { status: 400 });
    }
    if (updateData.price !== undefined && (!Number.isFinite(Number(updateData.price)) || Number(updateData.price) < 0)) {
      return NextResponse.json({ error: "产品价格不能小于 0" }, { status: 400 });
    }
    if (updateData.is_active === true) {
      const supabase = await getSupabaseClient();
      const { data: currentProduct, error: currentProductError } = await supabase
        .from("products")
        .select("price, images, name, sku")
        .eq("id", id)
        .single();
      if (currentProductError) throw currentProductError;
      const effectivePrice = updateData.price ?? currentProduct?.price;
      const effectiveImages = updateData.images ?? currentProduct?.images;
      const effectiveName = updateData.name ?? currentProduct?.name;
      const images = Array.isArray(effectiveImages) ? effectiveImages : [];
      if (!effectiveName || !currentProduct?.sku || !Number.isFinite(Number(effectivePrice))
          || Number(effectivePrice) <= 0 || images.length === 0) {
        return NextResponse.json(
          { error: "发布前必须填写产品名称、SKU、有效价格并至少上传一张主图" },
          { status: 400 }
        );
      }
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
        return NextResponse.json({ error: `${field} 必须大于 0` }, { status: 400 });
      }
    }
    if (updateData.shipping_class !== undefined && !["parcel", "freight"].includes(String(updateData.shipping_class))) {
      return NextResponse.json({ error: "运输类型只能选择包裹或货运" }, { status: 400 });
    }
    if (updateData.package_count !== undefined &&
        (!Number.isInteger(Number(updateData.package_count)) || Number(updateData.package_count) < 1)) {
      return NextResponse.json({ error: "包装件数必须为正整数" }, { status: 400 });
    }
    if (updateData.shipping_quote_required === false) {
      const requiredPackaging = ["packed_weight_kg", "package_length_cm", "package_width_cm", "package_height_cm"];
      if (requiredPackaging.some((field) => !Number.isFinite(Number(updateData[field])) || Number(updateData[field]) <= 0)) {
        return NextResponse.json(
          { error: "关闭人工运费确认前，必须填写包装重量和包装尺寸" },
          { status: 400 }
        );
      }
      if (updateData.shipping_class !== "parcel" || Number(updateData.package_count || 1) !== 1) {
        return NextResponse.json(
          { error: "只有单件包裹运输可以关闭人工运费确认" },
          { status: 400 }
        );
      }
    }

    const supabase = await getSupabaseClient();
    const pendingUpdate = { ...updateData, updated_at: new Date().toISOString() };
    const skippedColumns: string[] = [];
    let data: unknown = null;

    while (Object.keys(pendingUpdate).length > 1) {
      const result = await supabase
        .from("products")
        .update(pendingUpdate)
        .eq("id", id)
        .select()
        .single();

      if (!result.error) {
        data = result.data;
        break;
      }

      const missingColumn = getMissingProductColumn(result.error);
      if (!missingColumn || !OPTIONAL_PRODUCT_COLUMNS.has(missingColumn)) {
        throw result.error;
      }

      delete pendingUpdate[missingColumn as keyof typeof pendingUpdate];
      skippedColumns.push(missingColumn);
    }

    if (!data) {
      throw new Error("没有可保存的兼容字段");
    }
    if (sceneIds) {
      const { error: deleteSceneError } = await supabase
        .from("product_scenes")
        .delete()
        .eq("product_id", id);
      if (deleteSceneError) throw deleteSceneError;

      if (sceneIds.length) {
        const { error: insertSceneError } = await supabase
          .from("product_scenes")
          .insert(sceneIds.map((sceneId) => ({ product_id: id, scene_id: sceneId })));
        if (insertSceneError) throw insertSceneError;
      }
    }
    return NextResponse.json({
      success: true,
      data,
      warning: skippedColumns.length
        ? `已保存；以下可选字段尚未配置数据库列，已跳过：${skippedColumns.join(", ")}`
        : undefined,
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    const detail = error && typeof error === "object" && "message" in error
      ? String(error.message)
      : "";
    return NextResponse.json(
      { error: detail ? `更新产品失败：${detail}` : "更新产品失败" },
      { status: 500 }
    );
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
    await params;
    const body = await request.json();

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .insert({ ...body, is_active: false })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "创建产品失败" }, { status: 500 });
  }
}
