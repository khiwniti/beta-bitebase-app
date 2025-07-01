"use client"

import React, { useState, useEffect } from 'react'
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  BarChart3,
  MapPin,
  Users,
  Star,
  DollarSign,
  Percent,
  Award,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'

interface MarketShareDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data for market share analytics
const getMarketShareMetrics = (timeRange: string) => ({
  marketShare: {
    value: '12.8%',
    change: { value: 2.3, period: 'vs last period', trend: 'up' as const }
  },
  marketRank: {
    value: '#3',
    change: { value: 1, period: 'position improved', trend: 'up' as const }
  },
  competitiveIndex: {
    value: '8.4/10',
    change: { value: 0.6, period: 'vs last period', trend: 'up' as const }
  },
  brandAwareness: {
    value: '34.2%',
    change: { value: 5.8, period: 'vs last period', trend: 'up' as const }
  },
  customerSatisfaction: {
    value: '4.6/5',
    change: { value: 0.2, period: 'vs last period', trend: 'up' as const }
  },
  marketPenetration: {
    value: '18.5%',
    change: { value: 3.1, period: 'vs last period', trend: 'up' as const }
  }
})

const getCompetitorAnalysis = () => [
  { 
    name: 'Your Restaurant', 
    marketShare: 12.8, 
    revenue: 2847500, 
    customers: 12847, 
    rating: 4.6, 
    growth: 15.3,
    isYou: true 
  },
  { 
    name: 'Thai Garden Premium', 
    marketShare: 18.5, 
    revenue: 4125000, 
    customers: 18500, 
    rating: 4.7, 
    growth: 8.2,
    isYou: false 
  },
  { 
    name: 'Bangkok Bistro', 
    marketShare: 15.2, 
    revenue: 3380000, 
    customers: 15200, 
    rating: 4.5, 
    growth: 12.1,
    isYou: false 
  },
  { 
    name: 'Spice Route', 
    marketShare: 11.3, 
    revenue: 2520000, 
    customers: 11300, 
    rating: 4.4, 
    growth: 6.8,
    isYou: false 
  },
  { 
    name: 'Golden Lotus', 
    marketShare: 9.7, 
    revenue: 2160000, 
    customers: 9700, 
    rating: 4.3, 
    growth: -2.1,
    isYou: false 
  }
]

const getMarketSegments = () => [
  { 
    segment: 'Premium Dining', 
    yourShare: 15.2, 
    marketSize: 850000000, 
    growth: 12.5, 
    opportunity: 'High',
    color: '#3B82F6'
  },
  { 
    segment: 'Casual Dining', 
    yourShare: 18.7, 
    marketSize: 1200000000, 
    growth: 8.3, 
    opportunity: 'Medium',
    color: '#10B981'
  },
  { 
    segment: 'Fast Casual', 
    yourShare: 8.9, 
    marketSize: 650000000, 
    growth: 22.1, 
    opportunity: 'High',
    color: '#F59E0B'
  },
  { 
    segment: 'Delivery Only', 
    yourShare: 5.2, 
    marketSize: 420000000, 
    growth: 35.8, 
    opportunity: 'Very High',
    color: '#8B5CF6'
  }
]

const getGeographicShare = () => [
  { area: 'Sukhumvit', yourShare: 22.5, totalMarket: 180000000, competitors: 8, position: 2 },
  { area: 'Silom', yourShare: 15.8, totalMarket: 145000000, competitors: 12, position: 4 },
  { area: 'Siam', yourShare: 18.2, totalMarket: 220000000, competitors: 15, position: 3 },
  { area: 'Chatuchak', yourShare: 8.5, totalMarket: 95000000, competitors: 6, position: 5 },
  { area: 'Thonglor', yourShare: 28.1, totalMarket: 125000000, competitors: 5, position: 1 }
]

const getCompetitiveAdvantages = () => [
  { factor: 'Food Quality', yourScore: 4.6, marketAvg: 4.2, advantage: 'Strong' },
  { factor: 'Service Speed', yourScore: 4.3, marketAvg: 4.1, advantage: 'Moderate' },
  { factor: 'Price Value', yourScore: 4.1, marketAvg: 4.0, advantage: 'Slight' },
  { factor: 'Ambiance', yourScore: 4.7, marketAvg: 4.3, advantage: 'Strong' },
  { factor: 'Location', yourScore: 4.4, marketAvg: 4.2, advantage: 'Moderate' },
  { factor: 'Digital Presence', yourScore: 3.8, marketAvg: 4.1, advantage: 'Weak' }
]

