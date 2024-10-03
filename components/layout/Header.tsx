'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { SheetContent } from '@/components/ui/custom-sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
    const currentPathname = pathname.substring(3) || '/';
    router.push(`/${newLocale}${currentPathname}`);
  };

  const NavItems = ({ closeMenu }: { closeMenu?: () => void }) => (
    <>
      <Link
        href="/"
        className="block py-2 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors"
        onClick={closeMenu}
      >
        {t('home')}
      </Link>
      <Link
        href="/projects"
        className="block py-2 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors"
        onClick={closeMenu}
      >
        {t('projects')}
      </Link>
      <Link
        href="/blog"
        className="block py-2 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors"
        onClick={closeMenu}
      >
        {t('blog')}
      </Link>
    </>
  );

  return (
    <header className="bg-white dark:bg-gray-950 border-b-2  border-slate-300 dark:border-slate-400">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-800 dark:text-white">
            <Link href="/">William Craig</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Select onValueChange={changeLanguage} defaultValue={pathname.substring(1, 3)}>
              <SelectTrigger className="w-[80px] bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="en" className="text-gray-800 dark:text-white">
                  EN
                </SelectItem>
                <SelectItem value="es" className="text-gray-800 dark:text-white">
                  ES
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-800 dark:text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('menu')}</h2>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col">
                  <NavItems closeMenu={() => setIsOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
