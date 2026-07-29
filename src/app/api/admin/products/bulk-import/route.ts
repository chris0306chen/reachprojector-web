import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import {
  bulkImportPayloadSchema,
  toProductDetailContent,
  type ImportedProduct,
} from "@/lib/product-bulk-import";
import { calculatePackageQuote, type ShippingRate } from "@/lib/shipping-quote";

interface ProductReport {
  sku: string;
  name: string;
  status: "error" | "warning" | "ready";
  errors: string[];
  warnings: string[];
  categoryId?: string;
  imageCount: number;
  action: "new";
  generated: {
    seoTitle: string;
    metaDescription: string;
    factualSummary: string;
    faq: Array<{ question: string; answer: string }>;
    volumetricWeightKg: number | null;
    chargeableWeightKg: number | null;
    matchingShippingCountries: number;
  };
}

async function authorize() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, "products")) return null;
  return user;
}

async function buildReport(products: ImportedProduct[]): Promise<ProductReport[]> {
  const supabase = await getSupabaseClient();
  const [
    { data: categories, error: categoryError },
    { data: existing, error: productError },
    { data: shippingRates, error: shippingError },
  ] =
    await Promise.all([
      supabase.from("categories").select("id, name, slug").eq("is_active", true),
      supabase.from("products").select("sku, slug"),
      supabase.from("shipping_templates")
        .select("id,name,method,trade_terms,currency,country_code,min_weight_kg,max_weight_kg,base_weight_kg,base_fee,increment_weight_kg,increment_fee,minimum_fee,volumetric_divisor")
        .eq("is_active", true)
        .in("trade_terms", ["DDP", "DAP"]),
    ]);
  if (categoryError) throw categoryError;
  if (productError) throw productError;
  if (shippingError) throw shippingError;

  const categoryMap = new Map<string, string>();
  for (const category of categories || []) {
    categoryMap.set(String(category.name).toLowerCase(), category.id);
    categoryMap.set(String(category.slug).toLowerCase(), category.id);
  }
  const existingSkus = new Set((existing || []).map((item) => String(item.sku || "").toLowerCase()));
  const existingSlugs = new Set((existing || []).map((item) => String(item.slug).toLowerCase()));
  const batchSkus = new Set<string>();
  const batchSlugs = new Set<string>();

  return products.map((product) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sku = product.sku.toLowerCase();
    const slug = product.slug.toLowerCase();
    const categoryId = categoryMap.get(product.category.toLowerCase());
    if (!categoryId) errors.push(`找不到产品分类：${product.category}`);
    if (existingSkus.has(sku)) errors.push(`SKU 已存在：${product.sku}`);
    if (existingSlugs.has(slug)) errors.push(`Slug 已存在：${product.slug}`);
    if (batchSkus.has(sku)) errors.push(`表格内 SKU 重复：${product.sku}`);
    if (batchSlugs.has(slug)) errors.push(`表格内 Slug 重复：${product.slug}`);
    batchSkus.add(sku);
    batchSlugs.add(slug);
    const packagingComplete = [
      product.grossWeightKg,
      product.packageLengthCm,
      product.packageWidthCm,
      product.packageHeightCm,
    ].every((value) => typeof value === "number" && value > 0);
    const matchingQuotes = packagingComplete ? (shippingRates || [])
      .filter((row) => row.country_code !== "MX" || row.trade_terms === "DDP")
      .flatMap((row) => {
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
      };
      const quote = calculatePackageQuote({
        packedWeightKg: product.grossWeightKg!,
        lengthCm: product.packageLengthCm!,
        widthCm: product.packageWidthCm!,
        heightCm: product.packageHeightCm!,
        quantity: 1,
      }, rate);
      return quote ? [{ countryCode: row.country_code, quote }] : [];
    }) : [];
    if (!packagingComplete) {
      warnings.push("自动计算运费需要填写包装毛重及包装长、宽、高");
    } else if (!matchingQuotes.length) {
      warnings.push("没有启用中的运费模板可以匹配当前计费重量");
    }
    const representativeQuote = matchingQuotes[0]?.quote;
    const matchingCountries = new Set(matchingQuotes.map((item) => item.countryCode).filter(Boolean)).size;
    if (product.retailPrice <= 0) warnings.push("零售价待填写；该草稿不能发布");
    if (!product.seoTitle) warnings.push("SEO 标题为空，将暂时使用产品名称");
    if (!product.metaDescription) warnings.push("Meta 描述为空，将暂时使用产品简短描述");
    if (!product.images.some((image) => image.section === "main")) warnings.push("没有匹配到产品主图");
    if (product.images.filter((image) => image.section === "real_photos").length > 2) {
      errors.push("产品实拍图最多只能有两张");
    }
    return {
      sku: product.sku,
      name: product.name,
      status: errors.length ? "error" : warnings.length ? "warning" : "ready",
      errors,
      warnings,
      categoryId,
      imageCount: product.images.length,
      action: "new",
      generated: {
        seoTitle: product.seoTitle || product.name.slice(0, 70),
        metaDescription: (product.metaDescription || product.shortDescription).slice(0, 170),
        factualSummary: [
          `${product.name} by ${product.brand}.`,
          product.model ? `Model: ${product.model}.` : "",
          ...product.specifications.slice(0, 6).map((item) => `${item.name}: ${item.value}.`),
        ].filter(Boolean).join(" "),
        faq: product.specifications.length ? [{
          question: `What are the key specifications of ${product.name}?`,
          answer: product.specifications.slice(0, 5).map((item) => `${item.name}: ${item.value}`).join("; "),
        }] : [],
        volumetricWeightKg: representativeQuote?.volumetricWeightPerPackageKg ?? null,
        chargeableWeightKg: representativeQuote?.chargeableWeightPerPackageKg ?? null,
        matchingShippingCountries: matchingCountries,
      },
    };
  });
}

