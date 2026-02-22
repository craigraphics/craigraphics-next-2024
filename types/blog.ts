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
