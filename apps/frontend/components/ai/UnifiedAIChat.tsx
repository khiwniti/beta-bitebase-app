/**
 * Unified AI Chat Component
 *
 * This component provides a unified interface for AI chat functionality
 * across all AI providers (Cloudflare AI, Ollama, Vercel AI SDK).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Textarea, Card, CardContent, CardFooter, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@bitebase/ui';
import { Send, Bot, User, Loader2, MessageSquare, Zap, TrendingUp, MapPin, BarChart3, Users, DollarSign, Clock, Star } from 'lucide-react';
import { MarketingResearchActions } from './MarketingResearchActions';
import MarketingResearchVisualizer from './MarketingResearchVisualizer';

// Define props for the UnifiedAIChat component
interface UnifiedAIChatProps {
  title?: string;
  placeholder?: string;
  systemPrompt?: string;
  showProviderSelector?: boolean;
  className?: string;
}

// Message interface with marketing research fields
interface Message {
  role: 'user' | 'assistant';
  content: string;
  // Marketing research specific data
  isMarketingResponse?: boolean;
  charts?: { [key: string]: string }; // Chart title -> base64 image data
  sentiment?: {
    compound: number;
    pos: number;
    neu: number;
    neg: number;
  };
  keywords?: Array<[string, number]>; // [keyword, frequency]
}

// Mock AI context for now - you can replace this with actual context
const useAI = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const sendMessage = async (message: string, systemPrompt?: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(message);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      // In a real implementation, this would call the API
      // For mock purposes, detect if it might be a marketing query
      const isMarketingQuery = /marketing|campaign|promotion|customers|advertis|competitor|market research/i.test(message);
      
      setTimeout(() => {
        if (isMarketingQuery) {
          // Simulate marketing research response
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Here's some marketing insights for "${message}". I've analyzed the data and found some interesting patterns.`,
            isMarketingResponse: true,
            sentiment: {
              compound: 0.35,
              pos: 0.6,
              neu: 0.35,
              neg: 0.05
            },
            keywords: [
              ['marketing', 10],
              ['customers', 8],
              ['restaurant', 7],
              ['promotion', 6],
              ['social media', 5],
              ['campaign', 4],
              ['loyalty', 3]
            ]
          }]);
        } else {
          // Regular response
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I received your message: "${message}". This is a simulated response from the AI assistant.`
          }]);
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to send message');
      setIsLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return {
    messages,
    isLoading,
    error,
    activeProvider: 'cloudflare',
    availableProviders: ['cloudflare', 'ollama'],
    sendMessage,
    setActiveProvider: () => {},
    clearMessages
  };
};

// Create the UnifiedAIChat component
export const UnifiedAIChat: React.FC<UnifiedAIChatProps> = ({
  title = 'AI Assistant',
  placeholder = 'Type your message here...',
  systemPrompt,
  showProviderSelector = true,
  className = '',
}) => {
  const {
    messages,
    isLoading,
    error,
    activeProvider,
    availableProviders,
    sendMessage,
    setActiveProvider,
    clearMessages
  } = useAI();

  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');

    await sendMessage(message, systemPrompt);
  };

  // Handle marketing research actions
  const handleMarketingAction = async (action: string, parameters: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call the API endpoint
      // For now, we'll simulate a response
      setTimeout(() => {
        const actionResponses = {
          'marketing_research': 'Here is your comprehensive marketing research report.',
          'competitive_analysis': 'I\'ve analyzed your competitors and found these insights.',
          'marketing_campaign': 'Here\'s a marketing campaign strategy tailored for your business.',
          'marketing_ideas': 'I\'ve generated some creative marketing ideas for your consideration.',
        };
        
        // Add the response to the chat
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: actionResponses[action as keyof typeof actionResponses] || 
                  'I\'ve processed your marketing request.',
          isMarketingResponse: true,
          sentiment: {
            compound: 0.42,
            pos: 0.65,
            neu: 0.30,
            neg: 0.05
          },
          keywords: [
            ['marketing', 10],
            ['strategy', 8],
            ['customers', 7],
            ['campaign', 6],
            ['promotion', 5],
            ['social media', 4],
            ['engagement', 3]
          ]
        }]);
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error executing marketing action:', error);
      setError('Failed to execute marketing action');
      setIsLoading(false);
    }
  };

  // Handle provider change
  const handleProviderChange = (value: string) => {
    // setActiveProvider is a mock function that doesn't accept parameters
    // In a real implementation, this would update the active provider
    console.log('Provider changed to:', value);
  };

  // Get provider display name
  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'cloudflare':
        return 'Cloudflare AI';
      case 'ollama':
        return 'Ollama';
      case 'vercel':
        return 'Vercel AI';
      default:
        return provider;
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-primary">{title}</CardTitle>

          {showProviderSelector && availableProviders.length > 1 && (
            <Select value={activeProvider} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-[180px] form-input-theme">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {getProviderDisplayName(provider)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={clearMessages}
            title="Clear conversation"
            className="hover-primary"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Bot className="h-12 w-12 mb-4 text-primary" />
            <p>Send a message to start a conversation with the AI assistant.</p>
            <p className="text-sm mt-2">
              Currently using {getProviderDisplayName(activeProvider)}.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar>
                  {message.role === 'user' ? (
                    <>
                      <AvatarImage src="/avatars/user.png" alt="User" />
                      <AvatarFallback className="bg-primary-100">
                        <User className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/avatars/bot.png" alt="AI" />
                      <AvatarFallback className="bg-primary-100">
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'chat-message-user'
                      : 'chat-message-bot'
                  }`}
                >
                  {message.content}
                  
                  {/* Display marketing visualizations if this is a marketing response */}
                  {message.role === 'assistant' && message.isMarketingResponse && (
                    <MarketingResearchVisualizer
                      charts={message.charts}
                      sentiment={message.sentiment}
                      keywords={message.keywords}
                      className="mt-4"
                    />
                  )}
                </div>
              </div>
              
              {/* Display marketing research actions after assistant responses */}
              {message.role === 'assistant' && message.isMarketingResponse && index === messages.length - 1 && (
                <div className="w-full mt-4">
                  <MarketingResearchActions
                    onRequestAction={(action, parameters) => {
                      console.log("Marketing action requested:", action, parameters);
                      handleMarketingAction(action, parameters);
                    }}
                    query={messages.find(m => m.role === 'user')?.content || ''}
                  />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar>
                <AvatarImage src="/avatars/bot.png" alt="AI" />
                <AvatarFallback className="bg-primary-100">
                  <Bot className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>

              <div className="rounded-lg px-4 py-2 bg-gray-100">
                <div className="loading-dots flex space-x-2">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="rounded-lg px-4 py-2 bg-red-100 text-red-700">
              Error: {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="form-input-theme flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="btn-primary"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default UnifiedAIChat;
