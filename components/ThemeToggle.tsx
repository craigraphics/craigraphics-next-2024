'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '@iconify/react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Render nothing on the server-side
  }

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full border border-primary bg-background text-secondary hover:bg-primary hover:text-primary-foreground"
      aria-label="Toggle theme"
    >
      <Icon icon={theme === 'light' ? 'ph:moon' : 'ph:sun'} className="w-5 h-5" />
    </button>
  );
};

export default ThemeToggle;
