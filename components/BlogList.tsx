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
      <div className="pt-14 mt-12 sm:max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-primary dark:text-primary-dark sm:text-3xl underline-heading mb-4">{t('title')}</h2>
        <p className="text-secondary dark:text-secondary-dark text-lg font-medium mb-4">{t('description')}</p>

        {featuredPost && (
          <article className="my-12 grid md:grid-cols-2 gap-8 items-center rounded-md pl-7 border border-muted dark:border-muted-dark shadow-md shadow-black:20 dark:shadow-black:80 p-7 md:p-0 md:pl-7">
            <header>
              <Link href={`/${locale}/blog/${featuredPost.slug}`}>
                <h1 className="text-4xl text-primary dark:text-primary-dark font-bold mb-4 ">{featuredPost.title}</h1>
              </Link>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{featuredPost.excerpt}</p>
              <Link
                href={`/${locale}/blog/${featuredPost.slug}`}
                className="underline text-secondary dark:text-secondary-dark hover:no-underline hover:text-primary dark:hover:text-primary-dark"
              >
                {t('readMore')}
              </Link>
            </header>
            <Link href={`/${locale}/blog/${featuredPost.slug}`}>
              <figure className="relative h-64 md:h-96">
                <Image
                  src={featuredPost.image || '/images/placeholder-image.jpg'}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-r-md object-cover"
                  priority
                />
              </figure>
            </Link>
          </article>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {otherPosts.map(post => (
            <article
              key={post.slug}
              className=" border border-muted dark:border-muted-dark shadow-md shadow-black:20 dark:shadow-black:80 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <Link href={`/${locale}/blog/${post.slug}`} className="group">
                <figure className="relative h-48">
                  <Image
                    src={post.image || '/images/placeholder-image.jpg'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </figure>
                <div className="p-4">
                  <header>
                    <h2 className="text-xl font-semibold mb-2 text-primary dark:text-primary-dark  group-hover:text-secondary dark:group-hover:text-secondary-dark transition-colors duration-300">
                      {post.title}
                    </h2>
                    <time className="text-sm text-muted-dark dark:text-muted mb-2" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString()}
                    </time>
                  </header>
                  <p className="text-gray-700 dark:text-gray-200 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </Layout>
  );
}
