'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, defaultLocale } from '@/i18n/config';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || defaultLocale;

  const handleLocaleChange = (locale: string) => {
    // Replace the locale segment in the pathname
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    setIsOpen(false);
    router.push(newPath);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{currentLocale}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 py-2 min-w-[140px]">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentLocale === locale
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="mr-2">{locale === 'ar' ? '🇸🇦' : locale === 'zh' ? '🇨🇳' : locale === 'es' ? '🇪🇸' : locale === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
                {localeNames[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
