"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

interface ScrapedData {
  title: string;
  titleZh?: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  price?: string;
  brand?: string;
}

export default function ProductImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishForm, setPublishForm] = useState({
    name: "", slug: "", brand: "", category_id: "", price: "",
    description: "", images: [] as string[],
  });

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setScrapedData(null);

    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to start import");
        return;
      }

      // Poll for result
      const taskId = data.taskId;
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 1000));
        const statusRes = await fetch(`/api/admin/products/import/${taskId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "completed") {
          const d = statusData.data as ScrapedData;
          setScrapedData(d);
          setPublishForm({
            name: d.title || "",
            slug: (d.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            brand: d.brand || "",
            category_id: "",
            price: d.price?.replace(/[^0-9.]/g, "") || "",
            description: d.description || "",
            images: d.images || [],
          });
          break;
        }
        if (statusData.status === "failed") {
          setError(statusData.error || "Scraping failed");
          break;
        }
        attempts++;
      }

      if (attempts >= maxAttempts) {
        setError("Import timed out. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!publishForm.name || !publishForm.slug || !publishForm.brand || !publishForm.category_id || !publishForm.price) {
      setError("Please fill in all required fields");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/products/import/temp/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...publishForm,
          price: parseFloat(publishForm.price),
          is_new_arrival: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setScrapedData(null);
        setUrl("");
        setError("");
        alert("Product published successfully! It's saved as a draft.");
      } else {
        setError(data.error || "Failed to publish");
      }
    } catch (err) {
      setError("Failed to publish product");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Import Products</h1>

      {/* URL Input */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-3">Product URL</h2>
        <p className="text-sm text-slate-500 mb-4">Enter a product URL from 1688, AliExpress, Amazon, eBay, or any e-commerce site.</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.example.com/product/..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <button
            onClick={handleScrape}
            disabled={loading || !url}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {loading ? "Scraping..." : "Scrape"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
      </div>

      {/* Scraped Data Preview */}
      {scrapedData && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Scraped Data - Edit & Publish
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div>
              {scrapedData.images.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Images ({scrapedData.images.length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {scrapedData.images.slice(0, 6).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                    ))}
                  </div>
                </div>
              )}
              {scrapedData.description && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Description</p>
                  <p className="text-sm text-slate-600 line-clamp-4">{scrapedData.description}</p>
                </div>
              )}
            </div>

            {/* Edit Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                <input type="text" value={publishForm.name} onChange={(e) => setPublishForm({ ...publishForm, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                <input type="text" value={publishForm.slug} onChange={(e) => setPublishForm({ ...publishForm, slug: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
                  <input type="text" value={publishForm.brand} onChange={(e) => setPublishForm({ ...publishForm, brand: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (USD) *</label>
                  <input type="number" value={publishForm.price} onChange={(e) => setPublishForm({ ...publishForm, price: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category ID *</label>
                <input type="text" value={publishForm.category_id} onChange={(e) => setPublishForm({ ...publishForm, category_id: e.target.value })} placeholder="Paste category UUID" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {publishing ? "Publishing..." : "Publish as Draft"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
