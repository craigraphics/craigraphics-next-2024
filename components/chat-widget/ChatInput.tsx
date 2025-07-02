'use client';

import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  onSendMessage: () => void;
  onReset: () => void;
  isLoading: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({ inputMessage, setInputMessage, onSendMessage, onReset, isLoading, onKeyPress }: ChatInputProps) => {
  const t = useTranslations('chatWidget');

  return (
    <div className="p-6 border-t border-muted dark:border-muted-dark bg-background/40 dark:bg-background-dark/60">
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={t('placeholder')}
            className="w-full px-4 py-3 rounded-2xl border border-muted dark:border-muted-dark bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
            disabled={isLoading}
            maxLength={500}
          />
          <div className="absolute bottom-1 right-2 text-xs text-muted-foreground opacity-50">{inputMessage.length}/500</div>
        </div>
        <Button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="h-12 w-12 rounded-full dark:text-secondary bg-primary dark:bg-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark disabled:opacity-50 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          <Send className="h-5 w-5 text-primary" />
        </Button>
      </div>

      <p className="text-xs mt-3 text-center text-muted-foreground">
        {t('disclaimer')}
        <button
          onClick={onReset}
          className="ml-1 text-primary dark:text-primary-dark hover:text-secondary dark:hover:text-secondary-dark underline"
        >
          {t('resetConversation')}
        </button>
      </p>
    </div>
  );
};
