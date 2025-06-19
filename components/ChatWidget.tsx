'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, X, MessageCircle, Sparkles, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ModernChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  // Scroll detection to hide chat widget near footer
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Hide when user scrolled more than 70% down the page
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;
      setIsVisible(scrollPercentage < 0.85); // Hide when 85% scrolled
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch suggestions on mount
  useEffect(() => {
    fetch('/api/chat/suggestions')
      .then(res => res.json())
      .then(data => setSuggestions(data.suggestions))
      .catch(console.error);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const resetChat = () => {
    setMessages([]);
    setInputMessage('');
    setIsLoading(false);
    setIsTyping(false);
    setTypingMessage('');
  };

  const closeChat = () => {
    setIsOpen(false);
    setMessages([]);
    setInputMessage('');
    setIsLoading(false);
    setIsTyping(false);
    setTypingMessage('');
  };

  const sendMessage = async (message: string = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }), // Send original message to API
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      typeWriterEffect(data.response, () => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      });
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <>
        {/* Wide Input-Style Chat Bar */}
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

            {/* Main input-style container - reduced height and darker background in dark mode */}
            <div
              className="relative bg-background/70 dark:bg-background-dark/90 backdrop-blur-lg rounded-xl border border-muted/30 dark:border-muted-dark/30 px-4 py-3 transition-all duration-300 group-hover:scale-[1.02] group-hover:bg-background/80 dark:group-hover:bg-background-dark/95"
              onClick={() => setIsOpen(true)}
            >
              <div className="flex items-center space-x-4">
                {/* Chat icon - slightly smaller */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark dark:from-primary-dark dark:to-secondary-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent dark:bg-accent-dark rounded-full animate-[pulse_2s_ease-in-out_infinite] border border-background dark:border-background-dark" />
                </div>

                {/* Input-style text */}
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-sm group-hover:text-foreground dark:group-hover:text-foreground-dark transition-colors duration-300">
                    Ask about William&#39;s experience...
                  </div>
                </div>

                {/* Right side elements */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="hidden sm:flex items-center space-x-2 text-muted-foreground text-xs">
                    <Sparkles className="w-3 h-3 animate-[pulse_2.5s_ease-in-out_infinite] text-primary dark:text-primary-dark" />
                    <span>AI Assistant</span>
                  </div>

                  {/* Send-style icon - smaller */}
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
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={closeChat} />

      {/* Chat Container */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center">
        <Card className="w-full max-w-4xl h-full max-h-[800px] flex flex-col shadow-2xl border-0 overflow-hidden bg-background/80 dark:bg-background-dark/95 backdrop-blur-xl">
          {/* Header */}
          <div className="p-6 border-b border-muted dark:border-muted-dark bg-background/40 dark:bg-background-dark/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-secondary-dark dark:from-primary-dark dark:to-secondary-dark rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent dark:bg-accent-dark rounded-full border-2 border-background dark:border-background-dark animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground dark:text-primary-dark">William&#39;s AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Ask about my experience & expertise</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              className="h-10 w-10 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="space-y-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary dark:text-primary-dark animate-[pulse_2.5s_ease-in-out_infinite]" />
                    <h4 className="text-lg font-medium mb-2 text-foreground dark:text-foreground-dark">
                      Hi! I&#39;m William&#39;s AI Assistant
                    </h4>
                    <p className="text-sm">I can answer questions about William&#39;s professional experience, skills, and projects.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestions.slice(0, 6).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="p-4 h-auto text-left justify-start text-sm transition-all duration-200 hover:scale-[1.02] border-muted dark:border-muted-dark hover:border-primary/50 dark:hover:border-primary-dark/50 hover:bg-primary/5 dark:hover:bg-primary-dark/5 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                        onClick={() => sendMessage(suggestion)}
                      >
                        <MessageCircle className="w-4 h-4 mr-3 text-primary dark:text-primary-dark flex-shrink-0" />
                        <span className="text-foreground dark:text-foreground-dark">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary dark:bg-primary-dark'
                        : 'bg-gradient-to-br from-secondary to-primary dark:from-secondary-dark dark:to-primary-dark'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-foreground-dark dark:text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-foreground-dark dark:text-primary" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-4 rounded-2xl shadow-sm ${
                        message.role === 'user'
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
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary dark:from-secondary-dark dark:to-primary-dark flex items-center justify-center">
                    <Bot className="w-4 h-4 text-foreground-dark dark:text-primary" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-bl-md bg-muted dark:bg-muted-dark border border-muted dark:border-muted-dark">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <div
                          className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <div
                          className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary dark:from-secondary-dark dark:to-primary-dark flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-foreground-dark dark:text-primary" />
                  </div>
                  <div className="flex-1 max-w-[80%]">
                    <div className="inline-block p-4 rounded-2xl rounded-bl-md bg-muted dark:bg-muted-dark border border-muted dark:border-muted-dark shadow-sm">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground dark:text-foreground-dark">
                        {typingMessage}
                        <span className="animate-pulse">|</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-muted dark:border-muted-dark bg-background/40 dark:bg-background-dark/60">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about William's experience..."
                    className="w-full px-4 py-3 rounded-2xl border border-muted dark:border-muted-dark bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <div className="absolute bottom-1 right-2 text-xs text-muted-foreground opacity-50">{inputMessage.length}/500</div>
                </div>
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-12 w-12 rounded-full dark:text-secondary bg-primary dark:bg-primary-dark hover:bg-secondary dark:hover:bg-secondary-dark disabled:opacity-50 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  <Send className="h-5 w-5 text-primary" />
                </Button>
              </div>

              <p className="text-xs mt-3 text-center text-muted-foreground">
                This is an AI assistant. For direct contact, use the contact form.
                <button
                  onClick={resetChat}
                  className="ml-1 text-primary dark:text-primary-dark hover:text-secondary dark:hover:text-secondary-dark underline"
                >
                  Reset conversation
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
