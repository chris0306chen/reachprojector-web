"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Edit2, Plus, Truck } from "lucide-react";

interface ShippingTemplate {
  id: string;
  name: string;
  country_code: string;
  method: string;
  trade_terms: "DDP" | "DAP" | "MANUAL_QUOTE" | "UNAVAILABLE";
  shipping_class: "parcel" | "oversize" | "freight";
  currency: string;
  min_weight_kg: number;
  max_weight_kg: number;
  base_weight_kg: number;
  base_fee: number;
  increment_weight_kg: number;
  increment_fee: number;
  minimum_fee: number;
  volumetric_divisor: number;
  estimated_days_min?: number | null;
  estimated_days_max?: number | null;
  valid_from?: string | null;
  valid_to?: string | null;
  is_active: boolean;
  notes?: string | null;
}

const emptyTemplate: Omit<ShippingTemplate, "id"> = {
  name: "",
  country_code: "",
  method: "express",
  trade_terms: "MANUAL_QUOTE",
  shipping_class: "parcel",
  currency: "USD",
  min_weight_kg: 0,
  max_weight_kg: 0,
  base_weight_kg: 0,
  base_fee: 0,
  increment_weight_kg: 0.5,
  increment_fee: 0,
  minimum_fee: 0,
  volumetric_divisor: 5000,
  estimated_days_min: null,
  estimated_days_max: null,
  valid_from: null,
  valid_to: null,
  is_active: false,
  notes: "",
};

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function AdminShippingPage() {
  const [templates, setTemplates] = useState<ShippingTemplate[]>([]);
  const [editing, setEditing] = useState<ShippingTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/shipping", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "加载运费模板失败");
      setTemplates((Array.isArray(result.data) ? result.data : []).map((item: ShippingTemplate) => ({
        ...item,
        min_weight_kg: numberValue(item.min_weight_kg),
        max_weight_kg: numberValue(item.max_weight_kg),
        base_weight_kg: numberValue(item.base_weight_kg),
        base_fee: numberValue(item.base_fee),
        increment_weight_kg: numberValue(item.increment_weight_kg),
        increment_fee: numberValue(item.increment_fee),
        minimum_fee: numberValue(item.minimum_fee),
        volumetric_divisor: numberValue(item.volumetric_divisor),
      })));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "加载运费模板失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const deactivate = async (id: string) => {
    if (!window.confirm("确认停用这条运费规则？历史订单不会受到影响。")) return;
    const response = await fetch(`/api/admin/shipping/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("停用运费规则失败");
      return;
    }
    fetchTemplates();
  };

  if (loading) return <div className="py-20 text-center text-slate-500">正在加载...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">运费模板</h1>
          <p className="mt-1 text-sm text-slate-500">
            按国家、重量和贸易条款维护。未确认线路请保持“人工报价”和停用状态。
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" /> 新增规则
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {templates.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <Truck className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <p className="text-slate-500">暂无运费规则。真实报价确认前无需启用。</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">名称 / 国家</th>
                <th className="px-4 py-3">方式</th>
                <th className="px-4 py-3">条款</th>
                <th className="px-4 py-3">运输类别</th>
                <th className="px-4 py-3">重量区间</th>
                <th className="px-4 py-3">首重 / 续重</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((template) => (
                <tr key={template.id} className="text-sm text-slate-700">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{template.name}</div>
                    <div className="text-xs text-slate-500">{template.country_code}</div>
                  </td>
                  <td className="px-4 py-3">{template.method}</td>
                  <td className="px-4 py-3">{template.trade_terms}</td>
                  <td className="px-4 py-3">{template.shipping_class}</td>
                  <td className="px-4 py-3">{template.min_weight_kg}–{template.max_weight_kg} kg</td>
                  <td className="px-4 py-3">
                    {template.currency} {template.base_fee} / {template.increment_fee}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      template.is_active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {template.is_active ? "已启用" : "未启用"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { setEditing(template); setShowForm(true); }}
                      className="mr-2 rounded p-2 text-slate-500 hover:bg-slate-100"
                      aria-label="编辑"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {template.is_active && (
                      <button onClick={() => deactivate(template.id)} className="text-xs text-red-600 hover:underline">
                        停用
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <TemplateForm
          template={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchTemplates(); }}
        />
      )}
    </div>
  );
}

function TemplateForm({
  template,
  onClose,
  onSaved,
}: {
  template: ShippingTemplate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Omit<ShippingTemplate, "id">>(template || emptyTemplate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setNumber = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value === "" ? 0 : Number(value) });
  };

  const save = async () => {
    if (!form.name.trim() || !/^[A-Z]{2}$/.test(form.country_code)) {
      setError("请填写名称和两位大写国家代码，例如 US。");
      return;
    }
    setSaving(true);
    setError(null);
    const response = await fetch(template ? `/api/admin/shipping/${template.id}` : "/api/admin/shipping", {
      method: template ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(result.error || "保存失败");
      return;
    }
    onSaved();
  };

  const numberFields: Array<[keyof typeof form, string, string]> = [
    ["min_weight_kg", "最小重量", "0.01"],
    ["max_weight_kg", "最大重量", "0.01"],
    ["base_weight_kg", "首重", "0.01"],
    ["base_fee", "首重费", "0.01"],
    ["increment_weight_kg", "续重单位", "0.01"],
    ["increment_fee", "续重费", "0.01"],
    ["minimum_fee", "最低收费", "0.01"],
    ["volumetric_divisor", "体积除数", "1"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold">{template ? "编辑运费规则" : "新增运费规则"}</h2>
          <button onClick={onClose} className="text-2xl text-slate-400">&times;</button>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          {error && <div className="sm:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <Field label="规则名称">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </Field>
          <Field label="国家代码">
            <input maxLength={2} value={form.country_code} onChange={(e) => setForm({ ...form, country_code: e.target.value.toUpperCase() })} className="input" placeholder="US" />
          </Field>
          <Field label="运输方式">
            <input value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="input" placeholder="express" />
          </Field>
          <Field label="贸易条款">
            <select value={form.trade_terms} onChange={(e) => setForm({ ...form, trade_terms: e.target.value as typeof form.trade_terms })} className="input">
              <option value="MANUAL_QUOTE">人工报价</option>
              <option value="DAP">DAP（税费由买家承担）</option>
              <option value="DDP">DDP（双清包税）</option>
              <option value="UNAVAILABLE">不配送</option>
            </select>
          </Field>
          <Field label="运输类别">
            <select value={form.shipping_class} onChange={(e) => setForm({ ...form, shipping_class: e.target.value as typeof form.shipping_class })} className="input">
              <option value="parcel">parcel</option>
              <option value="oversize">oversize</option>
              <option value="freight">freight</option>
            </select>
          </Field>
          <Field label="币种">
            <input maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} className="input" />
          </Field>
          {numberFields.map(([key, label, step]) => (
            <Field key={key} label={`${label}${key.includes("fee") ? ` (${form.currency})` : key === "volumetric_divisor" ? "" : " (kg)"}`}>
              <input type="number" min="0" step={step} value={String(form[key] ?? "")} onChange={(e) => setNumber(key, e.target.value)} className="input" />
            </Field>
          ))}
          <Field label="启用">
            <select value={form.is_active ? "yes" : "no"} onChange={(e) => setForm({ ...form, is_active: e.target.value === "yes" })} className="input">
              <option value="no">否（建议资料确认前）</option>
              <option value="yes">是</option>
            </select>
          </Field>
          <Field label="备注">
            <input value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" />
          </Field>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button onClick={save} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
      <style jsx>{`.input { width: 100%; border: 1px solid #e2e8f0; border-radius: .5rem; padding: .5rem .75rem; font-size: .875rem; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
