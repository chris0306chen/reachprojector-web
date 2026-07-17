import Link from 'next/link';
import { ArrowRight, Truck, Shield, DollarSign, Headphones, Award, Globe, Monitor, Tv, Printer, Cpu } from 'lucide-react';
import { getProducts } from '@/lib/data-service';
import { ProductCard } from '@/components/product-card';
import RealWorldApplications from '@/components/real-world-applications';
import ShippingDelivery from '@/components/shipping-delivery';
import { getTranslations } from 'next-intl/server';
import { generateWebSiteSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('home');

  const [bestsellers, newArrivals] = await Promise.all([
    getProducts({ isBestseller: true, pageSize: 8 }),
    getProducts({ isNewArrival: true, pageSize: 4 }),
  ]);

  const brands = ['XGIMI', 'Hisense', 'JMGO', 'AWOL Vision', 'Formovie', 'HP', 'Canon', 'Brother', 'Epson', 'Intel', 'AMD', 'Samsung'];

  const categories = [
    {
      icon: Monitor,
      titleKey: 'categories.projectors',
      descKey: 'categories.projectorsDesc',
      href: '/products?category=projectors&sub=4k-laser',
      image: '/images/categories/4k-laser-projector.jpg',
    },
    {
      icon: Tv,
      titleKey: 'categories.ustLaser',
      descKey: 'categories.ustLaserDesc',
      href: '/products?category=projectors&sub=ust',
      image: '/images/categories/ust-laser-tv.jpg',
    },
    {
      icon: Printer,
      titleKey: 'categories.printers',
      descKey: 'categories.printersDesc',
      href: '/products?category=printers',
      image: '/images/categories/printer-scanner.jpg',
    },
    {
      icon: Cpu,
      titleKey: 'categories.components',
      descKey: 'categories.componentsDesc',
      href: '/products?category=components',
      image: '/images/categories/components.jpg',
    },
  ];

  const whyChooseUs = [
    { icon: Award, titleKey: 'whyChoose.authorizedDealer', descKey: 'whyChoose.authorizedDealerDesc' },
    { icon: DollarSign, titleKey: 'whyChoose.competitivePricing', descKey: 'whyChoose.competitivePricingDesc' },
    { icon: Truck, titleKey: 'whyChoose.globalShipping', descKey: 'whyChoose.globalShippingDesc' },
    { icon: Shield, titleKey: 'whyChoose.qualityGuarantee', descKey: 'whyChoose.qualityGuaranteeDesc' },
    { icon: Headphones, titleKey: 'whyChoose.expertSupport', descKey: 'whyChoose.expertSupportDesc' },
    { icon: Globe, titleKey: 'whyChoose.worldwideService', descKey: 'whyChoose.worldwideServiceDesc' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }} />
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-screen overflow-hidden flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero/hero-bg.jpg)' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-3xl">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
              {t('hero.subtitle')}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
              {t('hero.title1')}<br />
              <span className="text-orange-400">{t('hero.title2')}</span> {t('hero.title3')}
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl mb-8 leading-relaxed drop-shadow-md">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all hover:scale-105 shadow-lg"
              >
                {t('hero.browseProducts')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/30 backdrop-blur-sm transition-all hover:scale-105"
              >
                {t('hero.wholesaleInquiry')}
              </Link>
            </div>
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-md">500+</p>
                <p className="text-xs text-slate-300">{t('hero.stats.products')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-md">50+</p>
                <p className="text-xs text-slate-300">{t('hero.stats.countries')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-md">12+</p>
                <p className="text-xs text-slate-300">{t('hero.stats.topBrands')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Cards */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              {t('categories.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('categories.description')}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.titleKey}
                href={cat.href}
                className="group relative h-[200px] sm:h-[280px] lg:h-[350px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:via-black/50 transition-all duration-300" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-4 lg:p-5">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/10">
                    <cat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className="text-sm lg:text-lg font-bold text-white mb-1 drop-shadow-md">
                    {t(cat.titleKey)}
                  </h3>
                  <p className="text-xs lg:text-sm text-white/80 mb-2 lg:mb-3 leading-relaxed line-clamp-2">
                    {t(cat.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                    {t('viewProducts')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
                {t('bestsellers.title')}
              </h2>
              <p className="text-slate-500">{t('bestsellers.description')}</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
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
              {t('viewAllProducts')} <ArrowRight className="w-4 h-4" />
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
                  {t('newArrivals.title')}
                </h2>
                <p className="text-slate-500">{t('newArrivals.description')}</p>
              </div>
              <Link
                href="/products?sort=newest"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
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

      {/* Real-World Applications - Case Studies */}
      <RealWorldApplications />

      {/* Shipping & Delivery */}
      <ShippingDelivery />

      {/* B2B Wholesale CTA */}
      <section className="py-16 lg:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {t('b2b.title')}
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            {t('b2b.description')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('b2b.contactUs')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Brand Wall */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              {t('brands.title')}
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
              {t('whyChoose.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We are committed to providing the best products and service for our customers worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.titleKey} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
