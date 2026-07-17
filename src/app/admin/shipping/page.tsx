"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Truck, Globe, X } from "lucide-react";

interface ShippingTemplate {
  id: string;
  name: string;
  region: string;
  method: string;
  cost_type: string;
  base_cost: string;
  rate_per_kg: string;
  free_shipping_above: string;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  name: "",
  region: "",
  method: "sea",
  cost_type: "weight",
  base_cost: "",
  rate_per_kg: "",
  free_shipping_above: "",
  is_active: true,
};

export default function AdminShippingPage() {
  const [templates, setTemplates] = useState<ShippingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/shipping");
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch shipping templates:", err);
      setError("加载物流模板失败，请刷新重试");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;

      await fetch("/api/admin/shipping", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchTemplates();
    } catch (err) {
      console.error("Failed to save template:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (t: ShippingTemplate) => {
    setForm({
      name: t.name,
      region: t.region,
      method: t.method,
      cost_type: t.cost_type,
      base_cost: t.base_cost,
      rate_per_kg: t.rate_per_kg,
      free_shipping_above: t.free_shipping_above || "",
      is_active: t.is_active,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个运费模板吗？")) return;
    try {
      await fetch(`/api/admin/shipping?id=${id}`, { method: "DELETE" });
      fetchTemplates();
    } catch (err) {
      console.error("Failed to delete template:", err);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/admin/shipping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !isActive }),
      });
      fetchTemplates();
    } catch (err) {
      console.error("Failed to toggle active:", err);
    }
  };

  const methodLabels: Record<string, string> = {
    sea: "海运",
    air: "空运",
    express: "快递",
    train: "铁路",
  };

  const costTypeLabels: Record<string, string> = {
    weight: "按重量",
    volume: "按体积",
    piece: "按件",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">物流管理</h1>
          <p className="text-slate-500 text-sm mt-1">配置运费模板和物流方式</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加运费模板
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "编辑运费模板" : "添加运费模板"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">模板名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="例如：东南亚海运"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">地区</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  required
                  placeholder="例如：东南亚、北美、欧洲"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">物流方式</label>
                  <select
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="sea">海运</option>
                    <option value="air">空运</option>
                    <option value="express">快递</option>
                    <option value="train">铁路</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">计费方式</label>
                  <select
                    value={form.cost_type}
                    onChange={(e) => setForm({ ...form, cost_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="weight">按重量</option>
                    <option value="volume">按体积</option>
                    <option value="piece">按件</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">基础运费 ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.base_cost}
                    onChange={(e) => setForm({ ...form, base_cost: e.target.value })}
                    required
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">费率 ($/kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.rate_per_kg}
                    onChange={(e) => setForm({ ...form, rate_per_kg: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">免运费门槛 ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.free_shipping_above}
                    onChange={(e) => setForm({ ...form, free_shipping_above: e.target.value })}
                    placeholder="可选"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="is_active" className="text-sm text-slate-700">启用此模板</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "保存中..." : editingId ? "更新" : "创建"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Truck className="w-12 h-12 mb-3 text-slate-300" />
            <p>暂无运费模板</p>
            <p className="text-sm mt-1">点击"添加运费模板"开始配置</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">模板名称</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">地区</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">物流方式</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">计费方式</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">基础运费</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">费率</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">免运费门槛</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{t.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {t.region}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {methodLabels[t.method] || t.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{costTypeLabels[t.cost_type] || t.cost_type}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">${t.base_cost}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">${t.rate_per_kg}/kg</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {t.free_shipping_above ? `$${t.free_shipping_above}` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(t.id, t.is_active)}
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          t.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {t.is_active ? "启用" : "停用"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Pencil className="w-4 h-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
