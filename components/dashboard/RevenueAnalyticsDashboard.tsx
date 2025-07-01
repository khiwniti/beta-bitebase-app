"use client"

import React, { useState, useEffect } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  PieChart,
  BarChart3,
  Calendar,
  Target,
  Percent,
  CreditCard,
  ShoppingCart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'
import { RealDataService } from '../../lib/real-data-service'
import { ErrorBoundary } from '../ErrorBoundary'
import { connectionMonitor } from '../../lib/connection-monitor'

interface RevenueAnalyticsDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
  restaurantId?: string // Add restaurantId prop for real data
}

// Real data functions using RealDataService
const getRevenueMetrics = async (restaurantId: string, timeRange: string) => {
  try {
    const data = await RealDataService.RevenueAnalytics.getRevenueMetrics(restaurantId, timeRange);
    return data || {
      totalRevenue: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      avgOrderValue: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      dailyRevenue: { value: '฿0', change: { value: 0, period: 'vs yesterday', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      monthlyRevenue: { value: '฿0', change: { value: 0, period: 'vs last month', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      profitMargin: { value: '0%', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      revenuePerSeat: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } }
    };
  } catch (error) {
    console.error('Failed to fetch revenue metrics:', error);
    return {
      totalRevenue: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      avgOrderValue: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      dailyRevenue: { value: 'Error', change: { value: 0, period: 'vs yesterday', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      monthlyRevenue: { value: 'Error', change: { value: 0, period: 'vs last month', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      profitMargin: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      revenuePerSeat: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } }
    };
  }
}

const getRevenueBreakdown = async (restaurantId: string, timeRange: string) => {
  try {
    const data = await RealDataService.RevenueAnalytics.getRevenueBreakdown(restaurantId, timeRange);
    return data ? data.categories.map((cat, index) => ({
      category: cat.name,
      amount: cat.amount,
      percentage: cat.percentage,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]
    })) : [];
  } catch (error) {
    console.error('Failed to fetch revenue breakdown:', error);
    return [];
  }
}

const getPaymentMethods = async (restaurantId: string, timeRange: string) => {
  try {
    const data = await RealDataService.RevenueAnalytics.getRevenueBreakdown(restaurantId, timeRange);
    return data ? data.paymentMethods.map(method => ({
      method: method.method,
      percentage: method.percentage,
      amount: method.amount,
      trend: method.percentage > 30 ? 'up' : method.percentage < 15 ? 'down' : 'stable'
    })) : [];
  } catch (error) {
    console.error('Failed to fetch payment methods:', error);
    return [];
  }
}

const getTopPerformingItems = () => [
  { item: 'Pad Thai', revenue: 285000, orders: 1200, margin: '72%', trend: 'up' },
  { item: 'Tom Yum Soup', revenue: 198500, orders: 850, margin: '68%', trend: 'up' },
  { item: 'Green Curry', revenue: 167200, orders: 720, margin: '65%', trend: 'stable' },
  { item: 'Mango Sticky Rice', revenue: 142800, orders: 950, margin: '78%', trend: 'up' },
  { item: 'Thai Iced Tea', revenue: 128400, orders: 1600, margin: '82%', trend: 'up' }
]

export default function RevenueAnalyticsDashboard({
  className = '',
  timeRange = '30d',
  onTimeRangeChange,
  restaurantId = 'default-restaurant' // Default restaurant ID
}: RevenueAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState({
    totalRevenue: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    avgOrderValue: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    dailyRevenue: { value: '฿0', change: { value: 0, period: 'vs yesterday', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    monthlyRevenue: { value: '฿0', change: { value: 0, period: 'vs last month', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    profitMargin: { value: '0%', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    revenuePerSeat: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } }
  })
  const [revenueBreakdown, setRevenueBreakdown] = useState<Array<{category: string, amount: number, percentage: number, color: string}>>([])
  const [paymentMethods, setPaymentMethods] = useState<Array<{method: string, percentage: number, amount: number, trend: string}>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load all data concurrently
        const [metricsData, breakdownData, paymentsData] = await Promise.all([
          getRevenueMetrics(restaurantId, timeRange),
          getRevenueBreakdown(restaurantId, timeRange),
          getPaymentMethods(restaurantId, timeRange)
        ])
        
        setMetrics(metricsData)
        setRevenueBreakdown(breakdownData)
        setPaymentMethods(paymentsData)
      } catch (error) {
        console.error('Failed to load revenue data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [timeRange, restaurantId])

  const topItems = getTopPerformingItems()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Track financial performance and revenue trends</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange?.(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="items">Top Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Revenue Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Total Revenue"
              value={metrics.totalRevenue.value}
              change={metrics.totalRevenue.change}
              icon={<DollarSign className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Average Order Value"
              value={metrics.avgOrderValue.value}
              change={metrics.avgOrderValue.change}
              icon={<ShoppingCart className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Profit Margin"
              value={metrics.profitMargin.value}
              change={metrics.profitMargin.change}
              icon={<Percent className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Revenue per Seat"
              value={metrics.revenuePerSeat.value}
              change={metrics.revenuePerSeat.change}
              icon={<Target className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* Revenue vs Costs Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Revenue Trend"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Revenue trend chart would be displayed here</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Profit Margin Analysis"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Profit margin analysis would be displayed here</p>
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown by Category</CardTitle>
              <CardDescription>Distribution of revenue across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">฿{item.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Payment Methods Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Performance</CardTitle>
              <CardDescription>Revenue distribution by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{method.method}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">฿{method.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{method.percentage}%</div>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        method.trend === 'up' ? 'text-green-600' : 
                        method.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {method.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                         method.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                         <Minus className="h-4 w-4" />}
                        {method.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Top Performing Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Menu Items</CardTitle>
              <CardDescription>Revenue and profitability by menu item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Item</th>
                      <th className="text-left py-3 px-4 font-medium">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium">Orders</th>
                      <th className="text-left py-3 px-4 font-medium">Margin</th>
                      <th className="text-left py-3 px-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topItems.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4 font-medium">{item.item}</td>
                        <td className="py-3 px-4">฿{item.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.orders.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.margin}</td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center gap-1 ${
                            item.trend === 'up' ? 'text-green-600' : 
                            item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                             item.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                             <Minus className="h-4 w-4" />}
                            {item.trend}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
