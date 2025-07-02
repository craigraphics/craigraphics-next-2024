'use client';

import { Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const LoadingIndicator = () => {
  const t = useTranslations('chatWidget');

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary dark:from-secondary-dark dark:to-primary-dark flex items-center justify-center">
        <Bot className="w-4 h-4 text-foreground-dark dark:text-primary" />
      </div>
      <div className="p-4 rounded-2xl rounded-bl-md bg-muted dark:bg-muted-dark border border-muted dark:border-muted-dark">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-muted-foreground">{t('thinking')}</span>
        </div>
      </div>
    </div>
  );
};
