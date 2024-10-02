import { getBlogPosts } from '@/lib/getBlogPosts';
import BlogList from '@/components/BlogList';
import { useTranslations } from 'next-intl';

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('blog');
  const posts = getBlogPosts(locale);
  return <BlogList posts={posts} locale={locale} t={t} />;
}
