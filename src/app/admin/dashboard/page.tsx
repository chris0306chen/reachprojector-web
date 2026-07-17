"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingCart, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    pendingInquiries: number;
    revenueChange: number;
    ordersChange: number;
  };
  recentOrders: Array<{
    id: string;
    order_id: string;
    product_name: string;
    amount: string;
    currency: string;
    status: string;
    created_at: string;
  }>;
  recentInquiries: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    {
      label: "总收入",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "订单数",
      value: stats?.totalOrders || 0,
      change: stats?.ordersChange || 0,
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "产品数",
      value: stats?.totalProducts || 0,
      change: null,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "待处理询盘",
      value: stats?.pendingInquiries || 0,
      change: null,
      icon: MessageSquare,
      color: "bg-orange-50 text-orange-600",
    },
  ];

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">仪表盘</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.change !== null && (
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">最近订单</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {data?.recentOrders?.length ? (
              data.recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{order.product_name}</p>
                    <p className="text-xs text-slate-500">{order.order_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.currency} {order.amount}
                    </p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-slate-100 text-slate-600"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">暂无订单</div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">最近询盘</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {data?.recentInquiries?.length ? (
              data.recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{inquiry.name}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      inquiry.status === "pending" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {inquiry.status === "pending" ? "待处理" : "已处理"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{inquiry.email}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{inquiry.message}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">暂无询盘</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
