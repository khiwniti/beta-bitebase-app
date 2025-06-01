import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, cn } from "@bitebase/ui";
import {
  Download,
  Maximize2,
  RefreshCw,
  MoreHorizontal,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  className?: string;
  actions?: {
    onExport?: () => void;
    onRefresh?: () => void;
    onExpand?: () => void;
    onSettings?: () => void;
  };
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'custom';
  timeRange?: string;
  showLegend?: boolean;
}

export function ChartContainer({
  title,
  subtitle,
  children,
  loading = false,
  error,
  className,
  actions,
  chartType = 'line',
  timeRange,
  showLegend = true
}: ChartContainerProps) {
  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart3 className="w-4 h-4" />;
      case 'pie':
        return <PieChart className="w-4 h-4" />;
      case 'area':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <LineChart className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full border-red-200", className)}>
        <CardHeader>
          <CardTitle className="text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-red-500">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Failed to load chart</div>
              <div className="text-sm">{error}</div>
              {actions?.onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={actions.onRefresh}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full transition-all duration-300 hover:shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              {getChartIcon()}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {timeRange && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {timeRange}
              </span>
            )}

            <div className="flex items-center space-x-1">
              {actions?.onRefresh && (
                <Button variant="ghost" size="sm" onClick={actions.onRefresh}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}

              {actions?.onExport && (
                <Button variant="ghost" size="sm" onClick={actions.onExport}>
                  <Download className="w-4 h-4" />
                </Button>
              )}

              {actions?.onExpand && (
                <Button variant="ghost" size="sm" onClick={actions.onExpand}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}

              {actions?.onSettings && (
                <Button variant="ghost" size="sm" onClick={actions.onSettings}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          {children}

          {showLegend && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Current Period</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Previous Period</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Simple chart components for quick use
export function SimpleLineChart({ 
  data = [], 
  height = 300,
  xDataKey = "name",
  yDataKey = "value",
  color = "#3b82f6"
}) {
  const chartData = Array.isArray(data) ? data : [];
  
  // Convert simple number array to object array
  const formattedData = chartData.length > 0 && typeof chartData[0] === 'number'
    ? chartData.map((value, index) => ({ name: `Point ${index + 1}`, value }))
    : chartData;

  if (formattedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey={xDataKey} 
          tickLine={false} 
          axisLine={false} 
          padding={{ left: 10, right: 10 }} 
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          padding={{ top: 10, bottom: 10 }}
          width={40} 
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #f0f0f0' 
          }}
          cursor={{ stroke: '#ddd', strokeWidth: 1 }}
        />
        <Line 
          type="monotone" 
          dataKey={yDataKey} 
          stroke={color} 
          strokeWidth={2} 
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ 
  data = [], 
  height = 300,
  xDataKey = "name",
  yDataKey = "value",
  color = "#3b82f6"
}) {
  const chartData = Array.isArray(data) ? data : [];
  
  // Convert simple number array to object array
  const formattedData = chartData.length > 0 && typeof chartData[0] === 'number'
    ? chartData.map((value, index) => ({ name: `Point ${index + 1}`, value }))
    : chartData;

  if (formattedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey={xDataKey} 
          tickLine={false} 
          axisLine={false} 
          padding={{ left: 10, right: 10 }} 
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          padding={{ top: 10, bottom: 10 }}
          width={40} 
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #f0f0f0' 
          }}
        />
        <Bar 
          dataKey={yDataKey} 
          fill={color} 
          barSize={20}
          radius={[4, 4, 0, 0]} 
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function SimplePieChart({ 
  data = [], 
  height = 300,
  nameKey = "name",
  valueKey = "value",
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']
}) {
  const chartData = Array.isArray(data) ? data : [];
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={30}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #f0f0f0' 
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
