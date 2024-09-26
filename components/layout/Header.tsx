// components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

const Header = () => {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(`/${lang}${pathname.substring(3)}`);
  };

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-800 dark:text-white">
            <Link href="/">William Craig</Link>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2">
              {t('home')}
            </Link>
            <Link href="/blog" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2">
              {t('blog')}
            </Link>
            <Link href="/projects" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2">
              {t('projects')}
            </Link>
            <ThemeToggle />
            <select
              onChange={e => changeLanguage(e.target.value)}
              value={pathname.substring(1, 3)}
              className="ml-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
