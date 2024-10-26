import { getPost } from '@/lib/getPost';
import { unstable_setRequestLocale } from 'next-intl/server';
import BlogPostContent from '@/components/BlogPostContent';
import ClientProvider from '@/components/ClientProvider';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  const {
    slug
  } = params;

  return {
    title: `${slug} Blog Page - William Craig`,
    description: 'Welcome to the Blog Page of William Craig - craigraphics',
  };
}

export default async function BlogPostPage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const params = await props.params;

  const {
    locale,
    slug
  } = params;

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
