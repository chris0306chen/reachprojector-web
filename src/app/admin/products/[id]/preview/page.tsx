import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { normalizeProductDetail } from "@/lib/product-detail";
import { ProductDetailSections } from "@/components/product-detail-sections";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export const dynamic = "force-dynamic";

export default async function AdminProductPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!hasPermission(user, "products")) redirect("/admin/dashboard");

  const { id } = await params;
  const supabase = await getSupabaseClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !product) notFound();

  const importData =
    product.import_data && typeof product.import_data === "object"
      ? product.import_data as Record<string, unknown>
      : {};
  const mediaBackup =
    importData.admin_media_backup && typeof importData.admin_media_backup === "object"
      ? importData.admin_media_backup as Record<string, unknown>
      : {};
  const images = Array.isArray(product.images)
    ? product.images
    : Array.isArray(mediaBackup.images) ? mediaBackup.images as string[] : [];
  const detailContent = normalizeProductDetail(
    product.detail_content || mediaBackup.detail_content || importData.detail_content
  );
  const features = Array.isArray(product.features) ? product.features.filter(Boolean) : [];

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 border-b border-amber-200 bg-amber-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-semibold text-amber-900">后台草稿预览</p>
            <p className="text-xs text-amber-700">此页面仅供后台检查，不会改变产品上架状态。</p>
          </div>
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <ArrowLeft className="h-4 w-4" />
            返回产品管理
          </Link>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2">
        <div>
          {images[0] ? (
            <>
              <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                <img src={images[0]} alt={product.name} className="h-full w-full object-contain" />
              </div>
              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {images.slice(1, 5).map((image: string, index: number) => (
                    <div key={`${image}-${index}`} className="aspect-square overflow-hidden rounded-lg border border-slate-200">
                      <img src={image} alt={`${product.name} product image ${index + 2}`} className="h-full w-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              尚未上传产品主图
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-orange-500">{product.brand}</p>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {Number(product.price) > 0 ? `$${Number(product.price).toFixed(2)}` : "Price to be confirmed"}
          </p>
          {product.short_description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-600">{product.short_description}</p>
          )}
          {features.length > 0 && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {features.map((feature: string) => (
                <li key={feature} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{feature}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <ProductDetailSections
        content={detailContent}
        legacySpecifications={product.specifications}
        description={product.description}
      />
    </main>
  );
}
