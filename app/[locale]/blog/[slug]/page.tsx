import { getPost } from '@/lib/getPost';
import { unstable_setRequestLocale } from 'next-intl/server';
import BlogPostContent from '@/components/BlogPostContent';

export default async function BlogPostPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  unstable_setRequestLocale(locale);
  const post = await getPost(slug, locale);
  if (!post) {
    return <div>Post not found</div>;
  }
  return <BlogPostContent post={post} />;
}
