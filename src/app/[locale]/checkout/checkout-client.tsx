'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react';
import { PayPalCheckout } from '@/components/paypal-checkout';
import { StripeCheckout } from '@/components/stripe-checkout';
import { useTranslations } from 'next-intl';

type PaymentMethod = 'paypal' | 'stripe';

function CheckoutContent() {
  const t = useTranslations('checkout');
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';
  const productName = searchParams.get('productName') || 'Product';
  const price = parseFloat(searchParams.get('price') || '0');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');

  const totalAmount = (price * quantity).toFixed(2);

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
          {/* Payment Method Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('selectPayment')}</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'stripe' ? 'text-orange-500' : 'text-slate-400'}`} />
                <div className="text-left">
                  <p className={`font-medium text-sm ${paymentMethod === 'stripe' ? 'text-orange-600' : 'text-slate-700'}`}>
                    {t('cardPayment')}
                  </p>
                  <p className="text-xs text-slate-500">{t('cardPaymentDesc')}</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <svg className={`w-5 h-5 ${paymentMethod === 'paypal' ? 'text-orange-500' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.079-.026.175-.041.254-.93 4.783-4.13 6.515-8.227 6.515H9.668l-1.12 7.106h-.51a.641.641 0 0 0 .633.74h3.586c.457 0 .85-.334.922-.788l.038-.207.732-4.644.047-.256a.932.932 0 0 1 .922-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.773-4.445z"/>
                </svg>
                <div className="text-left">
                  <p className={`font-medium text-sm ${paymentMethod === 'paypal' ? 'text-orange-600' : 'text-slate-700'}`}>
                    PayPal
                  </p>
                  <p className="text-xs text-slate-500">{t('paypalAccount')}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {paymentMethod === 'stripe' ? (
              <StripeCheckout productId={productId} quantity={quantity} />
            ) : (
              <PayPalCheckout
                productId={productId}
                productName={productName}
                price={price}
                quantity={quantity}
                currency="USD"
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
                <span className="text-green-600 font-medium">{t('free')}</span>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <span className="font-semibold text-slate-900">{t('total')}</span>
              <span className="text-xl font-bold text-slate-900">${totalAmount}</span>
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
