"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, Calculator, Package, Truck, CheckCircle } from "lucide-react";

interface ShippingTemplate {
  id: string;
  name: string;
  region: string;
  shipping_method: string;
  billing_method: string;
  rate: number;
  free_threshold?: number;
  min_charge?: number;
  created_at: string;
}

export default function AdminShippingPage() {
  const [templates, setTemplates] = useState<ShippingTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ShippingTemplate | null>(null);

  // Calculator state
  const [calcWeight, setCalcWeight] = useState(1);
  const [calcRegion, setCalcRegion] = useState("");
  const [calcMethod, setCalcMethod] = useState("");
  const [calcResult, setCalcResult] = useState<number | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/shipping");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "加载运费模板失败");
        return;
      }
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("网络错误，请检查连接");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除此运费模板吗？")) return;
    try {
      const res = await fetch(`/api/admin/shipping?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleCalculate = () => {
    if (!calcWeight || !calcRegion || !calcMethod) return;

    const matchingTemplates = templates.filter(
      (t) =>
        t.region.toLowerCase().includes(calcRegion.toLowerCase()) &&
        t.shipping_method.toLowerCase().includes(calcMethod.toLowerCase())
    );

    if (matchingTemplates.length === 0) {
      setCalcResult(null);
      return;
    }

    const template = matchingTemplates[0];
    let cost = 0;

    if (template.billing_method === "by_weight") {
      cost = template.rate * calcWeight;
      if (template.min_charge && cost < template.min_charge) {
        cost = template.min_charge;
      }
    } else if (template.billing_method === "by_piece") {
      cost = template.rate;
    } else if (template.billing_method === "free") {
      cost = 0;
    }

    setCalcResult(Math.max(0, cost));
  };

  const regions = [...new Set(templates.map((t) => t.region))];
  const methods = [...new Set(templates.map((t) => t.shipping_method))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">运费模板</h1>
          <p className="text-slate-500 mt-1">管理不同地区的运费计算规则</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingTemplate(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            添加模板
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">暂无运费模板，点击"添加模板"创建</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{template.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{template.region}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowForm(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">运输方式</span>
                  <span className="text-slate-900 font-medium">{template.shipping_method}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">计费方式</span>
                  <span className="text-slate-900">
                    {template.billing_method === "by_weight"
                      ? "按重量"
                      : template.billing_method === "by_piece"
                        ? "按件"
                        : template.billing_method === "free"
                          ? "包邮"
                          : template.billing_method}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">费率</span>
                  <span className="text-orange-600 font-semibold">
                    {template.billing_method === "free"
                      ? "免费"
                      : `$${template.rate}${template.billing_method === "by_weight" ? "/kg" : ""}`}
                  </span>
                </div>
                {template.free_threshold && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">免邮门槛</span>
                    <span className="text-green-600 font-medium">${template.free_threshold}</span>
                  </div>
                )}
                {template.min_charge && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">最低收费</span>
                    <span className="text-slate-900">${template.min_charge}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <TemplateFormModal
          template={editingTemplate}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchTemplates();
          }}
        />
      )}

      {/* Freight Calculator Card */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-slate-400" />
            运费试算
          </h2>
          <p className="text-sm text-slate-500 mt-1">根据运费模板快速计算预估运费</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                包裹重量 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                placeholder="输入重量"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">目的地</label>
              <select
                value={calcRegion}
                onChange={(e) => setCalcRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="">选择地区...</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">运输方式</label>
              <select
                value={calcMethod}
                onChange={(e) => setCalcMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="">选择方式...</option>
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleCalculate}
              disabled={!calcWeight || !calcRegion || !calcMethod}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              计算运费
            </button>
            {calcResult !== null && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <span className="text-sm text-green-600">预估运费：</span>
                  <span className="text-lg font-bold text-green-700 ml-1">
                    ${calcResult.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
            {calcResult === null && calcRegion && calcMethod && calcWeight > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                <span className="text-sm text-amber-600">未找到匹配的运费模板</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <TemplateFormModal
          template={editingTemplate}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchTemplates();
          }}
        />
      )}
    </div>
  );
}

function TemplateFormModal({
  template,
  onClose,
  onSuccess,
}: {
  template: ShippingTemplate | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: template?.name || "",
    region: template?.region || "",
    shipping_method: template?.shipping_method || "Standard Shipping",
    billing_method: template?.billing_method || "by_weight",
    rate: template?.rate || 0,
    free_threshold: template?.free_threshold || null as number | null,
    min_charge: template?.min_charge || null as number | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.name || !form.region) {
      setError("请填写模板名称和地区");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const url = template ? `/api/admin/shipping?id=${template.id}` : "/api/admin/shipping";
      const method = template ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          free_threshold: form.free_threshold || null,
          min_charge: form.min_charge || null,
        }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "保存失败");
      }
    } catch (err) {
      setError("网络错误");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {template ? "编辑运费模板" : "添加运费模板"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <span className="text-slate-500 text-lg">&times;</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">模板名称</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="如：美国标准运费"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">地区</label>
            <input
              type="text"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="如：North America, Europe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">运输方式</label>
            <select
              value={form.shipping_method}
              onChange={(e) => setForm({ ...form, shipping_method: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="Standard Shipping">Standard Shipping</option>
              <option value="Express Shipping">Express Shipping</option>
              <option value="Economy Shipping">Economy Shipping</option>
              <option value="Free Shipping">Free Shipping</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">计费方式</label>
            <select
              value={form.billing_method}
              onChange={(e) => setForm({ ...form, billing_method: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="by_weight">按重量 (per kg)</option>
              <option value="by_piece">按件 (flat rate)</option>
              <option value="free">包邮</option>
            </select>
          </div>
          {form.billing_method !== "free" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                费率 ({form.billing_method === "by_weight" ? "USD/kg" : "USD/件"})
              </label>
              <input
                type="number"
                step="0.01"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              免邮门槛 (USD, 留空表示无)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.free_threshold || ""}
              onChange={(e) =>
                setForm({ ...form, free_threshold: e.target.value ? parseFloat(e.target.value) : null })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="如：99.00"
            />
          </div>
          {form.billing_method === "by_weight" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                最低收费 (USD, 留空表示无)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.min_charge || ""}
                onChange={(e) =>
                  setForm({ ...form, min_charge: e.target.value ? parseFloat(e.target.value) : null })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                placeholder="如：5.00"
              />
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
