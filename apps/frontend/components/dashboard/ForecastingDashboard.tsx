"use client"

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Clock,
  Percent
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'

interface ForecastingDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data for forecasting analytics
const getForecastMetrics = (timeRange: string) => ({
  revenueGrowth: {
    value: '+18.5%',
    change: { value: 3.2, period: 'projected next quarter', trend: 'up' as const }
  },
  customerGrowth: {
    value: '+22.1%',
    change: { value: 5.8, period: 'projected next quarter', trend: 'up' as const }
  },
  marketExpansion: {
    value: '2 areas',
    change: { value: 1, period: 'expansion opportunity', trend: 'up' as const }
  },
  seasonalPeak: {
    value: 'Dec 2024',
    change: { value: 0, period: 'next peak season', trend: 'neutral' as const }
  },
  profitMargin: {
    value: '72.3%',
    change: { value: 4.1, period: 'projected improvement', trend: 'up' as const }
  },
  riskScore: {
    value: 'Low',
    change: { value: 0, period: 'stable outlook', trend: 'neutral' as const }
  }
})

const getSeasonalTrends = () => [
  { 
    season: 'Q1 2024 (Jan-Mar)', 
    revenue: 2650000, 
    customers: 11200, 
    avgOrder: 425, 
    confidence: 92,
    factors: ['New Year promotions', 'Cool weather dining']
  },
  { 
    season: 'Q2 2024 (Apr-Jun)', 
    revenue: 2890000, 
    customers: 12100, 
    avgOrder: 445, 
    confidence: 88,
    factors: ['Songkran festival', 'Tourist season peak']
  },
  { 
    season: 'Q3 2024 (Jul-Sep)', 
    revenue: 2720000, 
    customers: 11800, 
    avgOrder: 435, 
    confidence: 85,
    factors: ['Rainy season', 'Back to school']
  },
  { 
    season: 'Q4 2024 (Oct-Dec)', 
    revenue: 3150000, 
    customers: 13500, 
    avgOrder: 465, 
    confidence: 90,
    factors: ['Holiday season', 'Year-end celebrations', 'Cool weather']
  }
]

const getGrowthOpportunities = () => [
  {
    opportunity: 'Delivery Expansion',
    potential: '฿450K',
    timeline: '3 months',
    investment: '฿120K',
    roi: '275%',
    probability: 85,
    description: 'Expand delivery radius to cover 3 new districts'
  },
  {
    opportunity: 'Lunch Menu Enhancement',
    potential: '฿320K',
    timeline: '2 months',
    investment: '฿80K',
    roi: '300%',
    probability: 92,
    description: 'Add express lunch options for office workers'
  },
  {
    opportunity: 'Weekend Brunch',
    potential: '฿280K',
    timeline: '1 month',
    investment: '฿60K',
    roi: '367%',
    probability: 78,
    description: 'Launch weekend brunch service 10AM-3PM'
  },
  {
    opportunity: 'Corporate Catering',
    potential: '฿380K',
    timeline: '4 months',
    investment: '฿150K',
    roi: '153%',
    probability: 70,
    description: 'Target corporate events and office catering'
  }
]

const getRiskFactors = () => [
  {
    risk: 'New Competitor Opening',
    impact: 'Medium',
    probability: 65,
    timeline: '2 months',
    mitigation: 'Strengthen customer loyalty program',
    description: 'Premium Thai restaurant planning to open 500m away'
  },
  {
    risk: 'Rising Food Costs',
    impact: 'High',
    probability: 80,
    timeline: '1 month',
    mitigation: 'Menu price optimization and supplier negotiation',
    description: 'Inflation affecting key ingredient costs by 8-12%'
  },
  {
    risk: 'Seasonal Demand Drop',
    impact: 'Low',
    probability: 90,
    timeline: '3 months',
    mitigation: 'Develop rainy season promotions',
    description: 'Historical 15% revenue drop during rainy season'
  }
]

