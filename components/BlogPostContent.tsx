import { BlogPost } from '@/types/blog';
import Layout from '@/components/layout/Layout';
import ArticleLayout from '@/components/ArticleLayout';

interface BlogPostContentProps {
  post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <Layout showChat={false}>
      <ArticleLayout post={post} />
    </Layout>
  );
}
