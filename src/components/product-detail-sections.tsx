import {
  normalizeProductDetail,
  type ProductDetailContent,
  type ProductSpecificationItem,
} from "@/lib/product-detail";

interface ProductDetailSectionsProps {
  content: ProductDetailContent | null | undefined;
  legacySpecifications?: Record<string, string> | null;
  description?: string | null;
}

const sectionClass = "border-t border-slate-200 py-12 sm:py-16";
const headingClass = "mb-8 text-2xl font-bold text-[#0B1A40]";

export function ProductDetailSections({
  content,
  legacySpecifications,
  description,
}: ProductDetailSectionsProps) {
  const detail = normalizeProductDetail(content);
  const specifications: ProductSpecificationItem[] =
    detail.specifications.length > 0
      ? detail.specifications
      : Object.entries(legacySpecifications || {}).map(([name, value]) => ({
          group: "Other",
          name,
          value: String(value),
        }));

  const groupedSpecifications = specifications.reduce<Record<string, ProductSpecificationItem[]>>(
    (groups, item) => {
      (groups[item.group] ||= []).push(item);
      return groups;
    },
    {}
  );

  if (
    specifications.length === 0 &&
    !description &&
    detail.real_photos.length === 0 &&
    detail.detail_images.length === 0 &&
    detail.logistics_images.length === 0
  ) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {specifications.length > 0 && (
        <section className={sectionClass} aria-labelledby="product-specifications">
          <h2 id="product-specifications" className={headingClass}>Product Specifications</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {Object.entries(groupedSpecifications).map(([group, items]) => (
              <div key={group} className="border-b border-slate-200 last:border-b-0">
                <h3 className="bg-[#0B1A40] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white">
                  {group}
                </h3>
                <dl className="grid md:grid-cols-2">
                  {items.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="grid grid-cols-[minmax(110px,35%)_1fr] gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0 md:[&:nth-child(odd)]:border-r"
                    >
                      <dt className="text-sm font-medium text-slate-600">{item.name}</dt>
                      <dd className="break-words text-sm text-slate-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      {description && (
        <section className={sectionClass} aria-labelledby="product-description">
          <h2 id="product-description" className={headingClass}>Product Description</h2>
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-line text-slate-600 leading-relaxed">{description}</p>
          </div>
        </section>
      )}

      {detail.real_photos.length > 0 && (
        <section className={sectionClass} aria-labelledby="real-product-photos">
          <h2 id="real-product-photos" className={headingClass}>Real Product Photos</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {detail.real_photos.map((image) => (
              <figure key={image.url} className="overflow-hidden rounded-2xl bg-slate-100">
                <img src={image.url} alt={image.alt} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {detail.detail_images.length > 0 && (
        <section className={sectionClass} aria-labelledby="product-details">
          <h2 id="product-details" className={headingClass}>Product Details</h2>
          <div className="space-y-5">
            {detail.detail_images.map((image) => (
              <img key={image.url} src={image.url} alt={image.alt} loading="lazy" className="h-auto w-full rounded-2xl" />
            ))}
          </div>
        </section>
      )}

      {detail.logistics_images.length > 0 && (
        <section className={sectionClass} aria-labelledby="bulk-orders-shipment">
          <h2 id="bulk-orders-shipment" className={headingClass}>Bulk Orders &amp; Shipment</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {detail.logistics_images.map((image) => (
              <figure key={`${image.type}-${image.url}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img src={image.url} alt={image.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="border-t border-slate-200 px-4 py-3 text-sm font-medium text-[#0B1A40]">
                  {image.type}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
