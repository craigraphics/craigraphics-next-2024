import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogPost } from '@/types/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ClientCodeBlock from '@/components/ClientCodeBlock';
import ShareButton from '@/components/ShareButton';

interface ArticleLayoutProps {
  post: BlogPost;
}

const components = {
  // @ts-ignore
  pre: (props: any) => <div className="my-pre-class">{props.children}</div>,
  // @ts-ignore
  code: (props: any) => <ClientCodeBlock {...props} />,
};

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ post }) => {
  return (
    <article className="mt-14 sm:max-w-4xl mx-auto">
      <header className="relative h-[60vh] mb-8">
        <Image src={post.image || '/images/placeholder-image.jpg'} alt={post.title} fill className="object-cover rounded-md" priority />
        <div className="py-8 mx-auto max-w-screen-lg container">
          <div className="text-sm uppercase tracking-wide">{post.category}</div>
        </div>
      </header>
      <main>
        <section className="container mx-auto max-w-screen-lg px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={post.avatar || 'null'} alt={post.author} />
                <AvatarFallback>{post.author}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-accent dark:text-accent-dark">{post?.author}</div>
                <div className="text-sm text-secondary dark:text-secondary-dark">
                  {post.date} · {post.readTime}
                </div>
              </div>
            </div>
            <ShareButton title={post.title} url={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`} />
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-primary-dark mb-12 mt-6 underline-heading">{post.title}</h1>
          <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground dark:prose-headings:text-primary-dark prose-headings:mb-2 prose-p:text-foreground dark:prose-p:text-foreground-dark prose-a:text-secondary dark:prose-a:text-secondary-dark prose-ul:list-disc prose-ol:list-decimal prose-li:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:text-current mdx-content">
            <MDXRemote source={post.content} components={components} />
          </div>
        </section>
      </main>
      <hr className="border-t-1 border-primary dark:border-primary-dark border-dashed mt-14 mb-14" />

      {post.tags && post.tags.length > 0 && (
        <section className="container mx-auto max-w-screen-lg px-4 mt-0">
          <h2 className="text-xl text-primary dark:text-primary-dark font-semibold mb-2 ">Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <li key={index} className="text-xs bg-muted dark:bg-muted-dark px-2 py-1 rounded text-primary dark:text-primary-dark">
                {tag}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};

export default ArticleLayout;
