"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, AlertCircle, CheckSquare, Square, ArrowUp, ArrowDown, Paperclip, Upload, X } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  category_id?: string;
  price: number;
  purchase_price?: number;
  purchase_currency?: string | null;
  supplier_url?: string;
  sale_price?: number;
  moq?: number;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  weight?: number;
  weight_kg?: number;
  support_oem?: boolean;
  oem_available?: boolean;
  oem_notes?: string;
  attachments?: Array<{ url: string; name: string; size: number }>;
  image_url?: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchAction, setBatchAction] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "鍔犺浇浜у搧澶辫触");
        return;
      }
      const rows = (Array.isArray(data.data) ? data.data : []) as Array<Product & { compare_at_price?: number | string }>;
      setProducts(rows.map((product) => ({
        ...product,
        price: Number(product.price) || 0,
        sale_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
      })));
    } catch (err) {
      setError("缃戠粶閿欒锛岃妫€鏌ヨ繛鎺?);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("纭畾瑕佸垹闄ゆ浜у搧鍚楋紵")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product status");
      fetchProducts();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setError(err instanceof Error ? err.message : "Failed to update product status");
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !isFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update featured status");
      fetchProducts();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      setError(err instanceof Error ? err.message : "Failed to update featured status");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleSelectProduct = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBatchAction = async () => {
    if (selectedIds.size === 0 || !batchAction) return;

    const actionMap: Record<string, { action: string; value: unknown }> = {
      activate: { action: "toggle_active", value: true },
      deactivate: { action: "toggle_active", value: false },
    };

    const batchOp = actionMap[batchAction];
    if (!batchOp) return;

    try {
      const res = await fetch("/api/admin/products/batch-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          ...batchOp,
        }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        setBatchAction("");
        fetchProducts();
      }
    } catch (err) {
      console.error("Batch action failed:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.slug?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? product.is_active : !product.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">鍔犺浇涓?..</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">浜у搧绠＄悊</h1>
          <p className="text-slate-500 mt-1">绠＄悊鎵€鏈変骇鍝佷俊鎭?/p>
        </div>
        <Link
          href="/admin/products/import"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 w-fit"
        >
          <Plus className="w-4 h-4" />
          閲囬泦浜у搧
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="鎼滅储浜у搧鍚嶇О..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="all">鍏ㄩ儴鍒嗙被</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="all">鍏ㄩ儴鐘舵€?/option>
            <option value="active">涓婃灦</option>
            <option value="inactive">涓嬫灦</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm font-medium text-orange-800">
            宸查€夋嫨 {selectedIds.size} 涓骇鍝?          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={batchAction}
              onChange={(e) => setBatchAction(e.target.value)}
              className="px-3 py-1.5 border border-orange-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">閫夋嫨鎿嶄綔...</option>
              <option value="activate">鎵归噺涓婃灦</option>
              <option value="deactivate">鎵归噺涓嬫灦</option>
            </select>
            <button
              onClick={handleBatchAction}
              disabled={!batchAction}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              鎵ц
            </button>
            <button
              onClick={() => {
                setSelectedIds(new Set());
                setBatchAction("");
              }}
              className="px-3 py-1.5 text-orange-700 text-sm hover:underline"
            >
              鍙栨秷閫夋嫨
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              {search || categoryFilter !== "all" || statusFilter !== "all"
                ? "娌℃湁鎵惧埌鍖归厤鐨勪骇鍝?
                : "鏆傛棤浜у搧"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 w-10">
                    <button onClick={handleSelectAll}>
                      {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    浜у搧
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    浠锋牸
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    閲囪喘浠?                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    MOQ
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    閲嶉噺
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    OEM
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    鎺ㄨ崘
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    鐘舵€?                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    鎿嶄綔
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <button onClick={() => handleSelectProduct(product.id)}>
                        {selectedIds.has(product.id) ? (
                          <CheckSquare className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <span className="text-xs text-slate-400">鏃犲浘</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500">/{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {product.sale_price ? (
                        <div>
                          <span className="font-medium text-orange-600">
                            ${product.sale_price.toFixed(2)}
                          </span>
                          <span className="text-slate-400 line-through text-xs ml-1">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium text-slate-900">${product.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">
                      {product.purchase_price !== undefined ? (
                        product.supplier_url ? (
                          <a
                            href={product.supplier_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-700"
                            title="鏌ョ湅渚涘簲鍟嗛〉闈?
                          >
                            {product.purchase_currency || "甯佺寰呯‘璁?} {product.purchase_price.toFixed(2)}
                          </a>
                        ) : (
                          <span>{product.purchase_currency || "甯佺寰呯‘璁?} {product.purchase_price.toFixed(2)}</span>
                        )
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">
                      {product.moq || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">
                      {product.weight_kg || product.weight ? `${(product.weight_kg || product.weight)}kg` : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {(product.oem_available || product.support_oem) ? (
                        <span className="text-green-600 text-xs font-medium">鏀寔</span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          product.is_featured
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {product.is_featured ? "鎺ㄨ崘" : "鏅€?}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(product.id, product.is_active)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          product.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.is_active ? (
                          <>
                            <ArrowUp className="w-3 h-3" />
                            涓婃灦
                          </>
                        ) : (
                          <>
                            <ArrowDown className="w-3 h-3" />
                            涓嬫灦
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                          title="缂栬緫"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          title="鍒犻櫎"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

function ProductEditModal({
  product,
  onClose,
  onSuccess,
}: {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price || 0,
    sale_price: product.sale_price || null as number | null,
    moq: product.moq || 1,
    stock: product.stock || 0,
    weight_kg: product.weight_kg || product.weight || null as number | null,
    oem_available: product.oem_available || product.support_oem || false,
    oem_notes: product.oem_notes || "",
  });
  const [attachments, setAttachments] = useState<Array<{ url: string; name: string; size: number }>>(
    product.attachments || []
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name) {
      setError("璇峰～鍐欎骇鍝佸悕绉?);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sale_price: form.sale_price || null,
          weight_kg: form.weight_kg || null,
          attachments: attachments,
        }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "淇濆瓨澶辫触");
      }
    } catch (err) {
      setError("缃戠粶閿欒");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAttachments([...attachments, { url: data.url, name: data.name, size: data.size }]);
      } else {
        setError("涓婁紶澶辫触");
      }
    } catch (err) {
      setError("涓婁紶澶辫触");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">缂栬緫浜у搧</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">浜у搧鍚嶇О</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">浠锋牸 (USD)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">淇冮攢浠?/label>
              <input
                type="number"
                step="0.01"
                value={form.sale_price || ""}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="鏃犱績閿€浠?
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">MOQ</label>
              <input
                type="number"
                value={form.moq}
                onChange={(e) => setForm({ ...form, moq: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">閲嶉噺 (kg)</label>
              <input
                type="number"
                step="0.01"
                value={form.weight_kg || ""}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="浜у搧閲嶉噺"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.oem_available}
                onChange={(e) => setForm({ ...form, oem_available: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
            <span className="text-sm font-medium text-slate-700">鏀寔 OEM 瀹氬埗</span>
          </div>
          {form.oem_available && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">OEM 璇存槑</label>
              <textarea
                value={form.oem_notes}
                onChange={(e) => setForm({ ...form, oem_notes: e.target.value })}
                rows={2}
                placeholder="OEM 瀹氬埗瑕佹眰銆佹渶浣庤捣璁㈤噺绛?
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">闄勪欢</label>
            <div className="space-y-2">
              {attachments.map((att, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700 truncate max-w-[300px]">{att.name}</span>
                    <span className="text-xs text-slate-400">
                      {att.size < 1024 * 1024
                        ? `${(att.size / 1024).toFixed(1)} KB`
                        : `${(att.size / (1024 * 1024)).toFixed(1)} MB`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveAttachment(idx)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">{uploading ? "涓婁紶涓?.." : "鐐瑰嚮涓婁紶闄勪欢"}</span>
                <input
                  type="file"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            鍙栨秷
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting ? "淇濆瓨涓?.." : "淇濆瓨"}
          </button>
        </div>
      </div>
    </div>
  );
}
