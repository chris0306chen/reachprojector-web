"use client";

import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import {
  EMPTY_PRODUCT_DETAIL,
  LOGISTICS_IMAGE_TYPES,
  SPECIFICATION_GROUPS,
  type ProductDetailContent,
  type ProductDetailImage,
  type ProductLogisticsImage,
} from "@/lib/product-detail";

interface ProductDetailEditorProps {
  value: ProductDetailContent | null | undefined;
  onChange: (value: ProductDetailContent) => void;
  onError: (message: string) => void;
}

type ImageSection = "real_photos" | "detail_images" | "logistics_images";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";
const specificationGroupLabels: Record<string, string> = {
  Optical: "光学", Display: "显示", System: "系统", Connectivity: "接口与连接",
  Power: "电源", Dimensions: "尺寸", Package: "包装", Other: "其他",
};
const logisticsTypeLabels: Record<string, string> = {
  "Bulk Stock": "大货库存", Warehouse: "仓库", Packing: "包装", Shipment: "出库发货",
};

export function ProductDetailEditor({ value, onChange, onError }: ProductDetailEditorProps) {
  // Preserve incomplete rows while editing; save-time validation handles cleanup.
  const detail = value || EMPTY_PRODUCT_DETAIL;
  const update = <K extends keyof ProductDetailContent>(key: K, next: ProductDetailContent[K]) =>
    onChange({ ...detail, [key]: next });

  const move = <T,>(items: T[], index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  };

  const uploadImage = async (file: File): Promise<ProductDetailImage | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "product-image");
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const result = await response.json();
    if (!response.ok || typeof result.url !== "string") {
      onError(result.error || "图片上传失败");
      return null;
    }
    return { url: result.url, alt: "" };
  };

  const addUploadedImage = async (section: ImageSection, file?: File) => {
    if (!file) return;
    if (section === "real_photos" && detail.real_photos.length >= 2) {
      onError("产品实拍图最多只能上传两张");
      return;
    }
    const uploaded = await uploadImage(file);
    if (!uploaded) return;
    if (section === "logistics_images") {
      update(section, [...detail.logistics_images, { ...uploaded, type: "Shipment" }]);
    } else {
      update(section, [...detail[section], uploaded]);
    }
  };

  const renderImageRows = (
    section: ImageSection,
    images: Array<ProductDetailImage | ProductLogisticsImage>
  ) => (
    <div className="space-y-3">
      {images.map((image, index) => (
        <div key={`${image.url}-${index}`} className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[112px_1fr_auto]">
          <img src={image.url} alt="" className="h-24 w-28 rounded-lg bg-slate-100 object-cover" />
          <div className="space-y-2">
            <input
              value={image.alt}
              maxLength={180}
              onChange={(event) => {
                const next = [...images];
                next[index] = { ...image, alt: event.target.value };
                update(section, next as never);
              }}
              placeholder="英文图片 Alt 文本（必填，供前台 SEO 使用）"
              className={inputClass}
            />
            {section === "logistics_images" && (
              <select
                value={(image as ProductLogisticsImage).type}
                onChange={(event) => {
                  const next = [...detail.logistics_images];
                  next[index] = { ...next[index], type: event.target.value as ProductLogisticsImage["type"] };
                  update("logistics_images", next);
                }}
                className={inputClass}
              >
                {LOGISTICS_IMAGE_TYPES.map((type) => <option key={type} value={type}>{logisticsTypeLabels[type]}</option>)}
              </select>
            )}
          </div>
          <div className="flex gap-1 sm:flex-col">
            <button type="button" onClick={() => update(section, move(images, index, -1) as never)} disabled={index === 0} className="rounded p-2 hover:bg-slate-100 disabled:opacity-30" aria-label="图片上移">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => update(section, move(images, index, 1) as never)} disabled={index === images.length - 1} className="rounded p-2 hover:bg-slate-100 disabled:opacity-30" aria-label="图片下移">
              <ArrowDown className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => update(section, images.filter((_, itemIndex) => itemIndex !== index) as never)} className="rounded p-2 text-red-500 hover:bg-red-50" aria-label="删除图片">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 hover:border-orange-400 hover:bg-orange-50/40">
        <ImagePlus className="h-4 w-4" />
        上传图片
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => {
            void addUploadedImage(section, event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );

  return (
    <div className="space-y-8 border-t border-slate-200 pt-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">产品详情页模板</h3>
        <p className="mt-1 text-sm text-slate-500">仅填写真实参数并上传真实图片；保存不会自动发布产品。</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-slate-900">1. 产品详细参数</h4>
          <button
            type="button"
            onClick={() => update("specifications", [...detail.specifications, { group: "Optical", name: "", value: "" }])}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
          >
            <Plus className="h-3.5 w-3.5" /> 添加参数
          </button>
        </div>
        {detail.specifications.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[140px_1fr_1fr_auto]">
            <select
              value={item.group}
              onChange={(event) => {
                const next = [...detail.specifications];
                next[index] = { ...item, group: event.target.value as typeof item.group };
                update("specifications", next);
              }}
              className={inputClass}
            >
              {SPECIFICATION_GROUPS.map((group) => <option key={group} value={group}>{specificationGroupLabels[group]}</option>)}
            </select>
            <input
              value={item.name}
              onChange={(event) => {
                const next = [...detail.specifications];
                next[index] = { ...item, name: event.target.value };
                update("specifications", next);
              }}
              placeholder="参数名称（前台显示英文）"
              className={inputClass}
            />
            <input
              value={item.value}
              onChange={(event) => {
                const next = [...detail.specifications];
                next[index] = { ...item, value: event.target.value };
                update("specifications", next);
              }}
              placeholder="参数值"
              className={inputClass}
            />
            <div className="flex">
              <button type="button" onClick={() => update("specifications", move(detail.specifications, index, -1))} disabled={index === 0} className="p-2 disabled:opacity-30" aria-label="参数上移"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => update("specifications", move(detail.specifications, index, 1))} disabled={index === detail.specifications.length - 1} className="p-2 disabled:opacity-30" aria-label="参数下移"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => update("specifications", detail.specifications.filter((_, itemIndex) => itemIndex !== index))} className="p-2 text-red-500" aria-label="删除参数"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h4 className="mb-3 font-medium text-slate-900">2. 产品实拍图（最多两张）</h4>
        {renderImageRows("real_photos", detail.real_photos)}
      </section>

      <section>
        <h4 className="mb-3 font-medium text-slate-900">3. 产品详情长图</h4>
        {renderImageRows("detail_images", detail.detail_images)}
      </section>

      <section>
        <h4 className="mb-3 font-medium text-slate-900">4. 大货、仓库、包装与出库图</h4>
        {renderImageRows("logistics_images", detail.logistics_images)}
      </section>
    </div>
  );
}
