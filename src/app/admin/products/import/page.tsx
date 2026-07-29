"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import {
  slugify,
  type ImportedProduct,
} from "@/lib/product-bulk-import";

type ReportItem = {
  sku: string;
  name: string;
  status: "error" | "warning" | "ready";
  errors: string[];
  warnings: string[];
  imageCount: number;
  generated: {
    seoTitle: string;
    metaDescription: string;
    factualSummary: string;
    volumetricWeightKg: number | null;
    chargeableWeightKg: number | null;
    matchingShippingCountries: number;
  };
};

type LinkPreview = {
  sourceType: "brand_website" | "amazon" | "alibaba";
  sourceUrl: string;
  canonicalUrl: string;
  retrievedAt: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  sku: string;
  specifications: Array<{ name: string; value: string }>;
  warnings: string[];
};

const text = (value: unknown) => String(value ?? "").trim();
const numberOrNull = (value: unknown) => {
  const number = Number(value);
  return value === "" || value === null || value === undefined || !Number.isFinite(number) ? null : number;
};
const stockStatus = (value: unknown): ImportedProduct["stockStatus"] => {
  const normalized = text(value).toLowerCase().replace(/\s+/g, "_");
  return ["in_stock", "out_of_stock", "pre_order"].includes(normalized)
    ? normalized as ImportedProduct["stockStatus"]
    : "in_stock";
};

