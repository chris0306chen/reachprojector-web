"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, AlertCircle, CheckSquare, Square, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  category_id?: string;
  price: number;
  sale_price?: number;
  moq?: number;
  stock: number;
  status: string;
  is_featured: boolean;
  weight?: number;
  support_oem?: boolean;
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
        setError(data.error || "加载产品失败");
        return;
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("网络错误，请检查连接");
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
    if (!confirm("确定要删除此产品吗？")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus === "active" ? "inactive" : "active" }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !isFeatured }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
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
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold text-slate-900">产品管理</h1>
          <p className="text-slate-500 mt-1">管理所有产品信息</p>
        </div>
        <Link
          href="/admin/products/import"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 w-fit"
        >
          <Plus className="w-4 h-4" />
          采集产品
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
              placeholder="搜索产品名称..."
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
            <option value="all">全部分类</option>
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
            <option value="all">全部状态</option>
            <option value="active">上架</option>
            <option value="inactive">下架</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm font-medium text-orange-800">
            已选择 {selectedIds.size} 个产品
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={batchAction}
              onChange={(e) => setBatchAction(e.target.value)}
              className="px-3 py-1.5 border border-orange-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">选择操作...</option>
              <option value="activate">批量上架</option>
              <option value="deactivate">批量下架</option>
            </select>
            <button
              onClick={handleBatchAction}
              disabled={!batchAction}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              执行
            </button>
            <button
              onClick={() => {
                setSelectedIds(new Set());
                setBatchAction("");
              }}
              className="px-3 py-1.5 text-orange-700 text-sm hover:underline"
            >
              取消选择
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
                ? "没有找到匹配的产品"
                : "暂无产品"}
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
                    产品
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    价格
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    MOQ
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    重量
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    OEM
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    推荐
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    状态
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                    操作
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
                            <span className="text-xs text-slate-400">无图</span>
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
                      {product.moq || 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">
                      {product.weight ? `${product.weight}kg` : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.support_oem ? (
                        <span className="text-green-600 text-xs font-medium">支持</span>
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
                        {product.is_featured ? "推荐" : "普通"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(product.id, product.status)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          product.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.status === "active" ? (
                          <>
                            <ArrowUp className="w-3 h-3" />
                            上架
                          </>
                        ) : (
                          <>
                            <ArrowDown className="w-3 h-3" />
                            下架
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          title="删除"
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
    </div>
  );
}
