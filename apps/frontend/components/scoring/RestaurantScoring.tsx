"use client"

import React, { useState, useEffect } from 'react'
import { 
  Star, 
  TrendingUp, 
  MapPin, 
  Users, 
  DollarSign, 
  Target,
  Award,
  BarChart3,
  Zap
} from 'lucide-react'
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"

interface ScoreMetric {
  id: string
  name: string
  value: number
  maxValue: number
  description: string
  icon: React.ElementType
  color: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
}

interface RestaurantScore {
  overall: number
  metrics: ScoreMetric[]
  lastUpdated: Date
  recommendations: string[]
}

interface RestaurantScoringProps {
  restaurantId?: string
  className?: string
  compact?: boolean
  showRecommendations?: boolean
}

const defaultMetrics: ScoreMetric[] = [
  {
    id: 'location',
    name: 'Location Score',
    value: 85,
    maxValue: 100,
    description: 'Based on foot traffic, accessibility, and competition density',
    icon: MapPin,
    color: 'text-blue-600',
    trend: 'up',
    trendValue: 5
  },
  {
    id: 'rating',
    name: 'Customer Rating',
    value: 92,
    maxValue: 100,
    description: 'Average customer satisfaction across all platforms',
    icon: Star,
    color: 'text-yellow-600',
    trend: 'up',
    trendValue: 2
  },
  {
    id: 'pricing',
    name: 'Pricing Strategy',
    value: 78,
    maxValue: 100,
    description: 'Competitive pricing analysis and value proposition',
    icon: DollarSign,
    color: 'text-green-600',
    trend: 'stable',
    trendValue: 0
  },
  {
    id: 'market',
    name: 'Market Position',
    value: 88,
    maxValue: 100,
    description: 'Market share and competitive advantage',
    icon: Target,
    color: 'text-purple-600',
    trend: 'up',
    trendValue: 8
  },
  {
    id: 'engagement',
    name: 'Customer Engagement',
    value: 75,
    maxValue: 100,
    description: 'Social media presence and customer interaction',
    icon: Users,
    color: 'text-indigo-600',
    trend: 'down',
    trendValue: -3
  },
  {
    id: 'performance',
    name: 'Business Performance',
    value: 82,
    maxValue: 100,
    description: 'Revenue trends and operational efficiency',
    icon: TrendingUp,
    color: 'text-emerald-600',
    trend: 'up',
    trendValue: 12
  }
]

export default function RestaurantScoring({ 
  restaurantId, 
  className = "",
  compact = false,
  showRecommendations = true 
}: RestaurantScoringProps) {
  const [score, setScore] = useState<RestaurantScore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch restaurant scoring data
    const fetchScore = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const overallScore = Math.round(
        defaultMetrics.reduce((sum, metric) => sum + metric.value, 0) / defaultMetrics.length
      )
      
      const recommendations = [
        "Consider expanding social media presence to improve customer engagement",
        "Location shows strong potential - consider extended hours during peak times",
        "Pricing is competitive but could be optimized for premium offerings",
        "Strong customer ratings - leverage this in marketing campaigns"
      ]
      
      setScore({
        overall: overallScore,
        metrics: defaultMetrics,
        lastUpdated: new Date(),
        recommendations
      })
      
      setLoading(false)
    }

    fetchScore()
  }, [restaurantId])

  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-600'
    if (value >= 80) return 'text-blue-600'
    if (value >= 70) return 'text-yellow-600'
    if (value >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (value: number) => {
    if (value >= 90) return 'bg-green-100 dark:bg-green-900/20'
    if (value >= 80) return 'bg-blue-100 dark:bg-blue-900/20'
    if (value >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20'
    if (value >= 60) return 'bg-orange-100 dark:bg-orange-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
      default:
        return <BarChart3 className="w-3 h-3 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">Unable to load scoring data</p>
      </div>
    )
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5" />
            Restaurant Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Overall Score</div>
          </div>
          <div className="space-y-2">
            {score.metrics.slice(0, 3).map((metric) => (
              <div key={metric.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-sm">{metric.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{metric.value}</span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Score Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              Restaurant Intelligence Score
            </div>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Comprehensive analysis based on location, performance, and market data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(score.overall)} mb-2`}>
                {score.overall}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Overall Score</div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${getScoreBgColor(score.overall)}`}>
                {score.overall >= 90 ? 'Excellent' : 
                 score.overall >= 80 ? 'Very Good' :
                 score.overall >= 70 ? 'Good' :
                 score.overall >= 60 ? 'Fair' : 'Needs Improvement'}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Performance Overview</span>
                  <span className="text-gray-500">Last updated: {score.lastUpdated.toLocaleDateString()}</span>
                </div>
                <Progress value={score.overall} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Strengths:</span>
                    <div className="font-medium">
                      {score.metrics
                        .filter(m => m.value >= 85)
                        .map(m => m.name)
                        .join(', ') || 'None identified'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Improvement Areas:</span>
                    <div className="font-medium">
                      {score.metrics
                        .filter(m => m.value < 80)
                        .map(m => m.name)
                        .join(', ') || 'None identified'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {score.metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  {metric.name}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  {metric.trendValue && (
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.trend === 'up' ? '+' : ''}{metric.trendValue}
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-500">/ {metric.maxValue}</span>
                </div>
                <Progress value={(metric.value / metric.maxValue) * 100} className="h-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      {showRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Actionable insights to improve your restaurant's performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {score.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}