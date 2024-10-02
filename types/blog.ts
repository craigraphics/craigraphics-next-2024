import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  language: 'en' | 'es';
  image?: string | null;
  excerpt?: string;
}

export interface SerializedBlogPost extends BlogPost {
  serializedContent: MDXRemoteSerializeResult;
}
