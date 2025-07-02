'use client';
import { useState } from 'react';

export const useChatState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return {
    isOpen,
    openChat,
    closeChat,
    toggleChat,
  };
};
