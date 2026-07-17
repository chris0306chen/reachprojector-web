import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: async () => {
      try {
        return (await import(`../../messages/${locale}.json`)).default;
      } catch {
        return (await import(`../../messages/${defaultLocale}.json`)).default;
      }
    },
  };
});
