"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MessageSquare, Mail, Phone, Calendar, ChevronDown, Check } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (Array.isArray(data)) {
        setInquiries(data);
      } else {
        setError(data.error || "加载询盘失败");
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      setError("加载询盘失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/inquiries`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch = inquiry.name.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">询盘管理</h1>
          <p className="text-slate-500 text-sm mt-1">查看和回复客户询盘</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索姓名、邮箱、主题或内容..."
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
              <option value="pending">待处理</option>
              <option value="replied">已回复</option>
              <option value="closed">已关闭</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiry List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
              <p>没有找到询盘</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedInquiry?.id === inquiry.id ? "bg-orange-50 border-l-2 border-l-orange-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{inquiry.name}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      inquiry.status === "pending" ? "bg-orange-100 text-orange-700" :
                      inquiry.status === "replied" ? "bg-green-100 text-green-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {inquiry.status === "pending" ? "待处理" : inquiry.status === "replied" ? "已回复" : "已关闭"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{inquiry.email}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{inquiry.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(inquiry.created_at).toLocaleDateString("zh-CN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiry Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          {selectedInquiry ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">询盘详情</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="pending">待处理</option>
                    <option value="replied">已回复</option>
                    <option value="closed">已关闭</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">姓名</p>
                    <p className="text-sm font-medium text-slate-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">邮箱</p>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.phone && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">电话</p>
                      <a href={`tel:${selectedInquiry.phone}`} className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                  {selectedInquiry.company && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">公司</p>
                      <p className="text-sm text-slate-900">{selectedInquiry.company}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">日期</p>
                    <p className="text-sm text-slate-900 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedInquiry.created_at).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">主题</p>
                  <p className="text-sm font-medium text-slate-900">{selectedInquiry.subject}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-500 mb-2">消息内容</p>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  邮件回复
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    拨打电话
                  </a>
                )}
                <button
                  onClick={() => updateStatus(selectedInquiry.id, "replied")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  标记为已回复
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
              <p>选择一条询盘查看详情</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        共 {filteredInquiries.length} 条询盘
      </div>
    </div>
  );
}
