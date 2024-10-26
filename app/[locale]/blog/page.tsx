import { use } from "react";
import { getBlogPosts } from '@/lib/getBlogPosts';
import { unstable_setRequestLocale } from 'next-intl/server';
import BlogList from '@/components/BlogList';
import { useTranslations } from 'next-intl';

export async function generateMetadata() {
  return {
    title: 'Blog Page - William Craig',
    description: 'Welcome to the Blog Page of William Craig - craigraphics',
  };
}

export default function BlogPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);

  const {
    locale
  } = params;

  unstable_setRequestLocale(locale);
  const t = useTranslations('blog');
  const posts = getBlogPosts(locale);
  return <BlogList posts={posts} locale={locale} t={t} />;
}
