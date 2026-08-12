'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { getCheckoutCopy } from '@/lib/checkout-copy';

interface StripeCheckoutProps {
  productId: string;
  quantity: number;
  countryCode: string;
}

export function StripeCheckout({ productId, quantity, countryCode }: StripeCheckoutProps) {
  const locale = useLocale();
  const copy = getCheckoutCopy(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, locale, countryCode }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.url !== 'string') {
        throw new Error(data.error || copy.stripeFailed);
      }
      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : copy.stripeFailed);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || !productId || !countryCode}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
        {loading ? copy.stripeOpen : copy.stripePay}
      </button>
      <p className="text-xs text-center text-slate-500">{copy.stripePowered}</p>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
