'use client';

import { useState, useEffect, useRef } from 'react';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface AirwallexCheckoutProps {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
  currency?: string;
  onSuccess?: () => void;
}

type PaymentStatus = 'idle' | 'loading' | 'ready' | 'processing' | 'success' | 'error';

declare global {
  interface Window {
    Airwallex: any;
  }
}

export function AirwallexCheckout({
  productId,
  productName,
  price,
  quantity = 1,
  currency = 'USD',
  onSuccess,
}: AirwallexCheckoutProps) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const airwallexRef = useRef<any>(null);

  const totalAmount = (price * quantity).toFixed(2);

  // Load Airwallex SDK
  useEffect(() => {
    if (window.Airwallex) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://static.airwallex.com/components/sdk/v1/index.js';
    script.async = true;
    script.onload = () => {
      setSdkLoaded(true);
    };
    script.onerror = () => {
      setErrorMessage('Failed to load payment SDK');
      setStatus('error');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
    };
  }, []);

  const initPayment = async () => {
    try {
      setStatus('loading');
      setErrorMessage('');

      // Create payment intent on backend
      const response = await fetch('/api/payment/create-intent', {
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

      if (!response.ok || !data.configured) {
        setErrorMessage(data.message || data.error || 'Payment service unavailable');
        setStatus('error');
        return;
      }

      const { client_secret, intent_id } = data;

      // Initialize Airwallex Drop-in
      if (window.Airwallex && containerRef.current) {
        const airwallex = window.Airwallex.init({
          env: 'prod',
          clientSecret: client_secret,
          intentId: intent_id,
        });

        airwallexRef.current = airwallex;

        // Mount the payment element
        const paymentElement = airwallex.createElement('payment');
        paymentElement.mount(containerRef.current);

        // Listen for payment events
        paymentElement.on('ready', () => {
          setStatus('ready');
        });

        paymentElement.on('success', (event: any) => {
          setStatus('success');
          onSuccess?.();
        });

        paymentElement.on('error', (event: any) => {
          setErrorMessage(event?.message || 'Payment failed');
          setStatus('error');
        });

        paymentElement.on('cancel', () => {
          setStatus('idle');
        });
      } else {
        setErrorMessage('Payment SDK not available');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment initialization failed');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
        <p className="text-lg font-semibold text-slate-900">Payment Successful</p>
        <p className="text-sm text-slate-500 mt-1">Your order has been confirmed</p>
      </div>
    );
  }

  return (
    <div>
      {status === 'idle' && (
        <button
          onClick={initPayment}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all hover:scale-[1.02] shadow-md"
        >
          <CreditCard className="w-5 h-5" />
          Pay with Card / Airwallex
        </button>
      )}

      {status === 'loading' && (
        <div className="flex items-center justify-center gap-2 py-4 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading payment form...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={initPayment}
            className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Drop-in container */}
      {(status === 'ready' || status === 'processing') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600 pb-2 border-b border-slate-200">
            <span className="font-medium">Total Amount</span>
            <span className="font-bold text-slate-900">
              {currency} {totalAmount}
            </span>
          </div>
          <div
            ref={containerRef}
            className="min-h-[300px] border border-slate-200 rounded-lg overflow-hidden"
          />
          {status === 'processing' && (
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing payment...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
