import { z } from "zod";
import { SPECIFICATION_GROUPS, type ProductDetailContent, type ProductSpecificationItem } from "@/lib/product-detail";

export const PRODUCT_IMPORT_LIMIT = 100;
export const IMAGE_IMPORT_LIMIT = 500;

export const importedImageSchema = z.object({
  originalPath: z.string().min(1).max(500),
  section: z.enum(["main", "gallery", "real_photos", "detail_images", "logistics"]),
  logisticsType: z.enum(["Bulk Stock", "Warehouse", "Packing", "Shipment"]).optional(),
  seoName: z.string().min(1).max(255),
  alt: z.string().min(1).max(240),
  url: z.string().url().optional(),
});

export const importedProductSchema = z.object({
  sku: z.string().trim().min(1).max(100).regex(/^[A-Za-z0-9._-]+$/),
  brand: z.string().trim().min(1).max(100),
  model: z.string().trim().max(120).default(""),
  name: z.string().trim().min(1).max(255),
  slug: z.string().trim().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(1).max(100),
  retailPrice: z.number().positive().max(99999999),
  compareAtPrice: z.number().positive().max(99999999).nullable().optional(),
  b2bPrice: z.number().positive().max(99999999).nullable().optional(),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  moq: z.number().int().positive().nullable().optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "pre_order"]).default("in_stock"),
  leadTime: z.string().trim().max(120).default(""),
  version: z.string().trim().max(120).default(""),
  plugType: z.string().trim().max(100).default(""),
  systemLanguage: z.string().trim().max(200).default(""),
  warranty: z.string().trim().max(160).default(""),
  countryOfOrigin: z.string().trim().max(100).default(""),
  productLengthCm: z.number().positive().max(10000).nullable().optional(),
  productWidthCm: z.number().positive().max(10000).nullable().optional(),
  productHeightCm: z.number().positive().max(10000).nullable().optional(),
  packageLengthCm: z.number().positive().max(10000).nullable().optional(),
  packageWidthCm: z.number().positive().max(10000).nullable().optional(),
  packageHeightCm: z.number().positive().max(10000).nullable().optional(),
  netWeightKg: z.number().positive().max(10000).nullable().optional(),
  grossWeightKg: z.number().positive().max(10000).nullable().optional(),
  shortDescription: z.string().trim().max(600).default(""),
  fullDescription: z.string().trim().max(20000).default(""),
  seoTitle: z.string().trim().max(70).default(""),
  metaDescription: z.string().trim().max(170).default(""),
  status: z.literal("draft").default("draft"),
  specifications: z.array(z.object({
    group: z.enum(SPECIFICATION_GROUPS),
    name: z.string().trim().min(1).max(120),
    value: z.string().trim().min(1).max(500),
  })).max(80).default([]),
  images: z.array(importedImageSchema).max(40).default([]),
});

export const bulkImportPayloadSchema = z.object({
  action: z.enum(["preflight", "import"]),
  products: z.array(importedProductSchema).min(1).max(PRODUCT_IMPORT_LIMIT),
});

export type ImportedProduct = z.infer<typeof importedProductSchema>;
export type ImportedImage = z.infer<typeof importedImageSchema>;

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

export function buildSeoImageName(
  product: Pick<ImportedProduct, "brand" | "model" | "name">,
  section: ImportedImage["section"],
  index: number,
  extension: string
): string {
  const identity = slugify(`${product.brand} ${product.model || product.name} projector`);
  const purpose = {
    main: "main-view",
    gallery: `gallery-${index + 1}`,
    real_photos: `real-photo-${index + 1}`,
    detail_images: `product-details-${index + 1}`,
    logistics: `shipping-${index + 1}`,
  }[section];
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  return `${identity}-${purpose}.${safeExtension}`;
}

export function buildImageAlt(
  product: Pick<ImportedProduct, "brand" | "model" | "name">,
  section: ImportedImage["section"],
  index: number
): string {
  const identity = `${product.brand} ${product.model || product.name}`.trim();
  const purpose = {
    main: "projector main view",
    gallery: `projector product view ${index + 1}`,
    real_photos: `projector real product photo ${index + 1}`,
    detail_images: `projector product details ${index + 1}`,
    logistics: `projector packing and shipment photo ${index + 1}`,
  }[section];
  return `${identity} ${purpose}`.slice(0, 240);
}

export function toProductDetailContent(product: ImportedProduct): ProductDetailContent {
  const specifications: ProductSpecificationItem[] = product.specifications.map((item) => ({
    group: item.group,
    name: item.name,
    value: item.value,
  }));
  const addSpecification = (
    group: ProductSpecificationItem["group"],
    name: string,
    value: string | number | null | undefined
  ) => {
    if (value === null || value === undefined || String(value).trim() === "") return;
    if (specifications.some((item) => item.name.toLowerCase() === name.toLowerCase())) return;
    specifications.push({ group, name, value: String(value) });
  };
  const dimensions = (
    length: number | null | undefined,
    width: number | null | undefined,
    height: number | null | undefined
  ) => length && width && height ? `${length} × ${width} × ${height} cm` : "";

  addSpecification("System", "Product Version", product.version);
  addSpecification("System", "System Language", product.systemLanguage);
  addSpecification("Power", "Plug Type", product.plugType);
  addSpecification(
    "Dimensions",
    "Product Dimensions",
    dimensions(product.productLengthCm, product.productWidthCm, product.productHeightCm)
  );
  addSpecification("Dimensions", "Net Weight", product.netWeightKg ? `${product.netWeightKg} kg` : "");
  addSpecification(
    "Package",
    "Package Dimensions",
    dimensions(product.packageLengthCm, product.packageWidthCm, product.packageHeightCm)
  );
  addSpecification("Package", "Gross Weight", product.grossWeightKg ? `${product.grossWeightKg} kg` : "");
  addSpecification("Other", "Country of Origin", product.countryOfOrigin);
  addSpecification("Other", "Lead Time", product.leadTime);
  addSpecification("Other", "Minimum Order Quantity", product.moq);
  addSpecification("Other", "Warranty", product.warranty);

  return {
    specifications: specifications.slice(0, 80),
    real_photos: product.images
      .filter((image) => image.section === "real_photos" && image.url)
      .slice(0, 2)
      .map((image) => ({ url: image.url!, alt: image.alt })),
    detail_images: product.images
      .filter((image) => image.section === "detail_images" && image.url)
      .map((image) => ({ url: image.url!, alt: image.alt })),
    logistics_images: product.images
      .filter((image) => image.section === "logistics" && image.url)
      .map((image) => ({
        url: image.url!,
        alt: image.alt,
        type: image.logisticsType || "Shipment",
      })),
  };
}
