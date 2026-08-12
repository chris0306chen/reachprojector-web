import Link from 'next/link';
import { useTranslations, useMessages } from 'next-intl';
import type { Product } from '@/storage/database/shared/schema';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const messages = useMessages();
  const imageUrl = product.images?.[0] || '/images/placeholder-product.jpg';
  const price = parseFloat(product.price);

  // Get translated product name and description with fallback
  const productItems = (messages as Record<string, unknown>)?.products as Record<string, unknown> | undefined;
  const items = productItems?.items as Record<string, { name?: string; shortDescription?: string }> | undefined;
  const translatedItem = items?.[product.slug];
  const displayName = translatedItem?.name || product.name;
  const displayShortDesc = translatedItem?.shortDescription || product.short_description;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-[0_1px_0_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={displayName}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_bestseller && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded">
              {t('badges.bestSeller')}
            </span>
          )}
          {product.is_new_arrival && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded">
              {t('badges.new')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="mb-2 text-xs font-semibold text-slate-500">
          {product.brand}
        </p>
        <h3 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-950 transition-colors group-hover:text-orange-600">
          {displayName}
        </h3>
        {displayShortDesc && (
          <p className="mb-4 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
            {displayShortDesc}
          </p>
        )}
        <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
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
