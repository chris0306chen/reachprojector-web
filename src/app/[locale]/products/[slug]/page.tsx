import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts, getCategories } from '@/lib/data-service';
import { ProductDetailClient } from './product-detail-client';
import PricingRFQWrapper from '@/components/b2b/PricingRFQWrapper';
import { generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - ${product.brand}`,
    description: product.short_description || `${product.name} by ${product.brand}. Premium quality electronics at competitive prices.`,
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

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200/80 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-hidden text-sm">
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
            <span aria-current="page" className="max-w-[200px] truncate font-medium text-slate-900 sm:max-w-md">{product.name}</span>
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
            currency: 'USD',
            sku: product.slug,
            category: category?.name || 'Electronics',
            availability: product.stock_status === 'in_stock' ? 'in_stock' : 'out_of_stock',
            locale,
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
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema([
            { question: `What is the warranty for ${product.name}?`, answer: 'All products come with full manufacturer warranty and pre-shipment quality inspection.' },
            { question: 'Do you offer wholesale pricing?', answer: 'Yes, tiered wholesale pricing for bulk orders. Contact via WhatsApp or RFQ form.' },
            { question: 'How long does shipping take?', answer: 'DDP delivery typically 7-15 business days to 50+ countries.' },
            { question: 'Which countries do you ship to?', answer: '50+ countries across Europe, Americas, Southeast Asia, and Middle East.' },
          ])),
        }}
      />
    </div>
  );
}
