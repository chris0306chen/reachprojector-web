import type { Metadata } from 'next';
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
      <section className="bg-slate-900 py-16 lg:py-20">
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

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <a href="mailto:info@reachtronics.com" className="flex items-start gap-3 text-slate-600 hover:text-orange-500 transition-colors">
                    <Mail className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('email')}</p>
                      <p className="text-sm">info@reachtronics.com</p>
                    </div>
                  </a>
                  <a href="tel:+8613655920080" className="flex items-start gap-3 text-slate-600 hover:text-orange-500 transition-colors">
                    <Phone className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('phone')}</p>
                      <p className="text-sm">+86-13655920080</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/8613655920080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-slate-600 hover:text-orange-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">WhatsApp</p>
                      <p className="text-sm">+86-13655920080</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('address')}</p>
                      <p className="text-sm">{t('addressValue')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('businessHours')}</p>
                      <p className="text-sm">{t('businessHoursValue')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp CTA */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('chatOnWhatsapp')}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-50 rounded-xl p-6 lg:p-8 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t('formTitle')}</h2>
                <p className="text-sm text-slate-500 mb-6">
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