export default function MarketShareDashboard({ 
  className = '',
  timeRange = '30d',
  onTimeRangeChange 
}: MarketShareDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(getMarketShareMetrics(timeRange))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setMetrics(getMarketShareMetrics(timeRange))
      setLoading(false)
    }, 500)
  }, [timeRange])

  const competitors = getCompetitorAnalysis()
  const segments = getMarketSegments()
  const geographic = getGeographicShare()
  const advantages = getCompetitiveAdvantages()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Market Share Analysis</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your competitive position and market penetration</p>
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
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Market Share Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Market Share"
              value={metrics.marketShare.value}
              change={metrics.marketShare.change}
              icon={<Target className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Market Rank"
              value={metrics.marketRank.value}
              change={metrics.marketRank.change}
              icon={<Award className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Competitive Index"
              value={metrics.competitiveIndex.value}
              change={metrics.competitiveIndex.change}
              icon={<Zap className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Brand Awareness"
              value={metrics.brandAwareness.value}
              change={metrics.brandAwareness.change}
              icon={<Users className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* Market Share Trend Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Market Share Trend"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Market share trend chart would be displayed here</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Competitive Position"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Competitive positioning chart would be displayed here</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Competitive Advantages */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Advantages</CardTitle>
              <CardDescription>How you compare against market average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{advantage.factor}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        advantage.advantage === 'Strong' ? 'bg-green-100 text-green-800' :
                        advantage.advantage === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                        advantage.advantage === 'Slight' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {advantage.advantage}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold">You: {advantage.yourScore}</div>
                        <div className="text-xs text-gray-500">Market: {advantage.marketAvg}</div>
                      </div>
                      <div className={`flex items-center ${
                        advantage.yourScore > advantage.marketAvg ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {advantage.yourScore > advantage.marketAvg ? 
                          <TrendingUp className="h-4 w-4" /> : 
                          <TrendingDown className="h-4 w-4" />
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          {/* Competitor Analysis Table */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Landscape</CardTitle>
              <CardDescription>Key competitors and their market position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Restaurant</th>
                      <th className="text-left py-3 px-4 font-medium">Market Share</th>
                      <th className="text-left py-3 px-4 font-medium">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium">Customers</th>
                      <th className="text-left py-3 px-4 font-medium">Rating</th>
                      <th className="text-left py-3 px-4 font-medium">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((competitor, index) => (
                      <tr key={index} className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        competitor.isYou ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${competitor.isYou ? 'text-blue-600' : ''}`}>
                              {competitor.name}
                            </span>
                            {competitor.isYou && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{competitor.marketShare}%</td>
                        <td className="py-3 px-4">฿{competitor.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">{competitor.customers.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            {competitor.rating}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center gap-1 ${
                            competitor.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {competitor.growth > 0 ? 
                              <TrendingUp className="h-4 w-4" /> : 
                              <TrendingDown className="h-4 w-4" />
                            }
                            {Math.abs(competitor.growth)}%
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

        <TabsContent value="segments" className="space-y-6">
          {/* Market Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Market Segments Performance</CardTitle>
              <CardDescription>Your share across different market segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((segment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{segment.segment}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        segment.opportunity === 'Very High' ? 'bg-red-100 text-red-800' :
                        segment.opportunity === 'High' ? 'bg-orange-100 text-orange-800' :
                        segment.opportunity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {segment.opportunity} Opportunity
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Share:</span>
                        <span className="font-semibold">{segment.yourShare}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Market Size:</span>
                        <span>฿{(segment.marketSize / 1000000).toFixed(0)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Growth Rate:</span>
                        <span className="text-green-600">+{segment.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          {/* Geographic Market Share */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Market Share</CardTitle>
              <CardDescription>Your position across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographic.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{area.area}</div>
                        <div className="text-sm text-gray-500">{area.competitors} competitors</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold">{area.yourShare}%</div>
                        <div className="text-sm text-gray-500">Market Share</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">#{area.position}</div>
                        <div className="text-sm text-gray-500">Position</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">฿{(area.totalMarket / 1000000).toFixed(0)}M</div>
                        <div className="text-sm text-gray-500">Market Size</div>
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
