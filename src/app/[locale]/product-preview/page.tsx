import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle, ShoppingCart } from "lucide-react";
import { ProductDetailSections } from "@/components/product-detail-sections";
import type { ProductDetailContent } from "@/lib/product-detail";

export const metadata: Metadata = {
  title: "Product Page Preview | REACH PROJECTOR",
  robots: { index: false, follow: false },
};

const previewDetails: ProductDetailContent = {
  specifications: [
    { group: "Display", name: "Resolution", value: "4K UHD (3840 ? 2160)" },
    { group: "Display", name: "Light Source", value: "RGB Triple Laser" },
    { group: "Display", name: "Brightness", value: "Preview specification" },
    { group: "Optical", name: "Throw Type", value: "Standard throw with optical zoom" },
    { group: "Optical", name: "Projection Size", value: "80?300 inches" },
    { group: "System", name: "Operating System", value: "Regional version to be confirmed" },
    { group: "Dimensions", name: "Product Dimensions", value: "To be confirmed" },
    { group: "Package", name: "Package Dimensions", value: "To be confirmed" },
    { group: "Package", name: "Gross Weight", value: "To be confirmed" },
    { group: "Other", name: "Warranty", value: "Set in the product admin before publishing" },
  ],
  real_photos: [
    { url: "/images/categories/4k-laser-projector.jpg", alt: "XGIMI X50 Ultra Max projector real product front view" },
    { url: "/images/categories/ust-laser-tv.jpg", alt: "XGIMI X50 Ultra Max projector installation view" },
  ],
  detail_images: [
    { url: "/images/cases/case-home-cinema.png", alt: "4K laser projector home cinema product detail" },
    { url: "/images/cases/case-living-room.png", alt: "4K laser projector living room application detail" },
  ],
  logistics_images: [
    { url: "/images/shipping/warehouse-packing.jpg", alt: "Projector warehouse packing for bulk orders", type: "Packing" },
    { url: "/images/shipping/container-loading.jpg", alt: "Projector bulk order shipment loading", type: "Shipment" },
  ],
};

export default async function ProductPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-amber-200 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-900 sm:px-6 lg:px-8">
          Preview only ? illustrative images and unconfirmed specifications will be replaced during product import.
        </div>
      </div>
      <div className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="text-slate-500">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/${locale}/products`} className="text-slate-500">Products</Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">Product Page Preview</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
              <img src="/images/categories/4k-laser-projector.webp" alt="XGIMI X50 Ultra Max 4K RGB laser projector preview" className="h-full w-full object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {["/images/categories/4k-laser-projector.webp", "/images/cases/case-home-cinema.png", "/images/cases/case-living-room.png"].map((image, index) => (
                <div key={image} className={`aspect-square overflow-hidden rounded-lg border-2 ${index === 0 ? "border-orange-500" : "border-slate-200"}`}>
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-orange-500">XGIMI</p>
            <h1 className="mb-4 text-3xl font-bold text-slate-900">XGIMI X50 Ultra Max 4K RGB Laser Projector</h1>
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">Price to be confirmed</span>
            </div>
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-green-600">
              <Check className="h-4 w-4" /> Available for project inquiry
            </div>
            <p className="mb-6 leading-relaxed text-slate-600">
              Premium 4K RGB laser projection for home cinema and professional AV installations. Final regional configuration, price, lead time and warranty will be confirmed before publication.
            </p>
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-900">Key Features</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {["4K UHD imaging", "RGB triple-laser light source", "Optical zoom", "Installation lens shift", "Large-screen projection", "B2B project support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-3.5 w-3.5 shrink-0 text-orange-500" />{feature}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white"><ShoppingCart className="h-4 w-4" /> Checkout Now</span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white"><MessageCircle className="h-4 w-4" /> WhatsApp Inquiry</span>
              <span className="inline-flex items-center rounded-lg border-2 border-slate-300 px-6 py-3 font-medium text-slate-700">Send Inquiry</span>
            </div>
          </div>
        </div>
      </div>

      <ProductDetailSections content={previewDetails} />

      <section className="mx-auto max-w-7xl border-t border-slate-200 px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold text-[#0B1A40]">Product Description</h2>
        <p className="max-w-4xl leading-relaxed text-slate-600">
          This area presents the SEO-optimized product description, application scenarios, installation advantages and purchasing guidance. The final page is generated from your spreadsheet and organized image folders.
        </p>
      </section>
    </div>
  );
}
