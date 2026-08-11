'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, Check, Minus, Plus } from 'lucide-react';
import { useTranslations, useMessages } from 'next-intl';
import type { Product } from '@/storage/database/shared/schema';
import { ProductCard } from '@/components/product-card';
import { PayPalCheckout } from '@/components/paypal-checkout';
import { useRouter } from 'next/navigation';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const t = useTranslations('productDetail');
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [quantity, setQuantity] = useState(1);
  const [showPayPal, setShowPayPal] = useState(false);
  const images = product.images && product.images.length > 0 ? product.images : ['/images/placeholder-product.jpg'];
  const price = parseFloat(product.price);
  const specs = product.specifications || {};
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

  const handlePayPalSuccess = () => {
    setTimeout(() => {
      router.push('/order-success?product=' + encodeURIComponent(displayName));
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Product Main */}
      <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)] lg:gap-16">
        {/* Image Gallery */}
        <div className="min-w-0">
          <div className="mb-4 aspect-square overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,.45)] sm:p-8">
            <img
              src={images[currentImage]}
              alt={displayName}
              className="h-full w-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2" aria-label="Product images">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  aria-label={`View product image ${idx + 1}`}
                  aria-pressed={idx === currentImage}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                    idx === currentImage ? 'border-orange-500' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:pt-3">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            {product.brand}
          </p>
          <h1 className="mb-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
            {displayName}
          </h1>

          {/* Price */}
          <div className="mb-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tracking-tight text-slate-950">
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-slate-400 line-through">
                ${parseFloat(product.compare_at_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6 flex items-center gap-2">
            {product.stock_status === 'in_stock' ? (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100"><Check className="h-3.5 w-3.5 text-emerald-700" /></span>
                <span className="text-sm font-semibold text-emerald-700">{t('inStock')}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-red-500">{t('outOfStock')}</span>
            )}
          </div>

          {/* Short Description */}
          {displayShortDesc && (
            <p className="mb-7 max-w-xl text-base leading-7 text-slate-600">
              {displayShortDesc}
            </p>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {t('keyFeatures')}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-orange-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-7">
            <label className="text-sm font-medium text-slate-700 mb-2 block">{t('quantity')}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Minus className="w-4 h-4" />
              </button>
              <output aria-live="polite" className="w-10 text-center font-semibold text-slate-900">{quantity}</output>
              <button
                onClick={() => setQuantity(Math.min(20, quantity + 1))}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-500 ml-2">
                {t('total')}: <span className="font-semibold text-slate-900">${(price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={`/checkout?productId=${product.id}&productName=${encodeURIComponent(displayName)}&price=${price}&quantity=${quantity}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {t('checkoutNow')}
            </Link>
            <a
              href={`https://wa.me/8613655920080?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t('whatsappInquiry')}
            </a>
            <Link
              href={`/contact?product=${product.slug}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-orange-400 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:col-span-2"
            >
              {t('sendInquiry')}
            </Link>
          </div>

          {/* PayPal Checkout */}
          {product.stock_status === 'in_stock' && (
            <div className="border-t border-slate-200 pt-6">
              {!showPayPal ? (
                <button
                  onClick={() => setShowPayPal(true)}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-orange-400 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.079-.026.175-.041.254-.93 4.783-4.13 6.515-8.227 6.515H9.668l-1.12 7.106h-.51a.641.641 0 0 0 .633.74h3.586c.457 0 .85-.334.922-.788l.038-.207.732-4.644.047-.256a.932.932 0 0 1 .922-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.773-4.445z"/>
                  </svg>
                  {t('buyWithPaypal')}
                </button>
              ) : (
                <PayPalCheckout
                  productId={product.id}
                  price={price}
                  quantity={quantity}
                  currency="USD"
                  onSuccess={handlePayPalSuccess}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Description / Specs */}
      <div className="mb-20 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10">
        <div className="mb-8 flex gap-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'description'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('description')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'specs'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('specifications')}
          </button>
        </div>

        {activeTab === 'description' && displayDescription && (
          <div className="prose prose-slate max-w-none">
            <p className="max-w-4xl text-base leading-8 text-slate-600">{displayDescription}</p>
          </div>
        )}

        {activeTab === 'specs' && Object.keys(specs).length > 0 && (
          <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-6 border-b border-slate-100 py-3.5">
                <span className="text-sm text-slate-500">{key}</span>
                <span className="text-sm font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{t('relatedProducts')}</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
