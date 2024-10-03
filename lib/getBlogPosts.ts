import fs from 'fs';
import path from 'path';
// @ts-expect-error: TypeScript cannot find module declaration for 'gray-matter'
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';

export function getBlogPosts(locale: string): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'content', 'blog');

  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Blog directory does not exist: ${postsDirectory}`);
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter(fileName => fileName.endsWith(`.${locale}.mdx`))
    .map(fileName => {
      const slug = fileName.replace(`.${locale}.mdx`, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const imageFormats = ['webp', 'jpg', 'jpeg', 'png'];
      let imagePath = null;
      const { data, content } = matter(fileContents);

      for (const format of imageFormats) {
        const potentialPath = path.join(process.cwd(), 'public', 'images', 'blog', slug, `featured-image.${format}`);
        if (fs.existsSync(potentialPath)) {
          imagePath = `/images/blog/${slug}/featured-image.${format}`;
          break;
        }
      }

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content,
        image: imagePath,
        language: locale as 'en' | 'es',
      };
    });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
