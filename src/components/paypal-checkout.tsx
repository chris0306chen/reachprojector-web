'use client';

import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from '@paypal/react-paypal-js';
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { getCheckoutCopy } from '@/lib/checkout-copy';

interface PayPalCheckoutProps {
  productId: string;
  price: number;
  quantity?: number;
  currency?: string;
  countryCode?: string;
  onSuccess?: (order: { order_id: string; paypal_order_id?: string | null }) => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export function PayPalCheckout({
  productId,
  price,
  quantity = 1,
  currency = 'USD',
  countryCode = '',
  onSuccess,
}: PayPalCheckoutProps) {
  const locale = useLocale();
  const copy = getCheckoutCopy(locale);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const totalAmount = (price * quantity).toFixed(2);

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency,
    intent: 'capture',
  };

  const handleCreateOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          countryCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || copy.createOrderFailed);
      }

      return data.orderId;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : copy.createOrderFailed);
      setStatus('error');
      throw err;
    }
  };

  const handleApprove = async (data: { orderID: string }) => {
    setStatus('processing');
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          productId,
          quantity,
          countryCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || copy.captureFailed);
      }

      setStatus('success');
      onSuccess?.(result.order);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : copy.paymentFailed);
      setStatus('error');
    }
  };

  const handleError = () => {
    setErrorMessage(copy.cancelled);
    setStatus('error');
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p className="font-medium text-green-800">{copy.paymentSuccess}</p>
          <p className="text-sm text-green-600">{copy.paymentSuccessDetail}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="font-medium text-red-800">{copy.paymentFailed}</p>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setStatus('idle');
            setErrorMessage('');
          }}
          className="text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          {copy.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
        <span>{copy.totalAmount}:</span>
        <span className="font-semibold text-slate-900">
          ${totalAmount} {currency}
        </span>
      </div>

      {status === 'processing' && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700">{copy.processingPayment}</span>
        </div>
      )}

      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          disabled={!countryCode}
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          }}
          fundingSource={FUNDING.PAYPAL}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={handleError}
          onCancel={() => {
            setStatus('idle');
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
