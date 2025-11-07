import { getPost } from '@/lib/getPost';
import { setRequestLocale } from 'next-intl/server';
import BlogPostContent from '@/components/BlogPostContent';
import ClientProvider from '@/components/ClientProvider';

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }) {
  const params = await props.params;

  const { locale, slug } = params;

  setRequestLocale(locale);
  const post = await getPost(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const baseUrl = 'https://craigraphics.com';
  const url = locale === 'en' ? `${baseUrl}/blog/${slug}` : `${baseUrl}/${locale}/blog/${slug}`;
  const imageUrl = post.image ? `${baseUrl}${post.image}` : `${baseUrl}/images/profile.png`;

  // Create excerpt from content if not available
  const excerpt =
    post.excerpt || (post.content ? post.content.substring(0, 160).replace(/[#*`]/g, '').trim() + '...' : 'Blog post by William Craig');

  return {
    title: post.title,
    description: excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: excerpt,
      url: url,
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      alternateLocale: locale === 'en' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/blog/${slug}`,
        es: `${baseUrl}/es/blog/${slug}`,
        'x-default': `${baseUrl}/blog/${slug}`,
      },
    },
    keywords: post.tags || [],
  };
}

export default async function BlogPostPage(props: { params: Promise<{ locale: string; slug: string }> }) {
  const params = await props.params;

  const { locale, slug } = params;

  setRequestLocale(locale);
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
