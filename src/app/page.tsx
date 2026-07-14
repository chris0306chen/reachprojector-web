import Link from 'next/link';
import { ArrowRight, Truck, Shield, DollarSign, Headphones, Award, Globe } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/data-service';
import { ProductCard } from '@/components/product-card';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [bestsellers, newArrivals, categories] = await Promise.all([
    getProducts({ isBestseller: true, pageSize: 8 }),
    getProducts({ isNewArrival: true, pageSize: 4 }),
    getCategories(),
  ]);

  const brands = ['XGIMI', 'Hisense', 'JMGO', 'AWOL Vision', 'Formovie', 'HP', 'Canon', 'Brother', 'Epson', 'Intel', 'AMD', 'Samsung'];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[96px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Authorized Dealer of Premium Electronics
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
              Premium Projectors &<br />
              <span className="text-orange-400">Electronics</span> Worldwide
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
              Your trusted source for 4K laser projectors, professional printers, and high-performance
              computer components. Competitive pricing, global shipping, and expert support.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-colors"
              >
                Wholesale Inquiry
              </Link>
            </div>
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-slate-400">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-slate-400">Countries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12+</p>
                <p className="text-xs text-slate-400">Top Brands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Explore our wide range of premium electronics from world-leading brands
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative bg-slate-50 hover:bg-slate-900 rounded-xl p-8 transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors mb-4">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 group-hover:text-orange-400 transition-colors">
                    View Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                Best Sellers
              </h2>
              <p className="text-slate-500">Our most popular products chosen by customers worldwide</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-500"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.products.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                  New Arrivals
                </h2>
                <p className="text-slate-500">Latest products added to our catalog</p>
              </div>
              <Link
                href="/products?sort=newest"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* B2B Wholesale CTA */}
      <section className="py-16 lg:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            B2B Wholesale Program
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Get exclusive wholesale pricing, priority shipping, and dedicated account management
            for bulk orders. Serving businesses in 50+ countries.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            Request Wholesale Pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Brand Wall */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              Trusted Brands We Carry
            </h2>
            <p className="text-slate-500">Authorized dealer of the world&apos;s leading electronics brands</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-center h-20 bg-slate-50 rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-600">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              Why Choose REACH PROJECTOR
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We are committed to providing the best products and service for our customers worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Authorized Dealer', desc: 'Official authorized dealer for all brands we carry. 100% genuine products with full manufacturer warranty.' },
              { icon: DollarSign, title: 'Competitive Pricing', desc: 'Direct relationships with manufacturers allow us to offer the most competitive prices in the market.' },
              { icon: Truck, title: 'Global DDP Shipping', desc: 'Door-to-door delivery to 50+ countries. We handle all customs, duties, and logistics for a hassle-free experience.' },
              { icon: Shield, title: 'Quality Guarantee', desc: 'Every product is quality inspected before shipping. Full warranty support and after-sales service.' },
              { icon: Headphones, title: 'Expert Support', desc: 'Our team of product experts is available via WhatsApp, email, and phone to help you make the right choice.' },
              { icon: Globe, title: 'Worldwide Service', desc: 'Serving customers in over 50 countries across Europe, Americas, Southeast Asia, and the Middle East.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
