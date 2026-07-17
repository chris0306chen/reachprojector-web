import type { Metadata } from 'next';
import { Shield, Truck, DollarSign, Globe, Award, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
              {t('subtitle')}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              {t('title')}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
                {t('story.title')}
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  {t('story.paragraph1')}
                </p>
                <p>
                  {t('story.paragraph2')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: t('stats.products') },
                { value: '50+', label: t('stats.countriesServed') },
                { value: '12+', label: t('stats.brandPartners') },
                { value: '99%', label: t('stats.customerSatisfaction') },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
                  <p className="text-3xl font-bold text-orange-500 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
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

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            {t('cta.description')}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('cta.contactUs')}
          </a>
        </div>
      </section>
    </>
  );
}