const getMarketTrends = () => [
  {
    trend: 'Plant-Based Options',
    growth: '+45%',
    relevance: 'High',
    adoption: 'Growing',
    description: 'Increasing demand for vegetarian and vegan Thai dishes'
  },
  {
    trend: 'Health-Conscious Dining',
    growth: '+32%',
    relevance: 'High',
    adoption: 'Established',
    description: 'Low-sodium, organic, and gluten-free options gaining popularity'
  },
  {
    trend: 'Premium Experiences',
    growth: '+28%',
    relevance: 'Medium',
    adoption: 'Growing',
    description: 'Customers willing to pay more for unique dining experiences'
  },
  {
    trend: 'Digital Integration',
    growth: '+55%',
    relevance: 'High',
    adoption: 'Critical',
    description: 'QR menus, mobile ordering, and contactless payments'
  }
]

export default function ForecastingDashboard({ 
  className = '',
  timeRange = '30d',
  onTimeRangeChange 
}: ForecastingDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(getForecastMetrics(timeRange))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setMetrics(getForecastMetrics(timeRange))
      setLoading(false)
    }, 500)
  }, [timeRange])

  const seasonalTrends = getSeasonalTrends()
  const opportunities = getGrowthOpportunities()
  const risks = getRiskFactors()
  const marketTrends = getMarketTrends()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Forecasting & Trends</h2>
          <p className="text-gray-600 dark:text-gray-400">Predictive analytics and market trend analysis</p>
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
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Forecast Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Revenue Growth"
              value={metrics.revenueGrowth.value}
              change={metrics.revenueGrowth.change}
              icon={<TrendingUp className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Customer Growth"
              value={metrics.customerGrowth.value}
              change={metrics.customerGrowth.change}
              icon={<Target className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Market Expansion"
              value={metrics.marketExpansion.value}
              change={metrics.marketExpansion.change}
              icon={<Zap className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Risk Assessment"
              value={metrics.riskScore.value}
              change={metrics.riskScore.change}
              icon={<CheckCircle className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* Forecast Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Revenue Forecast"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Revenue forecast chart would be displayed here</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Customer Growth Projection"
              timeRange={timeRange}
              onTimeRangeChange={onTimeRangeChange}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Customer growth projection would be displayed here</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Potential challenges and mitigation strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {risks.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          risk.impact === 'High' ? 'text-red-500' :
                          risk.impact === 'Medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{risk.risk}</h4>
                          <p className="text-sm text-gray-600">{risk.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                          risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {risk.impact} Impact
                        </span>
                        <span className="text-xs text-gray-500">{risk.probability}% likely</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          {/* Seasonal Forecasts */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Performance Forecast</CardTitle>
              <CardDescription>Quarterly projections based on historical data and market trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {seasonalTrends.map((season, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{season.season}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Confidence:</span>
                        <span className="font-semibold text-green-600">{season.confidence}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">฿{(season.revenue / 1000000).toFixed(2)}M</div>
                        <div className="text-sm text-gray-600">Projected Revenue</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{season.customers.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Expected Customers</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">฿{season.avgOrder}</div>
                        <div className="text-sm text-gray-600">Avg Order Value</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Key Factors:</h5>
                      <div className="flex flex-wrap gap-2">
                        {season.factors.map((factor, factorIndex) => (
                          <span key={factorIndex} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          {/* Growth Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Opportunities</CardTitle>
              <CardDescription>Identified opportunities for business expansion and revenue growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{opportunity.opportunity}</h4>
                        <p className="text-sm text-gray-600">{opportunity.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        opportunity.probability >= 85 ? 'bg-green-100 text-green-800' :
                        opportunity.probability >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {opportunity.probability}% Success Rate
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{opportunity.potential}</div>
                        <div className="text-xs text-gray-500">Revenue Potential</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{opportunity.investment}</div>
                        <div className="text-xs text-gray-500">Investment Required</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{opportunity.roi}</div>
                        <div className="text-xs text-gray-500">Expected ROI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">{opportunity.timeline}</div>
                        <div className="text-xs text-gray-500">Timeline</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Market Trends Analysis</CardTitle>
              <CardDescription>Emerging trends and their potential impact on your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{trend.trend}</h4>
                        <p className="text-sm text-gray-600">{trend.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          trend.relevance === 'High' ? 'bg-red-100 text-red-800' :
                          trend.relevance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {trend.relevance} Relevance
                        </span>
                        <span className="text-sm font-semibold text-green-600">{trend.growth}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Market Adoption: {trend.adoption}</span>
                      <Button size="sm" variant="outline">
                        Analyze Impact
                      </Button>
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
