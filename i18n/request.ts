import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const validLocales = ['en', 'es'] as const;
type ValidLocale = (typeof validLocales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate locale to prevent trying to load invalid files
  if (!validLocales.includes(locale as ValidLocale)) {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
