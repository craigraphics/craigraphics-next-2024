'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WelcomeMessageProps {
  suggestions: string[];
  suggestionsLoading: boolean;
  onSendMessage: (message: string) => void;
}

export const WelcomeMessage = ({ suggestions, suggestionsLoading, onSendMessage }: WelcomeMessageProps) => {
  const t = useTranslations('chatWidget');

  return (
    <div className="space-y-6">
      <div className="text-center py-8 text-muted-foreground">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary dark:text-primary-dark animate-[pulse_2.5s_ease-in-out_infinite]" />
        <h4 className="text-lg font-medium mb-2 text-foreground dark:text-foreground-dark">{t('welcomeMessage')}</h4>
        <p className="text-sm">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestionsLoading
          ? // Loading skeleton for suggestions
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 h-14 rounded-lg border border-muted dark:border-muted-dark bg-muted/50 dark:bg-muted-dark/50 animate-pulse"
              />
            ))
          : suggestions.slice(0, 6).map((suggestion: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="p-4 h-auto text-left justify-start text-sm transition-all duration-200 hover:scale-[1.02] border-muted dark:border-muted-dark hover:border-primary/50 dark:hover:border-primary-dark/50 hover:bg-primary/5 dark:hover:bg-primary-dark/5 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark break-words whitespace-normal min-h-[3.5rem]"
                onClick={() => onSendMessage(suggestion)}
              >
                <MessageCircle className="w-4 h-4 mr-3 text-primary dark:text-primary-dark flex-shrink-0 mt-0.5" />
                <span className="text-foreground dark:text-foreground-dark text-left leading-tight">{suggestion}</span>
              </Button>
            ))}
      </div>
    </div>
  );
};
