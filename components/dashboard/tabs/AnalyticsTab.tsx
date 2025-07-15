"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/useDashboardData";

interface AnalyticsTabProps {
  className?: string;
}

export default function AnalyticsTab({ className }: AnalyticsTabProps) {
  const [timeRange, setTimeRange] = useState<string>("month");
  const { analytics, loading, error, refetch } = useAnalyticsData(timeRange);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    return change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!analytics) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Analytics Data</h3>
          <p className="text-slate-400 mb-6">
            Analytics data will appear here once you start using the platform.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Business Analytics</h3>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
            <TabsList className="bg-white/10 backdrop-blur-md">
              <TabsTrigger value="day" className="data-[state=active]:bg-white/20">Day</TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-white/20">Week</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-white/20">Month</TabsTrigger>
              <TabsTrigger value="quarter" className="data-[state=active]:bg-white/20">Quarter</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={refetch} className="border-white/20 text-white hover:bg-white/10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(analytics.revenue.current)}
            </div>
            <div className={`text-sm flex items-center gap-1 ${getChangeColor(analytics.revenue.change)}`}>
              {getChangeIcon(analytics.revenue.change)}
              {formatPercentage(analytics.revenue.change)}
              <span className="text-slate-400 ml-1">vs previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(analytics.visitors.current)}
            </div>
            <div className={`text-sm flex items-center gap-1 ${getChangeColor(analytics.visitors.change)}`}>
              {getChangeIcon(analytics.visitors.change)}
              {formatPercentage(analytics.visitors.change)}
              <span className="text-slate-400 ml-1">vs previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.conversion.current.toFixed(1)}%
            </div>
            <div className={`text-sm flex items-center gap-1 ${getChangeColor(analytics.conversion.change)}`}>
              {getChangeIcon(analytics.conversion.change)}
              {formatPercentage(analytics.conversion.change)}
              <span className="text-slate-400 ml-1">vs previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Trends
          </CardTitle>
          <CardDescription className="text-slate-300">
            Track your key metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded-lg bg-white/5">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-400">
                Interactive chart visualization would be displayed here
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Showing {analytics.trends.length} data points for {timeRange}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Insights */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Peak Performance Day</span>
                <Badge className="bg-green-100 text-green-800">Best</Badge>
              </div>
              <p className="text-slate-300 text-sm">
                {analytics.trends.reduce((max, day) => 
                  day.revenue > max.revenue ? day : max
                ).date}
              </p>
              <p className="text-slate-400 text-xs">
                Revenue: {formatCurrency(Math.max(...analytics.trends.map(d => d.revenue)))}
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Average Daily Revenue</span>
                <Badge variant="outline" className="border-white/20 text-slate-300">Avg</Badge>
              </div>
              <p className="text-slate-300 text-sm">
                {formatCurrency(analytics.trends.reduce((sum, day) => sum + day.revenue, 0) / analytics.trends.length)}
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Visitor Growth</span>
                <Badge className={analytics.visitors.change > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {analytics.visitors.change > 0 ? "Growing" : "Declining"}
                </Badge>
              </div>
              <p className="text-slate-300 text-sm">
                {formatPercentage(analytics.visitors.change)} this {timeRange}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-300">
              Optimize your performance with these actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Detailed Report
            </Button>
            
            <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
              <Target className="h-4 w-4 mr-2" />
              Set Performance Goals
            </Button>
            
            <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Get AI Recommendations
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10 justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Review
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity Summary</CardTitle>
          <CardDescription className="text-slate-300">
            Key highlights from your recent performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {analytics.trends.length}
              </div>
              <div className="text-slate-400 text-sm">Days Tracked</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(analytics.trends.reduce((sum, day) => sum + day.visitors, 0))}
              </div>
              <div className="text-slate-400 text-sm">Total Visitors</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {(analytics.trends.reduce((sum, day) => sum + day.conversion, 0) / analytics.trends.length).toFixed(1)}%
              </div>
              <div className="text-slate-400 text-sm">Avg Conversion</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {formatCurrency(analytics.trends.reduce((sum, day) => sum + day.revenue, 0))}
              </div>
              <div className="text-slate-400 text-sm">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}