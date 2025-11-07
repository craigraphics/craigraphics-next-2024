import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'es'] as const;

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  // Exclude API routes, Next.js internals, static files, and service workers
  // The pattern excludes any path that contains a dot (file extensions)
  matcher: [
    '/((?!api|_next|_vercel|sitemap|robots|.*\\..*).*)',
  ],
};
