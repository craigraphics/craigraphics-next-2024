'use client';

import { Button } from '@/components/ui/button';
import { X, Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  const t = useTranslations('chatWidget');

  return (
    <div className="p-6 border-b border-muted dark:border-muted-dark bg-background/40 dark:bg-background-dark/60 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-secondary-dark dark:from-primary-dark dark:to-secondary-dark rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent dark:bg-accent-dark rounded-full border-2 border-background dark:border-background-dark animate-[pulse_2s_ease-in-out_infinite]" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground dark:text-primary-dark">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-10 w-10 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors text-muted-foreground"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
