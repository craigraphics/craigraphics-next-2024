'use client';
import { useState, useRef, useEffect } from 'react';

export const useTypeWriter = () => {
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const typeWriterEffect = (text: string, callback?: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTyping(true);
    setTypingMessage('');

    const words = text.split(' ');
    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        setTypingMessage(words.slice(0, currentIndex + 1).join(' '));
        currentIndex++;
      } else {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsTyping(false);
        setTypingMessage('');
        callback?.();
      }
    }, 90);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const resetTyping = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
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
