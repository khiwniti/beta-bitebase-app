'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'High' | 'Medium' | 'Low';
  category: string;
  actionable: boolean;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const AIInsightsTab: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI restaurant advisor. I can help you with market analysis, menu optimization, pricing strategies, and more. What would you like to know?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  // Mock AI insights
  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'recommendation',
      title: 'Optimize Menu Pricing',
      description: 'Based on competitor analysis, you can increase prices on signature dishes by 8-12% without significant demand impact.',
      confidence: 87,
      impact: 'High',
      category: 'Pricing',
      actionable: true,
      timestamp: '2025-07-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Weekend Rush Forecast',
      description: 'Expect 35% higher foot traffic this weekend due to local events. Consider increasing staff by 2-3 members.',
      confidence: 92,
      impact: 'High',
      category: 'Operations',
      actionable: true,
      timestamp: '2025-07-15T09:15:00Z'
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'New Market Segment',
      description: 'Growing demand for plant-based options in your area. 23% of nearby customers actively seek vegan alternatives.',
      confidence: 78,
      impact: 'Medium',
      category: 'Menu Development',
      actionable: true,
      timestamp: '2025-07-15T08:45:00Z'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Competitor Price Drop',
      description: 'Main competitor reduced lunch prices by 15%. Monitor customer retention and consider promotional response.',
      confidence: 95,
      impact: 'Medium',
      category: 'Competition',
      actionable: true,
      timestamp: '2025-07-15T07:20:00Z'
    },
    {
      id: '5',
      type: 'recommendation',
      title: 'Peak Hour Optimization',
      description: 'Implement dynamic pricing during 7-9 PM to manage demand and increase revenue by estimated 12%.',
      confidence: 84,
      impact: 'High',
      category: 'Revenue',
      actionable: true,
      timestamp: '2025-07-14T16:30:00Z'
    }
  ];

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "Based on your current market position, I recommend focusing on customer retention strategies. Your repeat customer rate could improve by 15-20% with targeted loyalty programs.",
      "The data shows optimal pricing for your signature dishes would be 8-12% higher than current levels. This could increase revenue by $2,400 monthly.",
      "I've analyzed foot traffic patterns and suggest extending weekend hours. The 9-11 PM slot shows 40% untapped demand in your area.",
      "Your menu analysis reveals that plant-based options could capture an additional 23% market share. Consider adding 2-3 vegan dishes.",
      "Competitor analysis indicates you're well-positioned in the premium segment. Focus on service quality to maintain your 4.7-star advantage."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'prediction': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'opportunity': return <Target className="w-5 h-5 text-purple-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-blue-600" />
            AI Insights
          </h2>
          <p className="text-gray-600">Get intelligent recommendations and predictions for your restaurant</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Chat Interface */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about your restaurant performance, market trends, or get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.type === 'ai' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about menu optimization, pricing, market trends..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick AI Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">Analyze Performance</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm">Market Opportunities</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm">Pricing Strategy</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Customer Insights</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Latest Insights
              </CardTitle>
              <CardDescription>
                AI-generated recommendations based on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedInsight?.id === insight.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact}
                        </Badge>
                        <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      {insight.actionable && (
                        <Button size="sm" variant="ghost" className="text-xs h-6">
                          Take Action
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insight Detail */}
          {selectedInsight && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getInsightIcon(selectedInsight.type)}
                  Insight Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{selectedInsight.title}</h3>
                    <p className="text-gray-700 text-sm mb-3">{selectedInsight.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className={`text-lg font-bold ${getConfidenceColor(selectedInsight.confidence)}`}>
                        {selectedInsight.confidence}%
                      </div>
                      <div className="text-xs text-gray-600">Confidence</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {selectedInsight.impact}
                      </div>
                      <div className="text-xs text-gray-600">Impact Level</div>
                    </div>
                  </div>

                  {selectedInsight.actionable && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recommended Actions:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Review current pricing strategy</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Analyze competitor responses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Implement gradual changes</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      Implement Suggestion
                    </Button>
                    <Button size="sm" variant="outline">
                      Get More Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsTab;