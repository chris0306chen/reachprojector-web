import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locale || (await requestLocale) || defaultLocale;
  return {
    locale: resolvedLocale,
    messages: async () => {
      try {
        return (await import(`../../messages/${resolvedLocale}.json`)).default;
      } catch {
        return (await import(`../../messages/${defaultLocale}.json`)).default;
      }
    },
  };
});
