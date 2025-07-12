"use client"

import React, { useState, useEffect } from 'react'
import { 
  MapPin, 
  Users, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Car,
  Train,
  Building,
  ShoppingBag,
  Coffee,
  Utensils,
  Star,
  Navigation
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'

interface LocationIntelligenceDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data for location intelligence
const getLocationMetrics = (timeRange: string) => ({
  footTraffic: {
    value: '8,547',
    change: { value: 12.8, period: 'vs last period', trend: 'up' as const }
  },
  peakHours: {
    value: '12-2 PM',
    change: { value: 0, period: 'consistent', trend: 'neutral' as const }
  },
  catchmentRadius: {
    value: '2.5 km',
    change: { value: 8.3, period: 'expanded', trend: 'up' as const }
  },
  accessibilityScore: {
    value: '8.7/10',
    change: { value: 0.4, period: 'vs last period', trend: 'up' as const }
  },
  competitorDensity: {
    value: '12 nearby',
    change: { value: 2, period: 'new competitors', trend: 'up' as const }
  },
  demographicMatch: {
    value: '85%',
    change: { value: 3.2, period: 'vs last period', trend: 'up' as const }
  }
})

const getFootTrafficPatterns = () => ({
  hourly: [
    { hour: '6 AM', traffic: 45, percentage: 5 },
    { hour: '7 AM', traffic: 120, percentage: 14 },
    { hour: '8 AM', traffic: 180, percentage: 21 },
    { hour: '9 AM', traffic: 95, percentage: 11 },
    { hour: '10 AM', traffic: 75, percentage: 9 },
    { hour: '11 AM', traffic: 140, percentage: 16 },
    { hour: '12 PM', traffic: 280, percentage: 33 },
    { hour: '1 PM', traffic: 320, percentage: 37 },
    { hour: '2 PM', traffic: 250, percentage: 29 },
    { hour: '3 PM', traffic: 160, percentage: 19 },
    { hour: '4 PM', traffic: 140, percentage: 16 },
    { hour: '5 PM', traffic: 200, percentage: 23 },
    { hour: '6 PM', traffic: 290, percentage: 34 },
    { hour: '7 PM', traffic: 340, percentage: 40 },
    { hour: '8 PM', traffic: 280, percentage: 33 },
    { hour: '9 PM', traffic: 180, percentage: 21 },
    { hour: '10 PM', traffic: 95, percentage: 11 }
  ],
  weekly: [
    { day: 'Monday', traffic: 1250, conversion: 12.5 },
    { day: 'Tuesday', traffic: 1180, conversion: 11.8 },
    { day: 'Wednesday', traffic: 1320, conversion: 13.2 },
    { day: 'Thursday', traffic: 1450, conversion: 14.5 },
    { day: 'Friday', traffic: 1680, conversion: 16.8 },
    { day: 'Saturday', traffic: 1920, conversion: 19.2 },
    { day: 'Sunday', traffic: 1580, conversion: 15.8 }
  ]
})

const getLocationFactors = () => ({
  accessibility: [
    { factor: 'Public Transport', score: 9.2, description: 'BTS station 200m away' },
    { factor: 'Parking Availability', score: 7.5, description: '50 spaces nearby' },
    { factor: 'Walking Distance', score: 8.8, description: 'High pedestrian area' },
    { factor: 'Visibility', score: 9.0, description: 'Main road frontage' }
  ],
  demographics: [
    { segment: 'Young Professionals', percentage: 35, income: 'High', match: 'Excellent' },
    { segment: 'Families', percentage: 28, income: 'Medium-High', match: 'Good' },
    { segment: 'Students', percentage: 20, income: 'Low-Medium', match: 'Fair' },
    { segment: 'Tourists', percentage: 12, income: 'Medium', match: 'Good' },
    { segment: 'Seniors', percentage: 5, income: 'Medium', match: 'Fair' }
  ],
  amenities: [
    { type: 'Shopping Centers', count: 3, distance: '0.5 km', impact: 'High' },
    { type: 'Office Buildings', count: 8, distance: '0.3 km', impact: 'High' },
    { type: 'Hotels', count: 2, distance: '0.8 km', impact: 'Medium' },
    { type: 'Schools', count: 1, distance: '1.2 km', impact: 'Low' },
    { type: 'Hospitals', count: 1, distance: '2.0 km', impact: 'Low' }
  ]
})

const getCompetitorMapping = () => [
  { name: 'Thai Garden', distance: 0.2, type: 'Thai', rating: 4.5, priceRange: '฿฿฿', threat: 'High' },
  { name: 'Coffee Corner', distance: 0.1, type: 'Cafe', rating: 4.3, priceRange: '฿', threat: 'Low' },
  { name: 'Sushi Master', distance: 0.3, type: 'Japanese', rating: 4.6, priceRange: '฿฿฿฿', threat: 'Medium' },
  { name: 'Pizza Palace', distance: 0.4, type: 'Italian', rating: 4.2, priceRange: '฿฿', threat: 'Medium' },
  { name: 'Street Food Hub', distance: 0.5, type: 'Street Food', rating: 4.0, priceRange: '฿', threat: 'Low' }
]

export default function LocationIntelligenceDashboard({ 
  className = '',
  timeRange = '30d',
  onTimeRangeChange 
}: LocationIntelligenceDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(getLocationMetrics(timeRange))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setMetrics(getLocationMetrics(timeRange))
      setLoading(false)
    }, 500)
  }, [timeRange])

  const trafficPatterns = getFootTrafficPatterns()
  const locationFactors = getLocationFactors()
  const competitors = getCompetitorMapping()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Location Intelligence</h2>
          <p className="text-gray-600 dark:text-gray-400">Analyze foot traffic, demographics, and location factors</p>
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
          <TabsTrigger value="traffic">Foot Traffic</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Location Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Daily Foot Traffic"
              value={metrics.footTraffic.value}
              change={metrics.footTraffic.change}
              icon={<Users className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Peak Hours"
              value={metrics.peakHours.value}
              change={metrics.peakHours.change}
              icon={<Clock className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Catchment Radius"
              value={metrics.catchmentRadius.value}
              change={metrics.catchmentRadius.change}
              icon={<Navigation className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Accessibility Score"
              value={metrics.accessibilityScore.value}
              change={metrics.accessibilityScore.change}
              icon={<MapPin className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* Location Factors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Factors</CardTitle>
                <CardDescription>How accessible is your location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationFactors.accessibility.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{factor.factor}</div>
                        <div className="text-xs text-gray-500">{factor.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{factor.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nearby Amenities</CardTitle>
                <CardDescription>Key amenities affecting foot traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationFactors.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm">{amenity.type}</div>
                          <div className="text-xs text-gray-500">{amenity.distance} away</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="font-semibold">{amenity.count}</div>
                          <div className="text-xs text-gray-500">Count</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          amenity.impact === 'High' ? 'bg-green-100 text-green-800' :
                          amenity.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {amenity.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          {/* Foot Traffic Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Traffic Pattern</CardTitle>
                <CardDescription>Peak hours and traffic distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trafficPatterns.hourly.filter((_, index) => index % 2 === 0).map((hour, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-16">{hour.hour}</span>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${hour.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{hour.traffic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Traffic Pattern</CardTitle>
                <CardDescription>Daily traffic and conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trafficPatterns.weekly.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{day.day}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{day.traffic}</div>
                          <div className="text-xs text-gray-500">Visitors</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{day.conversion}%</div>
                          <div className="text-xs text-gray-500">Conversion</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          {/* Demographics Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
              <CardDescription>Who visits your location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationFactors.demographics.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{segment.segment}</div>
                        <div className="text-sm text-gray-500">Income: {segment.income}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{segment.percentage}%</div>
                        <div className="text-xs text-gray-500">of visitors</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        segment.match === 'Excellent' ? 'bg-green-100 text-green-800' :
                        segment.match === 'Good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {segment.match} Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          {/* Competitor Mapping */}
          <Card>
            <CardHeader>
              <CardTitle>Nearby Competitors</CardTitle>
              <CardDescription>Restaurants and food establishments in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Utensils className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{competitor.name}</div>
                        <div className="text-sm text-gray-500">{competitor.type} • {competitor.distance} km away</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">{competitor.rating}</span>
                      </div>
                      <div className="text-sm">{competitor.priceRange}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        competitor.threat === 'High' ? 'bg-red-100 text-red-800' :
                        competitor.threat === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {competitor.threat} Threat
                      </span>
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
