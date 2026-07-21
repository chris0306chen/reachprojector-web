import Link from 'next/link';
import { ArrowRight, Settings, Package, Sparkles, Monitor, Tv, Wrench, RectangleVertical } from 'lucide-react';
import { getProducts } from '@/lib/data-service';
import { ProductCard } from '@/components/product-card';
import RealWorldApplications from '@/components/real-world-applications';
import ShippingDelivery from '@/components/shipping-delivery';
import { getTranslations } from 'next-intl/server';
import { generateWebSiteSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('home');

  const [bestsellers] = await Promise.all([
    getProducts({ pageSize: 8 }),
  ]);

  const categories = [
    {
      icon: Monitor,
      titleKey: 'categories.projectors',
      descKey: 'categories.projectorsDesc',
      href: '/products?category=4k-laser-projectors',
      image: '/images/categories/4k-laser-projector.jpg',
    },
    {
      icon: Tv,
      titleKey: 'categories.ustLaser',
      descKey: 'categories.ustLaserDesc',
      href: '/products?category=ust-laser-tv',
      image: '/images/categories/ust-laser-tv.jpg',
    },
    {
      icon: Wrench,
      titleKey: 'categories.mounts',
      descKey: 'categories.mountsDesc',
      href: '/products?category=projector-mounts',
      image: '/images/categories/projector-mount.jpg',
    },
    {
      icon: RectangleVertical,
      titleKey: 'categories.screens',
      descKey: 'categories.screensDesc',
      href: '/products?category=projection-screens',
      image: '/images/categories/projection-screen.jpg',
    },
  ];

  const solutions = [
    {
      titleKey: 'solutions.hospitality.title',
      descKey: 'solutions.hospitality.desc',
      oemKey: 'solutions.hospitality.oem',
      image: '/images/scenarios/hospitality.jpg',
      href: '/products',
    },
    {
      titleKey: 'solutions.retail.title',
      descKey: 'solutions.retail.desc',
      oemKey: 'solutions.retail.oem',
      image: '/images/scenarios/retail-oem.jpg',
      href: '/products',
    },
    {
      titleKey: 'solutions.events.title',
      descKey: 'solutions.events.desc',
      oemKey: 'solutions.events.oem',
      image: '/images/scenarios/events.jpg',
      href: '/products',
    },
    {
      titleKey: 'solutions.education.title',
      descKey: 'solutions.education.desc',
      oemKey: 'solutions.education.oem',
      image: '/images/scenarios/education.jpg',
      href: '/products',
    },
  ];

  const whyPartnerCards = [
    {
      icon: Settings,
      titleKey: 'whyPartner.cards.0.title',
      descKey: 'whyPartner.cards.0.desc',
    },
    {
      icon: Package,
      titleKey: 'whyPartner.cards.1.title',
      descKey: 'whyPartner.cards.1.desc',
    },
    {
      icon: Sparkles,
      titleKey: 'whyPartner.cards.2.title',
      descKey: 'whyPartner.cards.2.desc',
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }} />
      {/* ── 1. Hero Section ── */}
      <section className="relative min-h-[600px] lg:min-h-screen overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />

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
                {t('hero.getOemQuote')}
              </Link>
            </div>
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-md">50+</p>
                <p className="text-xs text-slate-300">{t('hero.stats.countries')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-md">100+</p>
                <p className="text-xs text-slate-300">{t('hero.stats.oemProjects')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white drop-shadow-md">4</p>
                <p className="text-xs text-slate-300">{t('hero.stats.coreScenarios')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Tailored Solutions ── */}
      <section id="solutions" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              {t('solutions.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('solutions.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {solutions.map((sol) => (
              <Link
                key={sol.titleKey}
                href={sol.href}
                className="group relative h-[350px] lg:h-[400px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${sol.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:via-black/50 transition-all duration-300" />
                <div className="relative z-10 h-full flex flex-col justify-end p-5 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2 drop-shadow-md">
                    {t(sol.titleKey)}
                  </h3>
                  <p className="text-sm text-white/80 mb-3 leading-relaxed line-clamp-3">
                    {t(sol.descKey)}
                  </p>
                  <span className="inline-block text-xs font-medium text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-full mb-3">
                    {t(sol.oemKey)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white group-hover:text-orange-300 transition-colors">
                    {t('viewProducts')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Why Partner With Us ── */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              {t('whyPartner.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPartnerCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{t(card.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(card.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Content Studio / Launch Kit ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                {t('contentStudio.title')}
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                {t('contentStudio.desc')}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all hover:scale-105 shadow-lg"
              >
                {t('contentStudio.cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-[350px] lg:h-[400px]">
              <div
                className="absolute top-0 right-0 w-[70%] h-[85%] rounded-xl bg-cover bg-center shadow-xl"
                style={{ backgroundImage: 'url(/images/scenarios/hospitality.jpg)' }}
              />
              <div
                className="absolute bottom-0 left-0 w-[70%] h-[85%] rounded-xl bg-cover bg-center shadow-xl border-4 border-white"
                style={{ backgroundImage: 'url(/images/scenarios/education.jpg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Category Navigation Cards ── */}
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
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:via-black/50 transition-all duration-300" />
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

      {/* ── 6. Best Sellers ── */}
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

      {/* ── 7. Inspiration for Your Space ── */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              {t('inspiration.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('inspiration.desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/products?category=4k-laser-projectors"
              className="group relative h-[300px] lg:h-[350px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: 'url(/images/scenarios/hospitality.jpg)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                  {t('inspiration.bedroom')}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                  {t('inspiration.shopScene')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            <Link
              href="/products"
              className="group relative h-[300px] lg:h-[350px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                  {t('inspiration.camping')}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                  {t('inspiration.shopScene')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Real-World Applications ── */}
      <RealWorldApplications />

      {/* ── 9. Shipping & Delivery ── */}
      <ShippingDelivery />

      {/* ── 10. B2B CTA ── */}
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
            {t('b2b.cta')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
