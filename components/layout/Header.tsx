import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

const Header = () => {
  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-800 dark:text-white">
            <Link href="/">William Craig</Link>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2">
              Home
            </Link>
            <Link href="/blog" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2">
              Blog
            </Link>
            <Link href="/projects" className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2">
              Projects
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
