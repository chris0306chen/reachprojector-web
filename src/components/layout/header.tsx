'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, Search, ChevronDown, Store, Building2 } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { productNavigation, sceneNavigation } from '@/lib/catalog-navigation';
import { getLocalizedSceneFamilyTitle } from '@/lib/solutions-copy';

type BusinessMode = 'retail' | 'b2b';

interface NavChild {
  href: string;
  label: string;
  description?: string;
  group?: string;
}

interface NavLink {
  href?: string;
  label: string;
  sectionLabel?: string;
  children?: NavChild[];
}

interface HeaderCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
}

export function Header({ categories = [] }: { categories?: HeaderCategory[] }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [businessMode, setBusinessMode] = useState<BusinessMode>('retail');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const parentCategories = categories.filter((category) => !category.parent_id);
  const projectorParent = parentCategories.find((category) => category.slug === 'projectors')
    || parentCategories.find((category) => category.name.toLowerCase() === 'projectors');
  const databaseProductChildren: NavChild[] = projectorParent ? [
    {
      href: `/${locale}/products?category=${projectorParent.slug}`,
      label: 'All Projectors',
      group: 'Projectors',
    },
    ...categories
      .filter((category) => category.parent_id === projectorParent.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        href: `/${locale}/products?category=${category.slug}`,
        label: category.name,
        group: 'Projectors',
      })),
    ...parentCategories
      .filter((category) => category.id !== projectorParent.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        href: `/${locale}/products?category=${category.slug}`,
        label: category.name,
        group: 'Other Categories',
      })),
  ] : [];
  const fallbackProductChildren: NavChild[] = [
    ...productNavigation[0].children.map(([label, slug]) => ({
      href: `/${locale}/products?category=${slug}`,
      label,
      group: 'Projectors',
    })),
    ...productNavigation.slice(1).map((category) => ({
      href: `/${locale}/products?category=${category.slug}`,
      label: category.label,
      group: 'Other Categories',
    })),
  ];
  const productChildren = databaseProductChildren.length ? databaseProductChildren : fallbackProductChildren;

  const navLinks: NavLink[] = [
    {
      label: t('products'),
      sectionLabel: 'SHOP BY PRODUCT',
      children: productChildren,
    },
    {
      label: t('shopByScene'),
      sectionLabel: 'SOLUTIONS BY APPLICATION',
      children: sceneNavigation.map((group) => ({
        href: `/${locale}/solutions#${group.slug}`,
        label: getLocalizedSceneFamilyTitle(locale, group.slug, group.group),
      })),
    },
    {
      label: t('resources'),
      children: [
        {
          href: `/${locale}/guides`,
          label: t('buyingGuides'),
        },
        {
          href: `/${locale}/solutions`,
          label: t('compatibilityGuide'),
        },
        {
          href: `/${locale}/shipping-policy`,
          label: t('installationGuides'),
        },
        {
          href: `/${locale}/warranty`,
          label: t('certificates'),
        },
      ],
    },
    {
      href: `/${locale}/wholesale`,
      label: t('oemOdmProjectors'),
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

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/${locale}/products?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
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
                      <div className={`bg-white rounded-xl shadow-lg border border-slate-200 py-3 ${
                        link.children.length > 6 ? 'w-[640px]' : 'min-w-[320px]'
                      }`}>
                        {/* Section label for Solutions dropdown */}
                        {link.sectionLabel && (
                          <div className="px-5 pb-2 mb-1 border-b border-slate-100">
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                              {link.sectionLabel}
                            </span>
                          </div>
                        )}
                        {link.children.some((child) => child.group) ? (
                          <div className="grid grid-cols-2 gap-6 px-4 py-2">
                            {['Projectors', 'Other Categories'].map((group) => (
                              <section key={group} aria-labelledby={`products-${group.toLowerCase().replace(' ', '-')}`}>
                                <h3
                                  id={`products-${group.toLowerCase().replace(' ', '-')}`}
                                  className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400"
                                >
                                  {group}
                                </h3>
                                <ul className="space-y-0.5">
                                  {link.children
                                    .filter((child) => child.group === group)
                                    .map((child) => (
                                      <li key={child.label}>
                                        <Link
                                          href={child.href}
                                          className="block rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-orange-600"
                                        >
                                          {child.label}
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                              </section>
                            ))}
                          </div>
                        ) : (
                          <div className={link.children.length > 6 ? 'grid grid-cols-2 gap-x-2 px-2' : ''}>
                            {link.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                              >
                                <span className="block font-medium">{child.label}</span>
                                {child.description && <span className="mt-0.5 block text-xs text-slate-400">{child.description}</span>}
                              </Link>
                            ))}
                          </div>
                        )}
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

            {/* Product search */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsSearchOpen((open) => !open)}
                className="flex items-center gap-2 p-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                aria-label={t('search')}
                aria-expanded={isSearchOpen}
              >
                <Search className="w-4 h-4" />
              </button>
              {isSearchOpen && (
                <form
                  onSubmit={submitSearch}
                  className="absolute right-0 top-full mt-3 flex w-[min(22rem,calc(100vw-2rem))] items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  <Search className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products, brands or models"
                    className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    aria-label={t('search')}
                  />
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Search
                  </button>
                </form>
              )}
            </div>

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

            <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 p-2">
              <Search className="ml-1 h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products, brands or models"
                className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-sm outline-none"
                aria-label={t('search')}
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
              >
                Search
              </button>
            </form>

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
                        {link.children.some((child) => child.group) ? (
                          ['Projectors', 'Other Categories'].map((group) => (
                            <div key={group} className="mb-3">
                              <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">{group}</p>
                              {link.children.filter((child) => child.group === group).map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className="ml-1 block border-l-2 border-slate-200 py-2 pl-2 text-sm text-slate-500 hover:border-orange-500 hover:text-orange-500"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          ))
                        ) : link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block py-2 pl-2 text-sm text-slate-500 hover:text-orange-500 border-l-2 border-slate-200 hover:border-orange-500 ml-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="block">{child.label}</span>
                              {child.description && <span className="block text-xs text-slate-400">{child.description}</span>}
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

            <div className="pt-3 border-t border-slate-200">
              <Link
                href={businessMode === 'b2b' ? `/${locale}/contact` : `/${locale}/products`}
                className="block w-full text-center py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg"
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
