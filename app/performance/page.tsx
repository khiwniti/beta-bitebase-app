"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Activity, Clock, 
  Users, DollarSign, Target, Zap, AlertTriangle,
  CheckCircle, RefreshCw, Download, BarChart3,
  PieChart, LineChart, Calendar, Filter
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface KPIData {
  category: string;
  metrics: PerformanceMetric[];
}

export default function PerformancePage() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [category, setCategory] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // Mock performance data
  const [performanceData, setPerformanceData] = useState<KPIData[]>([
    {
      category: 'Sales Performance',
      metrics: [
        {
          id: 'revenue',
          name: 'Total Revenue',
          value: 45250,
          target: 50000,
          unit: '$',
          trend: 'up',
          change: 12.5,
          status: 'good'
        },
        {
          id: 'orders',
          name: 'Total Orders',
          value: 1247,
          target: 1500,
          unit: '',
          trend: 'up',
          change: 8.3,
          status: 'warning'
        },
        {
          id: 'avg_order',
          name: 'Average Order Value',
          value: 36.30,
          target: 40.00,
          unit: '$',
          trend: 'up',
          change: 4.2,
          status: 'good'
        }
      ]
    },
    {
      category: 'Customer Metrics',
      metrics: [
        {
          id: 'new_customers',
          name: 'New Customers',
          value: 234,
          target: 300,
          unit: '',
          trend: 'down',
          change: -5.2,
          status: 'warning'
        },
        {
          id: 'retention',
          name: 'Customer Retention',
          value: 78.5,
          target: 80.0,
          unit: '%',
          trend: 'stable',
          change: 0.8,
          status: 'good'
        },
        {
          id: 'satisfaction',
          name: 'Customer Satisfaction',
          value: 4.6,
          target: 4.5,
          unit: '/5',
          trend: 'up',
          change: 2.1,
          status: 'excellent'
        }
      ]
    },
    {
      category: 'Operational Efficiency',
      metrics: [
        {
          id: 'prep_time',
          name: 'Average Prep Time',
          value: 12.5,
          target: 15.0,
          unit: 'min',
          trend: 'down',
          change: -8.3,
          status: 'excellent'
        },
        {
          id: 'waste',
          name: 'Food Waste',
          value: 8.2,
          target: 5.0,
          unit: '%',
          trend: 'up',
          change: 15.4,
          status: 'critical'
        },
        {
          id: 'staff_efficiency',
          name: 'Staff Efficiency',
          value: 85.3,
          target: 90.0,
          unit: '%',
          trend: 'up',
          change: 3.7,
          status: 'good'
        }
      ]
    },
    {
      category: 'Financial Health',
      metrics: [
        {
          id: 'profit_margin',
          name: 'Profit Margin',
          value: 18.7,
          target: 20.0,
          unit: '%',
          trend: 'up',
          change: 2.3,
          status: 'good'
        },
        {
          id: 'cost_per_order',
          name: 'Cost per Order',
          value: 28.50,
          target: 25.00,
          unit: '$',
          trend: 'up',
          change: 6.8,
          status: 'warning'
        },
        {
          id: 'roi',
          name: 'Return on Investment',
          value: 24.8,
          target: 25.0,
          unit: '%',
          trend: 'stable',
          change: -0.5,
          status: 'good'
        }
      ]
    }
  ]);

  const handleRefresh = async () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Performance data refreshed",
        description: "Latest metrics have been updated",
      });
    }, 1500);
  };

  const handleExport = async () => {
    try {
      // Simulate export functionality
      const csvData = performanceData.flatMap(category => 
        category.metrics.map(metric => ({
          Category: category.category,
          Metric: metric.name,
          Value: metric.value,
          Target: metric.target,
          Unit: metric.unit,
          Trend: metric.trend,
          Change: metric.change,
          Status: metric.status
        }))
      );

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Performance report downloaded",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <Target className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const filteredData = category === 'all' 
    ? performanceData 
    : performanceData.filter(data => data.category.toLowerCase().includes(category.toLowerCase()));

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Performance Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor key performance indicators and business metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="sales">Sales Performance</SelectItem>
              <SelectItem value="customer">Customer Metrics</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="financial">Financial Health</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="icon" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82/100</div>
            <p className="text-xs text-muted-foreground">
              +5 points from last period
            </p>
            <Progress value={82} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Met</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7/12</div>
            <p className="text-xs text-muted-foreground">
              58% target achievement
            </p>
            <Progress value={58} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+8.5%</div>
            <p className="text-xs text-muted-foreground">
              Overall improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics by Category */}
      {filteredData.map((categoryData, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              {categoryData.category === 'Sales Performance' && <DollarSign className="h-5 w-5" />}
              {categoryData.category === 'Customer Metrics' && <Users className="h-5 w-5" />}
              {categoryData.category === 'Operational Efficiency' && <Zap className="h-5 w-5" />}
              {categoryData.category === 'Financial Health' && <BarChart3 className="h-5 w-5" />}
              {categoryData.category}
            </CardTitle>
            <CardDescription>
              Key performance indicators for {categoryData.category.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryData.metrics.map((metric) => (
                <div key={metric.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {metric.name}
                    </h4>
                    <Badge className={getStatusColor(metric.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(metric.status)}
                        {metric.status}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metric.unit === '$' && metric.unit}
                        {metric.value.toLocaleString()}
                        {metric.unit !== '$' && metric.unit}
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        {getTrendIcon(metric.trend, metric.change)}
                        <span className={metric.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {metric.change >= 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Target: {metric.unit === '$' && metric.unit}{metric.target.toLocaleString()}{metric.unit !== '$' && metric.unit}</span>
                        <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={Math.min((metric.value / metric.target) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Performance Insights</CardTitle>
          <CardDescription>
            AI-powered recommendations to improve your metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">Critical: Food Waste Above Target</h4>
                  <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                    Food waste is at 8.2%, significantly above the 5% target. This is costing approximately $1,200 monthly.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Waste Analysis
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Opportunity: Increase Average Order Value</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                    AOV is $36.30, just $3.70 below target. Consider upselling strategies or combo deals.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Upselling Tips
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">Success: Excellent Prep Time Performance</h4>
                  <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                    Average prep time of 12.5 minutes is well below the 15-minute target. Great kitchen efficiency!
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Share Best Practices
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}