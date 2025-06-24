import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://craigraphics.com';
  const locales = ['en', 'es'];

  // Define your pages
  const pages = [
    { path: '', priority: 1, changeFrequency: 'yearly' as const },
    { path: '/work', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'yearly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add pages for each locale
  pages.forEach(page => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: locale === 'en' ? `${baseUrl}${page.path}` : `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    });
  });

  return sitemapEntries;
}
