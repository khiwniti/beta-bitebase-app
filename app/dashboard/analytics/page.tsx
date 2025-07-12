'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RealTimeMetrics from '@/components/dashboard/RealTimeMetrics';
import { 
  Download, RefreshCw, TrendingUp, Users, 
  DollarSign, MapPin, BarChart3, FileText,
  AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [restaurantId, setRestaurantId] = useState('default');
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Refreshing data",
      description: "Fetching latest analytics...",
    });
  };

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/analytics/export?type=${type}&range=${timeRange}&restaurantId=${restaurantId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${type} data exported successfully`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time business intelligence and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleExport('full')} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('sales')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Report</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Download detailed sales analysis
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('customers')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Report</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Export customer behavior data
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('inventory')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Report</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Current stock levels and trends
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('financial')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Report</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              P&L and cost analysis
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <RealTimeMetrics key={refreshKey} />

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
          <CardDescription>
            Actionable recommendations based on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AIInsight
              type="opportunity"
              title="Peak Hour Optimization"
              description="Your 12-2 PM lunch service is at 65% capacity. Consider promotional offers for 11:30 AM or 2:30 PM to balance traffic."
              impact="Potential 15% revenue increase"
              action="Create Happy Hour"
            />
            <AIInsight
              type="warning"
              title="Inventory Alert"
              description="Based on current sales trends, you'll run out of chicken breast in 2 days. Historical data shows this leads to 8% revenue loss."
              impact="Prevent $1,200 loss"
              action="Reorder Now"
            />
            <AIInsight
              type="success"
              title="Customer Retention Success"
              description="Your loyalty program has increased repeat visits by 23% this month. VIP customers now represent 35% of revenue."
              impact="+$8,500 monthly revenue"
              action="View Details"
            />
            <AIInsight
              type="info"
              title="Market Trend Alert"
              description="Plant-based options are trending up 45% in your area. Your competitors have added 3-5 vegan items on average."
              impact="Capture new market segment"
              action="Update Menu"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AIInsightProps {
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impact: string;
  action: string;
}

function AIInsight({ type, title, description, impact, action }: AIInsightProps) {
  const typeStyles = {
    opportunity: 'border-blue-200 bg-blue-50',
    warning: 'border-yellow-200 bg-yellow-50',
    success: 'border-green-200 bg-green-50',
    info: 'border-gray-200 bg-gray-50'
  };

  const typeIcons = {
    opportunity: <TrendingUp className="h-5 w-5 text-blue-600" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    info: <Info className="h-5 w-5 text-gray-600" />
  };

  return (
    <div className={`rounded-lg border p-4 ${typeStyles[type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {typeIcons[type]}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs font-medium">{impact}</p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          {action}
        </Button>
      </div>
    </div>
  );
}