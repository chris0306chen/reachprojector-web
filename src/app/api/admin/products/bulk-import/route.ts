import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import {
  bulkImportPayloadSchema,
  toProductDetailContent,
  type ImportedProduct,
} from "@/lib/product-bulk-import";

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
      supabase.from("shipping_templates").select("min_weight_kg, max_weight_kg").eq("is_active", true),
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
    if (!categoryId) errors.push(`Unknown category: ${product.category}`);
    if (existingSkus.has(sku)) errors.push(`SKU already exists: ${product.sku}`);
    if (existingSlugs.has(slug)) errors.push(`Slug already exists: ${product.slug}`);
    if (batchSkus.has(sku)) errors.push(`Duplicate SKU in workbook: ${product.sku}`);
    if (batchSlugs.has(slug)) errors.push(`Duplicate slug in workbook: ${product.slug}`);
    batchSkus.add(sku);
    batchSlugs.add(slug);
    if (!product.grossWeightKg) {
      warnings.push("Gross weight is missing; shipping cannot be checked");
    } else if (!(shippingRates || []).some((rate) =>
      product.grossWeightKg! >= Number(rate.min_weight_kg) &&
      product.grossWeightKg! <= Number(rate.max_weight_kg)
    )) {
      warnings.push(`No active shipping weight band matches ${product.grossWeightKg} kg`);
    }
    if (!product.packageDimensions) warnings.push("Package dimensions are missing");
    if (!product.warranty) warnings.push("Warranty needs confirmation");
    if (!product.seoTitle) warnings.push("SEO title will use the product name");
    if (!product.metaDescription) warnings.push("Meta description will use the short description");
    if (!product.images.some((image) => image.section === "main")) warnings.push("No main image matched");
    if (product.images.filter((image) => image.section === "real_photos").length > 2) {
      errors.push("Only two real product photos are allowed");
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
          product.version ? `Version: ${product.version}.` : "",
          product.grossWeightKg ? `Packed weight: ${product.grossWeightKg} kg.` : "",
          product.packageDimensions ? `Package size: ${product.packageDimensions}.` : "",
          product.moq ? `Minimum order quantity: ${product.moq}.` : "",
          product.leadTime ? `Lead time: ${product.leadTime}.` : "",
        ].filter(Boolean).join(" "),
        faq: [
          product.warranty ? { question: `What is the warranty for ${product.name}?`, answer: product.warranty } : null,
          product.leadTime ? { question: `What is the lead time for ${product.name}?`, answer: product.leadTime } : null,
          product.plugType ? { question: `Which plug type is supplied with ${product.name}?`, answer: product.plugType } : null,
        ].filter((item): item is { question: string; answer: string } => Boolean(item)),
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
        { error: "Invalid import data", details: parsed.error.issues.slice(0, 20) },
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
      return NextResponse.json({ error: "Preflight contains blocking errors", summary, report }, { status: 400 });
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
        import_data: {
          b2b_price: product.b2bPrice,
          moq: product.moq,
          lead_time: product.leadTime,
          version: product.version,
          plug_type: product.plugType,
          system_language: product.systemLanguage,
          warranty: product.warranty,
          country_of_origin: product.countryOfOrigin,
          product_dimensions: product.productDimensions,
          package_dimensions: product.packageDimensions,
          net_weight_kg: product.netWeightKg,
          gross_weight_kg: product.grossWeightKg,
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
      return NextResponse.json({ error: "Import failed and inserted products were rolled back", failures }, { status: 500 });
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
    return NextResponse.json({ error: error instanceof Error ? error.message : "Bulk import failed" }, { status: 500 });
  }
}
