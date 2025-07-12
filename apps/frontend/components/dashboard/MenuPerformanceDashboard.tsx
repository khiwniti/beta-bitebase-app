"use client"

import React, { useState, useEffect } from 'react'
import { 
  Utensils, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Star,
  Clock,
  Percent,
  Award,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'

interface MenuPerformanceDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data for menu performance analytics
const getMenuMetrics = (timeRange: string) => ({
  totalMenuItems: {
    value: '127',
    change: { value: 8, period: 'new items added', trend: 'up' as const }
  },
  avgItemRating: {
    value: '4.3/5',
    change: { value: 0.2, period: 'vs last period', trend: 'up' as const }
  },
  menuProfitability: {
    value: '68.5%',
    change: { value: 3.2, period: 'vs last period', trend: 'up' as const }
  },
  topSellerRevenue: {
    value: '฿285,000',
    change: { value: 15.8, period: 'vs last period', trend: 'up' as const }
  },
  menuTurnover: {
    value: '2.8x',
    change: { value: 12.1, period: 'vs last period', trend: 'up' as const }
  },
  avgOrderValue: {
    value: '฿485',
    change: { value: 8.7, period: 'vs last period', trend: 'up' as const }
  }
})

const getTopPerformingItems = () => [
  { 
    name: 'Pad Thai', 
    category: 'Main Course',
    orders: 1250, 
    revenue: 285000, 
    margin: 72, 
    rating: 4.7, 
    trend: 'up',
    price: 228,
    cost: 64
  },
  { 
    name: 'Tom Yum Soup', 
    category: 'Soup',
    orders: 890, 
    revenue: 198500, 
    margin: 68, 
    rating: 4.6, 
    trend: 'up',
    price: 223,
    cost: 71
  },
  { 
    name: 'Green Curry', 
    category: 'Main Course',
    orders: 720, 
    revenue: 167200, 
    margin: 65, 
    rating: 4.5, 
    trend: 'stable',
    price: 232,
    cost: 81
  },
  { 
    name: 'Mango Sticky Rice', 
    category: 'Dessert',
    orders: 950, 
    revenue: 142800, 
    margin: 78, 
    rating: 4.8, 
    trend: 'up',
    price: 150,
    cost: 33
  },
  { 
    name: 'Thai Iced Tea', 
    category: 'Beverage',
    orders: 1600, 
    revenue: 128400, 
    margin: 82, 
    rating: 4.4, 
    trend: 'up',
    price: 80,
    cost: 14
  }
]

const getUnderperformingItems = () => [
  { 
    name: 'Massaman Curry', 
    category: 'Main Course',
    orders: 45, 
    revenue: 12150, 
    margin: 45, 
    rating: 3.8, 
    trend: 'down',
    issue: 'Low demand'
  },
  { 
    name: 'Coconut Soup', 
    category: 'Soup',
    orders: 32, 
    revenue: 8960, 
    margin: 38, 
    rating: 3.9, 
    trend: 'down',
    issue: 'High cost'
  },
  { 
    name: 'Fish Cake', 
    category: 'Appetizer',
    orders: 28, 
    revenue: 5040, 
    margin: 42, 
    rating: 3.7, 
    trend: 'down',
    issue: 'Poor rating'
  }
]

const getCategoryPerformance = () => [
  { 
    category: 'Main Course', 
    items: 35, 
    totalRevenue: 1250000, 
    avgMargin: 65, 
    avgRating: 4.4,
    orderShare: 45,
    revenueShare: 52
  },
  { 
    category: 'Appetizer', 
    items: 18, 
    totalRevenue: 380000, 
    avgMargin: 72, 
    avgRating: 4.2,
    orderShare: 25,
    revenueShare: 16
  },
  { 
    category: 'Soup', 
    items: 12, 
    totalRevenue: 420000, 
    avgMargin: 68, 
    avgRating: 4.5,
    orderShare: 15,
    revenueShare: 17
  },
  { 
    category: 'Dessert', 
    items: 15, 
    totalRevenue: 285000, 
    avgMargin: 75, 
    avgRating: 4.6,
    orderShare: 10,
    revenueShare: 12
  },
  { 
    category: 'Beverage', 
    items: 22, 
    totalRevenue: 165000, 
    avgMargin: 80, 
    avgRating: 4.3,
    orderShare: 5,
    revenueShare: 3
  }
]

const getPricingAnalysis = () => [
  { priceRange: '฿50-100', items: 25, avgMargin: 78, orderVolume: 35, customerSatisfaction: 4.5 },
  { priceRange: '฿101-200', items: 45, avgMargin: 68, orderVolume: 40, customerSatisfaction: 4.4 },
  { priceRange: '฿201-300', items: 35, avgMargin: 62, orderVolume: 20, customerSatisfaction: 4.3 },
  { priceRange: '฿301-400', items: 15, avgMargin: 58, orderVolume: 4, customerSatisfaction: 4.2 },
  { priceRange: '฿400+', items: 7, avgMargin: 55, orderVolume: 1, customerSatisfaction: 4.1 }
]

export default function MenuPerformanceDashboard({ 
  className = '',
  timeRange = '30d',
  onTimeRangeChange 
}: MenuPerformanceDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(getMenuMetrics(timeRange))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setMetrics(getMenuMetrics(timeRange))
      setLoading(false)
    }, 500)
  }, [timeRange])

  const topItems = getTopPerformingItems()
  const underperformingItems = getUnderperformingItems()
  const categories = getCategoryPerformance()
  const pricingAnalysis = getPricingAnalysis()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Menu Performance</h2>
          <p className="text-gray-600 dark:text-gray-400">Analyze menu item performance and optimize pricing</p>
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
          <TabsTrigger value="items">Top Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Menu Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Total Menu Items"
              value={metrics.totalMenuItems.value}
              change={metrics.totalMenuItems.change}
              icon={<Utensils className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Avg Item Rating"
              value={metrics.avgItemRating.value}
              change={metrics.avgItemRating.change}
              icon={<Star className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Menu Profitability"
              value={metrics.menuProfitability.value}
              change={metrics.menuProfitability.change}
              icon={<Percent className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Top Seller Revenue"
              value={metrics.topSellerRevenue.value}
              change={metrics.topSellerRevenue.change}
              icon={<Award className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Menu Health Score</CardTitle>
                <CardDescription>Overall menu performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">High Performers</span>
                    </div>
                    <span className="font-semibold text-green-600">85 items</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Needs Attention</span>
                    </div>
                    <span className="font-semibold text-yellow-600">32 items</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Underperforming</span>
                    </div>
                    <span className="font-semibold text-red-600">10 items</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Recommended menu optimizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Optimize 3 underperforming items
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Review pricing for 5 items
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Promote top-rated items
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyze seasonal trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Top Performing Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Items</CardTitle>
              <CardDescription>Your best-selling and most profitable menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Item</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Orders</th>
                      <th className="text-left py-3 px-4 font-medium">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium">Margin</th>
                      <th className="text-left py-3 px-4 font-medium">Rating</th>
                      <th className="text-left py-3 px-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topItems.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-gray-600">{item.category}</td>
                        <td className="py-3 px-4">{item.orders.toLocaleString()}</td>
                        <td className="py-3 px-4">฿{item.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.margin}%</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            {item.rating}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center gap-1 ${
                            item.trend === 'up' ? 'text-green-600' : 
                            item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                             item.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                             <Clock className="h-4 w-4" />}
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

          {/* Underperforming Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items Needing Attention</CardTitle>
              <CardDescription>Menu items that may need optimization or removal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {underperformingItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.category} • {item.issue}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold">{item.orders} orders</div>
                        <div className="text-xs text-gray-500">฿{item.revenue.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4" />
                        {item.rating}
                      </div>
                      <Button size="sm" variant="outline">
                        Optimize
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Performance breakdown by menu category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{category.category}</h4>
                      <span className="text-sm text-gray-500">{category.items} items</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">฿{(category.totalRevenue / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{category.avgMargin}%</div>
                        <div className="text-xs text-gray-500">Avg Margin</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{category.avgRating}</div>
                        <div className="text-xs text-gray-500">Avg Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{category.orderShare}%</div>
                        <div className="text-xs text-gray-500">Order Share</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          {/* Pricing Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Analysis</CardTitle>
              <CardDescription>Performance across different price ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingAnalysis.map((range, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{range.priceRange}</div>
                        <div className="text-sm text-gray-500">{range.items} items</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="font-semibold">{range.avgMargin}%</div>
                        <div className="text-xs text-gray-500">Margin</div>
                      </div>
                      <div>
                        <div className="font-semibold">{range.orderVolume}%</div>
                        <div className="text-xs text-gray-500">Volume</div>
                      </div>
                      <div>
                        <div className="font-semibold">{range.customerSatisfaction}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
