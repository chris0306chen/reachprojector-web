"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  Save,
  Loader2,
  FileText,
  Globe,
  Building2,
  User,
  Hash,
  DollarSign,
  ClipboardList,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RFQDetail {
  rfq_number: string;
  product_name: string;
  product_slug: string;
  quantity: number;
  target_price?: string;
  country: string;
  whatsapp?: string;
  intended_use?: string;
  message?: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string; // JSON string of RFQDetail
  status: string;
  reply?: string;
  inquiry_type: string;
  created_at: string;
  updated_at?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type StatusKey = "pending" | "contacted" | "quoted" | "converted" | "rejected";

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "待处理", color: "text-amber-700", bg: "bg-amber-100" },
  contacted: { label: "已联系", color: "text-blue-700", bg: "bg-blue-100" },
  quoted: { label: "已报价", color: "text-purple-700", bg: "bg-purple-100" },
  converted: { label: "已成交", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "已拒绝", color: "text-red-700", bg: "bg-red-100" },
};

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待处理" },
  { key: "contacted", label: "已联系" },
  { key: "quoted", label: "已报价" },
  { key: "converted", label: "已成交" },
  { key: "rejected", label: "已拒绝" },
];

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function parseRFQDetail(raw: string): RFQDetail | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string) {
  const key = status as StatusKey;
  if (STATUS_CONFIG[key]) return STATUS_CONFIG[key];
  return { label: status, color: "text-slate-600", bg: "bg-slate-100" };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Edit state for expanded row
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [emailTestMsg, setEmailTestMsg] = useState<string | null>(null);

  /* ---- Fetch ---- */
  const fetchInquiries = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(pagination.limit),
        });
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/rfq?${params}`);
        if (!res.ok) throw new Error("获取询价列表失败");
        const json = await res.json();
        setInquiries(json.data || []);
        setPagination((current) => json.pagination || current);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "加载失败，请稍后重试";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, pagination.limit]
  );

  useEffect(() => {
    fetchInquiries(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  /* ---- Toggle expand ---- */
  const handleExpand = (inq: Inquiry) => {
    if (expandedId === inq.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(inq.id);
    setEditStatus(inq.status);
    setEditNotes(inq.reply || "");
    setSaveMsg(null);
  };

  /* ---- Save status / notes ---- */
  const handleSave = async (id: string) => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/rfq/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, notes: editNotes }),
      });
      if (!res.ok) throw new Error("保存失败");
      setSaveMsg("保存成功");
      fetchInquiries(pagination.page);
      setTimeout(() => setSaveMsg(null), 2000);
    } catch {
      setSaveMsg("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailTest = async () => {
    setEmailTestMsg("发送中...");
    try {
      const res = await fetch("/api/admin/email-test", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "发送失败");
      setEmailTestMsg(`测试邮件已发送（ID: ${data.messageId}）`);
    } catch (error) {
      setEmailTestMsg(error instanceof Error ? error.message : "发送失败");
    }
  };

  /* ---- Filter by search ---- */
  const filtered = search
    ? inquiries.filter((inq) => {
        const detail = parseRFQDetail(inq.message);
        const q = search.toLowerCase();
        return (
          inq.name?.toLowerCase().includes(q) ||
          inq.email?.toLowerCase().includes(q) ||
          inq.company?.toLowerCase().includes(q) ||
          inq.subject?.toLowerCase().includes(q) ||
          detail?.product_name?.toLowerCase().includes(q) ||
          detail?.rfq_number?.toLowerCase().includes(q)
        );
      })
    : inquiries;

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">询价管理</h1>
          <p className="text-slate-500 text-sm mt-1">
            共 {pagination.total} 条询价记录
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleEmailTest}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            发送测试邮件
          </button>
          {emailTestMsg && <p className="text-xs text-slate-500">{emailTestMsg}</p>}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Status tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索RFQ编号、公司、产品、联系人..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mb-3 text-slate-300" />
            <p>暂无询价记录</p>
          </div>
        ) : (
          <>
            {/* ============ DESKTOP TABLE ============ */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">
                      RFQ编号
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      公司
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      产品
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      数量
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      国家
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      状态
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      提交时间
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((inq) => {
                    const detail = parseRFQDetail(inq.message);
                    const expanded = expandedId === inq.id;
                    const s = getStatusStyle(inq.status);
                    return (
                      <tr
                        key={inq.id}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleExpand(inq)}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-slate-700">
                          {detail?.rfq_number || inq.subject}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {inq.company}
                        </td>
                        <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate">
                          {detail?.product_name || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {detail?.quantity || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            {detail?.country || inq.company}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.color}`}
                          >
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {formatDate(inq.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          {expanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ============ MOBILE CARDS ============ */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((inq) => {
                const detail = parseRFQDetail(inq.message);
                const expanded = expandedId === inq.id;
                const s = getStatusStyle(inq.status);
                return (
                  <div key={inq.id} className="p-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleExpand(inq)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-slate-600">
                          {detail?.rfq_number || inq.subject}
                        </span>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.color}`}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {inq.company}
                          </p>
                          <p className="text-xs text-slate-500">
                            {detail?.product_name} · {detail?.quantity}件 ·{" "}
                            {detail?.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          {formatDate(inq.created_at)}
                          {expanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile expanded detail */}
                    {expanded && (
                      <ExpandedDetail
                        inq={inq}
                        detail={detail}
                        editStatus={editStatus}
                        setEditStatus={setEditStatus}
                        editNotes={editNotes}
                        setEditNotes={setEditNotes}
                        saving={saving}
                        saveMsg={saveMsg}
                        onSave={() => handleSave(inq.id)}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ============ DESKTOP EXPANDED ROW ============ */}
            {expandedId && (
              <div className="hidden md:block border-t border-slate-200 bg-slate-50/50">
                {filtered
                  .filter((i) => i.id === expandedId)
                  .map((inq) => {
                    const detail = parseRFQDetail(inq.message);
                    return (
                      <ExpandedDetail
                        key={inq.id}
                        inq={inq}
                        detail={detail}
                        editStatus={editStatus}
                        setEditStatus={setEditStatus}
                        editNotes={editNotes}
                        setEditNotes={setEditNotes}
                        saving={saving}
                        saveMsg={saveMsg}
                        onSave={() => handleSave(inq.id)}
                      />
                    );
                  })}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              第 {pagination.page} / {pagination.totalPages} 页，共{" "}
              {pagination.total} 条
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchInquiries(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from(
                { length: Math.min(pagination.totalPages, 5) },
                (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (
                    pagination.page >=
                    pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchInquiries(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        pagination.page === pageNum
                          ? "bg-orange-500 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
              <button
                onClick={() => fetchInquiries(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expanded Detail Panel                                              */
/* ------------------------------------------------------------------ */

function ExpandedDetail({
  inq,
  detail,
  editStatus,
  setEditStatus,
  editNotes,
  setEditNotes,
  saving,
  saveMsg,
  onSave,
}: {
  inq: Inquiry;
  detail: RFQDetail | null;
  editStatus: string;
  setEditStatus: (v: string) => void;
  editNotes: string;
  setEditNotes: (v: string) => void;
  saving: boolean;
  saveMsg: string | null;
  onSave: () => void;
}) {
  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            联系信息
          </h3>
          <div className="space-y-2 text-sm">
            <InfoRow
              icon={<User className="w-3.5 h-3.5" />}
              label="联系人"
              value={inq.name}
            />
            <InfoRow
              icon={<Building2 className="w-3.5 h-3.5" />}
              label="公司"
              value={inq.company}
            />
            <InfoRow
              icon={<Globe className="w-3.5 h-3.5" />}
              label="国家"
              value={detail?.country}
            />
            <InfoRow
              icon={<Mail className="w-3.5 h-3.5" />}
              label="邮箱"
              value={inq.email}
            />
            <InfoRow
              icon={<Phone className="w-3.5 h-3.5" />}
              label="电话"
              value={inq.phone}
            />
            {detail?.whatsapp && (
              <InfoRow
                icon={<MessageCircle className="w-3.5 h-3.5" />}
                label="WhatsApp"
                value={detail.whatsapp}
              />
            )}
          </div>
        </div>

        {/* RFQ details */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            询价详情
          </h3>
          <div className="space-y-2 text-sm">
            <InfoRow
              icon={<Hash className="w-3.5 h-3.5" />}
              label="RFQ编号"
              value={detail?.rfq_number || inq.subject}
            />
            <InfoRow
              icon={<FileText className="w-3.5 h-3.5" />}
              label="产品"
              value={detail?.product_name}
            />
            <InfoRow
              icon={<ClipboardList className="w-3.5 h-3.5" />}
              label="数量"
              value={detail?.quantity ? `${detail.quantity}` : undefined}
            />
            <InfoRow
              icon={<DollarSign className="w-3.5 h-3.5" />}
              label="目标价"
              value={detail?.target_price}
            />
            <InfoRow
              icon={<FileText className="w-3.5 h-3.5" />}
              label="用途"
              value={detail?.intended_use}
            />
            {detail?.message && (
              <div className="pt-1">
                <p className="text-xs text-slate-400 mb-1">留言</p>
                <p className="text-slate-600 bg-white rounded-lg border border-slate-200 p-3 text-sm whitespace-pre-wrap">
                  {detail.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">操作</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 max-w-xs">
            <label className="block text-xs text-slate-500 mb-1">状态</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <label className="block text-xs text-slate-500 mb-1">备注</label>
            <input
              type="text"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="添加内部备注..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            保存
          </button>
          {saveMsg && (
            <span
              className={`text-sm ${
                saveMsg.includes("成功")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helper component                                             */
/* ------------------------------------------------------------------ */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-400 mt-0.5">{icon}</span>
      <span className="text-slate-400 w-16 flex-shrink-0">{label}</span>
      <span className="text-slate-700">{value || "-"}</span>
    </div>
  );
}
