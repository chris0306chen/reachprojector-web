import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts, getCategories } from '@/lib/data-service';
import { ProductDetailClient } from './product-detail-client';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - ${product.brand}`,
    description: product.short_description || `${product.name} by ${product.brand}. Premium quality electronics at competitive prices.`,
    openGraph: {
      title: `${product.name} - ${product.brand} | REACH PROJECTOR`,
      description: product.short_description || '',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.category_id);
  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.category_id);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/products" className="text-slate-500 hover:text-slate-900 transition-colors">Products</Link>
            <span className="text-slate-300">/</span>
            {category && (
              <>
                <Link href={`/products?category=${category.slug}`} className="text-slate-500 hover:text-slate-900 transition-colors">
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

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            brand: { '@type': 'Brand', name: product.brand },
            description: product.description || product.short_description,
            image: product.images?.[0] || '',
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: product.stock_status === 'in_stock'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: 'REACH PROJECTOR' },
            },
          }),
        }}
      />
    </div>
  );
}
