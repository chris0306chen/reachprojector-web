import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Monitor,
  Package,
  RectangleVertical,
  Settings,
  Sparkles,
  Tv,
  Wrench,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/product-card';
import RealWorldApplications from '@/components/real-world-applications';
import ShippingDelivery from '@/components/shipping-delivery';
import { getProducts } from '@/lib/data-service';
import { generateWebSiteSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('home');
  const bestsellers = await getProducts({ pageSize: 8 });

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
    },
    {
      titleKey: 'solutions.retail.title',
      descKey: 'solutions.retail.desc',
      oemKey: 'solutions.retail.oem',
      image: '/images/scenarios/retail-oem.jpg',
    },
    {
      titleKey: 'solutions.events.title',
      descKey: 'solutions.events.desc',
      oemKey: 'solutions.events.oem',
      image: '/images/scenarios/events.jpg',
    },
    {
      titleKey: 'solutions.education.title',
      descKey: 'solutions.education.desc',
      oemKey: 'solutions.education.oem',
      image: '/images/scenarios/education.jpg',
    },
  ];

  const partnerReasons = [
    { icon: Settings, titleKey: 'whyPartner.cards.0.title', descKey: 'whyPartner.cards.0.desc' },
    { icon: Package, titleKey: 'whyPartner.cards.1.title', descKey: 'whyPartner.cards.1.desc' },
    { icon: Sparkles, titleKey: 'whyPartner.cards.2.title', descKey: 'whyPartner.cards.2.desc' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
      />

      {/*
        THESIS: A global projector showroom with a clear retail and business split, refusing the generic centered electronics hero.
        OWN-WORLD: Deep slate viewing-room surfaces, warm projection orange, precise lines, and quiet white product plinths.
        STORY: Choose a route, see real product categories and applications, then shop or start a qualified business conversation.
        FIRST VIEWPORT: Left-aligned value proposition and actions sit beside a full-height projection-room image with a compact route rail.
        FORM: Established-world refinement; asymmetric showroom composition with restrained motion.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
      */}
      <main className="reach-home bg-white text-slate-950">
        <section className="relative isolate min-h-[calc(100dvh-5rem)] overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 lg:left-[46%]">
            <Image
              src="/images/hero/hero-bg.jpg"
              alt="Projector prepared for a business presentation in a conference room"
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover object-[58%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/90 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/20 lg:to-transparent" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(249,115,22,0.12),transparent_34%)]" />

          <div className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-end gap-12 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.65fr)] lg:items-center lg:px-8 lg:py-16">
            <div className="max-w-3xl">
              <h1 className="max-w-[14ch] text-balance text-4xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-7xl">
                {t('hero.title1')} {t('hero.title2')} {t('hero.title3')}
              </h1>
              <p className="mt-6 max-w-[58ch] text-base leading-7 text-slate-200 sm:text-lg">
                {t('hero.description')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-[0_16px_36px_rgba(249,115,22,0.24)] transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 active:translate-y-px"
                >
                  {t('hero.browseProducts')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/45 bg-slate-950/70 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px"
                >
                  {t('hero.getOemQuote')}
                </Link>
              </div>
            </div>

            <div className="grid gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.28)] lg:self-end">
              <Link
                href="/products"
                className="group flex items-center justify-between bg-slate-950/85 px-5 py-4 transition hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-orange-400"
              >
                <span>
                  <span className="block text-sm font-semibold">{t('hero.browseProducts')}</span>
                  <span className="mt-1 block text-xs text-slate-300">{t('categories.description')}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-orange-400 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="group flex items-center justify-between bg-slate-950/85 px-5 py-4 transition hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-orange-400"
              >
                <span>
                  <span className="block text-sm font-semibold">{t('b2b.cta')}</span>
                  <span className="mt-1 block text-xs text-slate-300">{t('b2b.description')}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-orange-400 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                {t('categories.title')}
              </h2>
              <p className="mt-4 max-w-[65ch] text-base leading-7 text-slate-600">
                {t('categories.description')}
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
              {categories.map((category, index) => (
                <Link
                  key={category.titleKey}
                  href={category.href}
                  className={`group relative isolate min-h-[22rem] overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${
                    index === 0 || index === 3 ? 'lg:col-span-7' : 'lg:col-span-5'
                  }`}
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                  <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-6 sm:p-8">
                    <category.icon className="mb-5 h-6 w-6 text-orange-400" aria-hidden="true" />
                    <h3 className="text-2xl font-semibold tracking-tight text-white">{t(category.titleKey)}</h3>
                    <p className="mt-2 max-w-[48ch] text-sm leading-6 text-slate-200">{t(category.descKey)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                      {t('viewProducts')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                  {t('bestsellers.title')}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{t('bestsellers.description')}</p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 underline decoration-orange-200 underline-offset-8 transition hover:decoration-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
              >
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {bestsellers.products.length > 0 ? (
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {bestsellers.products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-xl bg-slate-50 px-6 py-12 text-center text-sm text-slate-600">
                {t('categories.description')}
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] sm:text-4xl">
                  {t('solutions.title')}
                </h2>
                <p className="mt-4 max-w-[54ch] text-base leading-7 text-slate-300">
                  {t('solutions.description')}
                </p>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 active:translate-y-px"
                >
                  {t('b2b.cta')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {solutions.map((solution, index) => (
                  <Link
                    key={solution.titleKey}
                    href="/products"
                    className={`group relative isolate overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 ${
                      index === 0 ? 'min-h-[25rem] sm:row-span-2' : 'min-h-[12rem]'
                    }`}
                  >
                    <Image
                      src={solution.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-5">
                      <h3 className="text-lg font-semibold text-white">{t(solution.titleKey)}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-200">{t(solution.descKey)}</p>
                      <span className="mt-3 text-xs font-semibold text-orange-300">{t(solution.oemKey)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                {t('contentStudio.title')}
              </h2>
              <p className="mt-5 max-w-[65ch] text-base leading-7 text-slate-600">
                {t('contentStudio.desc')}
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 active:translate-y-px"
              >
                {t('contentStudio.cta')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="relative min-h-[28rem] sm:min-h-[34rem]">
              <div className="absolute left-0 top-0 h-[72%] w-[78%] overflow-hidden rounded-xl shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                <Image
                  src="/images/scenarios/hospitality.jpg"
                  alt="Hospitality room with a large projection screen"
                  fill
                  sizes="(min-width: 1024px) 42vw, 78vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 h-[62%] w-[68%] overflow-hidden rounded-xl border-[6px] border-slate-50 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                <Image
                  src="/images/scenarios/education.jpg"
                  alt="Projection equipment used in an education setting"
                  fill
                  sizes="(min-width: 1024px) 36vw, 68vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <h2 className="max-w-[14ch] text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                {t('whyPartner.title')}
              </h2>
              <div className="border-t border-slate-300">
                {partnerReasons.map((reason) => (
                  <div
                    key={reason.titleKey}
                    className="grid gap-4 border-b border-slate-200 py-7 sm:grid-cols-[3rem_0.65fr_1.35fr] sm:items-start"
                  >
                    <reason.icon className="h-6 w-6 text-orange-500" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-slate-950">{t(reason.titleKey)}</h3>
                    <p className="text-sm leading-6 text-slate-600">{t(reason.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <RealWorldApplications />
        <ShippingDelivery />

        <section className="bg-orange-500 py-16 text-orange-950 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-[-0.025em] sm:text-4xl">{t('b2b.title')}</h2>
              <p className="mt-4 max-w-[65ch] text-base leading-7 text-orange-950/85">{t('b2b.description')}</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-7 py-3 font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950 active:translate-y-px"
            >
              {t('b2b.cta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
