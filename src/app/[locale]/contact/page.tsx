import { Suspense } from 'react';
import { ContactForm } from './contact-form';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const t = await getTranslations('contact');

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

      <section className="bg-[#f7f7f5] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(260px,.7fr)_minmax(0,1.3fr)] lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8 lg:pt-3">
              <div>
                <h2 className="mb-7 text-2xl font-semibold tracking-tight text-slate-950">{t('getInTouch')}</h2>
                <div className="space-y-3">
                  <a href="mailto:info@reachtronics.com" className="group flex min-h-16 items-start gap-4 rounded-2xl p-3 text-slate-600 transition-colors hover:bg-white hover:text-orange-600">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100"><Mail className="h-4.5 w-4.5 text-orange-700" /></span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('email')}</p>
                      <p className="text-sm">info@reachtronics.com</p>
                    </div>
                  </a>
                  <a href="tel:+8613655920080" className="group flex min-h-16 items-start gap-4 rounded-2xl p-3 text-slate-600 transition-colors hover:bg-white hover:text-orange-600">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100"><Phone className="h-4.5 w-4.5 text-orange-700" /></span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('phone')}</p>
                      <p className="text-sm">+86-13655920080</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/8613655920080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-16 items-start gap-4 rounded-2xl p-3 text-slate-600 transition-colors hover:bg-white hover:text-orange-600"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100"><MessageCircle className="h-4.5 w-4.5 text-emerald-700" /></span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">WhatsApp</p>
                      <p className="text-sm">+86-13655920080</p>
                    </div>
                  </a>
                  <div className="flex min-h-16 items-start gap-4 p-3 text-slate-600">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200"><MapPin className="h-4.5 w-4.5 text-slate-700" /></span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('address')}</p>
                      <p className="text-sm">{t('addressValue')}</p>
                    </div>
                  </div>
                  <div className="flex min-h-16 items-start gap-4 p-3 text-slate-600">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200"><Clock className="h-4.5 w-4.5 text-slate-700" /></span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('businessHours')}</p>
                      <p className="text-sm">{t('businessHoursValue')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp CTA */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <h3 className="text-base font-semibold text-green-900 mb-2">
                  {t('whatsappTitle')}
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  {t('whatsappDescription')}
                </p>
                <a
                  href="https://wa.me/8613655920080?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('chatOnWhatsapp')}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,.5)] sm:p-8 lg:p-10">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{t('formTitle')}</h2>
                <p className="mb-8 max-w-2xl text-sm leading-6 text-slate-500">
                  {t('formDescription')}
                </p>
                <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-10 bg-slate-200 rounded" /><div className="h-10 bg-slate-200 rounded" /><div className="h-32 bg-slate-200 rounded" /><div className="h-12 bg-slate-200 rounded" /></div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
