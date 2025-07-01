'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Users, 
  Clock,
  Utensils,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react'

export default function CompetitionPage() {
  const [selectedRadius, setSelectedRadius] = useState('500m')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const competitorData = {
    summary: {
      totalCompetitors: 23,
      directCompetitors: 8,
      averageRating: 4.2,
      averagePrice: '$$',
      marketShare: {
        'Your Restaurant': 12,
        'Thai Garden': 18,
        'Sukhumvit Bistro': 15,
        'Bangkok Kitchen': 12,
        'Others': 43
      }
    },
    competitors: [
      {
        id: 1,
        name: 'Thai Garden Restaurant',
        distance: '150m',
        cuisine: 'Thai',
        rating: 4.5,
        reviews: 1250,
        priceRange: '$$',
        status: 'direct',
        strengths: ['Authentic Thai', 'Large portions', 'Tourist favorite'],
        weaknesses: ['Slow service', 'Limited parking'],
        threat: 'high',
        marketShare: 18
      },
      {
        id: 2,
        name: 'Sukhumvit Bistro',
        distance: '200m',
        cuisine: 'International',
        rating: 4.3,
        reviews: 890,
        priceRange: '$$$',
        status: 'direct',
        strengths: ['Modern ambiance', 'Good wine selection', 'Business crowd'],
        weaknesses: ['Expensive', 'Small portions'],
        threat: 'medium',
        marketShare: 15
      },
      {
        id: 3,
        name: 'Bangkok Kitchen',
        distance: '300m',
        cuisine: 'Thai',
        rating: 4.1,
        reviews: 650,
        priceRange: '$',
        status: 'direct',
        strengths: ['Budget-friendly', 'Quick service', 'Local favorite'],
        weaknesses: ['Basic decor', 'Limited menu'],
        threat: 'medium',
        marketShare: 12
      },
      {
        id: 4,
        name: 'Sushi Zen',
        distance: '250m',
        cuisine: 'Japanese',
        rating: 4.4,
        reviews: 420,
        priceRange: '$$$',
        status: 'indirect',
        strengths: ['Fresh sushi', 'Authentic', 'Intimate setting'],
        weaknesses: ['Limited seating', 'No delivery'],
        threat: 'low',
        marketShare: 8
      },
      {
        id: 5,
        name: 'Pizza Corner',
        distance: '180m',
        cuisine: 'Italian',
        rating: 3.9,
        reviews: 320,
        priceRange: '$$',
        status: 'indirect',
        strengths: ['Late night', 'Delivery', 'Family-friendly'],
        weaknesses: ['Average quality', 'Noisy'],
        threat: 'low',
        marketShare: 6
      }
    ],
    insights: [
      {
        type: 'opportunity',
        title: 'Price Gap Opportunity',
        description: 'Limited options in the $$ range with modern ambiance',
        impact: 'high'
      },
      {
        type: 'threat',
        title: 'Thai Garden Dominance',
        description: 'Market leader with strong tourist appeal and authentic positioning',
        impact: 'high'
      },
      {
        type: 'trend',
        title: 'Premium Segment Growth',
        description: 'Increasing demand for upscale dining experiences in the area',
        impact: 'medium'
      },
      {
        type: 'weakness',
        title: 'Service Speed Issues',
        description: 'Most competitors struggle with service speed during peak hours',
        impact: 'medium'
      }
    ]
  }

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getThreatIcon = (threat: string) => {
    switch (threat) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Eye className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'threat': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'trend': return <TrendingUp className="h-5 w-5 text-blue-500" />
      case 'weakness': return <TrendingDown className="h-5 w-5 text-yellow-500" />
      default: return <Target className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredCompetitors = competitorData.competitors.filter(competitor => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'direct') return competitor.status === 'direct'
    if (selectedCategory === 'indirect') return competitor.status === 'indirect'
    return competitor.cuisine.toLowerCase() === selectedCategory
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Competition Analysis</h1>
                <p className="text-gray-600 dark:text-gray-400">Sukhumvit Area - {selectedRadius} radius</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="250m">250m radius</option>
                <option value="500m">500m radius</option>
                <option value="1km">1km radius</option>
                <option value="2km">2km radius</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Competitors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitorData.summary.totalCompetitors}</p>
                  <p className="text-xs text-gray-500">{competitorData.summary.directCompetitors} direct</p>
                </div>
                <Utensils className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitorData.summary.averageRating}</p>
                    <Star className="h-5 w-5 text-yellow-500 ml-1" />
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Price Range</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitorData.summary.averagePrice}</p>
                  <p className="text-xs text-gray-500">฿200-500</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Market Share</p>
                  <p className="text-2xl font-bold text-primary-600">{competitorData.summary.marketShare['Your Restaurant']}%</p>
                  <p className="text-xs text-gray-500">estimated</p>
                </div>
                <PieChart className="h-8 w-8 text-primary-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Share */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Market Share Distribution
            </CardTitle>
            <CardDescription>
              Estimated market share based on reviews, ratings, and foot traffic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(competitorData.summary.marketShare).map(([restaurant, share]) => (
                <div key={restaurant} className="flex items-center justify-between">
                  <span className={`text-sm ${restaurant === 'Your Restaurant' ? 'font-medium text-primary-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    {restaurant}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${restaurant === 'Your Restaurant' ? 'bg-primary-500' : 'bg-gray-400'}`}
                        style={{ width: `${share}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['all', 'direct', 'indirect', 'thai', 'international', 'japanese'].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0 capitalize"
            >
              {category === 'all' ? 'All Competitors' : category}
            </Button>
          ))}
        </div>

        {/* Competitors List */}
        <div className="space-y-4">
          {filteredCompetitors.map((competitor) => (
            <Card key={competitor.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{competitor.name}</h3>
                      <Badge variant={competitor.status === 'direct' ? 'destructive' : 'secondary'}>
                        {competitor.status} competitor
                      </Badge>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getThreatColor(competitor.threat)}`}>
                        <div className="flex items-center space-x-1">
                          {getThreatIcon(competitor.threat)}
                          <span>{competitor.threat} threat</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{competitor.distance} away</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{competitor.cuisine}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {competitor.rating} ({competitor.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{competitor.priceRange}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Strengths</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {competitor.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Weaknesses</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {competitor.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-center">
                              <AlertTriangle className="h-3 w-3 text-red-500 mr-2 flex-shrink-0" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Market Share</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitor.marketShare}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Strategic Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Strategic Insights & Opportunities
            </CardTitle>
            <CardDescription>
              AI-powered competitive analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitorData.insights.map((insight, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                        <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'secondary' : 'outline'}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            View on Map
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Detailed Report
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Strategic Planning
          </Button>
        </div>
      </div>
  )
}