export async function POST(request: NextRequest) {
  const user = await authorize();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const parsed = bulkImportPayloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "导入数据格式不正确", details: parsed.error.issues.slice(0, 20) },
        { status: 400 }
      );
    }
    const report = await buildReport(parsed.data.products);
    const summary = {
      total: report.length,
      ready: report.filter((item) => item.status === "ready").length,
      warnings: report.filter((item) => item.status === "warning").length,
      errors: report.filter((item) => item.status === "error").length,
      images: report.reduce((total, item) => total + item.imageCount, 0),
    };
    if (parsed.data.action === "preflight") {
      return NextResponse.json({ summary, report });
    }
    if (summary.errors > 0) {
      return NextResponse.json({ error: "预检存在必须修复的错误", summary, report }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const insertedIds: string[] = [];
    const failures: Array<{ sku: string; error: string }> = [];
    for (let index = 0; index < parsed.data.products.length; index++) {
      const product = parsed.data.products[index];
      const itemReport = report[index];
      const mainImages = product.images
        .filter((image) => ["main", "gallery"].includes(image.section) && image.url)
        .map((image) => image.url!);
      const legacySpecifications = Object.fromEntries(
        product.specifications.map((item) => [item.name, item.value])
      );
      const shippingClass = /screen|cabinet|幕布|电视柜/i.test(`${product.name} ${product.category}`)
        ? "freight"
        : "parcel";
      const packagingComplete = [
        product.grossWeightKg,
        product.packageLengthCm,
        product.packageWidthCm,
        product.packageHeightCm,
      ].every((value) => typeof value === "number" && value > 0);
      const { data, error } = await supabase.from("products").insert({
        sku: product.sku,
        model: product.model || null,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category_id: itemReport.categoryId!,
        price: product.retailPrice,
        compare_at_price: product.compareAtPrice || null,
        currency: product.currency,
        description: product.fullDescription || null,
        short_description: product.shortDescription || null,
        images: mainImages,
        specifications: legacySpecifications,
        detail_content: toProductDetailContent(product),
        stock_status: product.stockStatus,
        seo_title: product.seoTitle || product.name.slice(0, 70),
        meta_description: (product.metaDescription || product.shortDescription).slice(0, 170) || null,
        product_length_cm: product.productLengthCm || null,
        product_width_cm: product.productWidthCm || null,
        product_height_cm: product.productHeightCm || null,
        net_weight_kg: product.netWeightKg || null,
        packed_weight_kg: product.grossWeightKg || null,
        package_length_cm: product.packageLengthCm || null,
        package_width_cm: product.packageWidthCm || null,
        package_height_cm: product.packageHeightCm || null,
        shipping_class: shippingClass,
        package_count: 1,
        shipping_quote_required: shippingClass !== "parcel" || !packagingComplete,
        import_data: {
          b2b_price: product.b2bPrice,
          moq: product.moq,
          lead_time: product.leadTime,
          version: product.version,
          plug_type: product.plugType,
          system_language: product.systemLanguage,
          warranty: product.warranty,
          country_of_origin: product.countryOfOrigin,
          source: product.source,
          image_name_map: product.images.map((image) => ({
            original: image.originalPath,
            seo_name: image.seoName,
            alt: image.alt,
          })),
          geo_content: itemReport.generated,
        },
        is_active: false,
      }).select("id").single();
      if (error) {
        failures.push({ sku: product.sku, error: error.message });
        break;
      }
      insertedIds.push(data.id);
    }

    if (failures.length) {
      if (insertedIds.length) await supabase.from("products").delete().in("id", insertedIds);
      await supabase.from("product_import_jobs").insert({
        created_by: user.email,
        status: "failed",
        product_count: parsed.data.products.length,
        success_count: 0,
        failure_count: failures.length,
        report: { failures },
      });
      return NextResponse.json({ error: "导入失败，已回滚本次新增产品", failures }, { status: 500 });
    }

    await supabase.from("product_import_jobs").insert({
      created_by: user.email,
      status: "completed",
      product_count: parsed.data.products.length,
      success_count: insertedIds.length,
      failure_count: 0,
      report: { product_ids: insertedIds, summary },
    });
    return NextResponse.json({ success: true, imported: insertedIds.length, productIds: insertedIds });
  } catch (error) {
    console.error("Bulk product import failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "批量导入失败" }, { status: 500 });
  }
}
