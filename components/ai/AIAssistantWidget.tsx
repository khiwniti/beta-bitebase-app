'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  BarChart3,
  Activity,
  Globe,
  Maximize2,
  Minimize2,
  Copy,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';

interface QuickInsight {
  id: string;
  type: 'tip' | 'alert' | 'opportunity' | 'trend';
  title: string;
  description: string;
  action?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: QuickInsight[];
  metrics?: Array<{
    name: string;
    value: string;
    change?: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

interface AIAssistantWidgetProps {
  className?: string;
  compact?: boolean;
  showQuickInsights?: boolean;
  restaurantData?: any;
}

const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  className = '',
  compact = false,
  showQuickInsights = true,
  restaurantData
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [isListening, setIsListening] = useState(false);
  const [quickInsights, setQuickInsights] = useState<QuickInsight[]>([]);
  const [language, setLanguage] = useState<'en' | 'th'>('en');

  // Generate quick insights on component mount
  useEffect(() => {
    generateQuickInsights();
  }, []);

  const generateQuickInsights = () => {
    const insights: QuickInsight[] = [
      {
        id: 'insight_1',
        type: 'opportunity',
        title: language === 'th' ? 'เพิ่มรายได้ช่วงเย็น' : 'Evening Revenue Boost',
        description: language === 'th' 
          ? 'ลูกค้าช่วง 7-9 โมงเย็นมากขึ้น 40% แต่ราคายังไม่ปรับ'
          : '40% more customers 7-9 PM but prices unchanged',
        action: language === 'th' ? 'ปรับราคาแบบไดนามิก' : 'Implement dynamic pricing',
        category: 'pricing',
        priority: 'high'
      },
      {
        id: 'insight_2',
        type: 'alert',
        title: language === 'th' ? 'ลูกค้าใหม่กลับมาน้อย' : 'Low Return Rate',
        description: language === 'th'
          ? 'ลูกค้าใหม่กลับมาครั้งที่ 2 เพียง 32%'
          : 'Only 32% of new customers return',
        action: language === 'th' ? 'สร้างโปรแกรมสะสมแต้ม' : 'Create loyalty program',
        category: 'customer',
        priority: 'high'
      },
      {
        id: 'insight_3',
        type: 'trend',
        title: language === 'th' ? 'เมนูเพื่อสุขภาพฮิต' : 'Healthy Menu Trending',
        description: language === 'th'
          ? 'สลัดและเมนูมังสวิรัติเติบโต 35%'
          : 'Salads and vegetarian options up 35%',
        action: language === 'th' ? 'เพิ่มเมนูเพื่อสุขภาพ' : 'Expand healthy options',
        category: 'menu',
        priority: 'medium'
      },
      {
        id: 'insight_4',
        type: 'tip',
        title: language === 'th' ? 'ช่วงสุดสัปดาห์คาดว่าคึกคัก' : 'Busy Weekend Predicted',
        description: language === 'th'
          ? 'AI คาดการณ์ลูกค้าเพิ่ม 20% สุดสัปดาห์นี้'
          : 'AI predicts 20% more customers this weekend',
        action: language === 'th' ? 'เพิ่มพนักงานและสต็อก' : 'Increase staff and stock',
        category: 'operations',
        priority: 'medium'
      }
    ];
    setQuickInsights(insights);
  };

  const quickActions = [
    {
      text: language === 'th' ? 'วิเคราะห์ยอดขายวันนี้' : 'Analyze today\'s sales',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      text: language === 'th' ? 'แนะนำการตลาด' : 'Marketing suggestions',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      text: language === 'th' ? 'เพิ่มประสิทธิภาพเมนู' : 'Optimize menu',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      text: language === 'th' ? 'ข้อมูลลูกค้า' : 'Customer insights',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'th'
          ? `ขอบคุณสำหรับคำถาม! ฉันได้วิเคราะห์ข้อมูลของคุณแล้ว`
          : `Thank you for your question! I've analyzed your data`,
        timestamp: new Date(),
        insights: quickInsights.slice(0, 2),
        metrics: [
          {
            name: language === 'th' ? 'รายได้วันนี้' : 'Today\'s Revenue',
            value: '฿8,450',
            change: 12,
            trend: 'up'
          },
          {
            name: language === 'th' ? 'ลูกค้าใหม่' : 'New Customers',
            value: '23',
            change: 8,
            trend: 'up'
          }
        ]
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.text);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'tip': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
    generateQuickInsights(); // Regenerate insights in new language
  };

  if (compact && !isExpanded) {
    return (
      <Card className={`w-80 ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-sm">
                {language === 'th' ? 'ผู้ช่วย AI' : 'AI Assistant'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="h-6 w-6 p-0"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {showQuickInsights && (
            <div className="space-y-2">
              {quickInsights.slice(0, 2).map((insight) => (
                <div key={insight.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <p className="text-xs font-medium">{insight.title}</p>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col ${isExpanded ? 'h-96' : 'h-80'} ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">
                {language === 'th' ? 'ผู้ช่วยธุรกิจ AI' : 'AI Business Assistant'}
              </CardTitle>
              <p className="text-xs text-gray-500">
                {language === 'th' ? 'พร้อมช่วยเหลือ 24/7' : 'Available 24/7'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-6 w-6 p-0"
            >
              <Globe className="w-3 h-3" />
            </Button>
            {compact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-3">
        {/* Quick Insights */}
        {showQuickInsights && messages.length === 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="text-xs font-medium text-gray-600">
              {language === 'th' ? 'ข้อมูลเชิงลึกด่วน:' : 'Quick Insights:'}
            </h4>
            <div className="space-y-2">
              {quickInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                  <div className="flex items-start gap-2">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium">{insight.title}</p>
                        <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{insight.description}</p>
                      {insight.action && (
                        <p className="text-xs text-blue-600 font-medium">{insight.action}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-medium text-gray-600">
              {language === 'th' ? 'คำถามยอดนิยม:' : 'Quick Actions:'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center gap-2 p-2 text-left text-xs rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <action.icon className={`w-3 h-3 ${action.color}`} />
                  <span className="text-gray-700 truncate">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-3 overflow-y-auto flex-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`p-2 rounded-lg text-xs ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                  
                  {/* Insights */}
                  {message.insights && (
                    <div className="mt-2 space-y-1">
                      {message.insights.map((insight) => (
                        <div key={insight.id} className="p-2 bg-white bg-opacity-90 rounded border">
                          <div className="flex items-center gap-1 mb-1">
                            {getInsightIcon(insight.type)}
                            <span className="text-xs font-medium text-gray-800">{insight.title}</span>
                          </div>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Metrics */}
                  {message.metrics && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {message.metrics.map((metric, index) => (
                        <div key={index} className="p-2 bg-white bg-opacity-90 rounded border">
                          <p className="text-xs font-medium text-gray-800">{metric.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                            {metric.change && (
                              <span className={`text-xs ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                  <Bot className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                  <span className="text-xs text-gray-600">
                    {language === 'th' ? 'กำลังคิด...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Input */}
      <div className="p-3 pt-0">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'th' ? 'ถามเกี่ยวกับธุรกิจของคุณ...' : 'Ask about your business...'}
            className="flex-1 min-h-[32px] max-h-16 text-xs resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsListening(!isListening)}
              className="h-8 w-8 p-0"
            >
              {isListening ? <MicOff className="w-3 h-3 text-red-500" /> : <Mic className="w-3 h-3" />}
            </Button>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistantWidget;