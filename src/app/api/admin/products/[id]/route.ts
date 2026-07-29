import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { normalizeProductDetail, validateProductDetail } from "@/lib/product-detail";

const OPTIONAL_PRODUCT_COLUMNS = new Set([
  "model", "oem_available", "oem_notes", "attachments", "detail_content", "weight_kg",
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

async function authorizeProductAdmin() {
  const user = await getCurrentUser();
  return user && hasPermission(user, "products") ? user : null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await authorizeProductAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const sceneIds = Array.isArray(body.scene_ids)
      ? [...new Set(body.scene_ids.filter((value: unknown): value is string => typeof value === "string"))]
      : null;

    const allowedFields = new Set([
      "name", "sku", "model", "slug", "brand", "category_id", "price", "currency", "compare_at_price",
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
        .select("import_data")
        .eq("id", id)
        .single();
      if (currentProductError) throw currentProductError;
      const currentImportData =
        currentProduct?.import_data && typeof currentProduct.import_data === "object"
          ? currentProduct.import_data as Record<string, unknown>
          : {};
      const mediaBackup =
        currentImportData.admin_media_backup && typeof currentImportData.admin_media_backup === "object"
          ? currentImportData.admin_media_backup as Record<string, unknown>
          : {};
      updateData.import_data = {
        ...currentImportData,
        warranty,
      };
      const detail = normalizeProductDetail(updateData.detail_content ?? mediaBackup.detail_content);
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
    const publicationSupabase = await getSupabaseClient();
    const { data: publicationProduct, error: publicationProductError } = await publicationSupabase
      .from("products")
      .select("price, images, name, sku, brand, slug, category_id, is_active, import_data")
      .eq("id", id)
      .single();
    if (publicationProductError) throw publicationProductError;
    const effectiveActive = updateData.is_active ?? publicationProduct?.is_active;
    if (effectiveActive === true) {
      const publicationImportData =
        publicationProduct?.import_data && typeof publicationProduct.import_data === "object"
          ? publicationProduct.import_data as Record<string, unknown>
          : {};
      const publicationMediaBackup =
        publicationImportData.admin_media_backup && typeof publicationImportData.admin_media_backup === "object"
          ? publicationImportData.admin_media_backup as Record<string, unknown>
          : {};
      const effectivePrice = updateData.price ?? publicationProduct?.price;
      const effectiveImages = updateData.images
        ?? (Array.isArray(publicationProduct?.images) && publicationProduct.images.length
          ? publicationProduct.images
          : publicationMediaBackup.images);
      const effectiveName = updateData.name ?? publicationProduct?.name;
      const effectiveSku = updateData.sku ?? publicationProduct?.sku;
      const effectiveBrand = updateData.brand ?? publicationProduct?.brand;
      const effectiveSlug = updateData.slug ?? publicationProduct?.slug;
      const effectiveCategory = updateData.category_id ?? publicationProduct?.category_id;
      const images = Array.isArray(effectiveImages) ? effectiveImages : [];
      if (!effectiveName || !effectiveSku || !effectiveBrand || !effectiveSlug || !effectiveCategory
          || !Number.isFinite(Number(effectivePrice))
          || Number(effectivePrice) <= 0 || images.length === 0) {
        return NextResponse.json(
          { error: "发布前必须填写产品名称、SKU、品牌、Slug、分类、有效价格并至少上传一张主图" },
          { status: 400 }
        );
      }
    }
    if (updateData.detail_content !== undefined) {
      const normalizedDetail = normalizeProductDetail(updateData.detail_content);
      const detailError = validateProductDetail(normalizedDetail);
      if (detailError) return NextResponse.json({ error: detailError }, { status: 400 });
      updateData.detail_content = normalizedDetail;
    }
    if (updateData.images !== undefined || updateData.detail_content !== undefined) {
      const supabase = await getSupabaseClient();
      const { data: currentProduct, error: currentProductError } = await supabase
        .from("products")
        .select("images, import_data")
        .eq("id", id)
        .single();
      if (currentProductError) throw currentProductError;
      const currentImportData =
        currentProduct?.import_data && typeof currentProduct.import_data === "object"
          ? currentProduct.import_data as Record<string, unknown>
          : {};
      const currentBackup =
        currentImportData.admin_media_backup && typeof currentImportData.admin_media_backup === "object"
          ? currentImportData.admin_media_backup as Record<string, unknown>
          : {};
      updateData.import_data = {
        ...currentImportData,
        ...(
          updateData.import_data && typeof updateData.import_data === "object"
            ? updateData.import_data as Record<string, unknown>
            : {}
        ),
        admin_media_backup: {
          ...currentBackup,
          images: updateData.images ?? currentProduct?.images ?? [],
          detail_content: updateData.detail_content ?? currentBackup.detail_content ?? null,
        },
      };
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
    if (!await authorizeProductAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  if (!await authorizeProductAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { error: "请使用产品导入或批量导入功能创建草稿" },
    { status: 405, headers: { Allow: "PUT, DELETE" } }
  );
}
