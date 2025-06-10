"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { 
  Sparkles,
  Send,
  RefreshCw,
  ArrowRight,
  ChevronUp,
  Info,
  BookOpen,
  Globe,
  CheckCircle2,
  Search,
  Edit,
  Copy
} from "lucide-react";

type Topic = {
  id: number;
  topic: string;
  keywords: string[];
  difficulty: "easy" | "medium" | "hard";
  searchVolume: "low" | "medium" | "high";
  competition: "low" | "medium" | "high";
  score: number;
};

export default function SEOOptimizationPage() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [activeTab, setActiveTab] = useState("topic-research");
  
  const [topicSuggestions, setTopicSuggestions] = useState<Topic[]>([
    {
      id: 1,
      topic: "Restaurant Analytics: How to Use Data to Increase Profit Margins",
      keywords: ["restaurant analytics", "profit margins", "data-driven decisions"],
      difficulty: "medium",
      searchVolume: "medium",
      competition: "medium",
      score: 78
    },
    {
      id: 2,
      topic: "10 Essential KPIs Every Restaurant Owner Should Track",
      keywords: ["restaurant KPIs", "metrics", "business performance"],
      difficulty: "easy",
      searchVolume: "high",
      competition: "high",
      score: 85
    },
    {
      id: 3,
      topic: "How to Choose the Best Location for Your New Restaurant",
      keywords: ["restaurant location", "site selection", "location analysis"],
      difficulty: "medium",
      searchVolume: "high",
      competition: "medium",
      score: 92
    },
    {
      id: 4,
      topic: "Understanding Food Cost Percentage and How to Optimize It",
      keywords: ["food cost percentage", "menu pricing", "restaurant profitability"],
      difficulty: "hard",
      searchVolume: "medium",
      competition: "low",
      score: 73
    },
    {
      id: 5,
      topic: "How AI is Transforming the Restaurant Industry",
      keywords: ["AI in restaurants", "restaurant technology", "digital transformation"],
      difficulty: "medium",
      searchVolume: "high",
      competition: "medium",
      score: 88
    }
  ]);

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    "restaurant analytics",
    "business intelligence",
    "data-driven decisions",
    "restaurant profit",
    "menu optimization"
  ]);

  const handleGenerateContent = () => {
    setIsGenerating(true);
    setGeneratedContent("");
    
    // Simulate API call to generate content
    setTimeout(() => {
      const sampleContent = `
# Restaurant Analytics: How to Use Data to Increase Profit Margins

## Introduction

In today's competitive restaurant industry, intuition and experience are no longer enough to maximize profits. The restaurants that thrive are increasingly those that leverage data analytics to make informed decisions. This article explores how restaurateurs can harness the power of data to boost their profit margins.

## What is Restaurant Analytics?

Restaurant analytics refers to the process of collecting, analyzing, and interpreting data related to your restaurant's operations. This includes sales data, inventory management, customer behavior, staff performance, and more. By analyzing this information, you can identify trends, spot inefficiencies, and make data-driven decisions to improve profitability.

## Key Areas Where Analytics Can Improve Profit Margins

### 1. Menu Engineering

Data analytics can reveal which menu items are most profitable and which are underperforming. By analyzing metrics like food cost percentage, contribution margin, and sales volume, you can optimize your menu to highlight high-profit items and adjust or remove those that aren't performing well.

**Key metrics to track:**
- Food cost percentage per item
- Contribution margin per dish
- Sales volume
- Menu item popularity vs. profitability

### 2. Inventory Management

Improper inventory management leads to waste, which directly impacts your bottom line. Analytics tools can help you:

- Forecast ingredient needs based on historical sales data
- Track waste patterns
- Optimize order quantities
- Identify theft or discrepancies

### 3. Staff Scheduling and Performance

Labor costs typically account for 30-35% of a restaurant's expenses. Analytics can help optimize scheduling by:

- Identifying peak hours requiring more staff
- Measuring individual server performance (average ticket size, upselling success)
- Reducing over-staffing during slower periods

### 4. Customer Behavior Analysis

Understanding your customers' preferences and behaviors can help you tailor your offerings and marketing strategies:

- Track which promotions drive the most traffic
- Analyze customer demographic data
- Identify repeat customers and their preferences
- Determine optimal pricing strategies

## Implementing Analytics in Your Restaurant

### Step 1: Identify Your Goals

Before diving into analytics, clearly define what you want to achieve. Are you looking to reduce food waste? Increase average check size? Optimize staffing? Having clear objectives will guide which data you collect and analyze.

### Step 2: Choose the Right Tools

Several restaurant analytics platforms are available, ranging from basic POS systems with built-in reporting to comprehensive business intelligence solutions. Choose tools that align with your specific needs and budget.

### Step 3: Collect Relevant Data

Ensure you're systematically collecting data across all aspects of your operation:
- Sales data from your POS system
- Inventory levels and usage
- Customer information and feedback
- Staff performance metrics
- Online ordering and delivery data

### Step 4: Analyze and Act

Data is only valuable if you use it to make decisions. Regularly review your analytics and implement changes based on the insights you gather.

## Case Study: How BiteBase Helped Increase Profits

[Restaurant name], a mid-sized casual dining establishment, implemented BiteBase's analytics platform and saw a 15% increase in profit margins within six months by:

- Redesigning their menu based on profitability analysis
- Reducing food waste by 22% through better inventory management
- Optimizing staff scheduling during peak hours
- Implementing targeted marketing campaigns based on customer data

## Conclusion

In an industry with typically thin profit margins, using data analytics can provide the competitive edge needed to thrive. By making data-driven decisions about your menu, inventory, staffing, and customer engagement strategies, you can significantly improve your restaurant's profitability while enhancing the customer experience.

Ready to transform your restaurant with data? [Call to action about BiteBase's analytics platform]
`;
      
      setGeneratedContent(sampleContent);
      setIsGenerating(false);
    }, 3000);
  };
  
  const handleAnalyzeKeywords = () => {
    setIsAnalyzing(true);
    
    // Simulate API call to analyze keywords
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleKeywordToggle = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const generateKeywordSuggestions = () => {
    const keywords = [
      "restaurant management",
      "restaurant technology",
      "menu pricing strategy",
      "restaurant customer retention",
      "food service analytics",
      "restaurant revenue optimization",
      "restaurant marketing",
      "restaurant KPIs",
      "restaurant performance metrics",
      "hospitality industry",
      "restaurant growth strategies",
      "restaurant customer experience",
      "food and beverage analytics"
    ];
    
    return keywords.filter(k => !selectedKeywords.includes(k)).slice(0, 5);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SEO Optimization Suite</h1>
        <p className="text-gray-600">Optimize your content strategy with AI-assisted SEO tools</p>
      </div>
      
      <Tabs defaultValue="topic-research" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="topic-research">
            <Search className="h-4 w-4 mr-2" />
            Topic Research
          </TabsTrigger>
          <TabsTrigger value="content-generator">
            <Sparkles className="h-4 w-4 mr-2" />
            Content Generator
          </TabsTrigger>
          <TabsTrigger value="seo-analyzer">
            <Globe className="h-4 w-4 mr-2" />
            SEO Analyzer
          </TabsTrigger>
        </TabsList>
        
        {/* Topic Research Tab */}
        <TabsContent value="topic-research">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Research</CardTitle>
                  <CardDescription>
                    Add keywords to find relevant topic ideas for your blog
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selected Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {keyword}
                          <button
                            type="button"
                            className="ml-1 inline-flex text-primary-500 hover:text-primary-600"
                            onClick={() => handleKeywordToggle(keyword)}
                          >
                            <span className="sr-only">Remove</span>
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suggested Keywords
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {generateKeywordSuggestions().map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleKeywordToggle(keyword)}
                        >
                          + {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleAnalyzeKeywords}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze Keywords
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Topics</CardTitle>
                  <CardDescription>
                    AI-suggested blog topics based on keyword analysis and market trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topicSuggestions.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{topic.topic}</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {topic.keywords.map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-50 text-primary-700">
                              <span className="font-bold text-sm">{topic.score}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block">Difficulty</span>
                            <span
                              className={`inline-flex items-center mt-1 ${
                                topic.difficulty === "easy"
                                  ? "text-green-600"
                                  : topic.difficulty === "medium"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {topic.difficulty === "easy"
                                ? "Easy"
                                : topic.difficulty === "medium"
                                ? "Medium"
                                : "Hard"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Search Volume</span>
                            <span
                              className={`inline-flex items-center mt-1 ${
                                topic.searchVolume === "high"
                                  ? "text-green-600"
                                  : topic.searchVolume === "medium"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {topic.searchVolume === "high"
                                ? "High"
                                : topic.searchVolume === "medium"
                                ? "Medium"
                                : "Low"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Competition</span>
                            <span
                              className={`inline-flex items-center mt-1 ${
                                topic.competition === "low"
                                  ? "text-green-600"
                                  : topic.competition === "medium"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {topic.competition === "low"
                                ? "Low"
                                : topic.competition === "medium"
                                ? "Medium"
                                : "High"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveTab("content-generator");
                              setAiPrompt(`Generate a blog post about "${topic.topic}" using the following keywords: ${topic.keywords.join(", ")}.`);
                            }}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit Topic
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                            onClick={() => {
                              setActiveTab("content-generator");
                              setAiPrompt(`Generate a blog post about "${topic.topic}" using the following keywords: ${topic.keywords.join(", ")}.`);
                            }}
                          >
                            <Sparkles className="mr-1 h-3 w-3" />
                            Generate Content
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Content Generator Tab */}
        <TabsContent value="content-generator">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>AI Content Generator</CardTitle>
                  <CardDescription>
                    Generate SEO-optimized content with our advanced AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Topic/Instructions
                    </label>
                    <textarea
                      rows={6}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe what you want the AI to write about..."
                    />
                  </div>
                  
                  <Button
                    onClick={handleGenerateContent}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={isGenerating || !aiPrompt}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <ChevronUp className="h-4 w-4 text-primary-600 mr-2 mt-0.5" />
                        Include specific keywords you want to target
                      </li>
                      <li className="flex items-start">
                        <ChevronUp className="h-4 w-4 text-primary-600 mr-2 mt-0.5" />
                        Specify desired length (short, medium, long)
                      </li>
                      <li className="flex items-start">
                        <ChevronUp className="h-4 w-4 text-primary-600 mr-2 mt-0.5" />
                        Mention target audience for better tone alignment
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>
                      AI-generated content ready for your review and editing
                    </CardDescription>
                  </div>
                  
                  {generatedContent && (
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <div className="prose max-w-none">
                      <div className="border border-gray-200 rounded-md p-4 bg-white font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[600px]">
                        {generatedContent}
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <Button variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Content
                        </Button>
                        <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Save to Posts
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      {isGenerating ? (
                        <div>
                          <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-primary-500" />
                          <p className="text-lg font-medium">Creating SEO-optimized content...</p>
                          <p className="text-sm mt-2">This may take a few moments</p>
                        </div>
                      ) : (
                        <div>
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium">No content generated yet</p>
                          <p className="text-sm mt-2">Enter a topic and click "Generate Content"</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* SEO Analyzer Tab */}
        <TabsContent value="seo-analyzer">
          <div className="p-8 text-center">
            <Info className="h-12 w-12 mx-auto mb-4 text-primary-500" />
            <h3 className="text-lg font-medium mb-2">SEO Analyzer Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Our advanced SEO analysis tools will be available in the next update. Stay tuned for powerful content optimization features!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 