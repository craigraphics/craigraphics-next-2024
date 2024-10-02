import { getPost } from '@/lib/getPost';
import BlogPostContent from '@/components/BlogPostContent';

export default async function BlogPostPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  const post = await getPost(slug, locale);
  if (!post) {
    return <div>Post not found</div>;
  }
  return <BlogPostContent post={post} />;
}
