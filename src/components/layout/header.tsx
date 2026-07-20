'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, Search, ChevronDown, ShoppingCart, Store, Building2 } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';

type BusinessMode = 'retail' | 'b2b';

interface NavChild {
  href: string;
  label: string;
  description?: string;
}

interface NavLink {
  href?: string;
  label: string;
  sectionLabel?: string;
  children?: NavChild[];
}

export function Header() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [businessMode, setBusinessMode] = useState<BusinessMode>('retail');
  const [cartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setOpenMobileDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks: NavLink[] = [
    {
      label: t('solutions'),
      sectionLabel: 'SOLUTIONS',
      children: [
        {
          href: `/${locale}/products?category=projectors`,
          label: t('oemOdmProjectors'),
        },
        {
          href: `/${locale}/contact`,
          label: t('educationCorporate'),
        },
        {
          href: `/${locale}/contact`,
          label: t('hospitalityLiving'),
        },
        {
          href: `/${locale}/contact`,
          label: t('eventsRentals'),
        },
        {
          href: `/${locale}/contact`,
          label: t('retailChannels'),
        },
      ],
    },
    {
      label: t('shopByScene'),
      children: [
        {
          href: `/${locale}/products?scene=bedroom`,
          label: t('bedroomCinema'),
        },
        {
          href: `/${locale}/products?scene=camping`,
          label: t('backyardCamping'),
        },
        {
          href: `/${locale}/products?scene=portable`,
          label: t('portableScreen'),
        },
      ],
    },
    {
      label: t('resources'),
      children: [
        {
          href: `/${locale}/about`,
          label: t('compatibilityGuide'),
        },
        {
          href: `/${locale}/about`,
          label: t('installationGuides'),
        },
        {
          href: `/${locale}/about`,
          label: t('certificates'),
        },
      ],
    },
    {
      href: `/${locale}/products`,
      label: t('allProducts'),
    },
    {
      href: `/${locale}/contact`,
      label: t('partnerWithUs'),
    },
  ];

  const handleDropdownEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    setOpenDropdown(null);
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <img src="/images/logo.png" alt="RC Logo" className="h-10 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold tracking-wide">
                <span className="text-orange-500">R</span>
                <span className="text-slate-800">E</span>
                <span className="text-slate-800">A</span>
                <span className="text-orange-500">C</span>
                <span className="text-slate-800">H</span>
              </span>
              <span className="text-xs text-slate-500 tracking-widest">PROJECTOR</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(link.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-3 min-w-[260px]">
                        {/* Section label for Solutions dropdown */}
                        {link.sectionLabel && (
                          <div className="px-5 pb-2 mb-1 border-b border-slate-100">
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                              {link.sectionLabel}
                            </span>
                          </div>
                        )}
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-5 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href!}
                  className="text-sm font-medium text-slate-700 hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Retail/B2B Toggle - Desktop */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setBusinessMode('retail')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  businessMode === 'retail'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                {t('retail')}
              </button>
              <button
                onClick={() => setBusinessMode('b2b')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  businessMode === 'b2b'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {t('b2b')}
              </button>
            </div>

            {/* Search */}
            <Link
              href={`/${locale}/products`}
              className="hidden sm:flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              aria-label={t('search')}
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Shopping Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              aria-label={t('cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-orange-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* CTA Button */}
            <Link
              href={businessMode === 'b2b' ? `/${locale}/contact` : `/${locale}/products`}
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              {businessMode === 'b2b' ? t('getQuote') : t('shopNow')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {/* Mobile Language Switcher */}
            <div className="mb-4 pb-4 border-b border-slate-200">
              <LanguageSwitcher />
            </div>

            {/* Mobile Retail/B2B Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setBusinessMode('retail')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  businessMode === 'retail'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Store className="w-4 h-4" />
                {t('retail')}
              </button>
              <button
                onClick={() => setBusinessMode('b2b')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  businessMode === 'b2b'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {t('b2b')}
              </button>
            </div>

            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full py-2.5 text-base font-medium text-slate-700 hover:text-orange-500"
                      onClick={() => toggleMobileDropdown(link.label)}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openMobileDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openMobileDropdown === link.label && (
                      <div className="pl-4 space-y-0.5">
                        {link.sectionLabel && (
                          <div className="py-1.5 px-2">
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                              {link.sectionLabel}
                            </span>
                          </div>
                        )}
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block py-2 pl-2 text-sm text-slate-500 hover:text-orange-500 border-l-2 border-slate-200 hover:border-orange-500 ml-1"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    className="block py-2.5 text-base font-medium text-slate-700 hover:text-orange-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <Link
                href={`/${locale}/cart`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                {t('cart')} {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link
                href={businessMode === 'b2b' ? `/${locale}/contact` : `/${locale}/products`}
                className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {businessMode === 'b2b' ? t('getQuote') : t('shopNow')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
