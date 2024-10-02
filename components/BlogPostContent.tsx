import { MDXRemote } from 'next-mdx-remote/rsc';
import { BlogPost } from '@/types/blog';

interface BlogPostContentProps {
  post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <MDXRemote source={post.content} />
    </article>
  );
}
