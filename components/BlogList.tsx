import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';

interface BlogListProps {
  posts: BlogPost[];
  locale: string;
  t: (key: string) => string;
}

export default function BlogList({ posts, locale, t }: BlogListProps) {
  if (posts.length === 0) {
    return <p>{t('noPosts')}</p>;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <Layout>
      {featuredPost && (
        <article className="mb-12 grid md:grid-cols-2 gap-8 items-center rounded-md pl-7 border-gray-200 dark:border-gray-800 border-2">
          <header>
            <Link href={`/${locale}/blog/${featuredPost.slug}`}>
              <h1 className="text-4xl text-gray-600 dark:text-gray-300 font-bold mb-4 ">{featuredPost.title}</h1>
            </Link>

            <p className="text-gray-600 dark:text-gray-300 mb-4">{featuredPost.excerpt}</p>
            <Link href={`/${locale}/blog/${featuredPost.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('readMore')}
            </Link>
          </header>
          <figure className="relative h-64 md:h-96">
            <Image
              src={featuredPost.image || '/placeholder-image.jpg'}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-r-md object-cover"
              priority
            />
          </figure>
        </article>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {otherPosts.map(post => (
          <article
            key={post.slug}
            className="border-gray-200 dark:border-gray-800 border-2 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <Link href={`/${locale}/blog/${post.slug}`} className="group">
              <figure className="relative h-48">
                <Image
                  src={post.image || '/placeholder-image.jpg'}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </figure>
              <div className="p-4">
                <header>
                  <h2 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-300  group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h2>
                  <time className="text-sm text-gray-600 dark:text-gray-300 mb-2" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString()}
                  </time>
                </header>
                <p className="text-gray-700 dark:text-gray-200 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </Layout>
  );
}
