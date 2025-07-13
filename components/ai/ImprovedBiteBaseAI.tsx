'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Bot,
  Send,
  Trash,
  User,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Star,
  Utensils,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Activity,
  Brain,
  Zap,
  MessageSquare,
  Settings,
  Mic,
  MicOff,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Share,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useRestaurantData } from '../../hooks/useRestaurantData';

// Enhanced AI Response Types
interface AIResponse {
  content: string;
  type: 'business_intelligence' | 'recommendation' | 'analysis' | 'prediction';
  category?: string;
  insights?: BusinessInsight[];
  recommendations?: Recommendation[];
  metrics?: Metric[];
  charts?: ChartData[];
  language: 'th' | 'en';
  confidence: number;
  sources?: string[];
  actionItems?: ActionItem[];
}

interface BusinessInsight {
  type: 'opportunity' | 'warning' | 'trend' | 'achievement' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  priority: number;
  timeframe?: string;
  category: string;
}

interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  expected_impact: string;
  timeline: string;
  resources_needed: string[];
  cost_estimate?: string;
  roi_estimate?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Metric {
  name: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  benchmark?: string;
  target?: string;
  unit?: string;
  period?: string;
}

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: any[];
  labels: string[];
  colors?: string[];
}

interface ActionItem {
  id: string;
  task: string;
  deadline: string;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  response?: AIResponse;
  category?: string;
  liked?: boolean;
  copied?: boolean;
  tokens?: number;
}

interface ImprovedBiteBaseAIProps {
  userId?: string;
  title?: string;
  placeholder?: string;
  className?: string;
  defaultLanguage?: 'th' | 'en';
  restaurantData?: any;
  onInsightGenerated?: (insight: BusinessInsight) => void;
  onRecommendationCreated?: (recommendation: Recommendation) => void;
  isFloating?: boolean;
}

