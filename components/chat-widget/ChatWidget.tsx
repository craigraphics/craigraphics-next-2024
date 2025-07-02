'use client';

import { Card } from '@/components/ui/card';
import {
  ChatHeader,
  WelcomeMessage,
  MessageBubble,
  LoadingIndicator,
  TypingIndicator,
  ChatInput,
  ChatWidgetBar,
  useChatSuggestions,
  useScrollVisibility,
  useTypeWriter,
  useChatMessages,
  useChatState,
} from './index';

export default function ModernChatWidget() {
  // Custom hooks for state management
  const { isOpen, openChat, closeChat } = useChatState();
  const isVisible = useScrollVisibility();
  const { data: suggestions = [], isLoading: suggestionsLoading } = useChatSuggestions(isOpen);
  const { typingMessage, isTyping, typeWriterEffect, resetTyping } = useTypeWriter();
  const { messages, inputMessage, setInputMessage, isLoading, messagesEndRef, sendMessage, handleKeyPress, resetChat } = useChatMessages();

  // Enhanced send message with typewriter effect
  const handleSendMessage = (message?: string) => {
    sendMessage(message, typeWriterEffect);
  };

  // Enhanced reset function that also clears typing state
  const handleReset = () => {
    resetChat();
    resetTyping();
  };

  if (!isOpen) {
    return <ChatWidgetBar isVisible={isVisible} onOpen={openChat} />;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={closeChat} />

      {/* Chat Container */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center">
        <Card className="w-full max-w-4xl h-full max-h-[800px] flex flex-col shadow-2xl border-0 overflow-hidden bg-background/80 dark:bg-background-dark/95 backdrop-blur-xl">
          <ChatHeader onClose={closeChat} />

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.length === 0 ? (
                <WelcomeMessage suggestions={suggestions} suggestionsLoading={suggestionsLoading} onSendMessage={handleSendMessage} />
              ) : (
                <>
                  {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))}

                  {isLoading && <LoadingIndicator />}

                  {isTyping && <TypingIndicator message={typingMessage} />}
                </>
              )}

              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSendMessage={() => handleSendMessage()}
              onReset={handleReset}
              isLoading={isLoading}
              onKeyPress={handleKeyPress}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
