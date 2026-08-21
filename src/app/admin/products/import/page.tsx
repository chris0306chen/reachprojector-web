"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle, ArrowRight, CheckCircle2, ClipboardCheck, Download, ExternalLink,
  FileSearch, FileSpreadsheet, Loader2, Search, ShieldCheck,
} from "lucide-react";
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
  evidence: Array<{
    field: "title" | "description" | "brand" | "model" | "sku" | "specification";
    label: string;
    value: string;
    source: "product_json_ld" | "page_metadata" | "specification_table" | "description_pattern";
  }>;
  missingFields: string[];
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
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [reviewStep, setReviewStep] = useState<1 | 2 | 3 | 4>(1);

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
    setLinkPreview(null);
    setReviewStep(1);
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
          missingFields: preview.missingFields,
          evidence: preview.evidence,
        },
      };
      setLinkDraft(product);
      setLinkPreview(preview);
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
    setReviewStep(4);
    setMessage("资料已进入预检队列。确认检查结果后，只会保存为下架草稿。");
  }

  function updateLinkDraft<K extends keyof ImportedProduct>(key: K, value: ImportedProduct[K]) {
    setLinkDraft((current) => current ? { ...current, [key]: value } : current);
    setReport([]);
    setSummary(null);
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

  const steps = [
    { id: 1, label: "来源证据", icon: FileSearch },
    { id: 2, label: "产品事实", icon: ClipboardCheck },
    { id: 3, label: "SEO / GEO", icon: Search },
    { id: 4, label: "预检入库", icon: ShieldCheck },
  ] as const;
  const requiredFactsComplete = Boolean(linkDraft?.name && linkDraft.brand && linkDraft.sku && linkDraft.slug);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">产品采集与审核</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">从授权的产品页面提取可验证事实，审核 SEO/GEO 内容，再保存为下架草稿。系统不会采集图片、价格、库存或商业承诺。</p>
        </div>
        <a href="/templates/reach-projector-product-import.xlsx" download className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          <Download className="h-4 w-4" />批量导入模板
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-2 md:grid-cols-4" aria-label="审核进度">
        {steps.map((step) => {
          const active = reviewStep === step.id;
          const complete = reviewStep > step.id;
          return (
            <button key={step.id} type="button" onClick={() => linkDraft && setReviewStep(step.id)} disabled={!linkDraft && step.id > 1}
              className={`flex min-h-12 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${active ? "bg-white text-slate-950 shadow-sm" : complete ? "text-emerald-700" : "text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"}`}>
              {complete ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <step.icon className="h-4 w-4 shrink-0" />}
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-orange-50 p-2 text-orange-600"><FileSearch className="h-5 w-5" /></div>
          <div>
            <h2 className="font-semibold text-slate-900">粘贴授权产品链接</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">优先使用品牌或供应商官网。Amazon、Alibaba 受限页面应改用官方接口或供应商导出资料。</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://brand.com/product/..."
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="button"
            onClick={collectLink}
            disabled={busy || !linkUrl}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}开始采集
          </button>
        </div>
        {message && <p role="status" className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p>}
      </section>

      {linkDraft && linkPreview && reviewStep === 1 && (
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div><h2 className="font-semibold text-slate-900">确认来源与证据</h2><p className="mt-1 text-sm text-slate-600">所有采集字段都保留来源。网页内容仅作为资料，不会被当作系统指令。</p></div>
            <a href={linkPreview.canonicalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800">打开原页面<ExternalLink className="h-4 w-4" /></a>
          </div>
          <dl className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm md:grid-cols-3">
            <div><dt className="text-slate-500">来源类型</dt><dd className="mt-1 font-medium text-slate-900">{linkPreview.sourceType}</dd></div>
            <div><dt className="text-slate-500">采集时间</dt><dd className="mt-1 font-medium text-slate-900">{new Date(linkPreview.retrievedAt).toLocaleString("zh-CN")}</dd></div>
            <div><dt className="text-slate-500">证据条目</dt><dd className="mt-1 font-medium text-slate-900">{linkPreview.evidence.length}</dd></div>
          </dl>
          {(linkWarnings.length > 0 || linkPreview.missingFields.length > 0) && <div className="space-y-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            {linkWarnings.map((warning) => <p key={warning}><strong>提醒：</strong>{warning}</p>)}
            {linkPreview.missingFields.length > 0 && <p><strong>需要补充：</strong>{linkPreview.missingFields.join("、")}</p>}
          </div>}
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[minmax(120px,0.35fr)_1fr] bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600"><span>字段与来源</span><span>采集证据</span></div>
            {linkPreview.evidence.slice(0, 30).map((item, index) => <div key={`${item.field}-${item.label}-${index}`} className="grid grid-cols-[minmax(120px,0.35fr)_1fr] gap-4 border-t border-slate-100 px-4 py-3 text-sm">
              <div><p className="font-medium text-slate-900">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.source.replaceAll("_", " ")}</p></div>
              <p className="line-clamp-3 leading-6 text-slate-700">{item.value}</p>
            </div>)}
          </div>
          <div className="flex justify-end"><button type="button" onClick={() => setReviewStep(2)} className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">审核产品事实<ArrowRight className="ml-2 h-4 w-4" /></button></div>
        </section>
      )}

      {linkDraft && reviewStep === 2 && (
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div><h2 className="font-semibold text-slate-900">审核产品事实</h2><p className="mt-1 text-sm text-slate-600">修正身份字段。SKU、品牌、名称和分类是创建草稿的必填项。</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            {([
              ["name", "产品名称"], ["brand", "品牌"], ["model", "型号"], ["sku", "SKU"], ["category", "分类"], ["slug", "Slug"],
            ] as Array<[keyof ImportedProduct, string]>).map(([key, label]) => <label key={key} className="text-sm font-medium text-slate-700">{label}
              <input value={String(linkDraft[key] ?? "")} onChange={(event) => updateLinkDraft(key, event.target.value as never)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            </label>)}
          </div>
          <div><h3 className="text-sm font-semibold text-slate-900">已验证规格（{linkDraft.specifications.length}）</h3><div className="mt-2 grid gap-2 md:grid-cols-2">{linkDraft.specifications.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="text-slate-500">{item.name}</span><p className="mt-0.5 font-medium text-slate-900">{item.value}</p></div>)}</div></div>
          {!requiredFactsComplete && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">请补全产品名称、品牌、SKU 和 Slug。</p>}
          <div className="flex justify-between gap-3"><button type="button" onClick={() => setReviewStep(1)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">返回证据</button><button type="button" disabled={!requiredFactsComplete} onClick={() => setReviewStep(3)} className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">审核 SEO / GEO<ArrowRight className="ml-2 h-4 w-4" /></button></div>
        </section>
      )}

      {linkDraft && reviewStep === 3 && (
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div><h2 className="font-semibold text-slate-900">审核 SEO / GEO 草稿</h2><p className="mt-1 text-sm text-slate-600">只使用已确认事实。最终预检会生成事实摘要、适用人群、限制说明、FAQ 和来源日期。</p></div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">SEO 标题 <span className="font-normal text-slate-400">{linkDraft.seoTitle.length}/70</span><input value={linkDraft.seoTitle} maxLength={70} onChange={(event) => updateLinkDraft("seoTitle", event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>
              <label className="block text-sm font-medium text-slate-700">Meta 描述 <span className="font-normal text-slate-400">{linkDraft.metaDescription.length}/170</span><textarea value={linkDraft.metaDescription} maxLength={170} rows={4} onChange={(event) => updateLinkDraft("metaDescription", event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 p-3 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>
              <label className="block text-sm font-medium text-slate-700">事实型产品摘要<textarea value={linkDraft.shortDescription} maxLength={600} rows={6} onChange={(event) => updateLinkDraft("shortDescription", event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 p-3 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>
            </div>
            <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm font-medium text-slate-500">Google 搜索预览</p><p className="mt-4 text-lg font-medium text-blue-800">{linkDraft.seoTitle || linkDraft.name}</p><p className="mt-1 text-sm text-emerald-700">reachprojector.com/products/{linkDraft.slug}</p><p className="mt-2 text-sm leading-6 text-slate-600">{linkDraft.metaDescription || linkDraft.shortDescription || "补充清晰、事实型的产品描述。"}</p><div className="mt-6 border-t border-slate-200 pt-5"><p className="text-sm font-semibold text-slate-900">GEO 将包含</p><ul className="mt-2 space-y-2 text-sm text-slate-600"><li>产品定义与明确型号</li><li>结构化已验证规格</li><li>适用人群与应用场景</li><li>缺失信息与购买限制</li><li>事实型 FAQ、来源与审核日期</li></ul></div></div>
          </div>
          <div className="flex justify-between gap-3">
            <button type="button" onClick={() => setReviewStep(2)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">返回事实</button>
            <button type="button" onClick={addLinkDraft} className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600">进入预检<ArrowRight className="ml-2 h-4 w-4" /></button>
          </div>
        </section>
      )}

      {reviewStep === 4 && (
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">预检并创建下架草稿</h2>
              <p className="mt-1 text-sm text-slate-600">检查重复、分类、SEO、运费资料和发布缺口。此操作不会自动上架。</p>
            </div>
            <div className="flex gap-2">
              <button onClick={preflight} disabled={busy || !products.length} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-50">{busy ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 inline h-4 w-4" />}运行预检</button>
              <button onClick={importDrafts} disabled={!canImport} className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">保存为草稿</button>
            </div>
          </div>
          {message && <p role="status" className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}
        </section>
      )}

      <details className="rounded-xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer list-none font-semibold text-slate-900"><span className="inline-flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-slate-500" />需要一次导入多个产品？</span></summary>
        <label className="mt-4 block cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 transition-colors hover:border-orange-400"><span className="block font-medium text-slate-900">上传 Excel 或 CSV</span><span className="mt-1 block text-sm text-slate-500">{workbookName || "最多 100 个产品，仍会经过相同预检并保存为下架草稿"}</span><input className="hidden" type="file" accept=".xlsx,.csv" disabled={busy} onChange={fileHandler(readWorkbook)} /></label>
      </details>

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
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-[760px] w-full text-left text-sm">
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
            {history.map((job) => <p key={String(job.id)}>{new Date(String(job.created_at)).toLocaleString("zh-CN")} · {String(job.status)} · {String(job.success_count)}/{String(job.product_count)} 个产品</p>)}
          </div>
        </div>
      )}
    </div>
  );
}
