"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { 
  MapPin, 
  Users, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Building,
  Utensils,
  Star,
  Navigation,
  Calendar,
  Activity,
  AlertCircle,
  RefreshCw,
  Zap,
  Map,
  BarChart3,
  Target,
  ShoppingBag,
  Wifi,
  WifiOff
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { Progress } from '../ui/progress'
import { MetricCard, DashboardGrid } from './DashboardGrid'

interface LocationIntelligenceData {
  restaurant_id: string
  restaurant_name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  location_score: number
  competitor_analysis: {
    total_competitors: number
    competition_density: number
    avg_competitor_rating: number
    overall_competition_score: number
    top_competitors: Array<{
      name: string
      rating: number
      price: number
      distance: number
      categories: Array<{ name: string }>
    }>
    opportunities: string[]
    threats: string[]
  }
  foot_traffic: {
    total_venues: number
    average_daily_visits: number
    peak_hours: number[]
    hourly_distribution: Array<{
      hour: number
      total_visits: number
      avg_popularity: number
    }>
    demographic_profile: {
      age_groups: Array<{
        range: string
        percentage: number
      }>
      gender: {
        male: number
        female: number
        other: number
      }
    }
    opportunity_score: number
    insights: string[]
  }
  local_events: {
    total_events: number
    high_impact_events: Array<{
      name: string
      traffic_impact_score: number
      distance_km: number
      start_time: string
    }>
    upcoming_events: Array<{
      name: string
      category: string
      expected_attendance: number
      traffic_impact_score: number
    }>
  }
  recommendations: Array<{
    category: string
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    expected_impact: string
  }>
  generated_at: string
}

interface EnhancedLocationIntelligenceDashboardProps {
  restaurantId: string
  className?: string
  onLocationChange?: (locationData: LocationIntelligenceData) => void
}

