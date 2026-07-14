"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Truck, Eye } from "lucide-react";

interface Order {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  amount: string;
  currency: string;
  payer_email: string;
  payer_name: string;
  status: string;
  tracking_number: string | null;
  shipping_method: string | null;
  created_at: string;
}

const statusOptions = ["pending", "paid", "shipped", "delivered", "refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [shippingModal, setShippingModal] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) { console.error("Failed to fetch orders:", err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders(orders.map((o) => o.id === id ? { ...o, status } : o));
    } catch (err) { console.error("Failed to update status:", err); }
  };

  const shipOrder = async (id: string) => {
    try {
      await fetch(`/api/admin/orders/${id}/ship`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_number: trackingNumber, shipping_method: shippingMethod }),
      });
      setOrders(orders.map((o) => o.id === id ? { ...o, status: "shipped", tracking_number: trackingNumber } : o));
      setShippingModal(null);
      setTrackingNumber("");
      setShippingMethod("");
    } catch (err) { console.error("Failed to ship order:", err); }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-emerald-100 text-emerald-700",
    refunded: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{order.order_id.slice(0, 12)}...</td>
                    <td className="px-4 py-3 text-sm text-slate-900 max-w-[200px] truncate">{order.product_name}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-900">{order.payer_name || "N/A"}</p>
                      <p className="text-xs text-slate-500">{order.payer_email || ""}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">${parseFloat(order.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setShippingModal(order.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                        title="Ship"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50">Previous</button>
            <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50">Next</button>
          </div>
        )}
      </div>

      {/* Shipping Modal */}
      {shippingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ship Order</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Method</label>
                <input type="text" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} placeholder="e.g., DHL, FedEx" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShippingModal(null)} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={() => shipOrder(shippingModal)} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Confirm Ship</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
