"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Globe,
  MapPin,
  Brain,
  Utensils,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Zap,
  Map,
  CheckCircle,
  Circle
} from "lucide-react";

interface MarketAnalysisDashboardProps {
  className?: string;
}

export default function MarketAnalysisDashboard({ className }: MarketAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data to match the image
  const summaryData = {
    analytics: "Searching Food",
    aiScoring: "60 of 60",
    marketScore: "Opportunity Rating"
  };

  const progressValue = 60; // 6/10 = 60%

  const findings = [
    "High foot traffic area",
    "Strong lunch market", 
    "Limited breakfast options"
  ];

  const insights = [
    "Evening dining focus",
    "Expat community",
    "Competitive pricing needed"
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="market" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-all duration-200"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Market</span>
          </TabsTrigger>
          <TabsTrigger 
            value="location" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-all duration-200"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Location</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="explorer" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-all duration-200"
          >
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">Explorer</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai-insights" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white transition-all duration-200"
          >
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Generate Market Analysis Button */}
          <div className="w-full">
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold rounded-lg shadow-lg"
              size="lg"
            >
              <Target className="h-5 w-5 mr-2" />
              Generate Market Analysis
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary of Findings */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    SUMMARY OF FINDINGS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Analytics Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Analytics</span>
                    </div>
                    <span className="text-gray-600">{summaryData.analytics}</span>
                  </div>

                  {/* AI Scoring Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">AI Scoring</span>
                    </div>
                    <span className="text-gray-600">{summaryData.aiScoring}</span>
                  </div>

                  {/* Market Score Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Market Score</span>
                    </div>
                    <span className="text-gray-600">{summaryData.marketScore}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Indicator */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Progress
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Done: 6/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={progressValue} className="w-full" />
                    <p className="text-sm text-gray-600 text-center">
                      {progressValue}% Complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Analysis Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">Downtown Bangkok</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Market Analysis Results
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Score: 8.5/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {findings.map((finding, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{finding}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Map className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </CardContent>
            </Card>

            {/* Second Analysis Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">Sukhumvit Road</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Market Analysis Results
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Score: 7.2/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{insight}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Map className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs content can be added here */}
        <TabsContent value="market" className="space-y-6">
          {/* Market Analysis Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Research Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Market Research
                </CardTitle>
                <CardDescription>
                  Analyze market trends and opportunities in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Market Size</span>
                    <Badge variant="secondary">$2.4M</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">+12.5%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Competition Level</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
              </CardContent>
            </Card>

            {/* Competitor Analysis Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Competitor Analysis
                </CardTitle>
                <CardDescription>
                  Track and analyze your competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Direct Competitors</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Market Share</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">15.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Rating</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">4.2/5</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Analyze Competitors
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Market Trends & Insights
              </CardTitle>
              <CardDescription>
                Latest trends and insights in your market segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">↗ 23%</div>
                  <div className="text-sm text-gray-600">Delivery Orders</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">↗ 18%</div>
                  <div className="text-sm text-gray-600">Health-Conscious</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">↗ 31%</div>
                  <div className="text-sm text-gray-600">Plant-Based Options</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Market Analyses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Recent Market Analyses
              </CardTitle>
              <CardDescription>
                Your latest market analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Silom District Analysis</div>
                      <div className="text-sm text-gray-600">Generated 2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Score: 8.7/10</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Thonglor Area Analysis</div>
                      <div className="text-sm text-gray-600">Generated 1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Score: 7.9/10</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Chatuchak Market Analysis</div>
                      <div className="text-sm text-gray-600">Generated 3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Score: 6.4/10</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location Intelligence</h3>
            <p className="text-gray-600 dark:text-gray-400">Location-based insights and mapping tools will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Advanced analytics and reporting tools will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="explorer">
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Restaurant Explorer</h3>
            <p className="text-gray-600 dark:text-gray-400">Restaurant discovery and exploration tools will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights">
          <div className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">AI-powered insights and recommendations will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}