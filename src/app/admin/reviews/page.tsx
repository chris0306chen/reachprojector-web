"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Review = {
  id: string;
  review_type: "product" | "company";
  moderation_status: "pending" | "approved" | "rejected" | "hidden";
  verification_status: "unverified" | "verified" | "rejected";
  product_rating: number | null;
  service_rating: number | null;
  title: string;
  body: string;
  display_name: string | null;
  country: string | null;
  company_name: string | null;
  source_channel: string;
  submitted_at: string;
};

const statusLabels = { pending: "待审核", approved: "已发布", rejected: "已拒绝", hidden: "已隐藏" };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState({ product_id: "", external_reference: "", customer_email: "", source_channel: "manual", sale_channel: "manual" });
  const [inviteLink, setInviteLink] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews?status=${status}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "加载评价失败");
      setReviews(result.data || []);
    } catch (error) { setMessage(error instanceof Error ? error.message : "加载评价失败"); }
    finally { setLoading(false); }
  }, [status]);

  useEffect(() => { void loadReviews(); }, [loadReviews]);

  async function updateReview(id: string, moderation_status: Review["moderation_status"]) {
    const response = await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, moderation_status }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || "更新失败"); return; }
    setMessage(`评价已${statusLabels[moderation_status]}`);
    await loadReviews();
  }

  async function createInvitation(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/reviews/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...invite, product_id: invite.product_id || null, external_reference: invite.external_reference || null, customer_email: invite.customer_email || null }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || "创建邀请失败"); return; }
    const link = `${window.location.origin}/en/reviews/submit?token=${encodeURIComponent(result.invitation.token)}`;
    setInviteLink(link);
    setMessage("邀请已创建。原始令牌只在此处显示一次，请复制保存。");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header><h1 className="text-3xl font-semibold text-slate-900">评价管理</h1><p className="mt-2 text-sm text-slate-600">审核真实客户提交的产品评价和企业评价，不自动生成评分。</p></header>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">创建评价邀请</h2>
          <form onSubmit={createInvitation} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input className="rounded border p-2" placeholder="产品 ID（产品评价）" value={invite.product_id} onChange={(e) => setInvite({ ...invite, product_id: e.target.value })} />
            <input className="rounded border p-2" placeholder="订单号或外部交易参考" required value={invite.external_reference} onChange={(e) => setInvite({ ...invite, external_reference: e.target.value })} />
            <input className="rounded border p-2" type="email" placeholder="客户邮箱（可选）" value={invite.customer_email} onChange={(e) => setInvite({ ...invite, customer_email: e.target.value })} />
            <select className="rounded border p-2" value={invite.source_channel} onChange={(e) => setInvite({ ...invite, source_channel: e.target.value })}><option value="manual">manual</option><option value="website">website</option><option value="Alibaba">Alibaba</option><option value="WhatsApp">WhatsApp</option></select>
            <button className="rounded bg-slate-900 px-4 py-2 font-semibold text-white" type="submit">生成一次性邀请</button>
          </form>
          {inviteLink && <div className="mt-4 break-all rounded bg-emerald-50 p-3 text-sm text-emerald-900"><strong>邀请链接：</strong> {inviteLink}</div>}
        </section>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">评价列表</h2><select className="rounded border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
          {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
          {loading ? <p className="mt-6 text-sm text-slate-500">加载中…</p> : reviews.length === 0 ? <p className="mt-6 text-sm text-slate-500">暂无评价。</p> : <div className="mt-6 space-y-4">{reviews.map((review) => <article key={review.id} className="rounded-lg border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="font-semibold">{review.title || "无标题"}</span><span className="ml-2 text-xs text-slate-500">{review.review_type} · {review.source_channel}</span></div><span className="text-xs text-slate-500">{new Date(review.submitted_at).toLocaleString()}</span></div><p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{review.body}</p><p className="mt-2 text-xs text-slate-500">{review.display_name || "匿名"}{review.country ? ` · ${review.country}` : ""} · 产品 {review.product_rating ?? "—"}/5 · 服务 {review.service_rating ?? "—"}/5</p><div className="mt-3 flex gap-2">{review.moderation_status !== "approved" && <button className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white" onClick={() => void updateReview(review.id, "approved")}>发布</button>}{review.moderation_status !== "rejected" && <button className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white" onClick={() => void updateReview(review.id, "rejected")}>拒绝</button>}{review.moderation_status !== "hidden" && <button className="rounded bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" onClick={() => void updateReview(review.id, "hidden")}>隐藏</button>}</div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
