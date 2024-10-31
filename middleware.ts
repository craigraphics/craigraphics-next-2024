import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'es'] as const;

export default createMiddleware({
  locales,
  defaultLocale: 'en',
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
