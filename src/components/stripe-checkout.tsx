'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

interface StripeCheckoutProps {
  productId: string;
  quantity: number;
}

export function StripeCheckout({ productId, quantity }: StripeCheckoutProps) {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, locale }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.url !== 'string') {
        throw new Error(data.error || 'Unable to start card checkout');
      }
      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start card checkout');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || !productId}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
        {loading ? 'Opening secure checkout…' : 'Pay securely by card'}
      </button>
      <p className="text-xs text-center text-slate-500">Secure payment powered by Stripe</p>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
