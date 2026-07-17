import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locale || (await requestLocale) || defaultLocale;
  
  let messages;
  try {
    messages = (await import(`../../messages/${resolvedLocale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/${defaultLocale}.json`)).default;
  }
  
  return {
    locale: resolvedLocale,
    messages,
  };
});
