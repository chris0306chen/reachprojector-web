"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Edit2, Trash2, Shield } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

const allPermissions = [
  "view_orders", "manage_orders", "ship_orders",
  "view_products", "manage_products",
  "view_inquiries", "reply_inquiries",
  "view_users",
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff", permissions: [] as string[] });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) { console.error("Failed to fetch users:", err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    const payload: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, permissions: form.permissions };
    if (form.password) payload.password = form.password;

    try {
      if (editingId) {
        await fetch(`/api/admin/users/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        payload.password = form.password;
        await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", email: "", password: "", role: "staff", permissions: [] });
      fetchUsers();
    } catch (err) { console.error("Failed to save user:", err); }
  };

  const editUser = (u: User) => {
    setForm({ name: u.name, email: u.email, password: "", role: u.role, permissions: u.permissions || [] });
    setEditingId(u.id);
    setShowForm(true);
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) { console.error("Failed to delete user:", err); }
  };

  const togglePermission = (perm: string) => {
    setForm({
      ...form,
      permissions: form.permissions.includes(perm)
        ? form.permissions.filter((p) => p !== perm)
        : [...form.permissions, perm],
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", email: "", password: "", role: "staff", permissions: [] }); }} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
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
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Permissions</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
                        {u.role === "admin" && <Shield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(u.permissions || []).map((p) => (
                          <span key={p} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => editUser(u)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Edit2 className="w-4 h-4" /></button>
                        {u.role !== "admin" && <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit" : "Add"} User</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{editingId ? "New Password (leave blank to keep)" : "Password"}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {form.role === "staff" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allPermissions.map((p) => (
                      <label key={p} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePermission(p)} className="rounded border-slate-300" />
                        <span className="text-slate-600">{p.replace(/_/g, " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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
