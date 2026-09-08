import Link from 'next/link';
import { useTranslations, useMessages, useLocale } from 'next-intl';
import type { Product } from '@/storage/database/shared/schema';
import { getProductCommerceProfile, getProductDecisionFacts } from '@/lib/product-commerce';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const messages = useMessages();
  const imageUrl = product.images?.[0] || '/images/placeholder-product.jpg';
  const price = parseFloat(product.price);
  const commerce = getProductCommerceProfile(product.import_data);
  const decisionFacts = getProductDecisionFacts(product.specifications, product.import_data);
  const isAvailable = product.stock_status === 'in_stock' && product.inventory_quantity > 0;

  // Get translated product name and description with fallback
  const productItems = (messages as Record<string, unknown>)?.products as Record<string, unknown> | undefined;
  const items = productItems?.items as Record<string, { name?: string; shortDescription?: string }> | undefined;
  const translatedItem = items?.[product.slug];
  const displayName = translatedItem?.name || product.name;
  const displayShortDesc = translatedItem?.shortDescription || product.short_description;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
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
        {decisionFacts.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1.5" aria-label={t('decisionFacts')}>
            {decisionFacts.map((fact) => (
              <li key={fact} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium leading-4 text-slate-600">
                {fact}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          {commerce.saleMode === 'quote_only' ? (
            <span className="text-sm font-semibold text-orange-600">{t('requestQuote')}</span>
          ) : <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              {Number.isFinite(price) && price > 0
                ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : t('priceOnRequest')}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-slate-400 line-through">
                ${parseFloat(product.compare_at_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>}
          {commerce.saleMode === 'quote_only' ? (
            <span className="text-xs font-medium text-slate-500">{t('projectSupply')}</span>
          ) : isAvailable ? (
            <span className="text-xs text-green-600 font-medium">{t('stock.inStock')}</span>
          ) : (
            <span className="text-xs text-red-500 font-medium">{t('stock.outOfStock')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
