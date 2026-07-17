"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Package, Eye, Truck, ChevronDown } from "lucide-react";

interface Order {
  id: string;
  order_id: string;
  product_name: string;
  product_image: string;
  amount: string;
  currency: string;
  payer_email: string;
  status: string;
  shipping_method: string;
  tracking_number: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: "待付款",
  paid: "已付款",
  shipped: "已发货",
  delivered: "已送达",
  refunded: "已退款",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  refunded: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const updateTracking = async (id: string, tracking_number: string) => {
    try {
      await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, tracking_number }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update tracking:", err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_id.toLowerCase().includes(search.toLowerCase()) ||
      order.payer_email.toLowerCase().includes(search.toLowerCase()) ||
      order.product_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">订单管理</h1>
          <p className="text-slate-500 text-sm mt-1">管理和跟踪所有订单</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索订单号、邮箱或产品..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none bg-white"
            >
              <option value="all">全部状态</option>
              <option value="pending">待付款</option>
              <option value="paid">已付款</option>
              <option value="shipped">已发货</option>
              <option value="delivered">已送达</option>
              <option value="refunded">已退款</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Package className="w-12 h-12 mb-3 text-slate-300" />
            <p>没有找到订单</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">订单号</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">产品</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">买家</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">金额</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">物流单号</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">日期</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{order.order_id.slice(0, 12)}...</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {order.product_image && (
                            <img src={order.product_image} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-sm text-slate-900 line-clamp-1">{order.product_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{order.payer_email}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      {order.currency} {order.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={order.tracking_number || ""}
                        placeholder="输入物流单号"
                        onBlur={(e) => {
                          if (e.target.value !== (order.tracking_number || "")) {
                            updateTracking(order.id, e.target.value);
                          }
                        }}
                        className="text-xs border border-slate-200 rounded px-2 py-1 w-32 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      >
                        <option value="pending">待付款</option>
                        <option value="paid">已付款</option>
                        <option value="shipped">已发货</option>
                        <option value="delivered">已送达</option>
                        <option value="refunded">已退款</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-slate-500">
        共 {filteredOrders.length} 条订单
      </div>
    </div>
  );
}
