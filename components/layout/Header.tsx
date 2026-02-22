'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { SheetContent } from '@/components/ui/custom-sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import Link from '@/components/ui/NavLink';

const NavItems = ({ closeMenu }: { closeMenu?: () => void }) => {
  const t = useTranslations('common');
  const locale = useLocale();
  return (
    <>
      <Link href={`/${locale}/`} onClick={closeMenu}>
        {t('home')}
      </Link>
      <Separator orientation="vertical" className="bg-muted h-5 hidden md:block" />
      <Link href={`/${locale}/work`} onClick={closeMenu}>
        {t('projects')}
      </Link>
      <Separator orientation="vertical" className="bg-muted h-5 hidden md:block" />
      <Link href={`/${locale}/blog`} onClick={closeMenu}>
        {t('blog')}
      </Link>
      <Separator orientation="vertical" className="bg-muted h-5 hidden md:block" />
      <Link href={`/${locale}/contact`} onClick={closeMenu}>
        {t('contact')}
      </Link>
    </>
  );
};

const Header = () => {
  const locale = useLocale();
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const changeLanguage = (newLocale: string) => {
    const currentPathname = pathname?.substring(3) || '/';
    router.push(`/${newLocale}${currentPathname}`);
  };

  const rafIdRef = useRef<number | null>(null);

  const controlHeader = useCallback(() => {
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollYRef.current);
      lastScrollYRef.current = currentScrollY;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', controlHeader, { passive: true });
    return () => {
      window.removeEventListener('scroll', controlHeader);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [controlHeader]);

  return (
    <header
      className={`fixed top-0 left-0 w-full
        border-b border-muted
        bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50
        transition-transform duration-300 z-10
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
            <Select onValueChange={changeLanguage} defaultValue={locale}>
              <SelectTrigger className="w-[80px] bg-background border-primary border">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem
                  className="
                  hover:text-primary hover:bg-secondary
                  data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
                  cursor-pointer"
                  value="en"
                >
                  EN
                </SelectItem>
                <SelectItem
                  className="
                  hover:text-primary hover:bg-secondary
                  data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-secondary
                  hover:bg-secondary hover:text-primary-foreground"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t('open_menu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-background/80">
                <SheetHeader className="mb-4">
                  <SheetTitle>{t('menu')}</SheetTitle>
                  <SheetDescription className="pb-2">{t('menu_description')}</SheetDescription>
                  <Separator orientation="horizontal" className="bg-accent" />
                </SheetHeader>
                <div className="absolute top-1 right-1 ">
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-secondary hover:bg-transparent hover:text-primary"
                    >
                      <X className="h-6 w-6" />
                      <span className="sr-only">{t('close_menu')}</span>
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
