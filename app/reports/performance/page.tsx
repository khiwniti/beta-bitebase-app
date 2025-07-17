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

export default function PerformanceReportsPage() {
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
          value: 342,
          target: 400,
          unit: '',
          trend: 'up',
          change: 8.3,
          status: 'warning'
        },
        {
          id: 'avgOrder',
          name: 'Average Order Value',
          value: 132.25,
          target: 125.00,
          unit: '$',
          trend: 'up',
          change: 5.8,
          status: 'excellent'
        }
      ]
    },
    {
      category: 'Customer Metrics',
      metrics: [
        {
          id: 'newCustomers',
          name: 'New Customers',
          value: 87,
          target: 100,
          unit: '',
          trend: 'up',
          change: 15.2,
          status: 'good'
        },
        {
          id: 'retention',
          name: 'Customer Retention',
          value: 78.5,
          target: 80.0,
          unit: '%',
          trend: 'stable',
          change: 0.2,
          status: 'warning'
        },
        {
          id: 'satisfaction',
          name: 'Customer Satisfaction',
          value: 4.6,
          target: 4.5,
          unit: '/5',
          trend: 'up',
          change: 4.3,
          status: 'excellent'
        }
      ]
    },
    {
      category: 'Operational Efficiency',
      metrics: [
        {
          id: 'tablesTurned',
          name: 'Tables Turned/Day',
          value: 3.2,
          target: 3.5,
          unit: '',
          trend: 'down',
          change: -2.1,
          status: 'warning'
        },
        {
          id: 'avgWaitTime',
          name: 'Average Wait Time',
          value: 18,
          target: 15,
          unit: 'min',
          trend: 'down',
          change: -8.5,
          status: 'critical'
        },
        {
          id: 'staffEfficiency',
          name: 'Staff Efficiency',
          value: 92.3,
          target: 90.0,
          unit: '%',
          trend: 'up',
          change: 3.7,
          status: 'excellent'
        }
      ]
    }
  ]);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange, category, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Data Refreshed",
      description: "Performance metrics have been updated with the latest data.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your performance report is being generated. You'll receive it via email shortly.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const filteredData = category === 'all' 
    ? performanceData 
    : performanceData.filter(data => data.category.toLowerCase().includes(category.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Performance Reports
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Business performance metrics and KPI tracking
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sales">Sales Performance</SelectItem>
                  <SelectItem value="customer">Customer Metrics</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mr-3" />
            <span className="text-gray-600 dark:text-gray-400">Loading performance data...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredData.map((categoryData, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {categoryData.category}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryData.metrics.map((metric) => (
                    <Card key={metric.id} className="relative overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {metric.name}
                          </CardTitle>
                          <Badge className={`${getStatusColor(metric.status)} text-xs`}>
                            {metric.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {metric.unit === '$' && metric.unit}
                              {metric.value.toLocaleString()}
                              {metric.unit !== '$' && metric.unit}
                            </span>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(metric.trend, metric.change)}
                              <span className={`text-sm ${
                                metric.change > 0 ? 'text-green-600' : 
                                metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Progress to Target</span>
                              <span className="text-gray-900 dark:text-gray-100">
                                {metric.unit === '$' && metric.unit}
                                {metric.target.toLocaleString()}
                                {metric.unit !== '$' && metric.unit}
                              </span>
                            </div>
                            <Progress 
                              value={(metric.value / metric.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
