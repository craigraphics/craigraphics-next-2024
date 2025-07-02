'use client';

import { MessageCircle, Sparkles, Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ChatWidgetBarProps {
  isVisible: boolean;
  onOpen: () => void;
}

export const ChatWidgetBar = ({ isVisible, onOpen }: ChatWidgetBarProps) => {
  const t = useTranslations('chatWidget');

  return (
    <div
      className={`fixed bottom-6 left-6 right-6 z-50 cursor-pointer group transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Gradient glow background - slower pulse */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent dark:from-primary-dark dark:via-secondary-dark dark:to-accent-dark rounded-xl blur-sm opacity-60 group-hover:opacity-80 animate-[pulse_3s_ease-in-out_infinite] transition-opacity duration-500" />

        {/* Enhanced glow on hover */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50 dark:from-primary-dark/50 dark:via-secondary-dark/50 dark:to-accent-dark/50 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-all duration-500" />

        {/* Main input-style container */}
        <div
          className="relative bg-background/70 dark:bg-background-dark/90 backdrop-blur-lg rounded-xl border border-muted/30 dark:border-muted-dark/30 px-4 py-3 transition-all duration-300 group-hover:scale-[1.02] group-hover:bg-background/80 dark:group-hover:bg-background-dark/95"
          onClick={onOpen}
        >
          <div className="flex items-center space-x-4">
            {/* Chat icon */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark dark:from-primary-dark dark:to-secondary-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="absolute top-0 -right-1 w-3 h-3 bg-accent dark:bg-accent-dark rounded-full animate-[pulse_2s_ease-in-out_infinite] border border-background dark:border-background-dark" />
            </div>

            {/* Input-style text */}
            <div className="flex-1 min-w-0">
              <div className="text-muted-foreground text-sm group-hover:text-foreground dark:group-hover:text-foreground-dark transition-colors duration-300">
                {t('placeholder')}
              </div>
            </div>

            {/* Right side elements */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2 text-muted-foreground text-xs">
                <Sparkles className="w-3 h-3 animate-[pulse_2.5s_ease-in-out_infinite] text-primary dark:text-primary-dark" />
                <span>{t('aiAssistant')}</span>
              </div>

              {/* Send-style icon */}
              <div className="w-6 h-6 bg-primary/10 dark:bg-primary-dark/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary-dark/20 transition-colors duration-300">
                <Bot className="w-3 h-3 text-primary dark:text-primary-dark" />
              </div>
            </div>
          </div>

          {/* Subtle bottom border glow */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-primary-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </div>
  );
};
