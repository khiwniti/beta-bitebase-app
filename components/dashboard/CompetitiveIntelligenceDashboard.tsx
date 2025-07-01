"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert } from '../ui/alert'
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Shield,
  Lightbulb,
  Eye,
  MapPin,
  Star,
  DollarSign,
  Users,
  Clock,
  Zap,
  Activity,
  BarChart3,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { 
  competitiveIntelligenceService, 
  type CompetitiveAnalysis,
  type CompetitorAlert,
  type Competitor 
} from '../../lib/competitive-intelligence-service'

interface CompetitiveIntelligenceDashboardProps {
  restaurantId: string;
  className?: string;
}

export default function CompetitiveIntelligenceDashboard({ 
  restaurantId, 
  className = "" 
}: CompetitiveIntelligenceDashboardProps) {
  const [analysis, setAnalysis] = useState<CompetitiveAnalysis | null>(null)
  const [alerts, setAlerts] = useState<CompetitorAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'competitors' | 'alerts' | 'insights'>('overview')
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null)

  useEffect(() => {
    loadCompetitiveData()
  }, [restaurantId])

  const loadCompetitiveData = async () => {
    setLoading(true)
    try {
      const [analysisResult, alertsResult] = await Promise.all([
        competitiveIntelligenceService.generateCompetitiveAnalysis(restaurantId),
        competitiveIntelligenceService.monitorCompetitorChanges(restaurantId)
      ])
      
      setAnalysis(analysisResult)
      setAlerts(alertsResult)
    } catch (error) {
      console.error('Failed to load competitive data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMarketPositionData = () => {
    if (!analysis) return []
    
    return [
      {
        category: 'Pricing',
        yourScore: analysis.marketPosition.pricing,
        marketAvg: 65
      },
      {
        category: 'Quality',
        yourScore: analysis.marketPosition.quality,
        marketAvg: 70
      },
      {
        category: 'Service',
        yourScore: analysis.marketPosition.service,
        marketAvg: 68
      },
      {
        category: 'Innovation',
        yourScore: analysis.marketPosition.innovation,
        marketAvg: 60
      },
      {
        category: 'Overall',
        yourScore: analysis.marketPosition.overall,
        marketAvg: 66
      }
    ]
  }

  const getCompetitorComparisonData = () => {
    if (!analysis) return []
    
    return analysis.competitors.map(competitor => ({
      name: competitor.name.substring(0, 15),
      priceRange: competitor.priceRange * 25, // Convert to percentage
      distance: competitor.location.distance,
      cuisine: competitor.cuisine.length
    }))
  }

  const getSentimentData = () => {
    return [
      { name: 'Positive', value: 65, color: '#10b981' },
      { name: 'Neutral', value: 25, color: '#6b7280' },
      { name: 'Negative', value: 10, color: '#ef4444' }
    ]
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-4 h-4" />
      case 'gap': return <Target className="w-4 h-4" />
      case 'strength': return <Shield className="w-4 h-4" />
      case 'weakness': return <AlertTriangle className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'gap': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'strength': return 'text-green-600 bg-green-50 border-green-200'
      case 'weakness': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'competitors', label: 'Competitors', icon: <Users className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> }
  ]

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className={className}>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <div>
            <h4>Analysis Unavailable</h4>
            <p>Unable to generate competitive analysis. Please try again later.</p>
          </div>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Eye className="w-6 h-6 mr-2 text-purple-600" />
            Competitive Intelligence
          </h2>
          <p className="text-gray-600">AI-powered competitive monitoring and insights</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {analysis.confidence * 100}% Confidence
          </Badge>
          <Button size="sm" onClick={loadCompetitiveData}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Rank</p>
                <p className="text-2xl font-bold text-gray-900">
                  #{analysis.marketPosition.marketShare.rank}
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                of {analysis.marketPosition.marketShare.totalCompetitors} restaurants
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Share</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analysis.marketPosition.marketShare.estimated}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Estimated
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => !a.acknowledged).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge 
                variant={alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length > 0 ? 'destructive' : 'outline'}
                className="text-xs"
              >
                {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length} urgent
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Competitors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analysis.competitors.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Within 2km
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'alerts' && alerts.filter(a => !a.acknowledged).length > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                  {alerts.filter(a => !a.acknowledged).length}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Market Position Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Market Position Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getMarketPositionData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      name="Your Restaurant" 
                      dataKey="yourScore" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar 
                      name="Market Average" 
                      dataKey="marketAvg" 
                      stroke="#6b7280" 
                      fill="#6b7280" 
                      fillOpacity={0.1}
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCompetitorComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="priceRange" fill="#8b5cf6" name="Price Level" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getSentimentData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {getSentimentData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedTab === 'competitors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.competitors.map((competitor) => (
              <Card key={competitor.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                      <p className="text-sm text-gray-600">{competitor.cuisine.join(', ')}</p>
                    </div>
                    <Badge variant="outline">
                      {'$'.repeat(competitor.priceRange)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {competitor.location.distance} km away
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {competitor.operatingHours.monday?.open} - {competitor.operatingHours.monday?.close}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {competitor.contact.website && (
                        <Button size="sm" variant="outline" className="p-1">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedCompetitor(competitor.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
                <p className="text-gray-600">No competitive alerts at this time.</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} className="relative">
                <div className={`w-3 h-3 rounded-full ${getAlertSeverityColor(alert.severity)} absolute top-4 left-4`} />
                <div className="ml-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{alert.createdAt.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  
                  {alert.suggestions.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-xs font-medium text-gray-700 mb-1">Suggested Actions:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                        {alert.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Alert>
            ))
          )}
        </div>
      )}

      {selectedTab === 'insights' && (
        <div className="space-y-6">
          {/* Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.insights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start space-x-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{insight.title}</h4>
                          <p className="text-sm opacity-90 mt-1">{insight.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                            <span className="text-xs opacity-75">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <span>Impact: {rec.expectedImpact}</span>
                        <span>Timeline: {rec.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Threats and Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Competitive Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.threats.map((threat, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-red-800">{threat.title}</h4>
                        <Badge variant="destructive" className="text-xs">
                          {threat.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-red-700 mb-2">{threat.description}</p>
                      <div className="text-xs text-red-600">
                        Estimated Impact: {threat.estimatedImpact}% revenue loss
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Target className="w-5 h-5 mr-2" />
                  Market Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.opportunities.map((opp, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-green-800">{opp.title}</h4>
                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                          {opp.effort} effort
                        </Badge>
                      </div>
                      <p className="text-xs text-green-700 mb-2">{opp.description}</p>
                      <div className="text-xs text-green-600">
                        Potential Revenue: ${(opp.estimatedRevenue / 1000).toFixed(0)}k annually
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}