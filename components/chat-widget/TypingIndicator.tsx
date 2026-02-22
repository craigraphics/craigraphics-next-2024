'use client';

import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  message: string;
}

export const TypingIndicator = ({ message }: TypingIndicatorProps) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="flex-1 max-w-[80%]">
        <div className="inline-block p-4 rounded-2xl rounded-bl-md bg-muted border border-muted shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {message}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </div>
    </div>
  );
};
