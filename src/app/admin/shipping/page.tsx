"use client";

import { useEffect, useState } from "react";
import { Truck, Plus, Edit2, Trash2 } from "lucide-react";

interface ShippingTemplate {
  id: string;
  name: string;
  zone: string;
  method: string;
  fixed_fee: string | null;
  free_shipping_min: string | null;
  trade_terms: string;
  is_active: boolean;
}

export default function AdminShippingPage() {
  const [templates, setTemplates] = useState<ShippingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", zone: "", method: "air", fixed_fee: "", free_shipping_min: "", trade_terms: "DDP" });

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/shipping");
      const data = await res.json();
      setTemplates(data.data || []);
    } catch (err) { console.error("Failed to fetch templates:", err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      zone: form.zone,
      method: form.method,
      fixed_fee: form.fixed_fee || null,
      free_shipping_min: form.free_shipping_min || null,
      trade_terms: form.trade_terms,
    };

    try {
      if (editingId) {
        await fetch(`/api/admin/shipping/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        await fetch("/api/admin/shipping", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", zone: "", method: "air", fixed_fee: "", free_shipping_min: "", trade_terms: "DDP" });
      fetchTemplates();
    } catch (err) { console.error("Failed to save template:", err); }
  };

  const editTemplate = (t: ShippingTemplate) => {
    setForm({ name: t.name, zone: t.zone, method: t.method, fixed_fee: t.fixed_fee || "", free_shipping_min: t.free_shipping_min || "", trade_terms: t.trade_terms });
    setEditingId(t.id);
    setShowForm(true);
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this shipping template?")) return;
    try {
      await fetch(`/api/admin/shipping/${id}`, { method: "DELETE" });
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (err) { console.error("Failed to delete:", err); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Shipping Templates</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", zone: "", method: "air", fixed_fee: "", free_shipping_min: "", trade_terms: "DDP" }); }} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Template
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Zone</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Method</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Fixed Fee</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Free Min</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Terms</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{t.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.zone}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">{t.method}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.fixed_fee ? `$${parseFloat(t.fixed_fee).toFixed(2)}` : "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.free_shipping_min ? `$${parseFloat(t.free_shipping_min).toFixed(2)}` : "-"}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{t.trade_terms}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => editTemplate(t)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteTemplate(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {templates.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No shipping templates yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit" : "Add"} Shipping Template</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g., US Express" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Zone</label>
                <input type="text" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g., US, EU, Southeast Asia" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
                <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="air">Air Freight</option>
                  <option value="sea">Sea Freight</option>
                  <option value="express">Express (DHL/FedEx)</option>
                  <option value="rail">Rail Freight</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fixed Fee ($)</label>
                <input type="number" value={form.fixed_fee} onChange={(e) => setForm({ ...form, fixed_fee: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Free Shipping Min Order ($)</label>
                <input type="number" value={form.free_shipping_min} onChange={(e) => setForm({ ...form, free_shipping_min: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trade Terms</label>
                <select value={form.trade_terms} onChange={(e) => setForm({ ...form, trade_terms: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                  <option value="DAP">DAP (Delivered at Place)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                  <option value="FOB">FOB (Free on Board)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
