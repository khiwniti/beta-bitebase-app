"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert } from '../ui/alert'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Cloud,
  Activity,
  BarChart3
} from 'lucide-react'
import { forecastingEngine, type ForecastRequest, type ForecastResult } from '../../lib/forecasting-engine'

interface AdvancedForecastingDashboardProps {
  restaurantId: string;
  className?: string;
}

export default function AdvancedForecastingDashboard({ 
  restaurantId, 
  className = "" 
}: AdvancedForecastingDashboardProps) {
  const [forecastData, setForecastData] = useState<ForecastResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(7)
  const [selectedScenario, setSelectedScenario] = useState<string>('realistic')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadForecast()
  }, [restaurantId, selectedTimeframe])

  const loadForecast = async () => {
    setLoading(true)
    try {
      const request: ForecastRequest = {
        restaurantId,
        forecastDays: selectedTimeframe,
        includeExternalFactors: true,
        granularity: 'daily'
      }

      const result = await forecastingEngine.generateSalesForecast(request)
      setForecastData(result)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load forecast:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScenarioData = () => {
    if (!forecastData) return []
    
    const scenario = forecastData.scenarios.find(s => s.type === selectedScenario)
    return scenario ? scenario.predictions : forecastData.predictions
  }

  const formatChartData = () => {
    const predictions = getScenarioData()
    return predictions.map((prediction, index) => ({
      day: prediction.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      revenue: prediction.predictedRevenue,
      customers: prediction.predictedCustomers,
      lowerBound: prediction.confidenceInterval.lower,
      upperBound: prediction.confidenceInterval.upper,
      dayIndex: index
    }))
  }

  const calculateTotalRevenue = () => {
    if (!forecastData) return 0
    return getScenarioData().reduce((sum, p) => sum + p.predictedRevenue, 0)
  }

  const calculateAverageCustomers = () => {
    if (!forecastData) return 0
    const predictions = getScenarioData()
    return Math.round(predictions.reduce((sum, p) => sum + p.predictedCustomers, 0) / predictions.length)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFactorIcon = (type: string) => {
    switch (type) {
      case 'weather': return <Cloud className="w-4 h-4" />
      case 'events': return <Calendar className="w-4 h-4" />
      case 'seasonal': return <Activity className="w-4 h-4" />
      case 'economic': return <TrendingUp className="w-4 h-4" />
      case 'competitor': return <BarChart3 className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!forecastData) {
    return (
      <div className={className}>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <div>
            <h4>Forecast Unavailable</h4>
            <p>Unable to generate sales forecast. Please try again later.</p>
          </div>
        </Alert>
      </div>
    )
  }

  const chartData = formatChartData()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Sales Forecasting
          </h2>
          <p className="text-gray-600">AI-powered sales predictions and recommendations</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
          
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="realistic">Most Likely</option>
            <option value="optimistic">Best Case</option>
            <option value="pessimistic">Worst Case</option>
          </select>
          
          <Button 
            size="sm" 
            onClick={loadForecast}
            className="text-sm"
          >
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
                <p className="text-sm font-medium text-gray-600">Forecast Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(calculateTotalRevenue() / 1000).toFixed(1)}k
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {selectedTimeframe} days
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Daily Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateAverageCustomers()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Per day
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confidence Level</p>
                <p className={`text-2xl font-bold ${getConfidenceColor(forecastData.confidence)}`}>
                  {Math.round(forecastData.confidence * 100)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Model accuracy: {Math.round(forecastData.modelAccuracy * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm font-bold text-gray-900">
                  {lastUpdate.toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-500">
                  {lastUpdate.toLocaleDateString()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Revenue Forecast</span>
            <Badge variant={selectedScenario === 'optimistic' ? 'default' : selectedScenario === 'pessimistic' ? 'destructive' : 'secondary'}>
              {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Customers'
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stackId="1"
                  stroke="#e5e7eb"
                  fill="#f3f4f6"
                  fillOpacity={0.4}
                  name="Upper Confidence"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stackId="1"
                  stroke="#e5e7eb"
                  fill="#ffffff"
                  fillOpacity={1}
                  name="Lower Confidence"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  name="Predicted Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Traffic Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Customers']}
                />
                <Bar dataKey="customers" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* External Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Influencing Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecastData.factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFactorIcon(factor.type)}
                    <div>
                      <p className="font-medium text-sm">{factor.name}</p>
                      <p className="text-xs text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={factor.impact > 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact * 100)}%
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(factor.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecastData.recommendations.map((rec, index) => (
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
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Impact: {rec.expectedImpact}</span>
                    <span>Timeline: {rec.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecastData.scenarios.map((scenario, index) => {
              const totalRevenue = scenario.predictions.reduce((sum, p) => sum + p.predictedRevenue, 0)
              const isSelected = scenario.type === selectedScenario
              
              return (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedScenario(scenario.type)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{scenario.name}</h3>
                    <Badge 
                      variant={scenario.type === 'optimistic' ? 'default' : scenario.type === 'pessimistic' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {scenario.adjustment > 0 ? '+' : ''}{Math.round(scenario.adjustment * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  <div className="text-lg font-bold">
                    ${(totalRevenue / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-gray-500">Total {selectedTimeframe}-day revenue</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}