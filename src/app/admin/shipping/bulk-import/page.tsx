"use client";

import { useState } from "react";
import Link from "next/link";

type ImportPayload = {
  batch_id: string;
  replace_countries: string[];
  templates: unknown[];
};

export default function ShippingBulkImportPage() {
  const [payload, setPayload] = useState<ImportPayload | null>(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function selectFile(file?: File) {
    setPayload(null);
    setStatus("");
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as ImportPayload;
      if (!parsed.batch_id || !Array.isArray(parsed.replace_countries) || !Array.isArray(parsed.templates)) {
        throw new Error("Invalid payload");
      }
      setFileName(file.name);
      setPayload(parsed);
    } catch {
      setStatus("文件格式错误，请使用审核后生成的运费上线 JSON。 ");
    }
  }

  async function publish() {
    if (!payload || submitting) return;
    setSubmitting(true);
    setStatus("正在安全替换运费规则…");
    try {
      const response = await fetch("/api/admin/shipping/bulk-replace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Import failed");
      setStatus(`上线成功：${result.data.countries} 个国家，新增 ${result.data.inserted} 条，替换 ${result.data.replaced} 条旧费率。`);
    } catch (error) {
      setStatus(error instanceof Error ? `上线失败：${error.message}` : "上线失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/admin/shipping" className="text-sm text-slate-500 hover:text-slate-900">← 返回运费模板</Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">运费批量上线</h1>
        <p className="mt-1 text-sm text-slate-500">先校验文件摘要，再将指定国家的旧费率安全替换为审核版本。</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-800" htmlFor="shipping-import-file">选择审核后的 JSON 文件</label>
        <input id="shipping-import-file" type="file" accept="application/json,.json" onChange={(event) => selectFile(event.target.files?.[0])}
          className="mt-3 block w-full rounded-lg border border-slate-300 p-3 text-sm" />

        {payload && (
          <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p><strong>文件：</strong>{fileName}</p>
            <p><strong>批次：</strong>{payload.batch_id}</p>
            <p><strong>替换国家：</strong>{payload.replace_countries.length}</p>
            <p><strong>新费率：</strong>{payload.templates.length}</p>
          </div>
        )}

        <button type="button" disabled={!payload || submitting} onClick={publish}
          className="mt-5 rounded-lg bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300">
          {submitting ? "正在上线…" : "确认替换并上线"}
        </button>
        {status && <p className="mt-4 text-sm font-medium text-slate-700" role="status">{status}</p>}
      </div>
    </div>
  );
}
