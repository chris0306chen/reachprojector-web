import type { Metadata } from 'next';
import { generateItemListSchema } from '@/lib/seo';
import Link from 'next/link';
import { getProducts, getCategories, getBrands } from '@/lib/data-service';
import { ProductCard } from '@/components/product-card';
import { ProductsClient } from './products-client';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

const CATEGORY_META: Record<string, { title: string; description: string; keywords: string[] }> = {
  '4k-laser-projectors': {
    title: '4K Laser Projectors Wholesale | XGIMI, Hisense, JMGO',
    description: 'Shop wholesale 4K laser projectors. Triple laser, ultra-short throw, up to 120-inch. Bulk pricing, DDP shipping to 50+ countries.',
    keywords: ['4k laser projector', 'wholesale 4k projector', 'xgimi 4k projector', 'hisense 4k laser'],
  },
  'ust-laser-tv': {
    title: 'UST Laser TV Wholesale | Ultra Short Throw | Hisense, Formovie',
    description: 'Wholesale ultra-short throw laser TVs. 100-120 inch display. Bulk pricing with DDP global shipping.',
    keywords: ['ust laser tv', 'ultra short throw projector', 'hisense laser tv', 'formovie theater'],
  },
  'projector-mounts': {
    title: 'Projector Mounts Wholesale | Ceiling, Wall, Floor Stands',
    description: 'Wholesale projector mounts and brackets. Ceiling, wall, floor stands and UST adjustable mounts. Bulk pricing with global DDP shipping.',
    keywords: ['projector mount', 'wholesale projector bracket', 'ceiling projector mount', 'UST projector stand'],
  },
  'projection-screens': {
    title: 'Projection Screens Wholesale | Motorized, ALR, Fixed Frame',
    description: 'Wholesale projection screens. Motorized, fixed frame, portable and ALR screens for any environment. Bulk pricing, worldwide DDP shipping.',
    keywords: ['projection screen', 'wholesale projector screen', 'ALR screen', 'motorized screen', 'fixed frame screen'],
  },
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams
  const category = params?.category
  const meta = category ? CATEGORY_META[category] : null
  if (!meta) return { title: 'All Products | REACH PROJECTOR' }
  return { title: meta.title, description: meta.description, keywords: meta.keywords }
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
    search?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const t = await getTranslations('products');
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const sortBy = (params.sort as 'newest' | 'price_asc' | 'price_desc' | 'name') || 'newest';

  const [result, categories, brands] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      brand: params.brand,
      search: params.search,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      sortBy,
      page,
      pageSize: 12,
    }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">{t('breadcrumb.home')}</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">{t('title')}</span>
            {params.category && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-orange-500 capitalize">{params.category}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <h2 className="text-base font-semibold text-slate-900 mb-4">{t('filters.title')}</h2>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">{t('filters.category')}</h3>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="/products"
                      className={`text-sm ${!params.category ? 'text-orange-500 font-medium' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
                    >
                      {t('filters.allProducts')}
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className={`text-sm ${params.category === cat.slug ? 'text-orange-500 font-medium' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">{t('filters.brand')}</h3>
                <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <li key={brand}>
                      <Link
                        href={`/products?brand=${encodeURIComponent(brand)}${params.category ? `&category=${params.category}` : ''}`}
                        className={`text-sm ${params.brand === brand ? 'text-orange-500 font-medium' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
                      >
                        {brand}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">{t('filters.priceRange')}</h3>
                <div className="space-y-1.5">
                  {[
                    { label: t('filters.priceRanges.under500'), min: '0', max: '500' },
                    { label: t('filters.priceRanges.500to1000'), min: '500', max: '1000' },
                    { label: t('filters.priceRanges.1000to2000'), min: '1000', max: '2000' },
                    { label: t('filters.priceRanges.2000to5000'), min: '2000', max: '5000' },
                    { label: t('filters.priceRanges.over5000'), min: '5000', max: '' },
                  ].map((range) => (
                    <Link
                      key={range.label}
                      href={`/products?minPrice=${range.min}${range.max ? `&maxPrice=${range.max}` : ''}${params.category ? `&category=${params.category}` : ''}`}
                      className="block text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {range.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductsClient
              products={result.products}
              total={result.total}
              page={page}
              totalPages={result.totalPages}
              currentSort={sortBy}
              currentCategory={params.category}
              currentBrand={params.brand}
              currentSearch={params.search}
            />
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateItemListSchema(
        result.products.map(p => ({ name: p.name, slug: p.slug, price: Number(p.price) || 0 }))
      )) }} />
    </div>
  );
}
