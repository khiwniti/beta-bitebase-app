/**
 * Enhanced BiteBase AI Assistant
 * Comprehensive Business Intelligence for Restaurant & Cafe Industry
 */

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
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
  Clock,
  Star,
  Utensils,
  Coffee,
  PieChart,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Calendar,
  ShoppingCart,
  MessageSquare,
  Settings,
  Zap,
  Brain,
  Activity
} from "lucide-react";

// Business Intelligence Categories
const BI_CATEGORIES = {
  SALES: {
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
    keywords: ["sales", "revenue", "profit", "income", "earnings", "money", "financial"]
  },
  CUSTOMERS: {
    icon: Users,
    color: "text-blue-600", 
    bg: "bg-blue-50",
    keywords: ["customer", "guest", "visitor", "demographic", "satisfaction", "loyalty"]
  },
  OPERATIONS: {
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50", 
    keywords: ["operation", "efficiency", "staff", "inventory", "cost", "workflow"]
  },
  MARKETING: {
    icon: Target,
    color: "text-orange-600",
    bg: "bg-orange-50",
    keywords: ["marketing", "promotion", "campaign", "social", "brand", "advertising"]
  },
  MENU: {
    icon: Utensils,
    color: "text-red-600",
    bg: "bg-red-50",
    keywords: ["menu", "food", "dish", "recipe", "ingredient", "cuisine", "pricing"]
  },
  LOCATION: {
    icon: MapPin,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    keywords: ["location", "area", "competition", "market", "demographic", "foot traffic"]
  },
  ANALYTICS: {
    icon: BarChart3,
    color: "text-teal-600",
    bg: "bg-teal-50",
    keywords: ["analytics", "data", "trend", "forecast", "insight", "performance"]
  },
  STRATEGY: {
    icon: Brain,
    color: "text-pink-600",
    bg: "bg-pink-50",
    keywords: ["strategy", "plan", "growth", "expansion", "optimization", "improvement"]
  }
};

// Enhanced AI Prompts for Restaurant Business Intelligence
const ENHANCED_AI_PROMPTS = {
  SALES_ANALYSIS: `Analyze restaurant sales performance including:
- Revenue trends and patterns
- Peak hours and seasonal variations
- Average order value optimization
- Payment method preferences
- Upselling opportunities
- Price elasticity analysis`,

  CUSTOMER_INSIGHTS: `Provide customer intelligence including:
- Customer segmentation and personas
- Dining behavior patterns
- Satisfaction metrics and feedback analysis
- Loyalty program effectiveness
- Customer lifetime value
- Retention strategies`,

  OPERATIONAL_EFFICIENCY: `Evaluate operational performance:
- Staff productivity and scheduling optimization
- Kitchen efficiency and wait times
- Inventory turnover and waste reduction
- Cost control and margin analysis
- Quality consistency metrics
- Service speed optimization`,

  MARKETING_INTELLIGENCE: `Marketing performance analysis:
- Campaign ROI and effectiveness
- Social media engagement metrics
- Brand sentiment analysis
- Competitor positioning
- Customer acquisition costs
- Digital marketing optimization`,

  MENU_OPTIMIZATION: `Menu engineering insights:
- Item profitability analysis
- Popular vs profitable items
- Seasonal menu recommendations
- Pricing strategy optimization
- Ingredient cost analysis
- Dietary trend adaptation`,

  LOCATION_ANALYTICS: `Location-based intelligence:
- Foot traffic patterns
- Competitor analysis
- Market penetration
- Demographic alignment
- Delivery zone optimization
- Expansion opportunities`,

  PREDICTIVE_ANALYTICS: `Predictive business insights:
- Demand forecasting
- Seasonal trend predictions
- Customer behavior modeling
- Revenue projections
- Risk assessment
- Growth opportunity identification`,

  STRATEGIC_PLANNING: `Strategic business guidance:
- Market positioning strategy
- Competitive advantage development
- Growth planning and scaling
- Investment prioritization
- Risk mitigation strategies
- Innovation opportunities`
};

interface AIResponse {
  content: string;
  type: string;
  category?: keyof typeof BI_CATEGORIES;
  insights?: BusinessInsight[];
  recommendations?: Recommendation[];
  metrics?: Metric[];
  language: "th" | "en";
}

interface BusinessInsight {
  type: "opportunity" | "warning" | "trend" | "achievement";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
}

interface Recommendation {
  priority: "high" | "medium" | "low";
  action: string;
  expected_impact: string;
  timeline: string;
  resources_needed: string[];
}

interface Metric {
  name: string;
  value: string | number;
  change?: number;
  trend: "up" | "down" | "stable";
  benchmark?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  response?: AIResponse;
  category?: keyof typeof BI_CATEGORIES;
}

