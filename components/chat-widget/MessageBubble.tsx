'use client';

import { Bot, User } from 'lucide-react';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-primary dark:bg-primary-dark'
            : 'bg-gradient-to-br from-secondary to-primary dark:from-secondary-dark dark:to-primary-dark'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-foreground-dark dark:text-primary" />
        ) : (
          <Bot className="w-4 h-4 text-foreground-dark dark:text-primary" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block p-4 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-primary dark:bg-primary-dark text-white dark:text-slate-900 rounded-br-md'
              : 'bg-muted dark:bg-muted-dark text-foreground dark:text-foreground-dark rounded-bl-md border border-muted dark:border-muted-dark'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs mt-1 text-muted-foreground opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