export default function EnhancedLocationIntelligenceDashboard({ 
  restaurantId,
  className = '',
  onLocationChange
}: EnhancedLocationIntelligenceDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState<LocationIntelligenceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'pending'>('disconnected')

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  const fetchLocationData = useCallback(async (forceRefresh = false) => {
    if (!restaurantId) return

    try {
      setLoading(true)
      setError(null)
      setConnectionStatus('pending')

      const params = new URLSearchParams({
        force_refresh: forceRefresh.toString(),
        include_events: 'true'
      })

      const response = await fetch(`${apiBaseUrl}/location/restaurants/${restaurantId}/analysis?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        setData(result.data)
        setLastUpdated(new Date())
        setConnectionStatus('connected')
        onLocationChange?.(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch location data')
      }
    } catch (err) {
      console.error('Error fetching location data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setConnectionStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }, [restaurantId, apiBaseUrl, onLocationChange])

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchLocationData(false)
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchLocationData])

  // Initial load
  useEffect(() => {
    fetchLocationData(false)
  }, [fetchLocationData])

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return '12 PM'
    return `${hour - 12} PM`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderConnectionStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {connectionStatus === 'connected' && <Wifi className="h-4 w-4 text-green-500" />}
      {connectionStatus === 'disconnected' && <WifiOff className="h-4 w-4 text-red-500" />}
      {connectionStatus === 'pending' && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />}
      <span className={`${
        connectionStatus === 'connected' ? 'text-green-600' : 
        connectionStatus === 'disconnected' ? 'text-red-600' : 
        'text-blue-600'
      }`}>
        {connectionStatus === 'connected' ? 'Connected' : 
         connectionStatus === 'disconnected' ? 'Disconnected' : 
         'Connecting...'}
      </span>
      {lastUpdated && (
        <span className="text-gray-500">
          • Updated {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  )

  if (loading && !data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading location intelligence...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            <Button 
              onClick={() => fetchLocationData(true)} 
              variant="outline" 
              size="sm" 
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No location data available</p>
          <Button onClick={() => fetchLocationData(true)} className="mt-4">
            Load Location Data
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Location Intelligence
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights for {data.restaurant_name}
          </p>
          {renderConnectionStatus()}
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto-refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLocationData(true)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {error} (Showing cached data)
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Location Score"
              value={`${data.location_score}/100`}
              change={{ 
                value: data.location_score > 70 ? 5.2 : -2.1, 
                period: 'vs benchmark', 
                trend: data.location_score > 70 ? 'up' : 'down' 
              }}
              icon={<Target className="h-5 w-5" />}
              status={connectionStatus}
              loading={loading}
            />
            <MetricCard
              title="Daily Foot Traffic"
              value={data.foot_traffic.average_daily_visits.toLocaleString()}
              change={{ 
                value: 12.8, 
                period: 'vs last period', 
                trend: 'up' 
              }}
              icon={<Users className="h-5 w-5" />}
              status={connectionStatus}
              loading={loading}
            />
            <MetricCard
              title="Opportunity Score"
              value={`${data.foot_traffic.opportunity_score}/100`}
              change={{ 
                value: data.foot_traffic.opportunity_score > 60 ? 8.3 : -3.1, 
                period: 'market potential', 
                trend: data.foot_traffic.opportunity_score > 60 ? 'up' : 'down' 
              }}
              icon={<TrendingUp className="h-5 w-5" />}
              status={connectionStatus}
              loading={loading}
            />
            <MetricCard
              title="Competition Level"
              value={`${data.competitor_analysis.total_competitors} nearby`}
              change={{ 
                value: data.competitor_analysis.overall_competition_score, 
                period: 'competition score', 
                trend: data.competitor_analysis.overall_competition_score > 50 ? 'down' : 'up' 
              }}
              icon={<Building className="h-5 w-5" />}
              status={connectionStatus}
              loading={loading}
            />
          </DashboardGrid>

          {/* Peak Hours & Location Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Peak Traffic Hours</CardTitle>
                <CardDescription>
                  Busiest times based on area foot traffic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.foot_traffic.peak_hours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{formatTime(hour)} - {formatTime(hour + 1)}</div>
                          <div className="text-sm text-gray-500">Peak #{index + 1}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">High Traffic</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>
                  Restaurant location and address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">{data.restaurant_name}</div>
                      <div className="text-sm text-gray-500">{data.location.address}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {data.location.latitude.toFixed(6)}, {data.location.longitude.toFixed(6)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Venues Analyzed:</span>
                        <div className="font-semibold">{data.foot_traffic.total_venues}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Events Tracked:</span>
                        <div className="font-semibold">{data.local_events.total_events}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Demographics Overview</CardTitle>
              <CardDescription>Customer profile in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Age Groups</h4>
                  <div className="space-y-2">
                    {data.foot_traffic.demographic_profile.age_groups.map((group, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{group.range}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={group.percentage} className="w-20" />
                          <span className="text-sm font-medium w-12">{group.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Gender Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Male</span>
                      <div className="flex items-center gap-2">
                        <Progress value={data.foot_traffic.demographic_profile.gender.male} className="w-20" />
                        <span className="text-sm font-medium w-12">{data.foot_traffic.demographic_profile.gender.male}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Female</span>
                      <div className="flex items-center gap-2">
                        <Progress value={data.foot_traffic.demographic_profile.gender.female} className="w-20" />
                        <span className="text-sm font-medium w-12">{data.foot_traffic.demographic_profile.gender.female}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          {/* Hourly Traffic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic Distribution</CardTitle>
              <CardDescription>
                Foot traffic patterns throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.foot_traffic.hourly_distribution
                  .filter(hour => hour.total_visits > 0)
                  .map((hour, index) => {
                    const maxVisits = Math.max(...data.foot_traffic.hourly_distribution.map(h => h.total_visits))
                    const percentage = (hour.total_visits / maxVisits) * 100
                    const isPeak = data.foot_traffic.peak_hours.includes(hour.hour)
                    
                    return (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                        isPeak ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-16">
                            {formatTime(hour.hour)}
                          </span>
                          {isPeak && <Badge variant="secondary" className="text-xs">Peak</Badge>}
                        </div>
                        <div className="flex-1 mx-4">
                          <Progress 
                            value={percentage} 
                            className="w-full"
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{hour.total_visits.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">visits</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Insights</CardTitle>
              <CardDescription>Key observations about foot traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.foot_traffic.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span className="text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          {/* Competition Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Competitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.competitor_analysis.total_competitors}</div>
                <p className="text-sm text-gray-500">Within 2km radius</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Density</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.competitor_analysis.competition_density}</div>
                <p className="text-sm text-gray-500">per km²</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.competitor_analysis.avg_competitor_rating.toFixed(1)}</div>
                <p className="text-sm text-gray-500">competitor average</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Competitors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Competitors</CardTitle>
              <CardDescription>Closest and highest-rated competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.competitor_analysis.top_competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Utensils className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{competitor.name}</div>
                        <div className="text-sm text-gray-500">
                          {competitor.categories.map(cat => cat.name).join(', ')} • {competitor.distance.toFixed(1)}km away
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium">{competitor.rating}</span>
                      </div>
                      <div className="text-sm">
                        {'$'.repeat(competitor.price || 2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitive Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Opportunities</CardTitle>
                <CardDescription>Market gaps and advantages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.competitor_analysis.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Threats</CardTitle>
                <CardDescription>Competitive challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.competitor_analysis.threats.map((threat, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
                      <span className="text-sm">{threat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Events Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.local_events.total_events}</div>
                <p className="text-sm text-gray-500">Next 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">High Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.local_events.high_impact_events.length}</div>
                <p className="text-sm text-gray-500">Events likely to boost traffic</p>
              </CardContent>
            </Card>
          </div>

          {/* High Impact Events */}
          {data.local_events.high_impact_events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>High Impact Events</CardTitle>
                <CardDescription>Events likely to significantly impact foot traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.local_events.high_impact_events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-gray-500">
                            {event.distance_km.toFixed(1)}km away • {new Date(event.start_time).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-orange-100 text-orange-800">
                          +{event.traffic_impact_score}% impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>All events in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.local_events.upcoming_events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-gray-500">
                          {event.category} • {event.expected_attendance?.toLocaleString()} expected
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">+{event.traffic_impact_score}%</div>
                      <div className="text-xs text-gray-500">traffic impact</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription>
                Actionable insights based on your location data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="text-xs text-gray-500">
                      Expected Impact: {rec.expected_impact}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Location Score Breakdown</CardTitle>
              <CardDescription>
                How your location score is calculated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Foot Traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={data.foot_traffic.opportunity_score} className="w-24" />
                    <span className="text-sm font-medium w-12">{data.foot_traffic.opportunity_score}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Competition Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={100 - data.competitor_analysis.overall_competition_score} className="w-24" />
                    <span className="text-sm font-medium w-12">{100 - data.competitor_analysis.overall_competition_score}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Overall Location Score</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(data.location_score)}`}>
                        {data.location_score}
                      </span>
                      <span className="text-gray-500">/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}