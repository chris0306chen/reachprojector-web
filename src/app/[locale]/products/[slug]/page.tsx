import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts, getCategories } from '@/lib/data-service';
import { ProductDetailClient } from './product-detail-client';
import PricingRFQWrapper from '@/components/b2b/PricingRFQWrapper';
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';
import { normalizeProductDetail } from '@/lib/product-detail';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.seo_title || `${product.name} - ${product.brand}`,
    description: product.meta_description || product.short_description || `${product.name} by ${product.brand}.`,
    alternates: {
      canonical: `/${locale}/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} - ${product.brand} | REACH PROJECTOR`,
      description: product.short_description || '',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.category_id);
  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.category_id);
  const structuredDetail = normalizeProductDetail(product.detail_content);
  const geoContent = product.import_data && typeof product.import_data === "object"
    ? (product.import_data as { geo_content?: { faq?: Array<{ question: string; answer: string }> } }).geo_content
    : undefined;
  const verifiedFaq = Array.isArray(geoContent?.faq) ? geoContent.faq : [];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href={`/${locale}`} className="text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href={`/${locale}/products`} className="text-slate-500 hover:text-slate-900 transition-colors">Products</Link>
            <span className="text-slate-300">/</span>
            {category && (
              <>
                <Link href={`/${locale}/products?category=${category.slug}`} className="text-slate-500 hover:text-slate-900 transition-colors">
                  {category.name}
                </Link>
                <span className="text-slate-300">/</span>
              </>
            )}
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <ProductDetailClient product={product} relatedProducts={relatedProducts} />

      <PricingRFQWrapper
        basePrice={Number(product.price)}
        productName={product.name}
        productSlug={product.slug}
        productBrand={product.brand}
        productImage={product.images?.[0] || ''}
      />

      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema({
            name: product.name,
            brand: product.brand || 'REACH PROJECTOR',
            description: (product.description || '').slice(0, 200),
            image: product.images?.[0] || '/og/default-og.jpg',
            price: Number(product.price),
            currency: product.currency || 'USD',
            sku: product.sku || product.slug,
            category: category?.name || 'Electronics',
            availability: product.stock_status === 'in_stock' && product.inventory_quantity > 0
              ? 'in_stock'
              : 'out_of_stock',
            locale,
            additionalProperties: structuredDetail.specifications.map((item) => ({
              name: item.name,
              value: item.value,
            })),
          })),
        }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema([
            { name: 'Home', url: `/${locale}` },
            { name: 'Products', url: `/${locale}/products` },
            { name: product.name, url: `/${locale}/products/${product.slug}` },
          ])),
        }}
      />
      {verifiedFaq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(verifiedFaq)) }}
        />
      )}
    </div>
  );
}
