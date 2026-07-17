'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          {t('showingProducts', { count: total })}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={currentSort}
              onChange={(e) => {
                window.location.href = buildUrl({ sort: e.target.value, page: '1' });
              }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="newest">{t('sort.newest')}</option>
              <option value="price_asc">{t('sort.priceLowHigh')}</option>
              <option value="price_desc">{t('sort.priceHighLow')}</option>
              <option value="name">{t('sort.nameAZ')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-slate-500 mb-2">{t('noProducts')}</p>
          <p className="text-sm text-slate-400 mb-4">{t('noProductsDesc')}</p>
          <Link href="/products" className="text-sm font-medium text-orange-500 hover:text-orange-600">
            {t('viewAllProducts')}
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link
              href={buildUrl({ page: (page - 1).toString() })}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
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
                    className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-colors ${
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
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t('next')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </>
  );
}
