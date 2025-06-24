import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'es'] as const;

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|sitemap|robots|.*\\..*).*)'],
};
