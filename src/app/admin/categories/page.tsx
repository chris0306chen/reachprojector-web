"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, Check, Tags } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
}

function categoryLabel(category: Category, categories: Category[]) {
  const names = [category.name];
  const visited = new Set([category.id]);
  let parentId = category.parent_id;
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = categories.find((item) => item.id === parentId);
    if (!parent) break;
    names.unshift(parent.name);
    parentId = parent.parent_id;
  }
  return names.join(" › ");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCategories = async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "加载分类失败");
      setCategories(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载分类失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadCategories(); }, []);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.is_active),
    [categories]
  );

  const updateCategory = async (id: string, update: Record<string, unknown>, success: string) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...update }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "更新分类失败");
      setNotice(success);
      setEditingId(null);
      await loadCategories();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "更新分类失败");
    } finally {
      setSaving(false);
    }
  };

  const mergeCategories = async () => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    const source = categories.find((category) => category.id === sourceId);
    const target = categories.find((category) => category.id === targetId);
    if (!source || !target) return;
    if (!confirm(`合并后，“${source.name}”下的 ${source.product_count} 个产品会移动到“${target.name}”，原分类将停用。确定继续吗？`)) return;

    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "merge", source_id: sourceId, target_id: targetId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "合并分类失败");
      setNotice(`已将“${source.name}”合并到“${target.name}”`);
      setSourceId("");
      setTargetId("");
      await loadCategories();
    } catch (mergeError) {
      setError(mergeError instanceof Error ? mergeError.message : "合并分类失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center text-slate-500">正在加载分类...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">分类管理</h1>
        <p className="mt-1 text-slate-500">整理名称、查看产品数量，并把重复分类安全合并。</p>
      </div>

      {error && <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}
      {notice && <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700"><Check className="h-4 w-4" />{notice}</div>}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">合并重复分类</h2>
        <p className="mt-1 text-sm text-slate-500">产品和下级分类会移动到目标分类，来源分类随后停用；不会删除产品。</p>
        <div className="mt-4 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          <select value={sourceId} onChange={(event) => setSourceId(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">选择需要合并的分类...</option>
            {activeCategories.map((category) => <option key={category.id} value={category.id}>{categoryLabel(category, categories)}（{category.product_count}）</option>)}
          </select>
          <ArrowRight className="hidden h-4 w-4 text-slate-400 lg:block" />
          <select value={targetId} onChange={(event) => setTargetId(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">选择保留的目标分类...</option>
            {activeCategories.filter((category) => category.id !== sourceId).map((category) => <option key={category.id} value={category.id}>{categoryLabel(category, categories)}（{category.product_count}）</option>)}
          </select>
          <button type="button" onClick={mergeCategories} disabled={saving || !sourceId || !targetId} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">确认合并</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2"><Tags className="h-4 w-4 text-orange-500" /><h2 className="font-semibold text-slate-900">全部分类</h2></div>
          <span className="text-sm text-slate-500">{activeCategories.length} 个启用 · {categories.length - activeCategories.length} 个停用</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">分类层级</th><th className="px-5 py-3">Slug</th><th className="px-5 py-3 text-right">产品数</th><th className="px-5 py-3 text-center">状态</th><th className="px-5 py-3 text-right">操作</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((category) => (
                <tr key={category.id} className={category.is_active ? "" : "bg-slate-50 text-slate-400"}>
                  <td className="px-5 py-3">
                    {editingId === category.id ? (
                      <input value={editingName} onChange={(event) => setEditingName(event.target.value)} maxLength={100} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900" autoFocus />
                    ) : <span className="text-sm font-medium text-slate-800">{categoryLabel(category, categories)}</span>}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500">{category.slug}</td>
                  <td className="px-5 py-3 text-right text-sm tabular-nums">{category.product_count}</td>
                  <td className="px-5 py-3 text-center">
                    {category.is_active
                      ? <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">启用</span>
                      : <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600">停用</span>}
                  </td>
                  <td className="px-5 py-3 text-right text-sm">
                    {editingId === category.id ? (
                      <div className="flex justify-end gap-3"><button disabled={saving || !editingName.trim()} onClick={() => updateCategory(category.id, { name: editingName }, "分类名称已更新")} className="font-medium text-orange-600 disabled:opacity-50">保存</button><button onClick={() => setEditingId(null)} className="text-slate-500">取消</button></div>
                    ) : (
                      <div className="flex justify-end gap-3"><button onClick={() => { setEditingId(category.id); setEditingName(category.name); }} className="font-medium text-slate-700 hover:text-orange-600">重命名</button><button disabled={saving || (category.is_active && category.product_count > 0)} onClick={() => updateCategory(category.id, { is_active: !category.is_active }, category.is_active ? "分类已停用" : "分类已启用")} title={category.is_active && category.product_count > 0 ? "请先移动或合并该分类下的产品" : undefined} className="font-medium text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40">{category.is_active ? "停用" : "启用"}</button></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
