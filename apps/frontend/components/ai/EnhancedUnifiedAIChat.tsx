/**
 * Enhanced UnifiedAIChat Component with Marketing Research Visualizations
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Textarea, Card, CardContent, CardFooter, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@bitebase/ui';
import { Bot, Send, Trash, User } from 'lucide-react';
import { 
  MarketingResearchVisualizer,
  MarketingResearchActions
} from '../marketing-research';
import '../marketing-research/marketing-research.css';

// Define types for marketing data
interface SentimentData {
  compound: number;
  pos: number;
  neu: number;
  neg: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isMarketingResponse?: boolean;
  charts?: { [key: string]: string };
  sentiment?: SentimentData;
  keywords?: Array<[string, number]>;
}

interface UnifiedAIChatProps {
  title?: string;
  placeholder?: string;
  systemPrompt?: string;
  showProviderSelector?: boolean;
  className?: string;
}

// Simulated API handler
const simulateApiCall = (message: string, isMarketingQuery: boolean) => {
  return new Promise<Message>((resolve) => {
    setTimeout(() => {
      if (isMarketingQuery) {
        resolve({
          role: 'assistant',
          content: `Here's some marketing insights for "${message}". I've analyzed the data and found some interesting patterns in customer behavior and promotional effectiveness.`,
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
        });
      } else {
        resolve({
          role: 'assistant',
          content: `I received your message: "${message}". This is a simulated response from the AI assistant.`
        });
      }
    }, 1000);
  });
};

const simulateMarketingAction = (action: string) => {
  return new Promise<Message>((resolve) => {
    setTimeout(() => {
      const actionResponses: Record<string, string> = {
        'marketing_research': 'Here is your comprehensive marketing research report with detailed customer segments, trend analysis, and opportunity identification.',
        'competitive_analysis': 'I\'ve analyzed your competitors and found these insights about their pricing, promotions, and market positioning.',
        'marketing_campaign': 'Here\'s a marketing campaign strategy tailored for your business, focusing on key customer segments and optimal channels.',
        'marketing_ideas': 'I\'ve generated some creative marketing ideas for your consideration, including seasonal promotions and loyalty programs.'
      };

      resolve({
        role: 'assistant',
        content: actionResponses[action] || 'I\'ve processed your marketing request.',
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
      });
    }, 1500);
  });
};

// Enhanced UnifiedAIChat component
export const EnhancedUnifiedAIChat: React.FC<UnifiedAIChatProps> = ({
  title = 'AI Assistant',
  placeholder = 'Type your message here...',
  systemPrompt,
  showProviderSelector = true,
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeProvider = 'cloudflare';
  const availableProviders = ['cloudflare', 'ollama'];

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
    setCurrentQuery(message);
    setInput('');
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      // Check if this is a marketing query
      const isMarketingQuery = /marketing|campaign|promotion|customers|advertis|competitor|market research/i.test(message);
      
      // Simulate API call
      const response = await simulateApiCall(message, isMarketingQuery);
      setMessages(prev => [...prev, response]);
      
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marketing research actions
  const handleMarketingAction = async (action: string, parameters: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call for marketing action
      const response = await simulateMarketingAction(action);
      setMessages(prev => [...prev, response]);
      
    } catch (err) {
      setError('Failed to execute marketing action');
      console.error('Error executing marketing action:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => setMessages([]);

  // Handle provider change
  const handleProviderChange = (value: string) => {
    console.log('Provider changed to:', value);
  };

  // Get provider display name
  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'cloudflare': return 'Cloudflare AI';
      case 'ollama': return 'Ollama';
      case 'vercel': return 'Vercel AI';
      default: return provider;
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
              className={`flex flex-col ${
                message.role === 'user' ? 'items-end' : 'items-start'
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
                    onRequestAction={handleMarketingAction}
                    query={currentQuery}
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

export default EnhancedUnifiedAIChat;
