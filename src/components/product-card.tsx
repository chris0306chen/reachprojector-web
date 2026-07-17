import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Product } from '@/storage/database/shared/schema';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const imageUrl = product.images?.[0] || '/images/placeholder-product.jpg';
  const price = parseFloat(product.price);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_bestseller && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded">
              {t('badges.bestseller')}
            </span>
          )}
          {product.is_new_arrival && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded">
              {t('badges.new')}
            </span>
          )}
        </div>
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <span className="p-2 bg-white rounded-full shadow-md hover:bg-orange-500 hover:text-white transition-colors">
              <Eye className="w-4 h-4" />
            </span>
            <span className="p-2 bg-white rounded-full shadow-md hover:bg-orange-500 hover:text-white transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.short_description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-slate-400 line-through">
                ${parseFloat(product.compare_at_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          {product.stock_status === 'in_stock' ? (
            <span className="text-xs text-green-600 font-medium">{t('stock.inStock')}</span>
          ) : (
            <span className="text-xs text-red-500 font-medium">{t('stock.outOfStock')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
