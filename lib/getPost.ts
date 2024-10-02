import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';

export async function getPost(slug: string, locale: string): Promise<BlogPost | null> {
  const fullPath = path.join(process.cwd(), 'content', 'blog', `${slug}.${locale}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    content,
    language: locale as 'en' | 'es',
  };
}
