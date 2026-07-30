'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Lock, CreditCard, Loader2 } from 'lucide-react';
import { PayPalCheckout } from '@/components/paypal-checkout';
import { StripeCheckout } from '@/components/stripe-checkout';
import { useTranslations } from 'next-intl';

type ShippingQuote = {
  mode: 'automatic';
  shippingCost: number;
  tradeTerms: 'DDP' | 'DAP';
  dutiesIncluded: boolean;
  method: string;
  estimatedDaysMin: number | null;
  estimatedDaysMax: number | null;
};

function CheckoutContent() {
  const t = useTranslations('checkout');
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';
  const parsedQuantity = Number(searchParams.get('quantity'));
  const quantity = Number.isSafeInteger(parsedQuantity) && parsedQuantity >= 1 && parsedQuantity <= 20 ? parsedQuantity : 1;
  const stripeEnabled = process.env.NEXT_PUBLIC_STRIPE_ENABLED === 'true';
  const [item, setItem] = useState<{ productId: string; productName: string; unitPrice: number; total: string } | null>(null);
  const [catalogError, setCatalogError] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState('');
  const [shipping, setShipping] = useState<ShippingQuote | null>(null);
  const [shippingError, setShippingError] = useState('');
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setCatalogError('');
    setItem(null);

    fetch('/api/checkout/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Product is unavailable');
        if (active) setItem(data);
      })
      .catch((error) => {
        if (active) setCatalogError(error instanceof Error ? error.message : 'Product is unavailable');
      });

    return () => { active = false; };
  }, [productId, quantity]);

  useEffect(() => {
    fetch('/api/shipping/quote')
      .then((response) => response.json())
      .then((data) => setCountries(Array.isArray(data.countries) ? data.countries : []))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!item || !countryCode) {
      setShipping(null);
      setShippingError('');
      return;
    }
    let active = true;
    setShippingLoading(true);
    setShipping(null);
    setShippingError('');
    fetch('/api/shipping/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: item.productId, quantity, countryCode }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data.mode !== 'automatic') throw new Error('Online shipping is unavailable. Please request a quote.');
        if (active) setShipping(data);
      })
      .catch((error) => {
        if (active) setShippingError(error instanceof Error ? error.message : 'Shipping quote unavailable');
      })
      .finally(() => {
        if (active) setShippingLoading(false);
      });
    return () => { active = false; };
  }, [item, countryCode, quantity]);

  const productName = item?.productName || 'Product';
  const price = item?.unitPrice || 0;
  const totalAmount = item?.total || '0.00';
  const grandTotal = (Number(totalAmount) + (shipping?.shippingCost || 0)).toFixed(2);

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/order-success?product=' + encodeURIComponent(productName));
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToProduct')}
        </button>
        <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Section */}
        <div className="lg:col-span-2">
          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <label htmlFor="shipping-country" className="block text-sm font-medium text-slate-700 mb-2">
              Shipping country
            </label>
            <select
              id="shipping-country"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm mb-4"
            >
              <option value="">Select destination</option>
              {countries.map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
            {shippingLoading && <p className="text-sm text-slate-500 mb-4">Calculating shipping...</p>}
            {shippingError && <p className="text-sm text-amber-700 mb-4">{shippingError}</p>}
            {shipping && (
              <p className="text-sm text-green-700 mb-4">
                {shipping.tradeTerms} shipping: ${shipping.shippingCost.toFixed(2)}
                {shipping.dutiesIncluded ? ' (duties included)' : ' (duties paid by recipient)'}
              </p>
            )}
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('selectPayment')}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {stripeEnabled && (
                <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-900 bg-slate-50">
                  <CreditCard className="w-5 h-5 text-slate-900" />
                  <div className="text-left">
                    <p className="font-medium text-sm text-slate-900">Credit or debit card</p>
                    <p className="text-xs text-slate-500">Secure checkout with Stripe</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200">
                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.079-.026.175-.041.254-.93 4.783-4.13 6.515-8.227 6.515H9.668l-1.12 7.106h-.51a.641.641 0 0 0 .633.74h3.586c.457 0 .85-.334.922-.788l.038-.207.732-4.644.047-.256a.932.932 0 0 1 .922-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.773-4.445z"/>
                </svg>
                <div className="text-left">
                  <p className="font-medium text-sm text-orange-600">PayPal</p>
                  <p className="text-xs text-slate-500">{t('paypalAccount')}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
              <p>
                PayPal payments are collected by Quanzhou Reach Technology Co., Ltd.
              </p>
              {stripeEnabled && (
                <p>
                  Card payments through Stripe are collected by HK REACH SOURCING LIMITED.
                </p>
              )}
              <p>The applicable seller is also identified on the order confirmation and invoice.</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {catalogError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {catalogError}
              </div>
            )}
            {!item && !catalogError && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading verified product price…
              </div>
            )}
            {item && shipping && stripeEnabled && (
              <>
                <StripeCheckout productId={item.productId} quantity={quantity} countryCode={countryCode} />
                <div className="flex items-center gap-3 my-6">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs uppercase tracking-wide text-slate-400">or pay with PayPal</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
              </>
            )}
            {item && shipping && (
              <PayPalCheckout
                productId={item.productId}
                price={price}
                quantity={quantity}
                currency="USD"
                countryCode={countryCode}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('orderSummary')}</h2>
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('product')}</span>
                <span className="font-medium text-slate-900 text-right max-w-[180px] truncate">{productName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('price')}</span>
                <span className="text-slate-900">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('quantity')}</span>
                <span className="text-slate-900">x{quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('shipping')}</span>
                <span className="text-slate-900 font-medium">
                  {shipping ? `$${shipping.shippingCost.toFixed(2)} ${shipping.tradeTerms}` : 'Select country'}
                </span>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <span className="font-semibold text-slate-900">{t('total')}</span>
              <span className="text-xl font-bold text-slate-900">${grandTotal}</span>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>{t('securePayment')}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>{t('sslEncryption')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