interface EnhancedBiteBaseAIProps {
  userId?: string;
  title?: string;
  placeholder?: string;
  className?: string;
  defaultLanguage?: "th" | "en";
  restaurantData?: any;
}

const EnhancedBiteBaseAI: React.FC<EnhancedBiteBaseAIProps> = ({
  userId = "default-user",
  title = "BiteBase Business Intelligence Assistant",
  placeholder = "Ask me anything about your restaurant business...",
  className = "",
  defaultLanguage = "en",
  restaurantData
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"th" | "en">(defaultLanguage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick action suggestions based on business intelligence
  const quickActions = [
    {
      category: "SALES" as keyof typeof BI_CATEGORIES,
      text: "Analyze my sales performance this month",
      icon: DollarSign
    },
    {
      category: "CUSTOMERS" as keyof typeof BI_CATEGORIES,
      text: "Show customer satisfaction insights",
      icon: Users
    },
    {
      category: "MENU" as keyof typeof BI_CATEGORIES,
      text: "Optimize my menu pricing strategy",
      icon: Utensils
    },
    {
      category: "MARKETING" as keyof typeof BI_CATEGORIES,
      text: "Suggest marketing campaigns for next month",
      icon: Target
    },
    {
      category: "OPERATIONS" as keyof typeof BI_CATEGORIES,
      text: "How can I improve operational efficiency?",
      icon: Activity
    },
    {
      category: "ANALYTICS" as keyof typeof BI_CATEGORIES,
      text: "Predict next quarter's performance",
      icon: BarChart3
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Categorize user input based on keywords
  const categorizeInput = (input: string): keyof typeof BI_CATEGORIES | null => {
    const lowerInput = input.toLowerCase();
    
    for (const [category, config] of Object.entries(BI_CATEGORIES)) {
      if (config.keywords.some(keyword => lowerInput.includes(keyword))) {
        return category as keyof typeof BI_CATEGORIES;
      }
    }
    return null;
  };

  // Enhanced AI response generation
  const generateEnhancedResponse = async (userInput: string, category?: keyof typeof BI_CATEGORIES): Promise<AIResponse> => {
    // Simulate AI processing with enhanced business intelligence
    await new Promise(resolve => setTimeout(resolve, 1500));

    const insights: BusinessInsight[] = [];
    const recommendations: Recommendation[] = [];
    const metrics: Metric[] = [];

    // Generate category-specific insights
    if (category) {
      switch (category) {
        case "SALES":
          insights.push({
            type: "trend",
            title: "Revenue Growth Trend",
            description: "Your sales have increased 15% compared to last month, driven by weekend dinner service.",
            impact: "high",
            confidence: 0.87
          });
          metrics.push(
            { name: "Monthly Revenue", value: "฿125,000", change: 15, trend: "up", benchmark: "Industry: ฿98,000" },
            { name: "Average Order Value", value: "฿450", change: 8, trend: "up", benchmark: "Target: ฿500" }
          );
          recommendations.push({
            priority: "high",
            action: "Implement dynamic pricing for peak hours",
            expected_impact: "10-15% revenue increase",
            timeline: "2 weeks",
            resources_needed: ["POS system update", "Staff training"]
          });
          break;

        case "CUSTOMERS":
          insights.push({
            type: "opportunity",
            title: "Customer Retention Opportunity",
            description: "30% of customers visit only once. Implementing a loyalty program could increase retention by 40%.",
            impact: "high",
            confidence: 0.82
          });
          metrics.push(
            { name: "Customer Satisfaction", value: "4.2/5", change: 5, trend: "up", benchmark: "Industry: 3.8/5" },
            { name: "Repeat Customer Rate", value: "35%", change: -2, trend: "down", benchmark: "Target: 50%" }
          );
          break;

        case "MENU":
          insights.push({
            type: "warning",
            title: "Menu Item Performance Gap",
            description: "3 menu items account for only 5% of sales but 20% of food costs. Consider removal or repricing.",
            impact: "medium",
            confidence: 0.91
          });
          recommendations.push({
            priority: "medium",
            action: "Redesign menu layout to highlight profitable items",
            expected_impact: "8-12% profit margin improvement",
            timeline: "1 week",
            resources_needed: ["Menu design", "Staff briefing"]
          });
          break;

        case "OPERATIONS":
          insights.push({
            type: "achievement",
            title: "Operational Efficiency Improved",
            description: "Kitchen wait times reduced by 25% after implementing new workflow system.",
            impact: "high",
            confidence: 0.95
          });
          metrics.push(
            { name: "Average Wait Time", value: "12 min", change: -25, trend: "down", benchmark: "Target: 10 min" },
            { name: "Staff Productivity", value: "85%", change: 12, trend: "up", benchmark: "Industry: 78%" }
          );
          break;
      }
    }

    // Generate contextual response based on input
    let content = "";
    if (language === "th") {
      content = `ขอบคุณสำหรับคำถามของคุณ! ฉันได้วิเคราะห์ข้อมูลธุรกิจของคุณแล้ว และพบข้อมูลเชิงลึกที่น่าสนใจ`;
    } else {
      content = `Thank you for your question! I've analyzed your restaurant data and found some valuable insights.`;
    }

    if (category) {
      const categoryConfig = BI_CATEGORIES[category];
      content += language === "th" 
        ? ` เกี่ยวกับด้าน${category.toLowerCase()} ของธุรกิจคุณ:`
        : ` Here's what I found about your ${category.toLowerCase()} performance:`;
    }

    return {
      content,
      type: "business_intelligence",
      category,
      insights,
      recommendations,
      metrics,
      language
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
      category: categorizeInput(input)
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateEnhancedResponse(input, userMessage.category);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        response,
        category: response.category
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: language === "th" 
          ? "ขออภัย เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง"
          : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.text);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "th" ? "en" : "th");
  };

  const renderInsights = (insights: BusinessInsight[]) => (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700">Business Insights:</h4>
      {insights.map((insight, index) => (
        <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
          {insight.type === "opportunity" && <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />}
          {insight.type === "warning" && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />}
          {insight.type === "trend" && <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />}
          {insight.type === "achievement" && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">{insight.title}</span>
              <Badge variant={insight.impact === "high" ? "destructive" : insight.impact === "medium" ? "default" : "secondary"} className="text-xs">
                {insight.impact} impact
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
            <div className="text-xs text-gray-500 mt-1">
              Confidence: {Math.round(insight.confidence * 100)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMetrics = (metrics: Metric[]) => (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700">Key Metrics:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <div key={index} className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">{metric.name}</span>
              {metric.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
              {metric.trend === "down" && <TrendingDown className="w-3 h-3 text-red-500" />}
              {metric.trend === "stable" && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
            </div>
            <div className="text-sm font-bold text-gray-900">{metric.value}</div>
            {metric.change && (
              <div className={`text-xs ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </div>
            )}
            {metric.benchmark && (
              <div className="text-xs text-gray-500">{metric.benchmark}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = (recommendations: Recommendation[]) => (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium text-gray-700">Recommendations:</h4>
      {recommendations.map((rec, index) => (
        <div key={index} className="p-2 bg-blue-50 rounded-lg border-l-2 border-blue-400">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"} className="text-xs">
              {rec.priority} priority
            </Badge>
            <span className="text-xs text-gray-500">{rec.timeline}</span>
          </div>
          <p className="text-xs font-medium text-gray-800">{rec.action}</p>
          <p className="text-xs text-gray-600 mt-1">Expected: {rec.expected_impact}</p>
          <div className="text-xs text-gray-500 mt-1">
            Resources: {rec.resources_needed.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <p className="text-xs text-gray-500">
                {language === "th" ? "ผู้ช่วยธุรกิจอัจฉริยะ" : "Intelligent Business Assistant"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-7 w-7 p-0"
            >
              <Globe className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-7 w-7 p-0"
            >
              <Trash className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-3">
        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="text-xs font-medium text-gray-600">
              {language === "th" ? "คำถามยอดนิยม:" : "Quick Actions:"}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => {
                const categoryConfig = BI_CATEGORIES[action.category];
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className={`flex items-center gap-2 p-2 text-left text-xs rounded-lg border hover:bg-gray-50 transition-colors ${categoryConfig.bg} border-gray-200`}
                  >
                    <IconComponent className={`w-3 h-3 ${categoryConfig.color}`} />
                    <span className="text-gray-700">{action.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-3 overflow-y-auto max-h-96">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] ${message.role === "user" ? "order-1" : ""}`}>
                <div
                  className={`p-2 rounded-lg text-xs ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                  
                  {/* Enhanced AI Response Components */}
                  {message.response?.insights && renderInsights(message.response.insights)}
                  {message.response?.metrics && renderMetrics(message.response.metrics)}
                  {message.response?.recommendations && renderRecommendations(message.response.recommendations)}
                </div>
                
                {/* Category Badge */}
                {message.category && (
                  <div className="flex items-center gap-1 mt-1">
                    {React.createElement(BI_CATEGORIES[message.category].icon, {
                      className: `w-3 h-3 ${BI_CATEGORIES[message.category].color}`
                    })}
                    <span className="text-xs text-gray-500">{message.category}</span>
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === "user" && (
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                  <Bot className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[36px] max-h-20 text-xs resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="h-9 w-9 p-0"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedBiteBaseAI;