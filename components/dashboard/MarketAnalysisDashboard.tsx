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
  Circle,
  Star,
  Clock
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

        <TabsContent value="location" className="space-y-6">
          {/* Location Intelligence Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Analysis Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  Location Analysis
                </CardTitle>
                <CardDescription>
                  Analyze foot traffic and demographic data for your location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Foot Traffic</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">High</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Demographics</span>
                    <Badge variant="secondary">25-45 years</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Peak Hours</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">12-2 PM, 6-8 PM</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Map className="h-4 w-4 mr-2" />
                  View Heat Map
                </Button>
              </CardContent>
            </Card>

            {/* Nearby Competition Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Nearby Competition
                </CardTitle>
                <CardDescription>
                  Competitive landscape within 1km radius
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Direct Competitors</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Distance</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">350m</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Market Density</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">High</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View Competitors
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Location Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Location Insights & Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered insights for your location strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Strengths</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">High visibility from main road</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Near public transportation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Business district location</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Opportunities</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Expand delivery radius</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Target office workers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Evening dining focus</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Location Performance Metrics
              </CardTitle>
              <CardDescription>
                Key performance indicators for your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">8.5/10</div>
                  <div className="text-sm text-gray-600">Location Score</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">2,400</div>
                  <div className="text-sm text-gray-600">Daily Foot Traffic</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                  <div className="text-sm text-gray-600">Visibility Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">$45k</div>
                  <div className="text-sm text-gray-600">Avg. Monthly Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription>
                  Track your revenue performance and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Revenue</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">$48,500</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">+15.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Order Value</span>
                    <Badge variant="secondary">$28.50</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Revenue Report
                </Button>
              </CardContent>
            </Card>

            {/* Customer Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Customer Analytics
                </CardTitle>
                <CardDescription>
                  Understand your customer behavior and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Customers</span>
                    <Badge variant="secondary">1,247</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Repeat Rate</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">68%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Satisfaction</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">4.6/5</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Customer Insights
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Key performance indicators and benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Service Rating</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">4.8/5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Order Accuracy</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">96%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Delivery Time</span>
                    <Badge variant="secondary">22 min</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Performance Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Sales & Performance Trends
              </CardTitle>
              <CardDescription>
                Visual representation of your business performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Weekly Sales</h4>
                  <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Sales Chart Placeholder</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Customer Traffic</h4>
                  <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Traffic Chart Placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Analytics Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Recent Analytics Reports
              </CardTitle>
              <CardDescription>
                Your latest analytics and performance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Monthly Performance Report</div>
                      <div className="text-sm text-gray-600">Generated 1 hour ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Revenue +15%</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Customer Behavior Analysis</div>
                      <div className="text-sm text-gray-600">Generated 6 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Satisfaction 4.6/5</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Menu Performance Analysis</div>
                      <div className="text-sm text-gray-600">Generated 1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">Top Items: 8</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explorer" className="space-y-6">
          {/* Restaurant Discovery Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Restaurant Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  Restaurant Discovery
                </CardTitle>
                <CardDescription>
                  Explore restaurants and dining options in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Nearby Restaurants</span>
                    <Badge variant="secondary">247</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cuisine Types</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">18</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Rating</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">4.3/5</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Map className="h-4 w-4 mr-2" />
                  Explore Map
                </Button>
              </CardContent>
            </Card>

            {/* Trending Restaurants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Trending Now
                </CardTitle>
                <CardDescription>
                  Popular restaurants and emerging dining trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hot Spots</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Openings</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Rising Stars</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">5</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  View Trending
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Featured Restaurants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Featured Restaurants
              </CardTitle>
              <CardDescription>
                Top-rated restaurants and hidden gems in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">The Golden Spoon</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">4.8/5</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Thai Cuisine • 0.3 km</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="h-3 w-3" />
                    <span>$$</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>25-30 min</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Sakura Sushi</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">4.6/5</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Japanese • 0.5 km</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="h-3 w-3" />
                    <span>$$$</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>20-25 min</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Mama's Kitchen</h4>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">4.7/5</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Italian • 0.8 km</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="h-3 w-3" />
                    <span>$$</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>30-35 min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Explore by Category
              </CardTitle>
              <CardDescription>
                Discover restaurants by cuisine type and dining style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <div className="text-2xl mb-2">🍜</div>
                  <div className="font-medium text-sm">Thai</div>
                  <div className="text-xs text-gray-500">42 restaurants</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <div className="text-2xl mb-2">🍣</div>
                  <div className="font-medium text-sm">Japanese</div>
                  <div className="text-xs text-gray-500">28 restaurants</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <div className="text-2xl mb-2">🍕</div>
                  <div className="font-medium text-sm">Italian</div>
                  <div className="text-xs text-gray-500">35 restaurants</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <div className="text-2xl mb-2">🍔</div>
                  <div className="font-medium text-sm">American</div>
                  <div className="text-xs text-gray-500">19 restaurants</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Insights Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Smart Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Smart Recommendations
                </CardTitle>
                <CardDescription>
                  AI-powered suggestions to optimize your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Insights</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">24</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Accuracy Rate</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">94%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Implementation</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">18/24</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  View All Insights
                </Button>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Predictive Analytics
                </CardTitle>
                <CardDescription>
                  Future trends and business forecasting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Revenue Forecast</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">+18%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Growth</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">+12%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Market Trend</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">Positive</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Forecasts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Latest AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Latest AI Insights
              </CardTitle>
              <CardDescription>
                Recent AI-generated insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-green-800 dark:text-green-200">Opportunity</h4>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">High Impact</Badge>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                        Lunch menu optimization could increase revenue by 15-20% based on customer ordering patterns.
                      </p>
                      <div className="text-xs text-green-600 dark:text-green-400">Generated 2 hours ago</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">Recommendation</h4>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Medium Impact</Badge>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                        Consider extending delivery hours to 11 PM to capture late-night dining demand.
                      </p>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Generated 4 hours ago</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Trend Alert</h4>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Trending</Badge>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                        Plant-based options are gaining popularity in your area. Consider adding 2-3 vegan dishes.
                      </p>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">Generated 6 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-500" />
                AI Performance Metrics
              </CardTitle>
              <CardDescription>
                Track the effectiveness of AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">94%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">$12.5k</div>
                  <div className="text-sm text-gray-600">Revenue Impact</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">18</div>
                  <div className="text-sm text-gray-600">Implemented</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">6</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-500" />
                AI Learning Progress
              </CardTitle>
              <CardDescription>
                How our AI is continuously improving for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Customer Behavior Analysis</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="w-24" />
                    <span className="text-sm text-gray-600">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Menu Optimization</span>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="w-24" />
                    <span className="text-sm text-gray-600">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Market Trend Prediction</span>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="w-24" />
                    <span className="text-sm text-gray-600">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Revenue Forecasting</span>
                  <div className="flex items-center gap-2">
                    <Progress value={88} className="w-24" />
                    <span className="text-sm text-gray-600">88%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}