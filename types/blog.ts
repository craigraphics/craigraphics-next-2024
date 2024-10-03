import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  language: 'en' | 'es';
  category?: string;
  image?: string | null;
  excerpt?: string;
  readTime?: string;
  author: string;
  avatar?: string | null;
  tags?: string[];
}

export interface SerializedBlogPost extends BlogPost {
  serializedContent: MDXRemoteSerializeResult;
}
