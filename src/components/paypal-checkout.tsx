'use client';

import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from '@paypal/react-paypal-js';
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PayPalCheckoutProps {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
  currency?: string;
  onSuccess?: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export function PayPalCheckout({
  productId,
  productName,
  price,
  quantity = 1,
  currency = 'USD',
  onSuccess,
}: PayPalCheckoutProps) {
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
          productName,
          price: price.toString(),
          quantity,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.orderId;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create order');
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
          productName,
          price: totalAmount,
          quantity,
          currency,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture payment');
      }

      setStatus('success');
      onSuccess?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Payment failed');
      setStatus('error');
    }
  };

  const handleError = () => {
    setErrorMessage('Payment was cancelled or failed. Please try again.');
    setStatus('error');
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p className="font-medium text-green-800">Payment Successful!</p>
          <p className="text-sm text-green-600">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
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
            <p className="font-medium text-red-800">Payment Failed</p>
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
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
        <span>Total Amount:</span>
        <span className="font-semibold text-slate-900">
          ${totalAmount} {currency}
        </span>
      </div>

      {status === 'processing' && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700">Processing payment...</span>
        </div>
      )}

      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
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
