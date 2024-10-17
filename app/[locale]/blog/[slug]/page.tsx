import { getPost } from '@/lib/getPost';
import { unstable_setRequestLocale } from 'next-intl/server';
import BlogPostContent from '@/components/BlogPostContent';
import ClientProvider from '@/components/ClientProvider';

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return {
    title: `${slug} Blog Page - William Craig`,
    description: 'Welcome to the Blog Page of William Craig - craigraphics',
  };
}

export default async function BlogPostPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  unstable_setRequestLocale(locale);
  const post = await getPost(slug, locale);
  if (!post) {
    return <div>Post not found</div>;
  }
  return (
    <ClientProvider>
      <BlogPostContent post={post} />
    </ClientProvider>
  );
}
