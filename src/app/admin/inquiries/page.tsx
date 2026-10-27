"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { InquiryPipelineEditor } from "@/components/admin/inquiry-pipeline-editor";
import { channelLabels, type InquiryOwner, type PipelineFields } from "@/lib/inquiry-pipeline";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
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

interface Inquiry extends PipelineFields {
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

type StatusKey = "pending" | "contacted" | "quoted" | "negotiating" | "converted" | "rejected";

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "待处理", color: "text-amber-700", bg: "bg-amber-100" },
  contacted: { label: "已联系", color: "text-blue-700", bg: "bg-blue-100" },
  quoted: { label: "已报价", color: "text-purple-700", bg: "bg-purple-100" },
  negotiating: { label: "谈判中", color: "text-orange-700", bg: "bg-orange-100" },
  converted: { label: "已成交", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "已失单", color: "text-red-700", bg: "bg-red-100" },
};

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待处理" },
  { key: "contacted", label: "已联系" },
  { key: "quoted", label: "已报价" },
  { key: "negotiating", label: "谈判中" },
  { key: "converted", label: "已成交" },
  { key: "rejected", label: "已失单" },
];

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function parseRFQDetail(raw: string): RFQDetail | null {
  try {
    const detail = JSON.parse(raw);
    return detail && typeof detail === "object" && typeof detail.rfq_number === "string" ? detail : null;
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string) {
  const key = (status === "new" ? "pending" : status) as StatusKey;
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
  const [searchQuery, setSearchQuery] = useState("");
  const requestId = useRef(0);
  const [viewer, setViewer] = useState<{ id: string; name: string; is_manager: boolean } | null>(null);
  const [owners, setOwners] = useState<InquiryOwner[]>([]);
  const [ownerError, setOwnerError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [emailTestMsg, setEmailTestMsg] = useState<string | null>(null);
  /* ---- Fetch ---- */
  const fetchInquiries = useCallback(
    async (page = 1) => {
      const currentRequest = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(pagination.limit),
        });
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (searchQuery) params.set("search", searchQuery);

        const res = await fetch(`/api/admin/inquiries?${params}`);
        if (!res.ok) throw new Error("获取询价列表失败");
        const json = await res.json();
        if (currentRequest !== requestId.current) return;
        setInquiries(json.data || []);
        setViewer(json.viewer);
        setPagination((current) => json.pagination || current);
      } catch (err: unknown) {
        if (currentRequest !== requestId.current) return;
        const msg = err instanceof Error ? err.message : "加载失败，请稍后重试";
        setError(msg);
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    },
    [statusFilter, searchQuery, pagination.limit]
  );

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setExpandedId(null);
    fetchInquiries(1);
    return () => { requestId.current += 1; };
  }, [fetchInquiries]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/inquiries/owners").then(async (res) => {
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "读取负责人失败");
      if (!cancelled) setOwners(result.data || []);
    }).catch((err) => { if (!cancelled) setOwnerError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const handleSaved = (data: PipelineFields) => {
    setInquiries((rows) => rows.map((row) => row.id === data.id ? { ...row, ...data } : row));
    setSaveMessage("跟进已保存");
    if (statusFilter !== "all" && data.status !== statusFilter) fetchInquiries(1);
  };

  /* ---- Toggle expand ---- */
  const handleExpand = (inq: Inquiry) => {
    if (expandedId === inq.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(inq.id);
    setSaveMessage("");
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

  const filtered = inquiries;

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
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <p>{viewer?.is_manager ? "主管可查看全部询盘并分配负责人" : "仅显示分配给我的询盘"} · 时间为北京时间</p>
        <button type="button" onClick={() => { setExpandedId(null); fetchInquiries(pagination.page); }} className="underline underline-offset-4">刷新列表（放弃未保存修改）</button>
      </div>
      {ownerError && <p role="alert" className="text-sm text-red-700">{ownerError}，请刷新页面重试。</p>}
      {saveMessage && <p role="status" className="text-sm text-green-800">{saveMessage}</p>}
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
              aria-label="搜索可见询盘"
              maxLength={200}
              placeholder="搜索编号、公司、产品、联系人..."
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
                      编号 / 主题
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
                    <th className="px-4 py-3 font-medium text-slate-600">负责人 / 下次跟进</th>
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
                          <button type="button" aria-expanded={expanded} onClick={(event) => { event.stopPropagation(); handleExpand(inq); }} className="text-left underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-orange-600">{detail?.rfq_number || inq.subject || "未填写主题"}</button>
                          <p className="mt-1 font-sans text-slate-600">{channelLabels[inq.channel] || inq.channel || "网站"} · {inq.inquiry_type}</p>
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
                            {detail?.country || "-"}
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
                        <td className="px-4 py-3 text-sm text-slate-700"><p>{!inq.assigned_to ? "未分配" : owners.find((owner) => owner.id === inq.assigned_to)?.name || "待核对负责人"}</p><p className="mt-1 text-xs">{inq.next_follow_up_at ? formatDate(inq.next_follow_up_at) : "未安排跟进"}</p></td>
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
                      role="button"
                      tabIndex={0}
                      aria-expanded={expanded}
                      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handleExpand(inq); } }}
                      className="cursor-pointer"
                      onClick={() => handleExpand(inq)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-slate-600">
                          {detail?.rfq_number || inq.subject || "未填写主题"}
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
                            {detail ? `${detail.product_name} · ${detail.quantity}件 · ${detail.country}` : inq.name}
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
                    <p className="mt-2 text-sm text-slate-600">{channelLabels[inq.channel] || inq.channel || "网站"} · {inq.inquiry_type} · {!inq.assigned_to ? "未分配" : owners.find((owner) => owner.id === inq.assigned_to)?.name || "待核对负责人"}</p>
                    <p className="mt-1 text-sm text-slate-600">下次跟进：{inq.next_follow_up_at ? formatDate(inq.next_follow_up_at) : "未安排"}</p>
                    {expanded && (
                      <ExpandedDetail
                        inq={inq}
                        detail={detail}
                        isManager={!!viewer?.is_manager}
                        owners={owners}
                        onSaved={handleSaved}
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
                        isManager={!!viewer?.is_manager}
                        owners={owners}
                        onSaved={handleSaved}
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

function ExpandedDetail({ inq, detail, isManager, owners, onSaved }: {
  inq: Inquiry;
  detail: RFQDetail | null;
  isManager: boolean;
  owners: InquiryOwner[];
  onSaved: (data: PipelineFields) => void;
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
              label={detail ? "RFQ编号" : "主题"}
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
            {(detail?.message || (!detail && inq.message)) && (
              <div className="pt-1">
                <p className="text-xs text-slate-400 mb-1">留言</p>
                <p className="text-slate-600 bg-white rounded-lg border border-slate-200 p-3 text-sm whitespace-pre-wrap">
                  {detail ? detail.message : inq.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <InquiryPipelineEditor key={`${inq.id}:${inq.workflow_version}`} inquiry={inq} isManager={isManager} owners={owners} onSaved={onSaved} />
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
