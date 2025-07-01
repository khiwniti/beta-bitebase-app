"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Star,
  MapPin,
  Calendar,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  MoreVertical,
  Eye,
  MessageSquare
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

interface ModernMobileDashboardProps {
  restaurantId: string;
  className?: string;
}

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  urgent?: boolean;
}

interface InsightCard {
  id: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  title: string;
  message: string;
  action?: string;
  timestamp: Date;
}

export default function ModernMobileDashboard({ 
  restaurantId, 
  className = "" 
}: ModernMobileDashboardProps) {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Sample data - replace with real API calls
  const metrics: DashboardMetric[] = [
    {
      id: 'revenue',
      title: 'Today\'s Revenue',
      value: '$2,845',
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600',
      subtitle: 'vs yesterday'
    },
    {
      id: 'customers',
      title: 'Customers Served',
      value: 127,
      change: -3.2,
      trend: 'down',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      subtitle: 'vs yesterday'
    },
    {
      id: 'rating',
      title: 'Avg Rating',
      value: '4.8',
      change: 0.2,
      trend: 'up',
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-600',
      subtitle: 'this week'
    },
    {
      id: 'orders',
      title: 'Active Orders',
      value: 8,
      change: 0,
      trend: 'stable',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-purple-600',
      subtitle: 'in kitchen'
    }
  ]

  const quickActions: QuickAction[] = [
    {
      id: 'orders',
      title: 'View Orders',
      description: '8 pending',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-blue-500',
      urgent: true
    },
    {
      id: 'reviews',
      title: 'New Reviews',
      description: '3 unread',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View reports',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'location',
      title: 'Location Data',
      description: 'Foot traffic',
      icon: <MapPin className="w-5 h-5" />,
      color: 'bg-orange-500'
    }
  ]

  const insights: InsightCard[] = [
    {
      id: '1',
      type: 'success',
      title: 'Peak Performance',
      message: 'Lunch rush exceeded expectations by 18%',
      action: 'View Details',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
    },
    {
      id: '2',
      type: 'warning',
      title: 'Inventory Alert',
      message: 'Salmon running low - consider 86ing',
      action: 'Update Menu',
      timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 mins ago
    },
    {
      id: '3',
      type: 'info',
      title: 'Weather Impact',
      message: 'Rain expected - outdoor seating may be affected',
      timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 mins ago
    }
  ]

  // Sample chart data
  const revenueData = [
    { time: '6am', revenue: 150 },
    { time: '9am', revenue: 680 },
    { time: '12pm', revenue: 1250 },
    { time: '3pm', revenue: 890 },
    { time: '6pm', revenue: 1650 },
    { time: '9pm', revenue: 1200 },
    { time: 'now', revenue: 2845 }
  ]

  const customerFlowData = [
    { hour: '11am', customers: 15 },
    { hour: '12pm', customers: 42 },
    { hour: '1pm', customers: 38 },
    { hour: '2pm', customers: 22 },
    { hour: '3pm', customers: 18 },
    { hour: 'now', customers: 12 }
  ]

  const menuPerformanceData = [
    { name: 'Signature Pasta', value: 35, color: '#3b82f6' },
    { name: 'Grilled Salmon', value: 28, color: '#10b981' },
    { name: 'Caesar Salad', value: 20, color: '#f59e0b' },
    { name: 'Margherita Pizza', value: 17, color: '#ef4444' }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setRefreshing(false)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'alert': return <AlertTriangle className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'alert': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Key Metrics Grid */}
        <div className={`grid gap-4 ${
          viewMode === 'mobile' ? 'grid-cols-2' : 
          viewMode === 'tablet' ? 'grid-cols-4' : 
          'grid-cols-4'
        }`}>
          {metrics.map((metric) => (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center text-xs ${
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {metric.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {metric.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                      {metric.change !== 0 && (
                        <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-xs text-gray-500">{metric.title}</div>
                  {metric.subtitle && (
                    <div className="text-xs text-gray-400 mt-1">{metric.subtitle}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-3 ${
              viewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'
            }`}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left group"
                >
                  {action.urgent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                    {action.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 absolute top-4 right-4" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Revenue Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Today's Revenue
              <Badge variant="outline">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Flow & Menu Performance */}
        <div className={`grid gap-4 ${
          viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {/* Customer Flow */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Customer Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerFlowData}>
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis hide />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Menu Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {menuPerformanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{item.value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{insight.title}</h4>
                        <p className="text-sm opacity-90 mt-1">{insight.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-75">
                            {formatTimeAgo(insight.timestamp)}
                          </span>
                          {insight.action && (
                            <Button size="sm" variant="outline" className="text-xs h-6">
                              {insight.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-green-700">Customer Satisfaction</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12m</div>
                <div className="text-sm text-blue-700">Avg Service Time</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$22.40</div>
                <div className="text-sm text-purple-700">Avg Order Value</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">94%</div>
                <div className="text-sm text-orange-700">Order Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {[
            { icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard', active: true },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics' },
            { icon: <MapPin className="w-5 h-5" />, label: 'Location' },
            { icon: <Users className="w-5 h-5" />, label: 'Customers' },
            { icon: <MoreVertical className="w-5 h-5" />, label: 'More' }
          ].map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg ${
                item.active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add bottom padding for mobile navigation */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}