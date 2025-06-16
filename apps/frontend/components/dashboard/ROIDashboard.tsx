"use client"

import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Percent,
  Calculator,
  PieChart,
  BarChart3,
  Clock,
  Award,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'

interface ROIDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data for ROI analytics
const getROIMetrics = (timeRange: string) => ({
  overallROI: {
    value: '285%',
    change: { value: 18.5, period: 'vs last period', trend: 'up' as const }
  },
  marketingROI: {
    value: '420%',
    change: { value: 32.1, period: 'vs last period', trend: 'up' as const }
  },
  operationalEfficiency: {
    value: '87.5%',
    change: { value: 5.2, period: 'vs last period', trend: 'up' as const }
  },
  customerAcquisitionCost: {
    value: '฿125',
    change: { value: -8.3, period: 'vs last period', trend: 'down' as const }
  },
  customerLifetimeValue: {
    value: '฿3,245',
    change: { value: 12.7, period: 'vs last period', trend: 'up' as const }
  },
  paybackPeriod: {
    value: '3.2 months',
    change: { value: -0.8, period: 'improvement', trend: 'down' as const }
  }
})

const getInvestmentAnalysis = () => [
  {
    category: 'Marketing & Advertising',
    investment: 180000,
    returns: 756000,
    roi: 320,
    payback: 2.1,
    status: 'excellent',
    breakdown: [
      { channel: 'Social Media Ads', investment: 45000, returns: 189000, roi: 320 },
      { channel: 'Google Ads', investment: 60000, returns: 252000, roi: 320 },
      { channel: 'Influencer Marketing', investment: 35000, returns: 147000, roi: 320 },
      { channel: 'Traditional Media', investment: 40000, returns: 168000, roi: 320 }
    ]
  },
  {
    category: 'Technology & Systems',
    investment: 250000,
    returns: 625000,
    roi: 150,
    payback: 4.8,
    status: 'good',
    breakdown: [
      { channel: 'POS System Upgrade', investment: 80000, returns: 200000, roi: 150 },
      { channel: 'Online Ordering Platform', investment: 120000, returns: 300000, roi: 150 },
      { channel: 'Kitchen Equipment', investment: 50000, returns: 125000, roi: 150 }
    ]
  },
  {
    category: 'Staff Training & Development',
    investment: 95000,
    returns: 285000,
    roi: 200,
    payback: 3.6,
    status: 'good',
    breakdown: [
      { channel: 'Service Training', investment: 35000, returns: 105000, roi: 200 },
      { channel: 'Culinary Skills', investment: 40000, returns: 120000, roi: 200 },
      { channel: 'Management Development', investment: 20000, returns: 60000, roi: 200 }
    ]
  },
  {
    category: 'Facility Improvements',
    investment: 320000,
    returns: 480000,
    roi: 50,
    payback: 8.0,
    status: 'fair',
    breakdown: [
      { channel: 'Interior Renovation', investment: 200000, returns: 300000, roi: 50 },
      { channel: 'Kitchen Expansion', investment: 80000, returns: 120000, roi: 50 },
      { channel: 'Outdoor Seating', investment: 40000, returns: 60000, roi: 50 }
    ]
  }
]

const getPerformanceMetrics = () => [
  {
    metric: 'Revenue per Square Meter',
    current: 15420,
    target: 18000,
    benchmark: 12500,
    performance: 'above_target',
    trend: 'up'
  },
  {
    metric: 'Table Turnover Rate',
    current: 3.2,
    target: 3.5,
    benchmark: 2.8,
    performance: 'on_track',
    trend: 'up'
  },
  {
    metric: 'Labor Cost Percentage',
    current: 28.5,
    target: 30.0,
    benchmark: 32.0,
    performance: 'excellent',
    trend: 'down'
  },
  {
    metric: 'Food Cost Percentage',
    current: 31.2,
    target: 30.0,
    benchmark: 33.0,
    performance: 'needs_improvement',
    trend: 'stable'
  },
  {
    metric: 'Customer Satisfaction Score',
    current: 4.6,
    target: 4.5,
    benchmark: 4.2,
    performance: 'excellent',
    trend: 'up'
  },
  {
    metric: 'Average Order Processing Time',
    current: 12.5,
    target: 15.0,
    benchmark: 18.0,
    performance: 'excellent',
    trend: 'down'
  }
]

