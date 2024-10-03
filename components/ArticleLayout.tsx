import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogPost } from '@/types/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ClientCodeBlock from '@/components/ClientCodeBlock';

interface ArticleLayoutProps {
  post: BlogPost;
}

const components = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: (props: any) => <div {...props} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: (props: any) => <ClientCodeBlock {...props} />,
};

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ post }) => {
  return (
    <article className="max-w-none">
      <header className="relative h-[60vh] mb-8 -mx-11 -mt-8">
        <Image src={post.image || '/placeholder-image.jpg'} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="py-8 mx-auto max-w-screen-lg container">
            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
            <div className="text-white text-sm uppercase tracking-wide">{post.category}</div>
          </div>
        </div>
      </header>
      <main>
        <section className="container mx-auto max-w-screen-lg px-4">
          <div className="flex items-center mb-8">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={post.avatar || 'null'} alt={post.author} />
              <AvatarFallback>{post.author}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-500 dark:text-gray-400">{post?.author}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.date} · {post.readTime}
              </div>
            </div>
          </div>

          <div
            className="prose dark:prose-invert max-w-none
                        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:mb-2
                        prose-p:text-gray-700 dark:prose-p:text-gray-300
                        prose-a:text-blue-600 dark:prose-a:text-blue-400
                        prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                        prose-ul:list-disc prose-ol:list-decimal prose-li:m-0              
                        prose-pre:bg-transparent prose-pre:p-0
                        prose-code:text-current mdx-content"
          >
            <MDXRemote source={post.content} components={components} />
          </div>
        </section>
      </main>
      <footer className="my-9 border-t-4 border-red-600 dark:border-red-700"></footer>

      {post.tags && post.tags.length > 0 && (
        <section className="container mx-auto max-w-screen-lg px-4 mt-0">
          <h2 className="text-xl text-gray-900 dark:text-gray-100 font-semibold mb-2">Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <li key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
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
