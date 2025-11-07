import { use } from 'react';
import { getBlogPosts } from '@/lib/getBlogPosts';
import { setRequestLocale } from 'next-intl/server';
import BlogList from '@/components/BlogList';
import { useTranslations } from 'next-intl';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const { locale } = params;
  setRequestLocale(locale);

  const baseUrl = 'https://craigraphics.com';
  const url = locale === 'en' ? `${baseUrl}/blog` : `${baseUrl}/${locale}/blog`;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const blog = messages.blog;

  return {
    title: 'Blog',
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: url,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/profile.png`,
          width: 200,
          height: 200,
          alt: 'William Craig',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: [`${baseUrl}/images/profile.png`],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/blog`,
        es: `${baseUrl}/es/blog`,
        'x-default': `${baseUrl}/blog`,
      },
    },
  };
}

export default function BlogPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);

  const { locale } = params;

  setRequestLocale(locale);
  const t = useTranslations('blog');
  const posts = getBlogPosts(locale);
  return <BlogList posts={posts} locale={locale} t={t} />;
}
