"use client";

import { useState } from "react";
import { inquiryStatuses, inquiryChannels, statusLabels, channelLabels, toShanghaiInput, fromShanghaiInput, type PipelineFields, type InquiryOwner } from "@/lib/inquiry-pipeline";

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500";

export function InquiryPipelineEditor({ inquiry, isManager, owners, onSaved }: {
  inquiry: PipelineFields;
  isManager: boolean;
  owners: InquiryOwner[];
  onSaved: (data: PipelineFields) => void;
}) {
  const [status, setStatus] = useState(inquiry.status === "new" ? "pending" : inquiry.status);
  const [owner, setOwner] = useState(inquiry.assigned_to || "");
  const [date, setDate] = useState(toShanghaiInput(inquiry.next_follow_up_at));
  const [notes, setNotes] = useState(inquiry.reply || "");
  const [channel, setChannel] = useState(inquiry.channel || "website");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const missingMigration = inquiry.workflow_version === undefined;

  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const body = {
        id: inquiry.id, expected_version: inquiry.workflow_version,
        reply: notes, next_follow_up_at: fromShanghaiInput(date),
        ...(status !== inquiry.status ? { status } : {}),
        ...(channel !== (inquiry.channel || "website") ? { channel } : {}),
        ...(isManager && owner !== (inquiry.assigned_to || "") ? { assigned_to: owner || null } : {}),
      };
      const res = await fetch("/api/admin/inquiries", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "保存失败，请重试");
      onSaved(result.data);
    } catch (err) { setError(err instanceof Error ? err.message : "保存失败，请重试"); }
    finally { setSaving(false); }
  }

  return <form onSubmit={save} className="border-t border-slate-200 pt-5">
    <h3 className="mb-3 font-semibold text-slate-900">销售跟进</h3>
    {missingMigration && <p role="alert" className="mb-3 text-sm text-red-700">请先执行询盘管线数据库迁移，再刷新列表。</p>}
    <fieldset disabled={saving || missingMigration} className="grid gap-4 sm:grid-cols-2">
      <label className="space-y-1 text-sm text-slate-700"><span>状态</span><select aria-label="状态" value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
        {!inquiryStatuses.includes(status as typeof inquiryStatuses[number]) && <option value={status}>{status}</option>}
        {inquiryStatuses.map((key) => <option key={key} value={key}>{statusLabels[key]}</option>)}
      </select></label>
      {isManager ? <label className="space-y-1 text-sm text-slate-700"><span>负责人</span><select aria-label="负责人" value={owner} onChange={(event) => setOwner(event.target.value)} className={inputClass}>
        <option value="">未分配</option>
        {owner && !owners.some((item) => item.id === owner) && <option value={owner} disabled>原负责人：{owner}（待核对）</option>}
        {owners.map((item) => <option key={item.id} value={item.id}>{item.name || item.id}</option>)}
      </select></label> : <p className="text-sm text-slate-700">负责人：{owners.find((item) => item.id === inquiry.assigned_to)?.name || "我"}（由主管分配）</p>}
      <label className="space-y-1 text-sm text-slate-700"><span>下次跟进（北京时间 UTC+8）</span><input aria-label="下次跟进" type="datetime-local" className={inputClass} value={date} onChange={(event) => setDate(event.target.value)} /></label>
      <label className="space-y-1 text-sm text-slate-700"><span>来源</span><select aria-label="来源" value={channel} onChange={(event) => setChannel(event.target.value)} className={inputClass}>
        {!inquiryChannels.includes(channel as typeof inquiryChannels[number]) && <option value={channel}>{channel}</option>}
        {inquiryChannels.map((key) => <option key={key} value={key}>{channelLabels[key]}</option>)}
      </select></label>
      <label className="space-y-1 text-sm text-slate-700 sm:col-span-2"><span>内部备注</span><textarea aria-label="内部备注" rows={3} maxLength={10000} className={inputClass} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="记录沟通情况及下一步行动，仅供内部查看" /></label>
      <div><button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-base font-medium text-white hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50">{saving ? "保存中…" : "保存跟进"}</button></div>
    </fieldset>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}。未保存的输入已保留。</p>}
  </form>;
}