export default function ProductImportPage() {
  const [products, setProducts] = useState<ImportedProduct[]>([]);
  const [workbookName, setWorkbookName] = useState("");
  const [report, setReport] = useState<ReportItem[]>([]);
  const [summary, setSummary] = useState<{ total: number; ready: number; warnings: number; errors: number; images: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Array<Record<string, string | number>>>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDraft, setLinkDraft] = useState<ImportedProduct | null>(null);
  const [linkWarnings, setLinkWarnings] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/products/bulk-import/history")
      .then((response) => response.ok ? response.json() : { data: [] })
      .then((result) => setHistory(result.data || []))
      .catch(() => setHistory([]));
  }, []);

  const canImport = useMemo(
    () => products.length > 0 && summary && summary.errors === 0 && !busy,
    [products.length, summary, busy]
  );

  async function collectLink() {
    setBusy(true);
    setMessage("");
    setLinkDraft(null);
    try {
      const response = await fetch("/api/admin/products/link-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to collect this product link");
      const preview = result.data as LinkPreview;
      const identity = preview.model || preview.title;
      const product: ImportedProduct = {
        sku: preview.sku.replace(/[^A-Za-z0-9._-]/g, ""),
        brand: preview.brand,
        model: preview.model,
        name: preview.title,
        slug: slugify(`${preview.brand} ${identity}`),
        category: "Projectors",
        retailPrice: 0,
        compareAtPrice: null,
        b2bPrice: null,
        currency: "USD",
        moq: null,
        stockStatus: "out_of_stock",
        inventoryQuantity: 0,
        leadTime: "",
        version: "",
        plugType: "",
        systemLanguage: "",
        warranty: "",
        countryOfOrigin: "",
        productLengthCm: null,
        productWidthCm: null,
        productHeightCm: null,
        packageLengthCm: null,
        packageWidthCm: null,
        packageHeightCm: null,
        netWeightKg: null,
        grossWeightKg: null,
        shortDescription: preview.description.slice(0, 600),
        fullDescription: preview.description,
        seoTitle: preview.title.slice(0, 70),
        metaDescription: preview.description.slice(0, 170),
        status: "draft",
        specifications: preview.specifications.map((item) => ({ group: "Other", ...item })),
        images: [],
        source: {
          type: preview.sourceType,
          url: preview.sourceUrl,
          canonicalUrl: preview.canonicalUrl,
          retrievedAt: preview.retrievedAt,
          warnings: preview.warnings,
        },
      };
      setLinkDraft(product);
      setLinkWarnings(preview.warnings);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to collect this product link");
    } finally {
      setBusy(false);
    }
  }

  function addLinkDraft() {
    if (!linkDraft) return;
    setProducts([linkDraft]);
    setReport([]);
    setSummary(null);
    setMessage("Link data added. Review the required fields, then run preflight.");
  }

  async function readWorkbook(file: File) {
    setMessage("");
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellFormula: true });
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      if (Object.values(sheet).some((cell) => cell && typeof cell === "object" && "f" in cell)) {
        throw new Error("模板中不能包含公式，请粘贴为纯值后重试。");
      }
    }
    const productSheet = workbook.Sheets.Products || workbook.Sheets[workbook.SheetNames[0]];
    if (!productSheet) throw new Error("找不到 Products 工作表。");
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(productSheet, { defval: "" });
    if (!rows.length) throw new Error("Products 工作表没有产品数据。");
    if (rows.length > 100) throw new Error("一次最多导入 100 个产品。");

    const specificationRows = workbook.Sheets.Specifications
      ? XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets.Specifications, { defval: "" })
      : [];
    const specsBySku = new Map<string, ImportedProduct["specifications"]>();
    for (const row of specificationRows) {
      const sku = text(row.SKU);
      if (!sku) continue;
      const group = text(row.Group) as ImportedProduct["specifications"][number]["group"];
      const name = text(row.Name);
      const value = text(row.Value);
      if (group && name && value) {
        specsBySku.set(sku, [...(specsBySku.get(sku) || []), { group, name, value }]);
      }
    }

    const parsed = rows.map((row) => {
      const name = text(row["Product Name"]);
      const sku = text(row.SKU);
      return {
        sku,
        brand: text(row.Brand),
        model: text(row.Model),
        name,
        slug: text(row.Slug) || slugify(name),
        category: text(row.Category),
        retailPrice: numberOrNull(row["Retail Price"]) || 0,
        compareAtPrice: numberOrNull(row["Compare-at Price"]),
        b2bPrice: numberOrNull(row["B2B Price"]),
        currency: text(row.Currency) || "USD",
        moq: numberOrNull(row.MOQ),
        stockStatus: stockStatus(row["Stock Status"]),
        inventoryQuantity: numberOrNull(row["Inventory Quantity"]) || 0,
        leadTime: text(row["Lead Time"]),
        version: text(row["Product Version"]),
        plugType: text(row["Plug Type"]),
        systemLanguage: text(row["System Language"]),
        warranty: text(row.Warranty),
        countryOfOrigin: text(row["Country of Origin"]),
        productLengthCm: numberOrNull(row["Product Length (cm)"]),
        productWidthCm: numberOrNull(row["Product Width (cm)"]),
        productHeightCm: numberOrNull(row["Product Height (cm)"]),
        packageLengthCm: numberOrNull(row["Package Length (cm)"]),
        packageWidthCm: numberOrNull(row["Package Width (cm)"]),
        packageHeightCm: numberOrNull(row["Package Height (cm)"]),
        netWeightKg: numberOrNull(row["Net Weight (kg)"]),
        grossWeightKg: numberOrNull(row["Gross Weight (kg)"]),
        shortDescription: text(row["Short Description"]),
        fullDescription: text(row["Full Description"]),
        seoTitle: text(row["SEO Title"]),
        metaDescription: text(row["Meta Description"]),
        status: "draft" as const,
        specifications: specsBySku.get(sku) || [],
        images: [],
      } satisfies ImportedProduct;
    });
    setProducts(parsed);
    setWorkbookName(file.name);
    setReport([]);
    setSummary(null);
  }

  async function preflight() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preflight", products }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || JSON.stringify(result.details));
      setReport(result.report);
      setSummary(result.summary);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "预检失败");
    } finally {
      setBusy(false);
    }
  }

  async function importDrafts() {
    if (!canImport) return;
    setBusy(true);
    setMessage("正在创建产品草稿，请不要关闭页面……");
    try {
      const response = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", products }),
      });
      const result = await response.json();
      if (!response.ok) {
        const failure = Array.isArray(result.failures) ? result.failures[0] : null;
        const detail = failure?.error ? `：${failure.error}` : "";
        throw new Error(`${result.error || "导入失败"}${detail}`);
      }
      setMessage(`导入完成：${result.imported} 个产品已保存为草稿。`);
      setProducts([]);
      setReport([]);
      setSummary(null);
      setWorkbookName("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "导入失败");
    } finally {
      setBusy(false);
    }
  }

  const fileHandler = (handler: (file: File) => Promise<void>) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try { await handler(file); } catch (error) {
      setMessage(error instanceof Error ? error.message : "文件解析失败");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">产品批量导入</h1>
          <p className="mt-1 text-sm text-slate-500">上传 Excel/CSV，先预检，再一次导入最多 100 个下架草稿；图片后续在产品编辑器中上传。</p>
        </div>
        <a href="/templates/reach-projector-product-import.xlsx" download className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          <Download className="h-4 w-4" />下载标准 Excel 模板
        </a>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">从产品链接提取（可选）</h2>
        <p className="mt-1 text-sm text-slate-500">
          部分品牌官网、Amazon 和 Alibaba 会阻止自动访问。提取失败时请直接使用产品管理中的“新增产品草稿”，不影响正常上架流程。
        </p>
        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://brand.com/product/..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={collectLink}
            disabled={busy || !linkUrl}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}提取产品资料
          </button>
        </div>
        {linkDraft && (
          <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="font-medium">{linkDraft.name || "待补充产品名称"}</p>
              <p className="text-xs text-slate-500">{linkDraft.source?.type} · {linkDraft.specifications.length} 项已验证参数 · 图片由后台人工上传</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-xs text-slate-600">SKU
                <input value={linkDraft.sku} onChange={(event) => setLinkDraft({ ...linkDraft, sku: event.target.value })} className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm" />
              </label>
              <label className="text-xs text-slate-600">品牌
                <input value={linkDraft.brand} onChange={(event) => setLinkDraft({ ...linkDraft, brand: event.target.value })} className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm" />
              </label>
              <label className="text-xs text-slate-600">分类
                <input value={linkDraft.category} onChange={(event) => setLinkDraft({ ...linkDraft, category: event.target.value })} className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm" />
              </label>
            </div>
            {linkWarnings.map((warning) => <p key={warning} className="text-xs text-amber-700">提醒：{warning}</p>)}
            <button type="button" onClick={addLinkDraft} disabled={!linkDraft.sku || !linkDraft.brand} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              加入现有预检与草稿流程
            </button>
          </div>
        )}
      </section>

      <div>
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 hover:border-orange-400">
          <FileSpreadsheet className="mb-3 h-8 w-8 text-orange-500" />
          <span className="block font-semibold">1. 上传产品 Excel 或 CSV</span>
          <span className="mt-1 block text-sm text-slate-500">{workbookName || "最多 100 个产品；只导入文字资料，不需要图片 ZIP"}</span>
          <input className="hidden" type="file" accept=".xlsx,.csv" disabled={busy} onChange={fileHandler(readWorkbook)} />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">2. 预检并导入</h2>
            <p className="text-sm text-slate-500">所有产品强制保存为下架草稿，不覆盖已有 SKU 或 Slug；图片和价格可以导入后补充。</p>
          </div>
          <div className="flex gap-2">
            <button onClick={preflight} disabled={busy || !products.length} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
              {busy ? <Loader2 className="inline h-4 w-4 animate-spin" /> : <Upload className="mr-2 inline h-4 w-4" />}运行预检
            </button>
            <button onClick={importDrafts} disabled={!canImport} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              一键导入为草稿
            </button>
          </div>
        </div>
        {message && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">{message}</p>}
      </div>

      {summary && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["产品", summary.total], ["可导入", summary.ready], ["警告", summary.warnings],
            ["错误", summary.errors], ["图片", summary.images],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {report.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3">状态</th><th className="p-3">SKU / 产品</th><th className="p-3">图片</th><th className="p-3">检查结果</th></tr></thead>
            <tbody>
              {report.map((item) => (
                <tr key={item.sku} className="border-t border-slate-100 align-top">
                  <td className="p-3">{item.status === "error" ? <AlertCircle className="h-5 w-5 text-red-500" /> : <CheckCircle2 className="h-5 w-5 text-green-500" />}</td>
                  <td className="p-3"><strong>{item.sku}</strong><br /><span className="text-slate-500">{item.name}</span></td>
                  <td className="p-3">{item.imageCount}</td>
                  <td className="p-3">
                    {item.errors.map((entry) => <p key={entry} className="text-red-600">错误：{entry}</p>)}
                    {item.warnings.map((entry) => <p key={entry} className="text-amber-700">提醒：{entry}</p>)}
                    {!item.errors.length && !item.warnings.length && <span className="text-green-700">可以导入</span>}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-slate-600">查看 SEO/GEO 预览</summary>
                      <p className="mt-1"><strong>SEO 标题：</strong> {item.generated.seoTitle}</p>
                      <p><strong>Meta 描述：</strong> {item.generated.metaDescription || "需要确认"}</p>
                      <p><strong>GEO 事实摘要：</strong> {item.generated.factualSummary}</p>
                      <p>
                        <strong>运费预检：</strong>{" "}
                        {item.generated.chargeableWeightKg
                          ? `体积重 ${item.generated.volumetricWeightKg} kg；计费重 ${item.generated.chargeableWeightKg} kg；匹配 ${item.generated.matchingShippingCountries} 个国家`
                          : "包装数据不完整或没有匹配运费"}
                      </p>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {history.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">最近导入记录</h2>
          <div className="space-y-2 text-sm">
            {history.map((job) => <p key={String(job.id)}>{String(job.created_at)} · {String(job.status)} · {String(job.success_count)}/{String(job.product_count)} products</p>)}
          </div>
        </div>
      )}
    </div>
  );
}
