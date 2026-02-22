import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

const validLocales = ['en', 'es'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  if (!hasLocale(validLocales, requested)) {
    notFound();
  }

  return {
    locale: requested,
    messages: (await import(`./messages/${requested}.json`)).default,
  };
});
