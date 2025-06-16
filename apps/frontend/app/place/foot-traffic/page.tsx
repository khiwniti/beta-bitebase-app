'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { 
  Activity, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Users, 
  MapPin,
  BarChart3,
  LineChart,
  PieChart,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export default function FootTrafficPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedLocation, setSelectedLocation] = useState('sukhumvit-soi-11')

  const trafficData = {
    'sukhumvit-soi-11': {
      name: 'Sukhumvit Soi 11',
      currentTraffic: 'High',
      peakHours: ['12:00-14:00', '19:00-22:00'],
      averageDaily: 2850,
      weeklyTrend: '+12%',
      hourlyPattern: {
        '06:00': 120, '07:00': 280, '08:00': 450, '09:00': 380, '10:00': 320,
        '11:00': 420, '12:00': 680, '13:00': 750, '14:00': 620, '15:00': 480,
        '16:00': 520, '17:00': 580, '18:00': 640, '19:00': 820, '20:00': 890,
        '21:00': 780, '22:00': 650, '23:00': 420, '00:00': 180
      },
      weeklyPattern: {
        'Monday': 2400, 'Tuesday': 2600, 'Wednesday': 2800, 'Thursday': 3200,
        'Friday': 3800, 'Saturday': 4200, 'Sunday': 2200
      },
      demographics: {
        'Office Workers': 35,
        'Tourists': 25,
        'Residents': 20,
        'Students': 15,
        'Others': 5
      },
      insights: [
        { type: 'peak', message: 'Lunch rush (12-2 PM) shows highest traffic', impact: 'high' },
        { type: 'trend', message: 'Weekend traffic 40% higher than weekdays', impact: 'medium' },
        { type: 'opportunity', message: 'Morning traffic underutilized (6-9 AM)', impact: 'medium' },
        { type: 'warning', message: 'Late night traffic declining (-8% this month)', impact: 'low' }
      ]
    }
  }

  const currentLocation = trafficData[selectedLocation]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'peak': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'trend': return <BarChart3 className="h-4 w-4 text-blue-500" />
      case 'opportunity': return <CheckCircle className="h-4 w-4 text-yellow-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge variant="destructive">High Impact</Badge>
      case 'medium': return <Badge variant="secondary">Medium Impact</Badge>
      case 'low': return <Badge variant="outline">Low Impact</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Foot Traffic Analysis</h1>
                <p className="text-gray-600 dark:text-gray-400">{currentLocation.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Traffic</p>
                <p className="text-xl font-bold text-green-600">{currentLocation.currentTraffic}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Trend</p>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xl font-bold text-green-600">{currentLocation.weeklyTrend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Average</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentLocation.averageDaily.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">people per day</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Peak Hours</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {currentLocation.peakHours[0]}
                  </p>
                  <p className="text-sm text-gray-500">{currentLocation.peakHours[1]}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Busiest Day</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Saturday</p>
                  <p className="text-xs text-gray-500">4,200 people</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Rate</p>
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Traffic Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Hourly Traffic Pattern
            </CardTitle>
            <CardDescription>
              Average foot traffic throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {Object.entries(currentLocation.hourlyPattern).map(([hour, count]) => (
                  <div key={hour} className="text-center">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 mb-1">
                      <div
                        className="bg-primary-500 rounded transition-all duration-300"
                        style={{
                          height: `${Math.max((Number(count) / 900) * 60, 8)}px`,
                          width: '100%'
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{hour.slice(0, 2)}</p>
                    <p className="text-xs font-medium">{Number(count)}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  <span>Peak Hours</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span>Low Traffic</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Pattern & Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Weekly Traffic Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(currentLocation.weeklyPattern).map(([day, count]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">{day}</span>
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(Number(count) / 4200) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">{Number(count).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Visitor Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(currentLocation.demographics).map(([segment, percentage]) => (
                  <div key={segment} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{segment}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Number(percentage)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{Number(percentage)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Traffic Insights & Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered insights based on foot traffic patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentLocation.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{insight.message}</p>
                      {getImpactBadge(insight.impact)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {insight.type === 'peak' && 'Consider staffing optimization during these hours'}
                      {insight.type === 'trend' && 'Plan weekend-specific promotions and events'}
                      {insight.type === 'opportunity' && 'Breakfast menu or early bird promotions could capture this market'}
                      {insight.type === 'warning' && 'Review late-night offerings and marketing strategy'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Period Selector */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant={selectedPeriod === 'day' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('day')}
          >
            Today
          </Button>
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
          >
            This Week
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            This Month
          </Button>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Compare Locations
          </Button>
        </div>
      </div>
  )
}
