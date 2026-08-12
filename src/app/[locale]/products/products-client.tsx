'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { useTranslations } from 'next-intl';
import type { Product } from '@/storage/database/shared/schema';

interface ProductsClientProps {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  currentSort: string;
  currentCategory?: string;
  currentBrand?: string;
  currentSearch?: string;
}

export function ProductsClient({
  products,
  total,
  page,
  totalPages,
  currentSort,
  currentCategory,
  currentBrand,
  currentSearch,
}: ProductsClientProps) {
  const t = useTranslations('products');
  const buildUrl = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    const merged = {
      category: currentCategory,
      brand: currentBrand,
      search: currentSearch,
      sort: currentSort,
      ...params,
    };
    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== 'newest' || (key === 'sort' && value)) {
        searchParams.set(key, value);
      }
    });
    return `/products?${searchParams.toString()}`;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-600">
          {t('showingProducts', { count: total })}
        </p>
        <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <select
              value={currentSort}
              onChange={(e) => {
                window.location.href = buildUrl({ sort: e.target.value, page: '1' });
              }}
              aria-label={t('sort.newest')}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="newest">{t('sort.newest')}</option>
              <option value="price_asc">{t('sort.priceLowHigh')}</option>
              <option value="price_desc">{t('sort.priceHighLow')}</option>
              <option value="name">{t('sort.nameAZ')}</option>
            </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <p className="mb-2 text-lg font-semibold text-slate-950">{t('noProducts')}</p>
          <p className="mb-5 text-sm text-slate-500">{t('noProductsDesc')}</p>
          <Link href="/products" className="text-sm font-semibold text-orange-600 underline decoration-orange-200 underline-offset-8 hover:decoration-orange-600">
            {t('viewAllProducts')}
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildUrl({ page: (page - 1).toString() })}
              className="flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('prev')}
            </Link>
          )}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <Link
                    href={buildUrl({ page: p.toString() })}
                    aria-current={p === page ? 'page' : undefined}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm transition-colors ${
                      p === page
                        ? 'bg-orange-500 text-white font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </Link>
                </span>
              ))}
          </div>
          {page < totalPages && (
            <Link
              href={buildUrl({ page: (page + 1).toString() })}
              className="flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              {t('next')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
