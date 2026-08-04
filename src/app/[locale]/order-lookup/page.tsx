'use client';

import { FormEvent, useState } from 'react';
import { PackageSearch } from 'lucide-react';

type Order = {
  order_id: string;
  product_name: string;
  quantity: number;
  amount: string;
  currency: string;
  shipping_method: string | null;
  tracking_number: string | null;
  status: string;
};

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    const response = await fetch('/api/orders/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, email }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setError(result.error || 'Unable to retrieve order');
    setOrder(result.order);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 text-center">
        <PackageSearch className="mx-auto mb-4 h-10 w-10 text-orange-500" />
        <h1 className="text-3xl font-bold text-slate-900">Track your order</h1>
        <p className="mt-2 text-slate-600">Enter the order number and checkout email from your confirmation.</p>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium text-slate-700">Order number
          <input required value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="ORD-..." className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-slate-700">Checkout email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <button disabled={loading} className="w-full rounded-lg bg-orange-500 px-4 py-3 font-medium text-white disabled:opacity-50">
          {loading ? 'Checking...' : 'View order'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      {order && (
        <section className="mt-6 rounded-xl bg-slate-50 p-6 text-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Order {order.order_id}</h2>
          <dl className="grid grid-cols-2 gap-3">
            <dt className="text-slate-500">Product</dt><dd>{order.product_name} × {order.quantity}</dd>
            <dt className="text-slate-500">Paid</dt><dd>{order.currency} {order.amount}</dd>
            <dt className="text-slate-500">Status</dt><dd className="capitalize">{order.status}</dd>
            <dt className="text-slate-500">Shipping</dt><dd>{order.shipping_method || 'Processing'}</dd>
            <dt className="text-slate-500">Tracking</dt><dd>{order.tracking_number || 'Not shipped yet'}</dd>
          </dl>
        </section>
      )}
    </main>
  );
}
