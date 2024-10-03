import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

export async function getPost(slug: string, locale: string): Promise<BlogPost | null> {
  const fullPath = path.join(process.cwd(), 'content', 'blog', `${slug}.${locale}.mdx`);

  const imageFormats = ['webp', 'jpg', 'jpeg', 'png'];
  let imagePath = null;
  let avatar = null;

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents) as {
    data: { title: string; date: string; readTime: string; author: string; tags: string[] };
    content: string;
  };

  for (const format of imageFormats) {
    const potentialPathForFeatured = path.join(process.cwd(), 'public', 'images', 'blog', slug, `featured-image.${format}`);
    const potentialPathForAvatar = path.join(process.cwd(), 'public', 'images', 'blog', slug, `profile.${format}`);

    if (fs.existsSync(potentialPathForFeatured)) {
      imagePath = `/images/blog/${slug}/featured-image.${format}`;
    }

    if (fs.existsSync(potentialPathForAvatar)) {
      avatar = `/images/blog/${slug}/profile.${format}`;
    }
  }

  return {
    slug,
    title: data.title,
    date: formatDate(data.date, locale as 'en' | 'es'),
    content,
    image: imagePath,
    avatar: avatar,
    readTime: data.readTime,
    author: data.author,
    tags: data.tags,
    language: locale as 'en' | 'es',
  };
}
