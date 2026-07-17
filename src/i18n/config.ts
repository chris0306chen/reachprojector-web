export const locales = ['en', 'zh', 'es', 'ar', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  ar: 'العربية',
  ru: 'Русский',
};

export const rtlLocales: Locale[] = ['ar'];
