"use client"

import React, { useState } from 'react'
import { 
  BarChart3, 
  Users, 
  Target, 
  MapPin, 
  Utensils, 
  Globe,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  Settings
} from 'lucide-react'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

// Import all the new dashboard components
import RevenueAnalyticsDashboard from './RevenueAnalyticsDashboard'
import CustomerAnalyticsDashboard from './CustomerAnalyticsDashboard'
import MarketShareDashboard from './MarketShareDashboard'
import LocationIntelligenceDashboard from './LocationIntelligenceDashboard'
import MenuPerformanceDashboard from './MenuPerformanceDashboard'
import DigitalPresenceDashboard from './DigitalPresenceDashboard'

interface MarketResearchDashboardProps {
  className?: string
}

export default function MarketResearchDashboard({ className = '' }: MarketResearchDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const dashboardTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Executive summary and key insights'
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: DollarSign,
      description: 'Financial performance and profitability'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      description: 'Customer analytics and behavior'
    },
    {
      id: 'market-share',
      label: 'Market Share',
      icon: Target,
      description: 'Competitive positioning and market analysis'
    },
    {
      id: 'location',
      label: 'Location',
      icon: MapPin,
      description: 'Foot traffic and location intelligence'
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: Utensils,
      description: 'Menu performance and optimization'
    },
    {
      id: 'digital',
      label: 'Digital',
      icon: Globe,
      description: 'Online presence and social media'
    }
  ]

  const getOverviewMetrics = () => [
    { title: 'Total Revenue', value: '฿2.85M', change: '+12.5%', trend: 'up', color: 'green' },
    { title: 'Customer Base', value: '12,847', change: '+18.2%', trend: 'up', color: 'blue' },
    { title: 'Market Share', value: '12.8%', change: '+2.3%', trend: 'up', color: 'purple' },
    { title: 'Avg Rating', value: '4.6/5', change: '+0.2', trend: 'up', color: 'yellow' },
    { title: 'Foot Traffic', value: '8,547', change: '+12.8%', trend: 'up', color: 'indigo' },
    { title: 'Menu Items', value: '127', change: '+8', trend: 'up', color: 'pink' }
  ]

  const getKeyInsights = () => [
    {
      title: 'Revenue Growth Opportunity',
      description: 'Lunch hours show 35% higher profit margins. Consider expanding lunch menu.',
      priority: 'High',
      category: 'Revenue'
    },
    {
      title: 'Customer Retention Strong',
      description: '68.5% customer retention rate, 15% above industry average.',
      priority: 'Medium',
      category: 'Customers'
    },
    {
      title: 'Market Position Improving',
      description: 'Moved from #4 to #3 in local market ranking this quarter.',
      priority: 'Medium',
      category: 'Market Share'
    },
    {
      title: 'Digital Presence Needs Attention',
      description: 'Response rate to reviews is 75%. Industry best practice is 90%+.',
      priority: 'High',
      category: 'Digital'
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Market Research Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analytics for restaurant market intelligence and business optimization
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7 h-auto p-1">
          {dashboardTabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Executive Summary
              </CardTitle>
              <CardDescription>
                Key performance indicators and business health overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getOverviewMetrics().map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-600">{metric.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${metric.color}-100 text-${metric.color}-800`}>
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
              <CardDescription>
                AI-powered insights based on your market research data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getKeyInsights().map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{insight.category}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.priority === 'High' ? 'bg-red-100 text-red-800' :
                          insight.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and analysis tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Generate Report</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Competitor Analysis</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  <span className="text-sm">Location Analysis</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Forecast Trends</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalyticsDashboard 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerAnalyticsDashboard 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>

        <TabsContent value="market-share">
          <MarketShareDashboard 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>

        <TabsContent value="location">
          <LocationIntelligenceDashboard 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>

        <TabsContent value="menu">
          <MenuPerformanceDashboard 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>

        <TabsContent value="digital">
          <DigitalPresenceDashboard 
            timeRange={timeRange} 
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
