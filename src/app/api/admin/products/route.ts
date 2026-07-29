import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { normalizeProductDetail, type ProductDetailContent } from "@/lib/product-detail";

interface RecoveredProductMedia {
  main: string[];
  realPhotos: Array<{ url: string; alt: string }>;
  detailImages: Array<{ url: string; alt: string }>;
  logisticsImages: Array<{ url: string; alt: string; type: "Shipment" }>;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, "products")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
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
    const scenesByProduct = new Map<string, string[]>();
    const sourcingByProduct = new Map<string, {
      purchase_price: number;
      purchase_currency: string | null;
      moq: number | null;
      supplier_url: string;
      sourcing_notes: string | null;
    }>();

    if (productIds.length > 0) {
      const { data: sceneRows, error: scenesError } = await supabase
        .from("product_scenes")
        .select("product_id, scene_id")
        .in("product_id", productIds);
      if (!scenesError) {
        for (const row of sceneRows || []) {
          scenesByProduct.set(row.product_id, [...(scenesByProduct.get(row.product_id) || []), row.scene_id]);
        }
      } else if (scenesError.code !== "42P01") {
        console.error("Failed to fetch product scenes:", scenesError);
      }

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

    const recoveredMedia = new Map<string, RecoveredProductMedia>();
    if ((data || []).length > 0) {
      const { data: storedFiles, error: storageError } = await supabase.storage
        .from("attachments")
        .list("products", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
      if (!storageError) {
        for (const product of data || []) {
          const media: RecoveredProductMedia = {
            main: [],
            realPhotos: [],
            detailImages: [],
            logisticsImages: [],
          };
          for (const file of storedFiles || []) {
            if (!file.name.includes(`-${product.slug}-`)) continue;
            const { data: publicUrl } = supabase.storage
              .from("attachments")
              .getPublicUrl(`products/${file.name}`);
            const url = publicUrl.publicUrl;
            if (file.name.includes("-main-")) {
              media.main.push(url);
            } else if (file.name.includes("-product-photo-")) {
              media.realPhotos.push({ url, alt: `${product.name} product photo` });
            } else if (file.name.includes("-product-detail-")) {
              media.detailImages.push({ url, alt: `${product.name} product details` });
            } else if (file.name.includes("-shipping-")) {
              media.logisticsImages.push({ url, alt: `${product.name} shipping photo`, type: "Shipment" });
            }
          }
          if (media.main.length || media.realPhotos.length || media.detailImages.length || media.logisticsImages.length) {
            recoveredMedia.set(product.id, media);
          }
        }
      } else {
        console.error("Failed to recover product media:", storageError);
      }
    }

    return NextResponse.json({
      data: (data || []).map((product) => {
        const recovered = recoveredMedia.get(product.id);
        const backup = product.import_data?.admin_media_backup;
        const detail = normalizeProductDetail(
          product.detail_content || backup?.detail_content || product.import_data?.detail_content
        );
        const recoveredDetail: ProductDetailContent = {
          specifications: detail.specifications,
          real_photos: detail.real_photos.length ? detail.real_photos : recovered?.realPhotos || [],
          detail_images: detail.detail_images.length ? detail.detail_images : recovered?.detailImages || [],
          logistics_images: detail.logistics_images.length ? detail.logistics_images : recovered?.logisticsImages || [],
        };
        return {
          ...product,
          images: Array.isArray(product.images) && product.images.length
            ? product.images
            : backup?.images?.length ? backup.images : recovered?.main || [],
          detail_content: recoveredDetail,
          ...sourcingByProduct.get(product.id),
          scene_ids: scenesByProduct.get(product.id) || [],
        };
      }),
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
