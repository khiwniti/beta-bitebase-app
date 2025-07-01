'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, TrendingUp, BarChart3, MapPin, Target, Zap, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  suggestions?: string[];
  language?: string;
  model?: string;
  data_source?: string;
  tokens_used?: number;
}

interface ConversationalAnalyticsProps {
  restaurantId?: string;
  initialContext?: {
    location?: { latitude: number; longitude: number };
    language?: 'en' | 'th' | 'auto';
  };
  onInsightGenerated?: (insight: any) => void;
}

const ConversationalAnalytics: React.FC<ConversationalAnalyticsProps> = ({
  restaurantId,
  initialContext,
  onInsightGenerated
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [currentLanguage, setCurrentLanguage] = useState(initialContext?.language || 'auto');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage === 'th' ? 'th-TH' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [currentLanguage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          restaurant_id: restaurantId,
          conversation_id: conversationId,
          context: {
            language: currentLanguage,
            location: initialContext?.location
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
          intent: data.data.intent,
          suggestions: data.data.suggestions,
          language: data.data.language,
          model: data.data.model,
          data_source: data.data.data_source,
          tokens_used: data.data.tokens_used
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        if (!conversationId && data.data.conversation_id) {
          setConversationId(data.data.conversation_id);
        }

        // Trigger insight callback if provided
        if (onInsightGenerated && assistantMessage.intent !== 'greeting') {
          onInsightGenerated({
            intent: assistantMessage.intent,
            content: assistantMessage.content,
            suggestions: assistantMessage.suggestions,
            timestamp: assistantMessage.timestamp
          });
        }

        // Auto-detect language from response
        if (data.data.language && data.data.language !== currentLanguage) {
          setCurrentLanguage(data.data.language);
        }
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: currentLanguage === 'th' 
          ? 'ขออภัย ขณะนี้ระบบ AI มีปัญหา กรุณาลองใหม่อีกครั้ง' 
          : 'Sorry, I\'m experiencing technical difficulties. Please try again.',
        timestamp: new Date(),
        intent: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case 'sales_analysis':
      case 'revenue_analysis':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'predictive_analytics':
      case 'forecasting':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'competitive_intelligence':
      case 'market_analysis':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'customer_analysis':
        return <BarChart3 className="w-4 h-4 text-orange-600" />;
      case 'location_analysis':
        return <MapPin className="w-4 h-4 text-red-600" />;
      default:
        return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getModelBadgeColor = (model?: string) => {
    if (model?.includes('claude-3.5-sonnet') || model?.includes('reasoning')) {
      return 'bg-purple-100 text-purple-800';
    } else if (model?.includes('claude-3-haiku') || model?.includes('fast')) {
      return 'bg-green-100 text-green-800';
    } else if (model?.includes('claude-3-sonnet') || model?.includes('chat')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const suggestedQueries = currentLanguage === 'th' ? [
    "วิเคราะห์รายได้ของร้านในเดือนนี้",
    "แนะนำกลยุทธ์การตลาดสำหรับเพิ่มลูกค้า",
    "คาดการณ์ยอดขายสัปดาห์หน้า",
    "วิเคราะห์คู่แข่งในบริเวณใกล้เคียง",
    "แนะนำการปรับปรุงเมนู"
  ] : [
    "Analyze this month's revenue performance",
    "Suggest marketing strategies to increase customers",
    "Forecast next week's sales",
    "Analyze nearby competitors",
    "Recommend menu optimizations"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">
              {currentLanguage === 'th' ? 'AI ที่ปรึกษาธุรกิจ' : 'AI Business Consultant'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {currentLanguage === 'th' ? 'ขับเคลื่อนด้วย AWS Bedrock' : 'Powered by AWS Bedrock'}
            </Badge>
            {messages.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {messages.length} {currentLanguage === 'th' ? 'ข้อความ' : 'messages'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">
                {currentLanguage === 'th' 
                  ? 'สวัสดี! ผมพร้อมช่วยวิเคราะห์ธุรกิจร้านอาหารของคุณ' 
                  : 'Hello! I\'m ready to analyze your restaurant business'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {currentLanguage === 'th' 
                  ? 'ถามคำถามหรือเลือกคำแนะนำด้านล่าง' 
                  : 'Ask a question or select a suggestion below'}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              )}

              <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>

                {/* Message metadata */}
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  
                  {message.role === 'assistant' && (
                    <>
                      {message.intent && (
                        <div className="flex items-center gap-1">
                          {getIntentIcon(message.intent)}
                          <span className="capitalize">{message.intent.replace('_', ' ')}</span>
                        </div>
                      )}
                      
                      {message.model && (
                        <Badge variant="outline" className={`text-xs ${getModelBadgeColor(message.model)}`}>
                          {message.model.includes('haiku') ? 'Fast' : 
                           message.model.includes('3.5-sonnet') ? 'Reasoning' : 
                           message.model.includes('sonnet') ? 'Advanced' : 'AI'}
                        </Badge>
                      )}

                      {message.tokens_used && message.tokens_used > 0 && (
                        <span className="text-xs text-gray-400">
                          {message.tokens_used} tokens
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Suggestions */}
                {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        {messages.length === 0 && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">
              {currentLanguage === 'th' ? 'คำถามแนะนำ:' : 'Suggested questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 3).map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleSuggestionClick(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  currentLanguage === 'th' 
                    ? 'ถามคำถามเกี่ยวกับธุรกิจของคุณ...' 
                    : 'Ask a question about your business...'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            
            {recognitionRef.current && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={isListening ? 'bg-red-50 border-red-200' : ''}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-600" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationalAnalytics;