'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, Check, Minus, Plus, Globe2, ShieldCheck, Truck, PackageCheck } from 'lucide-react';
import { useLocale, useTranslations, useMessages } from 'next-intl';
import type { Product } from '@/storage/database/shared/schema';
import { ProductCard } from '@/components/product-card';
import { ProductDetailSections } from '@/components/product-detail-sections';
import { getProductCommerceProfile } from '@/lib/product-commerce';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const t = useTranslations('productDetail');
  const locale = useLocale();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const images = product.images && product.images.length > 0 ? product.images : ['/images/placeholder-product.jpg'];
  const price = parseFloat(product.price);
  const commerce = getProductCommerceProfile(product.import_data);
  const isQuoteOnly = commerce.saleMode === 'quote_only';
  const isAvailable = !isQuoteOnly && product.stock_status === 'in_stock' && product.inventory_quantity > 0;
  const hasRegionalDetails = Boolean(
    commerce.marketVersion || commerce.systemLanguage || commerce.streamingSetup
    || commerce.plugAndVoltage || commerce.warranty || commerce.duties
  );
  const features = product.features || [];

  // Get translated product name and description with fallback
  const messages = useMessages();
  const productItems = (messages as Record<string, unknown>)?.products as Record<string, unknown> | undefined;
  const items = productItems?.items as Record<string, { name?: string; shortDescription?: string; description?: string }> | undefined;
  const translatedItem = items?.[product.slug];
  const displayName = translatedItem?.name || product.name;
  const displayShortDesc = translatedItem?.shortDescription || product.short_description;
  const displayDescription = translatedItem?.description || product.description;

  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${displayName} (${product.brand}). Could you please provide more details and pricing?`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
            <img
              src={images[currentImage]}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  aria-label={`${displayName} image ${idx + 1}`}
                  aria-pressed={idx === currentImage}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === currentImage ? 'border-orange-500' : 'border-slate-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm font-medium text-orange-500 uppercase tracking-wider mb-2">
            {product.brand}
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            {displayName}
          </h1>

          {/* Price or project supply mode */}
          {isQuoteOnly ? (
            <div className="mb-6 rounded-xl bg-slate-950 px-5 py-4 text-white">
              <p className="text-lg font-semibold">{t('quoteOnly')}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{t('confirmConfiguration')}</p>
            </div>
          ) : <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">
              {Number.isFinite(price) && price > 0
                ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : t('projectQuote')}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-slate-400 line-through">
                ${parseFloat(product.compare_at_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>}

          {/* Stock Status */}
          {!isQuoteOnly && <div className="flex items-center gap-2 mb-6">
            {isAvailable ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">{t('inStock')}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-red-500">{t('outOfStock')}</span>
            )}
          </div>}

          {/* Short Description */}
          {displayShortDesc && (
            <p className="text-slate-600 mb-6 leading-relaxed">
              {displayShortDesc}
            </p>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                {t('keyFeatures')}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasRegionalDetails && (
            <section className="mb-7 rounded-xl border border-slate-200 bg-slate-50 p-5" aria-labelledby="regional-configuration-title">
              <div className="mb-4 flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-orange-600" aria-hidden="true" />
                <h2 id="regional-configuration-title" className="text-base font-semibold text-slate-950">{t('regionalTitle')}</h2>
              </div>
              <dl className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                {[
                  [t('marketVersion'), commerce.marketVersion],
                  [t('systemLanguage'), commerce.systemLanguage],
                  [t('streamingSetup'), commerce.streamingSetup],
                  [t('plugAndVoltage'), commerce.plugAndVoltage],
                  [t('warrantyLabel'), commerce.warranty],
                  [t('dutiesLabel'), commerce.duties],
                ].filter((item) => item[1]).map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                    <dd className="mt-1 break-words text-sm leading-5 text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600">{t('confirmConfiguration')}</p>
            </section>
          )}

          {/* Quantity Selector */}
          {isAvailable && <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-2 block">{t('quantity')}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label={`Decrease ${t('quantity')}`}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(20, product.inventory_quantity, quantity + 1))}
                aria-label={`Increase ${t('quantity')}`}
                disabled={quantity >= Math.min(20, product.inventory_quantity)}
                className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-500 ms-2">
                {t('total')}: <span className="font-semibold text-slate-900">${(price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </span>
            </div>
          </div>}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {isQuoteOnly ? (
              <Link
                href={`/${locale}/contact?product=${product.slug}&type=project`}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                {t('projectQuote')}
              </Link>
            ) : isAvailable && <Link
              href={`/${locale}/checkout?productId=${product.id}&quantity=${quantity}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all hover:scale-[1.02] shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              {t('checkoutNow')}
            </Link>}
            <a
              href={`https://wa.me/8613655920080?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t('whatsappInquiry')}
            </a>
            {!isQuoteOnly && <Link
              href={`/${locale}/contact?product=${product.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-medium rounded-lg transition-colors"
            >
              {t('sendInquiry')}
            </Link>}
          </div>

          {!isQuoteOnly && commerce.saleMode === 'retail_and_bulk' && (
            <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-slate-200 py-3 text-sm text-slate-600">
              <span>{t('retailSupport')}</span>
              <Link href={`/${locale}/contact?product=${product.slug}&type=bulk`} className="font-semibold text-orange-600 underline decoration-orange-200 underline-offset-4 hover:decoration-orange-600">
                {t('bulkQuote')}
              </Link>
            </div>
          )}

          <section className="rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="order-confidence-title">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" aria-hidden="true" />
              <h2 id="order-confidence-title" className="text-base font-semibold text-slate-950">{t('orderConfidence')}</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">{t('orderConfidenceText')}</p>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
              <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />{t('securePayment')}</li>
              <li className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />{t('shippingTerms')}</li>
              <li className="flex items-start gap-2"><PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />{t('preShipmentCheck')}</li>
            </ul>
          </section>

        </div>
      </div>

      <ProductDetailSections
        content={product.detail_content}
        legacySpecifications={product.specifications}
        description={displayDescription}
        locale={locale}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('relatedProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
