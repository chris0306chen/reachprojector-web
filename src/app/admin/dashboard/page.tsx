"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Truck,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalInquiries: number;
    totalSales?: number;
    pendingPaymentOrders?: number;
    pendingShipOrders?: number;
    newInquiriesCount?: number;
  };
  byCountry?: Array<{ country: string; total_sales: number; order_count: number }>;
  byProduct?: Array<{ product_name: string; total_quantity: number; total_sales: number }>;
  recentOrders: Array<{
    id: string;
    order_id: string;
    customer_name?: string;
    payer_email: string;
    product_name: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
  }>;
  recentInquiries: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "加载数据失败");
        return;
      }
      setData(json);
    } catch (err) {
      setError("网络错误，请检查连接");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          重试
        </button>
      </div>
    );
  }

  const stats = data?.stats;
  const totalSales = stats?.totalSales ?? stats?.totalRevenue ?? 0;
  const pendingPayment = stats?.pendingPaymentOrders ?? 0;
  const pendingShip = stats?.pendingShipOrders ?? 0;
  const newInquiries = stats?.newInquiriesCount ?? stats?.totalInquiries ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">仪表盘</h1>
        <p className="text-slate-500 mt-1">业务数据概览</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总销售额"
          value={`$${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="待付款订单"
          value={pendingPayment.toString()}
          icon={Clock}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          title="待发货订单"
          value={pendingShip.toString()}
          icon={Truck}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="新询盘"
          value={newInquiries.toString()}
          icon={MessageSquare}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">总订单数</p>
            <p className="text-xl font-bold text-slate-900">{stats?.totalOrders ?? 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">产品总数</p>
            <p className="text-xl font-bold text-slate-900">{stats?.totalProducts ?? 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">询盘总数</p>
            <p className="text-xl font-bold text-slate-900">{stats?.totalInquiries ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Country */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            按国家销售统计
          </h2>
          {data?.byCountry && data.byCountry.length > 0 ? (
            <div className="space-y-3">
              {data.byCountry.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.country || "未知"}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.total_sales / Math.max(...data.byCountry.map(c => c.total_sales), 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-20 text-right">
                      ${item.total_sales.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">暂无数据</p>
          )}
        </div>

        {/* By Product */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-400" />
            产品销量排行
          </h2>
          {data?.byProduct && data.byProduct.length > 0 ? (
            <div className="space-y-3">
              {data.byProduct.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 truncate max-w-[180px]">
                    {item.product_name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{item.total_quantity} 件</span>
                    <span className="text-sm font-medium text-slate-900 w-20 text-right">
                      ${item.total_sales.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">暂无数据</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">最近订单</h2>
          <Link href="/admin/orders" className="text-sm text-orange-600 hover:underline">
            查看全部
          </Link>
        </div>
        {data?.recentOrders && data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    订单号
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
                    时间
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.recentOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-900">
                      {order.order_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {order.customer_name || order.payer_email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">
                      {order.product_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">
                      {order.currency} {parseFloat(String(order.amount)).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString("zh-CN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无订单</p>
          </div>
        )}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">最近询盘</h2>
          <Link href="/admin/inquiries" className="text-sm text-orange-600 hover:underline">
            查看全部
          </Link>
        </div>
        {data?.recentInquiries && data.recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    姓名
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    邮箱
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    主题
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    状态
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    时间
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.recentInquiries.slice(0, 5).map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{inquiry.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{inquiry.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">
                      {inquiry.subject}
                    </td>
                    <td className="px-4 py-3">
                      <InquiryStatusBadge status={inquiry.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(inquiry.created_at).toLocaleDateString("zh-CN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无询盘</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{title}</span>
        <div className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending_payment: { label: "待付款", className: "bg-amber-50 text-amber-700" },
    preparing: { label: "备货中", className: "bg-blue-50 text-blue-700" },
    shipped: { label: "已发货", className: "bg-indigo-50 text-indigo-700" },
    completed: { label: "已完成", className: "bg-green-50 text-green-700" },
    after_sales: { label: "售后中", className: "bg-red-50 text-red-700" },
    // Legacy
    pending: { label: "待付款", className: "bg-amber-50 text-amber-700" },
    paid: { label: "已付款", className: "bg-blue-50 text-blue-700" },
    delivered: { label: "已完成", className: "bg-green-50 text-green-700" },
    cancelled: { label: "已取消", className: "bg-slate-100 text-slate-600" },
  };
  const { label, className } = config[status] || { label: status, className: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function InquiryStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    new: { label: "新询盘", className: "bg-blue-50 text-blue-700" },
    following_up: { label: "跟进中", className: "bg-amber-50 text-amber-700" },
    quoted: { label: "已报价", className: "bg-indigo-50 text-indigo-700" },
    negotiating: { label: "谈判中", className: "bg-purple-50 text-purple-700" },
    won: { label: "已成交", className: "bg-green-50 text-green-700" },
    lost: { label: "已流失", className: "bg-red-50 text-red-700" },
    // Legacy
    pending: { label: "待处理", className: "bg-amber-50 text-amber-700" },
    replied: { label: "已回复", className: "bg-green-50 text-green-700" },
    closed: { label: "已关闭", className: "bg-slate-100 text-slate-600" },
  };
  const { label, className } = config[status] || { label: status, className: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
