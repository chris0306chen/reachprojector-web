export const SPECIFICATION_GROUPS = [
  "Optical",
  "Display",
  "System",
  "Connectivity",
  "Power",
  "Dimensions",
  "Package",
  "Other",
] as const;

export const LOGISTICS_IMAGE_TYPES = [
  "Bulk Stock",
  "Warehouse",
  "Packing",
  "Shipment",
] as const;

export type SpecificationGroup = (typeof SPECIFICATION_GROUPS)[number];
export type LogisticsImageType = (typeof LOGISTICS_IMAGE_TYPES)[number];

export interface ProductSpecificationItem {
  group: SpecificationGroup;
  name: string;
  value: string;
}

export interface ProductDetailImage {
  url: string;
  alt: string;
}

export interface ProductLogisticsImage extends ProductDetailImage {
  type: LogisticsImageType;
}

export interface ProductDetailContent {
  specifications: ProductSpecificationItem[];
  real_photos: ProductDetailImage[];
  detail_images: ProductDetailImage[];
  logistics_images: ProductLogisticsImage[];
}

export const EMPTY_PRODUCT_DETAIL: ProductDetailContent = {
  specifications: [],
  real_photos: [],
  detail_images: [],
  logistics_images: [],
};

const isSafeImageUrl = (value: unknown): value is string => {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return value.startsWith("/");
  }
};

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export function normalizeProductDetail(value: unknown): ProductDetailContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return EMPTY_PRODUCT_DETAIL;
  const input = value as Record<string, unknown>;

  const specifications = Array.isArray(input.specifications)
    ? input.specifications.slice(0, 80).flatMap((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return [];
        const row = item as Record<string, unknown>;
        const group = SPECIFICATION_GROUPS.includes(row.group as SpecificationGroup)
          ? (row.group as SpecificationGroup)
          : "Other";
        const name = cleanText(row.name, 100);
        const specificationValue = cleanText(row.value, 500);
        return name && specificationValue ? [{ group, name, value: specificationValue }] : [];
      })
    : [];

  const normalizeImages = (images: unknown, limit: number): ProductDetailImage[] =>
    Array.isArray(images)
      ? images.slice(0, limit).flatMap((item) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) return [];
          const row = item as Record<string, unknown>;
          const url = isSafeImageUrl(row.url) ? row.url : "";
          const alt = cleanText(row.alt, 180);
          return url && alt ? [{ url, alt }] : [];
        })
      : [];

  const logistics_images = Array.isArray(input.logistics_images)
    ? input.logistics_images.slice(0, 12).flatMap((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return [];
        const row = item as Record<string, unknown>;
        const url = isSafeImageUrl(row.url) ? row.url : "";
        const alt = cleanText(row.alt, 180);
        const type = LOGISTICS_IMAGE_TYPES.includes(row.type as LogisticsImageType)
          ? (row.type as LogisticsImageType)
          : "Shipment";
        return url && alt ? [{ url, alt, type }] : [];
      })
    : [];

  return {
    specifications,
    real_photos: normalizeImages(input.real_photos, 2),
    detail_images: normalizeImages(input.detail_images, 20),
    logistics_images,
  };
}

export function validateProductDetail(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "detail_content must be an object";
  }
  const normalized = normalizeProductDetail(value);
  const input = value as Record<string, unknown>;
  const expectedCounts = {
    specifications: Array.isArray(input.specifications) ? input.specifications.length : 0,
    real_photos: Array.isArray(input.real_photos) ? input.real_photos.length : 0,
    detail_images: Array.isArray(input.detail_images) ? input.detail_images.length : 0,
    logistics_images: Array.isArray(input.logistics_images) ? input.logistics_images.length : 0,
  };
  if (expectedCounts.real_photos > 2) return "Only two real product photos are allowed";
  if (
    normalized.specifications.length !== expectedCounts.specifications ||
    normalized.real_photos.length !== expectedCounts.real_photos ||
    normalized.detail_images.length !== expectedCounts.detail_images ||
    normalized.logistics_images.length !== expectedCounts.logistics_images
  ) {
    return "Every detail entry requires valid text, image URL, alt text and type";
  }
  return null;
}
