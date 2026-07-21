'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

const brands = ['XGIMI', 'Hisense', 'JMGO', 'Formovie', 'AWOL Vision', 'Elite Screens', 'Screen Innovations'];

export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const footerLinks = {
    products: [
      { href: `/${locale}/products?category=4k-laser-projectors`, label: t('home.categories.projectors') },
      { href: `/${locale}/products?category=ust-laser-tv`, label: t('home.categories.ustLaser') },
      { href: `/${locale}/products?category=projector-mounts`, label: t('home.categories.mounts') },
      { href: `/${locale}/products?category=projection-screens`, label: t('home.categories.screens') },
      { href: `/${locale}/products`, label: t('allProducts') },
    ],
    company: [
      { href: `/${locale}/about`, label: tNav('about') },
      { href: `/${locale}/contact`, label: tNav('contact') },
      { href: `/${locale}/about`, label: t('whyChooseUs') },
      { href: `/${locale}/contact`, label: t('wholesaleInquiry') },
    ],
    support: [
      { href: `/${locale}/contact`, label: t('technicalSupport') },
      { href: `/${locale}/contact`, label: t('warrantyPolicy') },
      { href: `/${locale}/contact`, label: t('shippingInfo') },
      { href: `/${locale}/contact`, label: t('returnsRefunds') },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="RC Logo" className="h-10 w-auto" />
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-extrabold tracking-wide">
                  <span className="text-orange-500">R</span>
                  <span className="text-white">E</span>
                  <span className="text-white">A</span>
                  <span className="text-orange-500">C</span>
                  <span className="text-white">H</span>
                </span>
                <span className="text-xs text-slate-300 tracking-widest">PROJECTOR</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
              {t('description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                <span className="font-medium text-white">Quanzhou Reach Technology Co., Ltd.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                <span className="font-medium text-white">HK REACH SOURCING LIMITED</span>
              </div>
              <a href="mailto:info@reachtronics.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                info@reachtronics.com
              </a>
              <a href="tel:+8613655920080" className="flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +86-13655920080
              </a>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t('addressFujian')}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t('addressHongKong')}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('products')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link, idx) => (
                <li key={`product-${idx}`}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('company')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link, idx) => (
                <li key={`company-${idx}`}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('support')}</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link, idx) => (
                <li key={`support-${idx}`}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brands */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">{t('authorizedDealer')}</p>
          <div className="flex flex-wrap gap-6">
            {brands.map((brand) => (
              <span key={brand} className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            &copy; 2026 HK REACH SOURCING LIMITED. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
