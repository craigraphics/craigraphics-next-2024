'use client';
import { useState, useEffect, useRef } from 'react';

export const useScrollVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Batch DOM reads using requestAnimationFrame to avoid forced reflows
      rafIdRef.current = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Hide when user scrolled more than 70% down the page
        const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;
        setIsVisible(scrollPercentage < 0.85); // Hide when 85% scrolled
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return isVisible;
};
