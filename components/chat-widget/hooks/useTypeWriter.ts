'use client';
import { useState } from 'react';

export const useTypeWriter = () => {
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  const typeWriterEffect = (text: string, callback?: () => void) => {
    setIsTyping(true);
    setTypingMessage('');

    const words = text.split(' ');
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setTypingMessage(() => {
          const wordsToShow = words.slice(0, currentIndex + 1);
          return wordsToShow.join(' ');
        });
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setTypingMessage('');
        callback?.();
      }
    }, 90);
  };

  const resetTyping = () => {
    setIsTyping(false);
    setTypingMessage('');
  };

  return {
    typingMessage,
    isTyping,
    typeWriterEffect,
    resetTyping,
  };
};
