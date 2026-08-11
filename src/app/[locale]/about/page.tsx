import { Shield, Truck, DollarSign, Globe, Award, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations('about');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(234,88,12,.18),transparent_68%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              {t('subtitle')}
            </p>
            <h1 className="mb-6 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">REACH PROJECTOR</p>
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                {t('story.title')}
              </h2>
              <div className="space-y-5 text-base leading-8 text-slate-600">
                <p>
                  {t('story.paragraph1')}
                </p>
                <p>
                  {t('story.paragraph2')}
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-[#f7f7f5] p-7 sm:p-10">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white p-8 shadow-sm">
                <img src="/images/logo.png" alt="REACH PROJECTOR" className="h-full w-full object-contain" />
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-600">{t('description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-[#f7f7f5] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
              {t('whyChoose.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {t('whyChoose.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: t('whyChoose.authenticProducts'),
                desc: t('whyChoose.authenticProductsDesc'),
              },
              {
                icon: Truck,
                title: t('whyChoose.globalLogistics'),
                desc: t('whyChoose.globalLogisticsDesc'),
              },
              {
                icon: DollarSign,
                title: t('whyChoose.competitivePricing'),
                desc: t('whyChoose.competitivePricingDesc'),
              },
              {
                icon: Shield,
                title: t('whyChoose.expertTeam'),
                desc: t('whyChoose.expertTeamDesc'),
              },
              {
                icon: Globe,
                title: t('whyChoose.globalReach'),
                desc: t('whyChoose.globalReachDesc'),
              },
              {
                icon: Users,
                title: t('whyChoose.dedicatedSupport'),
                desc: t('whyChoose.dedicatedSupportDesc'),
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                  <item.icon className="h-5 w-5 text-orange-700" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            {t('cta.description')}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            {t('cta.contactUs')}
          </a>
        </div>
      </section>
    </>
  );
}
