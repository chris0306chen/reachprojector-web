'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, ArrowRight, Check, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import type { Product } from '@/storage/database/shared/schema';
import { ProductCard } from '@/components/product-card';
import { PayPalCheckout } from '@/components/paypal-checkout';
import { useRouter } from 'next/navigation';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [quantity, setQuantity] = useState(1);
  const [showPayPal, setShowPayPal] = useState(false);
  const images = product.images && product.images.length > 0 ? product.images : ['/images/placeholder-product.jpg'];
  const price = parseFloat(product.price);
  const specs = product.specifications || {};
  const features = product.features || [];

  const whatsappMessage = encodeURIComponent(
    `Hi, I am interested in ${product.name} (${product.brand}). Could you please provide more details and pricing?`
  );

  const handlePayPalSuccess = () => {
    setTimeout(() => {
      router.push('/order-success?product=' + encodeURIComponent(product.name));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
            <img
              src={images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === currentImage ? 'border-orange-500' : 'border-slate-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm font-medium text-orange-500 uppercase tracking-wider mb-2">
            {product.brand}
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-slate-400 line-through">
                ${parseFloat(product.compare_at_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock_status === 'in_stock' ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">In Stock - Ready to Ship</span>
              </>
            ) : (
              <span className="text-sm font-medium text-red-500">Out of Stock</span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-slate-600 mb-6 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-500 ml-2">
                Total: <span className="font-semibold text-slate-900">${(price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href={`/checkout?productId=${product.id}&productName=${encodeURIComponent(product.name)}&price=${price}&quantity=${quantity}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all hover:scale-[1.02] shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              Checkout Now
            </Link>
            <a
              href={`https://wa.me/8613800138000?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Inquiry
            </a>
            <Link
              href={`/contact?product=${product.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-medium rounded-lg transition-colors"
            >
              Send Inquiry
            </Link>
          </div>

          {/* PayPal Checkout */}
          {product.stock_status === 'in_stock' && (
            <div className="border-t border-slate-200 pt-6">
              {!showPayPal ? (
                <button
                  onClick={() => setShowPayPal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-medium rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.079-.026.175-.041.254-.93 4.783-4.13 6.515-8.227 6.515H9.668l-1.12 7.106h-.51a.641.641 0 0 0 .633.74h3.586c.457 0 .85-.334.922-.788l.038-.207.732-4.644.047-.256a.932.932 0 0 1 .922-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.773-4.445z"/>
                  </svg>
                  Buy Now with PayPal
                </button>
              ) : (
                <PayPalCheckout
                  productId={product.id}
                  productName={product.name}
                  price={price}
                  quantity={quantity}
                  currency="USD"
                  onSuccess={handlePayPalSuccess}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Description / Specs */}
      <div className="border-t border-slate-200 pt-8 mb-16">
        <div className="flex gap-6 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'description'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'specs'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Specifications
          </button>
        </div>

        {activeTab === 'description' && product.description && (
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === 'specs' && Object.keys(specs).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">{key}</span>
                <span className="text-sm font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
