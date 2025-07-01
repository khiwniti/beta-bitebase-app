"use client"

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserCheck, 
  Clock, 
  Star,
  Heart,
  Calendar,
  TrendingUp,
  TrendingDown,
  MapPin,
  Smartphone,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'
import { RealDataService } from '../../lib/real-data-service'

interface CustomerAnalyticsDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
  restaurantId?: string // Add restaurantId prop for real data
}

// Real data functions using RealDataService
const getCustomerMetrics = async (restaurantId: string, timeRange: string) => {
  try {
    const data = await RealDataService.CustomerAnalytics.getCustomerMetrics(restaurantId, timeRange);
    return data || {
      totalCustomers: { value: '0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      newCustomers: { value: '0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      returningCustomers: { value: '0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      customerRetention: { value: '0%', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      avgVisitFrequency: { value: '0x/month', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      customerLifetimeValue: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } }
    };
  } catch (error) {
    console.error('Failed to fetch customer metrics:', error);
    return {
      totalCustomers: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      newCustomers: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      returningCustomers: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      customerRetention: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      avgVisitFrequency: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
      customerLifetimeValue: { value: 'Error', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } }
    };
  }
}

const getDemographics = async (restaurantId: string) => {
  try {
    const data = await RealDataService.CustomerAnalytics.getDemographics(restaurantId);
    return data || {
      ageGroups: [
        { range: '18-25', percentage: 0, count: 0 },
        { range: '26-35', percentage: 0, count: 0 },
        { range: '36-45', percentage: 0, count: 0 },
        { range: '46-55', percentage: 0, count: 0 },
        { range: '55+', percentage: 0, count: 0 }
      ],
      gender: [
        { type: 'Female', percentage: 0, count: 0 },
        { type: 'Male', percentage: 0, count: 0 },
        { type: 'Other', percentage: 0, count: 0 }
      ],
      locations: [
        { area: 'No Data', percentage: 0, count: 0 }
      ]
    };
  } catch (error) {
    console.error('Failed to fetch demographics:', error);
    return {
      ageGroups: [{ range: 'Error', percentage: 0, count: 0 }],
      gender: [{ type: 'Error', percentage: 0, count: 0 }],
      locations: [{ area: 'Error', percentage: 0, count: 0 }]
    };
  }
}

const getCustomerBehavior = () => ({
  visitTimes: [
    { time: 'Breakfast (6-10 AM)', percentage: 15, avgSpend: 185 },
    { time: 'Lunch (11 AM-2 PM)', percentage: 35, avgSpend: 285 },
    { time: 'Afternoon (2-5 PM)', percentage: 20, avgSpend: 165 },
    { time: 'Dinner (5-9 PM)', percentage: 25, avgSpend: 425 },
    { time: 'Late Night (9 PM+)', percentage: 5, avgSpend: 145 }
  ],
  orderChannels: [
    { channel: 'Dine-in', percentage: 45, satisfaction: 4.6 },
    { channel: 'Delivery', percentage: 35, satisfaction: 4.3 },
    { channel: 'Takeaway', percentage: 20, satisfaction: 4.5 }
  ],
  deviceUsage: [
    { device: 'Mobile', percentage: 68, orders: 8736 },
    { device: 'Desktop', percentage: 22, orders: 2826 },
    { device: 'Tablet', percentage: 10, orders: 1285 }
  ]
})

const getTopCustomers = () => [
  { name: 'Siriporn K.', visits: 45, totalSpent: 18750, avgOrder: 417, lastVisit: '2 days ago' },
  { name: 'Niran P.', visits: 38, totalSpent: 15960, avgOrder: 420, lastVisit: '1 day ago' },
  { name: 'Malee S.', visits: 42, totalSpent: 14280, avgOrder: 340, lastVisit: '3 days ago' },
  { name: 'Somchai T.', visits: 35, totalSpent: 13825, avgOrder: 395, lastVisit: '1 day ago' },
  { name: 'Pranee W.', visits: 40, totalSpent: 12800, avgOrder: 320, lastVisit: '4 days ago' }
]

export default function CustomerAnalyticsDashboard({
  className = '',
  timeRange = '30d',
  onTimeRangeChange,
  restaurantId = 'default-restaurant' // Default restaurant ID
}: CustomerAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState({
    totalCustomers: { value: '0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    newCustomers: { value: '0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    returningCustomers: { value: '0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    customerRetention: { value: '0%', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    avgVisitFrequency: { value: '0x/month', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } },
    customerLifetimeValue: { value: '฿0', change: { value: 0, period: 'vs last period', trend: 'neutral' as 'neutral' | 'up' | 'down' } }
  })
  const [demographics, setDemographics] = useState({
    ageGroups: [
      { range: '18-25', percentage: 0, count: 0 },
      { range: '26-35', percentage: 0, count: 0 },
      { range: '36-45', percentage: 0, count: 0 },
      { range: '46-55', percentage: 0, count: 0 },
      { range: '55+', percentage: 0, count: 0 }
    ],
    gender: [
      { type: 'Female', percentage: 0, count: 0 },
      { type: 'Male', percentage: 0, count: 0 },
      { type: 'Other', percentage: 0, count: 0 }
    ],
    locations: [
      { area: 'No Data', percentage: 0, count: 0 }
    ]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load all data concurrently
        const [metricsData, demographicsData] = await Promise.all([
          getCustomerMetrics(restaurantId, timeRange),
          getDemographics(restaurantId)
        ])
        
        setMetrics(metricsData)
        setDemographics(demographicsData)
      } catch (error) {
        console.error('Failed to load customer data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [timeRange, restaurantId])

  const behavior = getCustomerBehavior()
  const topCustomers = getTopCustomers()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Understand your customer base and behavior patterns</p>
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
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="loyalty">Top Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Customer Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Total Customers"
              value={metrics.totalCustomers.value}
              change={metrics.totalCustomers.change}
              icon={<Users className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="New Customers"
              value={metrics.newCustomers.value}
              change={metrics.newCustomers.change}
              icon={<UserCheck className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Customer Retention"
              value={metrics.customerRetention.value}
              change={metrics.customerRetention.change}
              icon={<Heart className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Avg Visit Frequency"
              value={metrics.avgVisitFrequency.value}
              change={metrics.avgVisitFrequency.change}
              icon={<Clock className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* Customer Growth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Customer Growth"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Customer growth chart would be displayed here</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Customer Lifetime Value"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">CLV analysis would be displayed here</p>
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Age Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Customer age demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demographics.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{group.range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${group.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{group.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Customer gender breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demographics.gender.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
                <CardDescription>Customer location breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demographics.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{location.area}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${location.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visit Times */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Visit Times</CardTitle>
                <CardDescription>When customers visit most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {behavior.visitTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{time.time}</div>
                        <div className="text-xs text-gray-500">Avg: ฿{time.avgSpend}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{time.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Order Channels</CardTitle>
                <CardDescription>How customers order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {behavior.orderChannels.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{channel.channel}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {channel.satisfaction}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{channel.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Your most valuable customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Visits</th>
                      <th className="text-left py-3 px-4 font-medium">Total Spent</th>
                      <th className="text-left py-3 px-4 font-medium">Avg Order</th>
                      <th className="text-left py-3 px-4 font-medium">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4 font-medium">{customer.name}</td>
                        <td className="py-3 px-4">{customer.visits}</td>
                        <td className="py-3 px-4">฿{customer.totalSpent.toLocaleString()}</td>
                        <td className="py-3 px-4">฿{customer.avgOrder}</td>
                        <td className="py-3 px-4 text-gray-600">{customer.lastVisit}</td>
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
