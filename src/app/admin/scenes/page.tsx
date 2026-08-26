"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Layers3, Plus, Trash2 } from "lucide-react";

interface Scene {
  id: string; name: string; slug: string; group_name: string; description: string | null;
  sort_order: number; is_active: boolean; product_count: number;
}

export default function AdminScenesPage() {
  const [groups, setGroups] = useState<string[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", group_name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/scenes");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "加载场景失败");
      setGroups(result.groups || []);
      setScenes(result.scenes || []);
      setForm((current) => ({ ...current, group_name: current.group_name || result.groups?.[0] || "" }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载场景失败");
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const request = async (method: string, body?: Record<string, unknown>, query = "") => {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/scenes${query}`, {
        method, headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "操作失败");
      await load();
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "操作失败");
      return false;
    } finally { setSaving(false); }
  };

  const createScene = async () => {
    if (!form.name.trim() || !form.group_name) { setError("请填写场景名称并选择母类目"); return; }
    if (await request("POST", form)) {
      setNotice("场景已新增");
      setForm({ name: "", slug: "", group_name: groups[0] || "", description: "" });
    }
  };

  const removeScene = async (scene: Scene) => {
    if (!confirm(`永久删除空场景“${scene.name}”？此操作无法恢复。`)) return;
    if (await request("DELETE", undefined, `?id=${encodeURIComponent(scene.id)}`)) setNotice("空场景已删除");
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center text-slate-500">正在加载场景...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">场景管理</h1><p className="mt-1 text-slate-500">五个母类目保持固定；可新增子场景、移动、停用或删除空场景。</p></div>
        <button type="button" disabled={saving} onClick={async () => { if (await request("POST", { action: "normalize_groups" })) setNotice("现有场景已按五个母类目重新归组"); }} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">按五类重新归组</button>
      </div>
      {error && <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}
      {notice && <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700"><Check className="h-4 w-4" />{notice}</div>}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2"><Plus className="h-4 w-4 text-orange-500" /><h2 className="font-semibold text-slate-900">新增子场景</h2></div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={120} placeholder="场景名称" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} maxLength={120} placeholder="Slug（可自动生成）" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={form.group_name} onChange={(event) => setForm({ ...form, group_name: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {groups.map((group) => <option key={group} value={group}>{group}</option>)}
          </select>
          <button type="button" onClick={createScene} disabled={saving || !form.name.trim()} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">新增场景</button>
        </div>
      </section>

      <div className="space-y-5">
        {groups.map((group) => (
          <section key={group} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4"><div className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-orange-500" /><h2 className="font-semibold text-slate-900">{group}</h2></div><span className="text-sm text-slate-500">{scenes.filter((scene) => scene.group_name === group).length} 个子场景</span></div>
            <div className="divide-y divide-slate-200">
              {scenes.filter((scene) => scene.group_name === group).map((scene) => (
                <div key={scene.id} className="grid items-center gap-3 px-5 py-4 md:grid-cols-[1.3fr_1fr_9rem_8rem]">
                  <div><p className="font-medium text-slate-900">{scene.name}</p><p className="mt-1 text-xs text-slate-500">/{scene.slug} · {scene.product_count} 个产品</p></div>
                  <select value={scene.group_name} disabled={saving || !scene.is_active} onChange={async (event) => { if (await request("PATCH", { id: scene.id, group_name: event.target.value })) setNotice("场景已移动"); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-100">
                    {groups.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button type="button" disabled={saving} onClick={async () => { if (await request("PATCH", { id: scene.id, is_active: !scene.is_active })) setNotice(scene.is_active ? "场景已停用" : "场景已启用"); }} className="text-sm font-medium text-slate-600 hover:text-orange-600">{scene.is_active ? "停用" : "启用"}</button>
                  <button type="button" disabled={saving || scene.product_count > 0} onClick={() => removeScene(scene)} title={scene.product_count > 0 ? "有关联产品，只能停用" : "永久删除空场景"} className="inline-flex items-center justify-end gap-1 text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-35"><Trash2 className="h-4 w-4" />删除</button>
                </div>
              ))}
              {!scenes.some((scene) => scene.group_name === group) && <p className="px-5 py-8 text-center text-sm text-slate-500">暂无子场景，可从上方新增。</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
