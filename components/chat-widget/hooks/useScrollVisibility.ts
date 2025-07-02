'use client';
import { useState, useEffect } from 'react';

export const useScrollVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Hide when user scrolled more than 70% down the page
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;
      setIsVisible(scrollPercentage < 0.85); // Hide when 85% scrolled
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
};
