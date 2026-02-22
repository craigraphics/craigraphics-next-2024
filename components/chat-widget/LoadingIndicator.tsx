'use client';

import { Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const LoadingIndicator = () => {
  const t = useTranslations('chatWidget');

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="p-4 rounded-2xl rounded-bl-md bg-muted border border-muted">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-muted-foreground">{t('thinking')}</span>
        </div>
      </div>
    </div>
  );
};
