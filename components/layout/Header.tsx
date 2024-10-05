'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { SheetContent } from '@/components/ui/custom-sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import Link from '@/components/ui/NavLink';

const Header = () => {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const changeLanguage = (newLocale: string) => {
    const currentPathname = pathname.substring(3) || '/';
    router.push(`/${newLocale}${currentPathname}`);
  };

  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);

      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScrollY]);

  const NavItems = ({ closeMenu }: { closeMenu?: () => void }) => (
    <>
      <Link href="/" onClick={closeMenu}>
        {t('home')}
      </Link>
      <Link href="/projects" onClick={closeMenu}>
        {t('projects')}
      </Link>
      <Link href="/blog" onClick={closeMenu}>
        {t('blog')}
      </Link>
    </>
  );
  return (
    <header
      className={`fixed top-0 left-0 w-full
        border-b border-muted dark:border-muted-dark
        bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50
        transition-transform duration-300
        ${isVisible ? 'translate-y-0' : '-translate-y-full'} backdrop-filter backdrop-blur-lg`}
    >
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold ">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Select onValueChange={changeLanguage} defaultValue={pathname.substring(1, 3)}>
              <SelectTrigger className="w-[80px] dark:bg-background-dark border-primary border dark:border-primary-dark dark:text-secondary-dark">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-background-dark ">
                <SelectItem
                  className=" 
                  dark:hover:bg-secondary-dark dark:hover:text-foreground-dark
                  data-[state=checked]:bg-primary data-[state=checked]:text-foreground-dark
                  dark:data-[state=checked]:bg-primary-dark dark:data-[state=checked]:text-slate-800  
                  cursor-pointer"
                  value="en"
                >
                  EN
                </SelectItem>
                <SelectItem
                  className="
                  dark:hover:bg-secondary-dark dark:hover:text-foreground-dark
                  data-[state=checked]:bg-primary data-[state=checked]:text-foreground-dark
                  dark:data-[state=checked]:bg-primary-dark dark:data-[state=checked]:text-slate-800  
                  cursor-pointer"
                  value="es"
                >
                  ES
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px] border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">{t('menu')}</h2>
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