const getCostOptimization = () => [
  {
    area: 'Food Waste Reduction',
    currentCost: 45000,
    optimizedCost: 32000,
    savings: 13000,
    implementation: 'Easy',
    timeline: '1 month',
    description: 'Implement inventory management system and portion control'
  },
  {
    area: 'Energy Efficiency',
    currentCost: 28000,
    optimizedCost: 21000,
    savings: 7000,
    implementation: 'Medium',
    timeline: '2 months',
    description: 'Upgrade to LED lighting and energy-efficient equipment'
  },
  {
    area: 'Staff Scheduling Optimization',
    currentCost: 185000,
    optimizedCost: 168000,
    savings: 17000,
    implementation: 'Medium',
    timeline: '1 month',
    description: 'Use data-driven scheduling to match staff levels with demand'
  },
  {
    area: 'Supplier Negotiation',
    currentCost: 95000,
    optimizedCost: 85000,
    savings: 10000,
    implementation: 'Easy',
    timeline: '2 weeks',
    description: 'Renegotiate contracts with key suppliers for better rates'
  }
]

export default function ROIDashboard({ 
  className = '',
  timeRange = '30d',
  onTimeRangeChange 
}: ROIDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(getROIMetrics(timeRange))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setMetrics(getROIMetrics(timeRange))
      setLoading(false)
    }, 500)
  }, [timeRange])

  const investments = getInvestmentAnalysis()
  const performance = getPerformanceMetrics()
  const costOptimization = getCostOptimization()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ROI & Performance</h2>
          <p className="text-gray-600 dark:text-gray-400">Return on investment analysis and operational efficiency metrics</p>
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
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key ROI Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Overall ROI"
              value={metrics.overallROI.value}
              change={metrics.overallROI.change}
              icon={<Target className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Marketing ROI"
              value={metrics.marketingROI.value}
              change={metrics.marketingROI.change}
              icon={<TrendingUp className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Operational Efficiency"
              value={metrics.operationalEfficiency.value}
              change={metrics.operationalEfficiency.change}
              icon={<Zap className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Customer Acquisition Cost"
              value={metrics.customerAcquisitionCost.value}
              change={metrics.customerAcquisitionCost.change}
              icon={<Calculator className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* ROI Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Performance Summary</CardTitle>
                <CardDescription>Overview of all investment categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.map((investment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium">{investment.category}</div>
                        <div className="text-sm text-gray-500">฿{investment.investment.toLocaleString()} invested</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{investment.roi}%</div>
                          <div className="text-xs text-gray-500">ROI</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          investment.status === 'excellent' ? 'bg-green-100 text-green-800' :
                          investment.status === 'good' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {investment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Critical business metrics and benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performance.slice(0, 4).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{metric.metric}</div>
                        <div className="text-xs text-gray-500">Target: {metric.target}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">{metric.current}</div>
                        </div>
                        <div className={`flex items-center ${
                          metric.performance === 'excellent' ? 'text-green-600' :
                          metric.performance === 'above_target' ? 'text-blue-600' :
                          metric.performance === 'on_track' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {metric.performance === 'excellent' || metric.performance === 'above_target' ? 
                            <CheckCircle className="h-4 w-4" /> : 
                            <AlertTriangle className="h-4 w-4" />
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          {/* Investment Analysis */}
          {investments.map((investment, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {investment.category}
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    investment.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    investment.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {investment.roi}% ROI
                  </span>
                </CardTitle>
                <CardDescription>
                  Investment: ฿{investment.investment.toLocaleString()} • 
                  Returns: ฿{investment.returns.toLocaleString()} • 
                  Payback: {investment.payback} months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investment.breakdown.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.channel}</div>
                        <div className="text-sm text-gray-500">฿{item.investment.toLocaleString()} invested</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">฿{item.returns.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Returns</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{item.roi}%</div>
                          <div className="text-xs text-gray-500">ROI</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators compared to targets and industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{metric.metric}</h4>
                      <div className={`flex items-center gap-1 ${
                        metric.performance === 'excellent' ? 'text-green-600' :
                        metric.performance === 'above_target' ? 'text-blue-600' :
                        metric.performance === 'on_track' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {metric.performance === 'excellent' || metric.performance === 'above_target' ? 
                          <CheckCircle className="h-4 w-4" /> : 
                          <AlertTriangle className="h-4 w-4" />
                        }
                        <span className="text-sm font-medium">
                          {metric.performance.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{metric.current}</div>
                        <div className="text-xs text-gray-500">Current</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{metric.target}</div>
                        <div className="text-xs text-gray-500">Target</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">{metric.benchmark}</div>
                        <div className="text-xs text-gray-500">Industry Avg</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Cost Optimization */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Opportunities</CardTitle>
              <CardDescription>Identified areas for cost reduction and efficiency improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costOptimization.map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{opportunity.area}</h4>
                        <p className="text-sm text-gray-600">{opportunity.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        opportunity.implementation === 'Easy' ? 'bg-green-100 text-green-800' :
                        opportunity.implementation === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {opportunity.implementation}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">฿{opportunity.currentCost.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Current Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">฿{opportunity.optimizedCost.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Optimized Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">฿{opportunity.savings.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Monthly Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{opportunity.timeline}</div>
                        <div className="text-xs text-gray-500">Implementation</div>
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
