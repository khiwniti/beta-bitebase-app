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

interface RevenueAnalyticsDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data for revenue analytics - would be replaced with real API data
const getRevenueMetrics = (timeRange: string) => ({
  totalRevenue: {
    value: '฿2,847,500',
    change: { value: 12.5, period: 'vs last period', trend: 'up' as const }
  },
  avgOrderValue: {
    value: '฿485',
    change: { value: 8.2, period: 'vs last period', trend: 'up' as const }
  },
  grossMargin: {
    value: '68.5%',
    change: { value: 2.1, period: 'vs last period', trend: 'up' as const }
  },
  netProfit: {
    value: '฿427,125',
    change: { value: 15.3, period: 'vs last period', trend: 'up' as const }
  },
  costOfGoods: {
    value: '฿896,775',
    change: { value: -3.2, period: 'vs last period', trend: 'down' as const }
  },
  operatingExpenses: {
    value: '฿1,523,600',
    change: { value: 5.8, period: 'vs last period', trend: 'up' as const }
  }
})

const getRevenueBreakdown = () => [
  { category: 'Food Sales', amount: 1850000, percentage: 65, color: '#3B82F6' },
  { category: 'Beverage Sales', amount: 568500, percentage: 20, color: '#10B981' },
  { category: 'Delivery Fees', amount: 284250, percentage: 10, color: '#F59E0B' },
  { category: 'Other Services', amount: 142125, percentage: 5, color: '#8B5CF6' }
]

const getPaymentMethods = () => [
  { method: 'Credit/Debit Cards', percentage: 45, amount: 1281375, trend: 'up' },
  { method: 'Digital Wallets', percentage: 30, amount: 854250, trend: 'up' },
  { method: 'Cash', percentage: 20, amount: 569500, trend: 'down' },
  { method: 'Bank Transfer', percentage: 5, amount: 142375, trend: 'stable' }
]

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
  onTimeRangeChange 
}: RevenueAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(getRevenueMetrics(timeRange))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setMetrics(getRevenueMetrics(timeRange))
      setLoading(false)
    }, 500)
  }, [timeRange])

  const revenueBreakdown = getRevenueBreakdown()
  const paymentMethods = getPaymentMethods()
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
              title="Gross Margin"
              value={metrics.grossMargin.value}
              change={metrics.grossMargin.change}
              icon={<Percent className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Net Profit"
              value={metrics.netProfit.value}
              change={metrics.netProfit.change}
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