const ImprovedBiteBaseAI: React.FC<ImprovedBiteBaseAIProps> = ({
  userId = 'default-user',
  title = 'BiteBase AI Assistant',
  placeholder = 'Ask me anything about your restaurant business...',
  className = '',
  defaultLanguage = 'en',
  restaurantData,
  onInsightGenerated,
  onRecommendationCreated,
  isFloating = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'th' | 'en'>(defaultLanguage);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get real restaurant data
  const { restaurants, analytics, isLoading: dataLoading } = useRestaurantData();

  // Enhanced quick actions with real data integration
  const quickActions = [
    {
      category: 'sales',
      text: language === 'th' ? 'วิเคราะห์ยอดขายเดือนนี้' : 'Analyze this month\'s sales performance',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      category: 'customers',
      text: language === 'th' ? 'แสดงข้อมูลเชิงลึกลูกค้า' : 'Show customer satisfaction insights',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      category: 'menu',
      text: language === 'th' ? 'เพิ่มประสิทธิภาพเมนู' : 'Optimize my menu pricing strategy',
      icon: Utensils,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      category: 'marketing',
      text: language === 'th' ? 'แนะนำแคมเปญการตลาด' : 'Suggest marketing campaigns',
      icon: Target,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      category: 'operations',
      text: language === 'th' ? 'ปรับปรุงประสิทธิภาพการดำเนินงาน' : 'Improve operational efficiency',
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      category: 'analytics',
      text: language === 'th' ? 'ทำนายผลประกอบการไตรมาสหน้า' : 'Predict next quarter performance',
      icon: BarChart3,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    }
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Enhanced AI response generation with real data
  const generateEnhancedResponse = async (userInput: string): Promise<AIResponse> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to backend AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      const insights: BusinessInsight[] = [];
      const recommendations: Recommendation[] = [];
      const metrics: Metric[] = [];
      const actionItems: ActionItem[] = [];

      // Generate insights based on real restaurant data
      if (restaurants && restaurants.length > 0) {
        insights.push({
          type: 'trend',
          title: language === 'th' ? 'แนวโน้มการเติบโตของตลาด' : 'Market Growth Trend',
          description: language === 'th' 
            ? `พบร้านอาหาร ${restaurants.length} แห่งในพื้นที่ของคุณ แสดงถึงตลาดที่มีการแข่งขันสูง`
            : `Found ${restaurants.length} restaurants in your area, indicating a highly competitive market`,
          impact: 'high',
          confidence: 0.87,
          priority: 1,
          timeframe: '3 months',
          category: 'market'
        });
      }

      if (analytics) {
        metrics.push(
          {
            name: language === 'th' ? 'รายได้รายเดือน' : 'Monthly Revenue',
            value: '฿125,000',
            change: 15,
            trend: 'up',
            benchmark: 'Industry: ฿98,000',
            target: '฿150,000',
            unit: 'THB',
            period: 'monthly'
          },
          {
            name: language === 'th' ? 'ค่าเฉลี่ยต่อออเดอร์' : 'Average Order Value',
            value: '฿450',
            change: 8,
            trend: 'up',
            benchmark: 'Target: ฿500',
            unit: 'THB',
            period: 'daily'
          },
          {
            name: language === 'th' ? 'คะแนนความพึงพอใจ' : 'Customer Satisfaction',
            value: '4.2/5',
            change: 5,
            trend: 'up',
            benchmark: 'Industry: 3.8/5',
            unit: 'rating',
            period: 'monthly'
          }
        );

        recommendations.push({
          id: 'rec_001',
          priority: 'high',
          action: language === 'th' 
            ? 'ปรับราคาแบบไดนามิกในช่วงเวลาเร่งด่วน'
            : 'Implement dynamic pricing for peak hours',
          expected_impact: language === 'th' ? 'เพิ่มรายได้ 10-15%' : '10-15% revenue increase',
          timeline: language === 'th' ? '2 สัปดาห์' : '2 weeks',
          resources_needed: [
            language === 'th' ? 'อัปเดตระบบ POS' : 'POS system update',
            language === 'th' ? 'อบรมพนักงาน' : 'Staff training'
          ],
          cost_estimate: '฿15,000',
          roi_estimate: '300%',
          difficulty: 'medium',
          category: 'pricing'
        });

        actionItems.push({
          id: 'action_001',
          task: language === 'th' ? 'ติดตั้งระบบการจองออนไลน์' : 'Install online reservation system',
          deadline: '2024-08-15',
          assignee: 'Restaurant Manager',
          status: 'pending',
          priority: 'high'
        });
      }

      const content = language === 'th'
        ? `ขอบคุณสำหรับคำถามของคุณ! ฉันได้วิเคราะห์ข้อมูลธุรกิจของคุณแล้ว และพบข้อมูลเชิงลึกที่น่าสนใจ`
        : `Thank you for your question! I've analyzed your restaurant data and found valuable insights.`;

      return {
        content,
        type: 'business_intelligence',
        category: 'general',
        insights,
        recommendations,
        metrics,
        actionItems,
        language,
        confidence: 0.89,
        sources: ['Restaurant Data', 'Market Analysis', 'Industry Benchmarks']
      };
    } catch (error) {
      console.error('AI Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: input,
      timestamp: new Date(),
      tokens: input.split(' ').length
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await generateEnhancedResponse(input);
      
      const assistantMessage: Message = {
        id: messageId + '_response',
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        response,
        tokens: response.content.split(' ').length
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Trigger callbacks
      if (response.insights && onInsightGenerated) {
        response.insights.forEach(insight => onInsightGenerated(insight));
      }
      if (response.recommendations && onRecommendationCreated) {
        response.recommendations.forEach(rec => onRecommendationCreated(rec));
      }
    } catch (error) {
      const errorMessage: Message = {
        id: messageId + '_error',
        role: 'assistant',
        content: language === 'th' 
          ? 'ขออภัย เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง'
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.text);
    setSelectedCategory(action.category);
  };

  const handleLike = (messageId: string, liked: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, liked } : msg
    ));
  };

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, copied: true } : msg
    ));
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, copied: false } : msg
      ));
    }, 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  const exportChat = () => {
    const chatData = {
      messages,
      timestamp: new Date().toISOString(),
      language,
      userId
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitebase-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Voice recognition (placeholder)
  const toggleVoice = () => {
    setIsListening(!isListening);
    // Implement voice recognition here
  };

  const renderInsights = (insights: BusinessInsight[]) => (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700">
        {language === 'th' ? 'ข้อมูลเชิงลึก:' : 'Business Insights:'}
      </h4>
      {insights.map((insight, index) => (
        <div key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
          {insight.type === 'opportunity' && <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />}
          {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />}
          {insight.type === 'trend' && <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />}
          {insight.type === 'achievement' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />}
          {insight.type === 'prediction' && <Brain className="w-4 h-4 text-purple-500 mt-0.5" />}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{insight.title}</span>
              <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                {insight.impact}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
              {insight.timeframe && <span>Timeframe: {insight.timeframe}</span>}
              <Progress value={insight.confidence * 100} className="w-16 h-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMetrics = (metrics: Metric[]) => (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700">
        {language === 'th' ? 'ตัวชี้วัดหลัก:' : 'Key Metrics:'}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <div key={index} className="p-3 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{metric.name}</span>
              {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
              {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
              {metric.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">{metric.value}</div>
            {metric.change && (
              <div className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'} mb-1`}>
                {metric.change > 0 ? '+' : ''}{metric.change}% {metric.period && `(${metric.period})`}
              </div>
            )}
            {metric.benchmark && (
              <div className="text-xs text-gray-500">{metric.benchmark}</div>
            )}
            {metric.target && (
              <div className="text-xs text-blue-600">Target: {metric.target}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = (recommendations: Recommendation[]) => (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700">
        {language === 'th' ? 'คำแนะนำ:' : 'Recommendations:'}
      </h4>
      {recommendations.map((rec, index) => (
        <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={rec.priority === 'critical' ? 'destructive' : rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
              {rec.priority}
            </Badge>
            <span className="text-xs text-gray-500">{rec.timeline}</span>
            <Badge variant="outline" className="text-xs">
              {rec.difficulty}
            </Badge>
          </div>
          <p className="text-sm font-medium text-gray-800 mb-1">{rec.action}</p>
          <p className="text-sm text-gray-600 mb-2">Expected: {rec.expected_impact}</p>
          {rec.roi_estimate && (
            <p className="text-sm text-green-600 mb-1">ROI: {rec.roi_estimate}</p>
          )}
          {rec.cost_estimate && (
            <p className="text-sm text-orange-600 mb-2">Cost: {rec.cost_estimate}</p>
          )}
          <div className="text-xs text-gray-500">
            Resources: {rec.resources_needed.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );

  const renderActionItems = (actionItems: ActionItem[]) => (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700">
        {language === 'th' ? 'รายการงาน:' : 'Action Items:'}
      </h4>
      {actionItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border">
          <CheckCircle className={`w-4 h-4 ${item.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
          <div className="flex-1">
            <p className="text-sm font-medium">{item.task}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Due: {item.deadline}</span>
              {item.assignee && <span>Assignee: {item.assignee}</span>}
              <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                {item.priority}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className={`flex flex-col h-full ${className} ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <p className="text-xs text-gray-500">
                {language === 'th' ? 'ผู้ช่วยธุรกิจอัจฉริยะ' : 'Intelligent Business Assistant'}
                {dataLoading && <span className="ml-2 text-amber-500">Loading data...</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={toggleVoice} className="h-7 w-7 p-0">
              {isListening ? <MicOff className="w-3 h-3 text-red-500" /> : <Mic className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-7 w-7 p-0">
              <Globe className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={exportChat} className="h-7 w-7 p-0">
              <Download className="w-3 h-3" />
            </Button>
            {!isFloating && (
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-7 w-7 p-0">
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearChat} className="h-7 w-7 p-0">
              <Trash className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-3">
        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="text-sm font-medium text-gray-600">
              {language === 'th' ? 'คำถามยอดนิยม:' : 'Quick Actions:'}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className={`flex items-center gap-2 p-3 text-left text-sm rounded-lg border hover:shadow-md transition-all ${action.bg} border-gray-200 hover:border-gray-300`}
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-gray-700">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4 overflow-y-auto max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                  
                  {/* Enhanced AI Response Components */}
                  {message.response?.insights && renderInsights(message.response.insights)}
                  {message.response?.metrics && renderMetrics(message.response.metrics)}
                  {message.response?.recommendations && renderRecommendations(message.response.recommendations)}
                  {message.response?.actionItems && renderActionItems(message.response.actionItems)}
                </div>
                
                {/* Message Actions */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(message.id, !message.liked)}
                      className="h-6 w-6 p-0"
                    >
                      <ThumbsUp className={`w-3 h-3 ${message.liked ? 'text-blue-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(message.id, message.content)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className={`w-3 h-3 ${message.copied ? 'text-green-500' : 'text-gray-400'}`} />
                    </Button>
                    {message.response?.confidence && (
                      <span className="text-xs text-gray-500">
                        {Math.round(message.response.confidence * 100)}% confident
                      </span>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.tokens && <span>{message.tokens} tokens</span>}
                </div>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                  <span className="text-sm text-gray-600">
                    {language === 'th' ? 'กำลังวิเคราะห์...' : 'Analyzing your data...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="flex-shrink-0 p-3 pt-0">
        <div className="flex gap-2 w-full">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[40px] max-h-24 text-sm resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImprovedBiteBaseAI;