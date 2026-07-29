"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
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
  productName: string;
  productSlug: string;
  mainImages: string[];
  onMainImagesChange: (images: string[]) => void;
  onChange: (value: ProductDetailContent) => void;
  onError: (message: string) => void;
}

type ImageSection = "real_photos" | "detail_images" | "logistics_images";
type UploadSection = "main_images" | ImageSection;

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";
const specificationGroupLabels: Record<string, string> = {
  Optical: "光学", Display: "显示", System: "系统", Connectivity: "接口与连接",
  Power: "电源", Dimensions: "尺寸", Package: "包装", Other: "其他",
};
const logisticsTypeLabels: Record<string, string> = {
  "Bulk Stock": "大货库存", Warehouse: "仓库", Packing: "包装", Shipment: "出库发货",
};

const seoSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100)
  || "reach-projector";

const optimizeProductImage = async (
  file: File,
  section: UploadSection
): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const maxWidth = section === "main_images" ? 2048 : section === "detail_images" ? 1600 : 1920;
  const maxHeight = section === "detail_images" ? 12000 : section === "main_images" ? 2048 : 1920;
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("浏览器无法处理该图片");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.84)
  );
  if (!blob) throw new Error("图片转换为 WebP 失败");
  return blob;
};

export function ProductDetailEditor({
  value,
  productName,
  productSlug,
  mainImages,
  onMainImagesChange,
  onChange,
  onError,
}: ProductDetailEditorProps) {
  // Preserve incomplete rows while editing; save-time validation handles cleanup.
  const detail = value || EMPTY_PRODUCT_DETAIL;
  const [specificationSource, setSpecificationSource] = useState("");
  const update = <K extends keyof ProductDetailContent>(key: K, next: ProductDetailContent[K]) =>
    onChange({ ...detail, [key]: next });

  const move = <T,>(items: T[], index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  };

  const uploadImage = async (
    file: File,
    section: UploadSection,
    index: number
  ): Promise<ProductDetailImage | null> => {
    try {
      const sectionName = section === "main_images"
        ? "main"
        : section === "real_photos"
        ? "product-photo"
        : section === "detail_images"
          ? "product-detail"
          : "shipping";
      const position = String(index + 1).padStart(2, "0");
      const storageName = `${seoSlug(productSlug || productName)}-${sectionName}-${position}.webp`;
      const optimized = await optimizeProductImage(file, section);
      const formData = new FormData();
      formData.append("file", new File([optimized], storageName, { type: "image/webp" }));
      formData.append("kind", "product-image");
      formData.append("storageName", storageName);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") {
        onError(result.error || "图片上传失败");
        return null;
      }
      const altSection = section === "main_images"
        ? "product image"
        : section === "real_photos"
        ? "product photo"
        : section === "detail_images"
          ? "product details"
          : "shipping photo";
      return { url: result.url, alt: `${productName.trim()} ${altSection} ${index + 1}` };
    } catch (error) {
      onError(error instanceof Error ? error.message : "图片处理失败");
      return null;
    }
  };

  const addUploadedImages = async (section: ImageSection, files?: FileList | null) => {
    if (!files?.length) return;
    const limit = section === "real_photos" ? 2 : section === "detail_images" ? 20 : 12;
    const available = limit - detail[section].length;
    if (available <= 0) {
      onError("产品实拍图最多只能上传两张");
      return;
    }
    const selected = Array.from(files).slice(0, available);
    const uploaded = (await Promise.all(
      selected.map((file, index) => uploadImage(file, section, detail[section].length + index))
    )).filter(
      (image): image is ProductDetailImage => Boolean(image)
    );
    if (!uploaded.length) return;
    if (section === "logistics_images") {
      update(section, [
        ...detail.logistics_images,
        ...uploaded.map((image) => ({ ...image, type: "Shipment" as const })),
      ]);
    } else {
      update(section, [...detail[section], ...uploaded]);
    }
  };

  const addMainImages = async (files?: FileList | null) => {
    if (!files?.length) return;
    const available = 8 - mainImages.length;
    if (available <= 0) {
      onError("产品主图最多上传八张");
      return;
    }
    const selected = Array.from(files).slice(0, available);
    const uploaded = (await Promise.all(
      selected.map((file, index) => uploadImage(file, "main_images", mainImages.length + index))
    )).filter((image): image is ProductDetailImage => Boolean(image));
    if (uploaded.length) onMainImagesChange([...mainImages, ...uploaded.map((image) => image.url)]);
  };

  const importSpecifications = () => {
    const rows: string[][] = [];
    if (/<(?:table|tr|td|th)\b/i.test(specificationSource)) {
      const document = new DOMParser().parseFromString(specificationSource, "text/html");
      document.querySelectorAll("tr").forEach((row) => {
        const cells = Array.from(row.querySelectorAll("th,td"))
          .map((cell) => cell.textContent?.trim() || "")
          .filter(Boolean);
        if (cells.length >= 2) rows.push(cells);
      });
    } else {
      specificationSource.split(/\r?\n/).forEach((line) => {
        const cells = line.split(/\t|\s*\|\s*|\s*[:：=]\s*/).map((item) => item.trim()).filter(Boolean);
        if (cells.length >= 2) rows.push(cells);
      });
    }
    const groupAliases: Record<string, ProductDetailContent["specifications"][number]["group"]> = {
      optical: "Optical", "光学": "Optical", display: "Display", "显示": "Display",
      system: "System", "系统": "System", connectivity: "Connectivity", "接口": "Connectivity",
      power: "Power", "电源": "Power", dimensions: "Dimensions", "尺寸": "Dimensions",
      package: "Package", "包装": "Package", other: "Other", "其他": "Other",
    };
    const parsed = rows.flatMap((cells) => {
      const possibleGroup = groupAliases[cells[0].toLowerCase()];
      const name = possibleGroup ? cells[1] : cells[0];
      const specificationValue = (possibleGroup ? cells.slice(2) : cells.slice(1)).join(" / ");
      if (!name || !specificationValue || /^(parameter|specification|参数)$/i.test(name)) return [];
      return [{ group: possibleGroup || "Other" as const, name, value: specificationValue }];
    });
    if (!parsed.length) {
      onError("没有识别到参数。请粘贴 HTML 表格，或使用“参数名：参数值”每行一条。");
      return;
    }
    const combined = [...detail.specifications];
    for (const item of parsed) {
      const existing = combined.findIndex((row) => row.name.toLowerCase() === item.name.toLowerCase());
      if (existing >= 0) combined[existing] = item;
      else combined.push(item);
    }
    update("specifications", combined.slice(0, 80));
    setSpecificationSource("");
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
        批量上传图片
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => {
            void addUploadedImages(section, event.target.files);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );

  return (
    <div className="space-y-8 border-t border-slate-200 pt-6">
      <section>
        <h3 className="text-base font-semibold text-slate-900">
          产品主图 <span className="text-red-500">*</span>
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          最多八张；上传时自动生成 SEO 文件名、转换 WebP，并限制在 2048px 内。
        </p>
        {mainImages.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {mainImages.map((url, index) => (
              <div key={`${url}-${index}`} className="relative rounded-xl border border-slate-200 p-2">
                <img src={url} alt="" className="aspect-square w-full rounded-lg bg-slate-100 object-contain" />
                <button
                  type="button"
                  onClick={() => onMainImagesChange(mainImages.filter((_, itemIndex) => itemIndex !== index))}
                  className="absolute right-3 top-3 rounded-full bg-white p-1 text-red-500 shadow"
                  aria-label="删除主图"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 hover:border-orange-400 hover:bg-orange-50/40">
          <ImagePlus className="h-4 w-4" />
          批量上传主图
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(event) => {
              void addMainImages(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </section>

      <div>
        <h3 className="text-base font-semibold text-slate-900">产品详情页模板</h3>
        <p className="mt-1 text-sm text-slate-500">仅填写真实参数并上传真实图片；保存不会自动发布产品。</p>
      </div>

      <section className="space-y-3">
        <div>
          <h4 className="font-medium text-slate-900">1. 产品详细参数</h4>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">粘贴参数表文字或 HTML 代码</label>
          <textarea
            value={specificationSource}
            onChange={(event) => setSpecificationSource(event.target.value)}
            rows={7}
            placeholder={"支持 HTML <table>...</table>，或每行：Brightness: 3300 ISO lumens"}
            className={inputClass}
          />
          <button
            type="button"
            onClick={importSpecifications}
            disabled={!specificationSource.trim()}
            className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white disabled:opacity-40"
          >
            解析并生成参数表
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
