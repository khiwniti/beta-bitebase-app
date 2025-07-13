'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import ImprovedBiteBaseAI from '../ai/ImprovedBiteBaseAI';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  Zap,
  MessageSquare,
  ChevronRight,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'trend' | 'achievement' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: string;
  actionable: boolean;
  timestamp: Date;
}

interface AIRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  expected_impact: string;
  timeline: string;
  category: string;
  implemented?: boolean;
}

const AIInsightsPanel: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate initial AI insights
  useEffect(() => {
    generateInitialInsights();
  }, []);

  const generateInitialInsights = () => {
    const initialInsights: AIInsight[] = [
      {
        id: 'insight_001',
        type: 'opportunity',
        title: 'Peak Hour Revenue Optimization',
        description: 'Your 7-9 PM slot shows 40% higher customer volume but only 15% price premium. Dynamic pricing could increase revenue by ฿25,000/month.',
        impact: 'high',
        confidence: 0.87,
        category: 'pricing',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: 'insight_002',
        type: 'warning',
        title: 'Customer Retention Declining',
        description: 'First-time customer return rate dropped from 45% to 32% this month. Loyalty program implementation is recommended.',
        impact: 'high',
        confidence: 0.82,
        category: 'customer',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: 'insight_003',
        type: 'trend',
        title: 'Healthy Menu Items Trending',
        description: 'Salads and vegetarian options show 35% higher growth rate. Consider expanding healthy menu section.',
        impact: 'medium',
        confidence: 0.91,
        category: 'menu',
        actionable: true,
        timestamp: new Date()
      },
      {
        id: 'insight_004',
        type: 'achievement',
        title: 'Operational Efficiency Improved',
        description: 'Kitchen wait times reduced by 25% after workflow optimization. Customer satisfaction increased to 4.6/5.',
        impact: 'high',
        confidence: 0.95,
        category: 'operations',
        actionable: false,
        timestamp: new Date()
      },
      {
        id: 'insight_005',
        type: 'prediction',
        title: 'Weekend Demand Forecast',
        description: 'AI predicts 20% higher demand this weekend due to local events. Consider increasing staff and inventory.',
        impact: 'medium',
        confidence: 0.78,
        category: 'operations',
        actionable: true,
        timestamp: new Date()
      }
    ];

    const initialRecommendations: AIRecommendation[] = [
      {
        id: 'rec_001',
        priority: 'high',
        action: 'Implement dynamic pricing for peak hours (7-9 PM)',
        expected_impact: '฿25,000 additional monthly revenue',
        timeline: '2 weeks',
        category: 'pricing'
      },
      {
        id: 'rec_002',
        priority: 'high',
        action: 'Launch customer loyalty program with points system',
        expected_impact: '15% increase in customer retention',
        timeline: '3 weeks',
        category: 'customer'
      },
      {
        id: 'rec_003',
        priority: 'medium',
        action: 'Add 3-4 new healthy menu options',
        expected_impact: '8% increase in average order value',
        timeline: '1 week',
        category: 'menu'
      },
      {
        id: 'rec_004',
        priority: 'medium',
        action: 'Increase weekend staffing by 30%',
        expected_impact: 'Maintain service quality during high demand',
        timeline: 'This weekend',
        category: 'operations'
      }
    ];

    setInsights(initialInsights);
    setRecommendations(initialRecommendations);
  };

  const handleInsightGenerated = (insight: any) => {
    const newInsight: AIInsight = {
      id: `insight_${Date.now()}`,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      impact: insight.impact,
      confidence: insight.confidence,
      category: insight.category || 'general',
      actionable: true,
      timestamp: new Date()
    };
    setInsights(prev => [newInsight, ...prev]);
  };

  const handleRecommendationCreated = (recommendation: any) => {
    const newRecommendation: AIRecommendation = {
      id: `rec_${Date.now()}`,
      priority: recommendation.priority,
      action: recommendation.action,
      expected_impact: recommendation.expected_impact,
      timeline: recommendation.timeline,
      category: recommendation.category || 'general'
    };
    setRecommendations(prev => [newRecommendation, ...prev]);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate new insights
    const newInsight: AIInsight = {
      id: `insight_${Date.now()}`,
      type: 'opportunity',
      title: 'Social Media Engagement Opportunity',
      description: 'Your Instagram engagement rate is 40% below industry average. Implementing a photo contest could increase followers by 25%.',
      impact: 'medium',
      confidence: 0.73,
      category: 'marketing',
      actionable: true,
      timestamp: new Date()
    };
    
    setInsights(prev => [newInsight, ...prev]);
    setIsAnalyzing(false);
  };

  const implementRecommendation = (recId: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recId ? { ...rec, implemented: true } : rec
      )
    );
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'achievement': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'prediction': return <Brain className="w-4 h-4 text-purple-500" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing': return <DollarSign className="w-3 h-3" />;
      case 'customer': return <Users className="w-3 h-3" />;
      case 'menu': return <Target className="w-3 h-3" />;
      case 'operations': return <Activity className="w-3 h-3" />;
      case 'marketing': return <MessageSquare className="w-3 h-3" />;
      default: return <BarChart3 className="w-3 h-3" />;
    }
  };

  const highPriorityInsights = insights.filter(insight => 
    insight.impact === 'high' && insight.actionable
  ).slice(0, 3);

  const criticalRecommendations = recommendations.filter(rec => 
    rec.priority === 'critical' || rec.priority === 'high'
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Insights</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommendations</p>
                <p className="text-2xl font-bold">{recommendations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Implemented</p>
                <p className="text-2xl font-bold">
                  {recommendations.filter(r => r.implemented).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Insights */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              High Priority Insights
            </CardTitle>
            <Button
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              size="sm"
              variant="outline"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {highPriorityInsights.map((insight) => (
            <div key={insight.id} className="p-3 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant={insight.impact === 'high' ? 'destructive' : 'default'} className="text-xs">
                      {insight.impact}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(insight.category)}
                      <span className="text-xs text-gray-500">{insight.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <Progress value={insight.confidence * 100} className="w-16 h-1" />
                      <span className="text-xs text-gray-500">{Math.round(insight.confidence * 100)}%</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {insight.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Critical Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Critical Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {criticalRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={recommendation.priority === 'critical' ? 'destructive' : 'default'} className="text-xs">
                      {recommendation.priority}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(recommendation.category)}
                      <span className="text-xs text-gray-500">{recommendation.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {recommendation.timeline}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{recommendation.action}</h4>
                  <p className="text-sm text-gray-600 mb-2">Expected: {recommendation.expected_impact}</p>
                </div>
                <Button
                  onClick={() => implementRecommendation(recommendation.id)}
                  disabled={recommendation.implemented}
                  size="sm"
                  variant={recommendation.implemented ? "secondary" : "default"}
                >
                  {recommendation.implemented ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Done
                    </>
                  ) : (
                    <>
                      Implement
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Chat Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              AI Business Assistant
            </CardTitle>
            <Button
              onClick={() => setShowChat(!showChat)}
              variant="outline"
              size="sm"
            >
              {showChat ? 'Hide Chat' : 'Open Chat'}
            </Button>
          </div>
        </CardHeader>
        {showChat && (
          <CardContent>
            <div className="h-96">
              <ImprovedBiteBaseAI
                userId="dashboard-ai"
                title="Dashboard AI Assistant"
                placeholder="Ask me about your business performance, insights, or recommendations..."
                className="h-full"
                onInsightGenerated={handleInsightGenerated}
                onRecommendationCreated={handleRecommendationCreated}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIInsightsPanel;