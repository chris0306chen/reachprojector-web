import type { Metadata } from 'next';
import { generateItemListSchema } from '@/lib/seo';
import Link from 'next/link';
import { getProducts, getCategories, getBrands } from '@/lib/data-service';
import { ProductsClient } from './products-client';
import { getTranslations } from 'next-intl/server';
import { SlidersHorizontal } from 'lucide-react';

export const dynamic = 'force-dynamic';

const CATEGORY_META: Record<string, { title: string; description: string; keywords: string[] }> = {
  '4k-laser-projectors': {
    title: '4K Laser Projectors | Compare XGIMI, Hisense & JMGO',
    description: 'Compare 4K laser projectors by brightness, throw type, room fit and regional configuration. Retail purchasing and business quotations are available.',
    keywords: ['4k laser projector', 'compare 4k projectors', 'xgimi 4k projector', 'hisense 4k laser'],
  },
  'ust-laser-tv': {
    title: 'Ultra Short Throw Projectors & Laser TVs | Buying Guide',
    description: 'Compare ultra-short-throw projectors and laser TVs by screen compatibility, room light, image size and installation requirements.',
    keywords: ['ust laser tv', 'ultra short throw projector', 'hisense laser tv', 'formovie theater'],
  },
  'projector-mounts': {
    title: 'Projector Mounts | Ceiling, Wall & Floor Stands',
    description: 'Choose projector mounts and stands by projector type, placement, adjustment range and installation requirements.',
    keywords: ['projector mount', 'projector bracket', 'ceiling projector mount', 'UST projector stand'],
  },
  'projection-screens': {
    title: 'Projection Screens | Motorized, ALR & Fixed Frame',
    description: 'Compare motorized, fixed-frame, portable, ALR and CLR screens by projector type, room light and installation needs.',
    keywords: ['projection screen', 'projector screen', 'ALR screen', 'motorized screen', 'fixed frame screen'],
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

  const filters = (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-950">{t('filters.category')}</h3>
        <div className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-1">
          <Link
            href="/products"
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              !params.category
                ? 'bg-slate-950 font-semibold text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            {t('filters.allProducts')}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                params.category === category.slug
                  ? 'bg-slate-950 font-semibold text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-7">
        <h3 className="text-sm font-semibold text-slate-950">{t('filters.brand')}</h3>
        <div className="mt-3 max-h-56 space-y-1 overflow-y-auto pe-2">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/products?brand=${encodeURIComponent(brand)}${params.category ? `&category=${params.category}` : ''}`}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                params.brand === brand
                  ? 'bg-orange-50 font-semibold text-orange-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-7">
        <h3 className="text-sm font-semibold text-slate-950">{t('filters.priceRange')}</h3>
        <div className="mt-3 space-y-1">
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
              className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {range.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
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

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h1 className="text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{t('title')}</h1>
          <p className="mt-4 max-w-[65ch] text-base leading-7 text-slate-600">{t('subtitle')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <details className="mb-6 rounded-xl border border-slate-200 bg-white lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold marker:content-none">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-orange-500" aria-hidden="true" />
              {t('filters.title')}
            </span>
            <span className="text-sm font-normal text-slate-500">{t('showingProducts', { count: result.total })}</span>
          </summary>
          <div className="border-t border-slate-200 p-5">{filters}</div>
        </details>

        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="mb-5 text-base font-semibold text-slate-950">{t('filters.title')}</h2>
              {filters}
            </div>
          </aside>

          <div className="min-w-0">
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
    </main>
  );
}
