'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Settings, 
  Expand, 
  Paperclip, 
  Mic, 
  Wand2,
  Languages
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  className?: string;
}

const FloatingChatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'th'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      title: 'BiteBase Assistant',
      status: 'Online - Ready to help',
      placeholder: 'Ask about sales, customers, or menu performance...',
      welcome: "Hello! I'm your BiteBase AI assistant. How can I help with your café or restaurant analytics today?",
      quickActions: ['Sales Report', 'Customer Trends', 'Menu Analysis'],
      responses: {
        hello: "Hello there! How can I assist with your restaurant analytics today?",
        sales: "Your sales for today are trending 12% higher than yesterday. The peak hour was between 12:30-1:30 PM.",
        customers: "Customer traffic shows a 15% increase in returning customers this week. The average spend per customer is $18.50.",
        menu: "Your top performing items are the Avocado Toast (32% of sales) and Iced Latte (28% of sales). The Veggie Wrap has the lowest sales at 5%.",
        default: "I can help you analyze sales data, customer trends, and menu performance. Could you be more specific about what you'd like to know?"
      }
    },
    th: {
      title: 'ผู้ช่วย BiteBase',
      status: 'ออนไลน์ - พร้อมช่วยเหลือ',
      placeholder: 'สอบถามเกี่ยวกับยอดขาย, ลูกค้า, หรือประสิทธิภาพเมนู...',
      welcome: 'สวัสดี! ฉันคือผู้ช่วย BiteBase AI ของคุณ ฉันสามารถช่วยคุณวิเคราะห์ข้อมูลร้านคาเฟ่หรือร้านอาหารของคุณได้อย่างไรในวันนี้?',
      quickActions: ['รายงานยอดขาย', 'แนวโน้มลูกค้า', 'วิเคราะห์เมนู'],
      responses: {
        hello: "สวัสดี! ฉันสามารถช่วยคุณวิเคราะห์ข้อมูลร้านอาหารของคุณได้อย่างไรในวันนี้?",
        sales: "ยอดขายวันนี้สูงกว่าวันเมื่อวาน 12% ชั่วโมงเร่งด่วนคือระหว่าง 12:30-13:30 น.",
        customers: "จำนวนลูกค้าแสดงให้เห็นลูกค้าประจำเพิ่มขึ้น 15% ในสัปดาห์นี้ ค่าใช้จ่ายเฉลี่ยต่อลูกค้าอยู่ที่ $18.50",
        menu: "เมนูขายดีที่สุดของคุณคือ Avocado Toast (32% ของยอดขาย) และ Iced Latte (28% ของยอดขาย) Veggie Wrap มียอดขายต่ำสุดที่ 5%",
        default: "ฉันสามารถช่วยคุณวิเคราะห์ข้อมูลยอดขาย แนวโน้มลูกค้า และประสิทธิภาพเมนู คุณต้องการทราบข้อมูลใดเป็นพิเศษหรือไม่?"
      }
    }
  };

  const t = translations[currentLanguage];

  useEffect(() => {
    // Add welcome message when component mounts
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: t.welcome,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [currentLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'th' : 'en');
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('สวัสดี')) {
      return t.responses.hello;
    } else if (message.includes('sales') || message.includes('ยอดขาย')) {
      return t.responses.sales;
    } else if (message.includes('customer') || message.includes('ลูกค้า')) {
      return t.responses.customers;
    } else if (message.includes('menu') || message.includes('เมนู')) {
      return t.responses.menu;
    } else {
      return t.responses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(action),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-xl z-50 transition-all duration-300 hover:scale-110 flex items-center justify-center p-0 ${className}`}
        size="lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Container */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[70vh] bg-white rounded-xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-amber-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full animate-bounce flex-shrink-0">
                <Bot className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm truncate">{t.title}</h2>
                <p className="text-xs text-amber-100 truncate">{t.status}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-white hover:bg-amber-700 transition-colors p-1.5 h-7 w-7 rounded-md"
              >
                <Languages className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-amber-700 transition-colors p-1.5 h-7 w-7 rounded-md"
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-amber-700 transition-colors p-1.5 h-7 w-7 rounded-md"
              >
                <Expand className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-3 py-4 bg-gray-50 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[280px] rounded-xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-none px-3 py-2.5'
                      : 'bg-white border border-gray-100 rounded-tl-none px-3 py-2.5'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="flex items-center mb-2">
                      <div className="bg-amber-100 p-1.5 rounded-full mr-2 flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <span className="text-xs font-semibold text-amber-800">BiteBase AI</span>
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="flex justify-end mb-1.5">
                      <span className="text-xs font-semibold text-amber-100">You</span>
                    </div>
                  )}
                  <p className={`text-sm leading-relaxed ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {message.content}
                  </p>
                  {message.type === 'bot' && message.id === '1' && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                          className="text-xs bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 h-6 px-2 py-0 rounded-full"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-amber-200 text-right' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center">
                  <div className="bg-white rounded-full p-1.5 mr-2 shadow-sm flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="bg-white rounded-xl px-3 py-2 shadow-sm flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-3 py-3 bg-white">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:text-amber-600 p-1.5 h-8 w-8 rounded-md flex-shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.placeholder}
                className="flex-1 border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                maxLength={250}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-1.5 h-8 w-8 transition-transform hover:scale-105 flex-shrink-0"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
              <div className="text-xs text-gray-500">
                {inputValue.length}/250
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500 hover:text-amber-600 h-6 px-2 py-1 rounded-md"
                >
                  <Mic className="w-3 h-3 mr-1" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500 hover:text-amber-600 h-6 px-2 py-1 rounded-md"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  AI Suggest
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;