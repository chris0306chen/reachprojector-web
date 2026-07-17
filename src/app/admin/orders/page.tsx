"use client";

import { useEffect, useState } from "react";
import { Search, Download, Plus, Filter, AlertCircle, X } from "lucide-react";

interface Order {
  id: string;
  order_id: string;
  order_type?: string;
  customer_name?: string;
  customer_email?: string;
  customer_company?: string;
  product_name: string;
  quantity: number;
  amount: number;
  currency: string;
  payer_email: string;
  status: string;
  payment_status?: string;
  shipping_method?: string;
  tracking_number?: string;
  country?: string;
  pi_number?: string;
  deposit_amount?: number;
  final_payment_amount?: number;
  notes?: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "加载订单失败");
        return;
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("网络错误，请检查连接");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleUpdateTracking = async (id: string, trackingNumber: string) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_number: trackingNumber }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update tracking:", err);
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    window.open(`/api/admin/orders/export?${params.toString()}`, "_blank");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id?.toLowerCase().includes(search.toLowerCase()) ||
      order.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.payer_email?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_company?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "b2c" && (order.order_type || "b2c_online") === "b2c_online") ||
      (typeFilter === "b2b" && order.order_type === "b2b_offline");
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenue = filteredOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (parseFloat(String(o.amount)) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">订单管理</h1>
          <p className="text-slate-500 mt-1">管理 B2C 线上订单和 B2B 线下订单</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            导出 Excel
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            手工建单
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">总订单</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{filteredOrders.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">总营收</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">待付款</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {filteredOrders.filter((o) => o.status === "pending_payment").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">待发货</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {filteredOrders.filter((o) => o.status === "preparing").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索订单号、产品、客户..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="all">全部类型</option>
            <option value="b2c">B2C 线上</option>
            <option value="b2b">B2B 线下</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="all">全部状态</option>
            <option value="pending_payment">待付款</option>
            <option value="preparing">备货中</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="after_sales">售后中</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              {search || statusFilter !== "all" || typeFilter !== "all" ? "没有找到匹配的订单" : "暂无订单"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    订单号
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    类型
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    客户
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    产品
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    金额
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    状态
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    物流单号
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    时间
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-900">
                      {order.order_id}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.order_type === "b2b_offline"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {order.order_type === "b2b_offline" ? "B2B" : "B2C"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-900">
                        {order.customer_name || order.payer_email}
                      </div>
                      {order.customer_company && (
                        <div className="text-xs text-slate-500">{order.customer_company}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">
                      {order.product_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">
                      {order.currency} {parseFloat(String(order.amount)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${getStatusClass(order.status)}`}
                      >
                        <option value="pending_payment">待付款</option>
                        <option value="preparing">备货中</option>
                        <option value="shipped">已发货</option>
                        <option value="completed">已完成</option>
                        <option value="after_sales">售后中</option>
                        <option value="cancelled">已取消</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={order.tracking_number || ""}
                        onBlur={(e) => {
                          if (e.target.value !== (order.tracking_number || "")) {
                            handleUpdateTracking(order.id, e.target.value);
                          }
                        }}
                        placeholder="输入物流单号"
                        className="text-xs border border-slate-200 rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditingOrder(order)}
                        className="text-xs text-orange-600 hover:underline"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create B2B Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchOrders();
          }}
        />
      )}

      {/* Order Detail Modal */}
      {editingOrder && (
        <OrderDetailModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
}

function CreateOrderModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_company: "",
    product_name: "",
    quantity: 1,
    amount: 0,
    currency: "USD",
    country: "",
    shipping_address: "",
    pi_number: "",
    deposit_amount: 0,
    notes: "",
    product_specs: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.customer_name || !form.product_name || !form.amount) {
      setError("请填写客户姓名、产品名称和金额");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          order_type: "b2b_offline",
          status: "pending_payment",
          payment_status: "unpaid",
        }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "创建失败");
      }
    } catch (err) {
      setError("网络错误");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">创建 B2B 订单</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">客户姓名 *</label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">客户邮箱</label>
              <input
                type="email"
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">客户公司</label>
              <input
                type="text"
                value={form.customer_company}
                onChange={(e) => setForm({ ...form, customer_company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">国家</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品名称 *</label>
            <input
              type="text"
              value={form.product_name}
              onChange={(e) => setForm({ ...form, product_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">数量</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">金额 *</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">币种</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PI 号</label>
              <input
                type="text"
                value={form.pi_number}
                onChange={(e) => setForm({ ...form, pi_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">定金</label>
              <input
                type="number"
                step="0.01"
                value={form.deposit_amount}
                onChange={(e) => setForm({ ...form, deposit_amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">收货地址</label>
            <textarea
              value={form.shipping_address}
              onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品规格</label>
            <textarea
              value={form.product_specs}
              onChange={(e) => setForm({ ...form, product_specs: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting ? "创建中..." : "创建订单"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">订单详情</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">订单号</p>
              <p className="text-sm font-mono text-slate-900">{order.order_id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">类型</p>
              <p className="text-sm text-slate-900">
                {order.order_type === "b2b_offline" ? "B2B 线下" : "B2C 线上"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">客户</p>
              <p className="text-sm text-slate-900">{order.customer_name || order.payer_email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">公司</p>
              <p className="text-sm text-slate-900">{order.customer_company || "-"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">产品</p>
            <p className="text-sm text-slate-900">{order.product_name}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-500">金额</p>
              <p className="text-sm font-medium text-slate-900">
                {order.currency} {parseFloat(String(order.amount)).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">PI 号</p>
              <p className="text-sm text-slate-900">{order.pi_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">定金</p>
              <p className="text-sm text-slate-900">
                {order.deposit_amount ? `$${order.deposit_amount}` : "-"}
              </p>
            </div>
          </div>
          {order.notes && (
            <div>
              <p className="text-sm text-slate-500">备注</p>
              <p className="text-sm text-slate-900">{order.notes}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500">创建时间</p>
            <p className="text-sm text-slate-900">
              {new Date(order.created_at).toLocaleString("zh-CN")}
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    pending_payment: "bg-amber-50 text-amber-700",
    preparing: "bg-blue-50 text-blue-700",
    shipped: "bg-indigo-50 text-indigo-700",
    completed: "bg-green-50 text-green-700",
    after_sales: "bg-red-50 text-red-700",
    cancelled: "bg-slate-100 text-slate-600",
  };
  return classes[status] || "bg-slate-100 text-slate-600";
}
