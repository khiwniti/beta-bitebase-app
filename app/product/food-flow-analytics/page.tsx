"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import RestaurantMap from "../../../components/dashboard/RestaurantMap"

import {
  ChefHat,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Utensils,
  Package,
  AlertTriangle,
  CheckCircle,
  Timer,
  Thermometer,
  Scale,
  Leaf,
  Heart,
  Flame,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Search,
  Star,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"

// Professional Food Flow Analytics Interfaces
interface KitchenWorkflowMetrics {
  averagePrepTime: number
  peakHourEfficiency: number
  orderAccuracy: number
  foodWastePercentage: number
  kitchenUtilization: number
  staffProductivity: number
  equipmentEfficiency: number
  qualityScore: number
}

interface FoodTrendAnalysis {
  trendingIngredients: Array<{
    name: string
    growthRate: number
    seasonality: string
    costTrend: 'up' | 'down' | 'stable'
    availability: number
  }>
  customerPreferences: Array<{
    category: string
    preference: string
    percentage: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }>
  competitorAnalysis: Array<{
    dish: string
    ourPrice: number
    competitorAvg: number
    marketPosition: 'premium' | 'competitive' | 'value'
  }>
}

interface NutritionalAnalysis {
  averageCalories: number
  healthyOptionsPercentage: number
  allergenCompliance: number
  dietaryOptionsCount: {
    vegetarian: number
    vegan: number
    glutenFree: number
    lowCarb: number
    keto: number
  }
  nutritionalBalance: {
    protein: number
    carbs: number
    fats: number
    fiber: number
  }
}

export default function FoodFlowAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('workflow')
  const [kitchenMetrics, setKitchenMetrics] = useState<KitchenWorkflowMetrics | null>(null)
  const [trendAnalysis, setTrendAnalysis] = useState<FoodTrendAnalysis | null>(null)
  const [nutritionalData, setNutritionalData] = useState<NutritionalAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate professional food flow analytics data
    const generateFoodFlowData = () => {
      // Kitchen Workflow Metrics
      setKitchenMetrics({
        averagePrepTime: 12.5,
        peakHourEfficiency: 78,
        orderAccuracy: 94.5,
        foodWastePercentage: 8.2,
        kitchenUtilization: 82,
        staffProductivity: 87,
        equipmentEfficiency: 91,
        qualityScore: 4.3
      })

      // Food Trend Analysis
      setTrendAnalysis({
        trendingIngredients: [
          { name: 'Plant-based Proteins', growthRate: 45, seasonality: 'Year-round', costTrend: 'up', availability: 85 },
          { name: 'Fermented Foods', growthRate: 32, seasonality: 'Year-round', costTrend: 'stable', availability: 90 },
          { name: 'Ancient Grains', growthRate: 28, seasonality: 'Year-round', costTrend: 'up', availability: 75 },
          { name: 'Sustainable Seafood', growthRate: 25, seasonality: 'Seasonal', costTrend: 'up', availability: 70 },
          { name: 'Local Herbs', growthRate: 22, seasonality: 'Seasonal', costTrend: 'stable', availability: 95 }
        ],
        customerPreferences: [
          { category: 'Dietary', preference: 'Plant-based options', percentage: 35, trend: 'increasing' },
          { category: 'Preparation', preference: 'Fresh ingredients', percentage: 78, trend: 'stable' },
          { category: 'Health', preference: 'Low-sodium options', percentage: 42, trend: 'increasing' },
          { category: 'Sustainability', preference: 'Locally sourced', percentage: 58, trend: 'increasing' },
          { category: 'Experience', preference: 'Interactive dining', percentage: 28, trend: 'increasing' }
        ],
        competitorAnalysis: [
          { dish: 'Pad Thai', ourPrice: 180, competitorAvg: 165, marketPosition: 'premium' },
          { dish: 'Green Curry', ourPrice: 200, competitorAvg: 195, marketPosition: 'competitive' },
          { dish: 'Tom Yum Soup', ourPrice: 120, competitorAvg: 140, marketPosition: 'value' },
          { dish: 'Mango Sticky Rice', ourPrice: 90, competitorAvg: 85, marketPosition: 'competitive' }
        ]
      })

      // Nutritional Analysis
      setNutritionalData({
        averageCalories: 485,
        healthyOptionsPercentage: 65,
        allergenCompliance: 92,
        dietaryOptionsCount: {
          vegetarian: 15,
          vegan: 8,
          glutenFree: 12,
          lowCarb: 10,
          keto: 6
        },
        nutritionalBalance: {
          protein: 25,
          carbs: 45,
          fats: 25,
          fiber: 5
        }
      })

      setLoading(false)
    }

    generateFoodFlowData()
  }, [])

  const getMetricColor = (value: number, threshold: { good: number, warning: number }) => {
    if (value >= threshold.good) return 'text-green-600'
    if (value >= threshold.warning) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'decreasing':
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading food flow analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Flow Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of kitchen operations, food trends, and customer preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate Insights
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflow">Kitchen Workflow</TabsTrigger>
          <TabsTrigger value="trends">Food Trends</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Analysis</TabsTrigger>
          <TabsTrigger value="location">Location Discovery</TabsTrigger>
          <TabsTrigger value="customer">Customer Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          {/* Kitchen Workflow Metrics */}
          {kitchenMetrics && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                    <Timer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchenMetrics.averagePrepTime} min</div>
                    <p className="text-xs text-muted-foreground">Per order</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Order Accuracy</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getMetricColor(kitchenMetrics.orderAccuracy, { good: 95, warning: 90 })}`}>
                      {kitchenMetrics.orderAccuracy}%
                    </div>
                    <p className="text-xs text-muted-foreground">Correct orders</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Food Waste</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getMetricColor(100 - kitchenMetrics.foodWastePercentage, { good: 92, warning: 85 })}`}>
                      {kitchenMetrics.foodWastePercentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">Of total food</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kitchenMetrics.qualityScore}/5.0</div>
                    <p className="text-xs text-muted-foreground">Customer rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Kitchen Metrics */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Kitchen Efficiency Metrics</CardTitle>
                    <CardDescription>Real-time kitchen performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kitchen Utilization</span>
                        <span className="font-medium">{kitchenMetrics.kitchenUtilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${kitchenMetrics.kitchenUtilization}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Staff Productivity</span>
                        <span className="font-medium">{kitchenMetrics.staffProductivity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${kitchenMetrics.staffProductivity}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Equipment Efficiency</span>
                        <span className="font-medium">{kitchenMetrics.equipmentEfficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${kitchenMetrics.equipmentEfficiency}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Peak Hour Efficiency</span>
                        <span className="font-medium">{kitchenMetrics.peakHourEfficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${kitchenMetrics.peakHourEfficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Optimization</CardTitle>
                    <CardDescription>Areas for improvement and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Optimize Prep Stations</div>
                          <div className="text-xs text-gray-600">Reorganize prep stations to reduce movement by 15%</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Staff Training</div>
                          <div className="text-xs text-gray-600">Focus on knife skills and mise en place techniques</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Activity className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Equipment Upgrade</div>
                          <div className="text-xs text-gray-600">Consider upgrading to high-efficiency ovens</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Timing Optimization</div>
                          <div className="text-xs text-gray-600">Implement better order sequencing during peak hours</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Food Trends Analysis */}
          {trendAnalysis && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Ingredients</CardTitle>
                    <CardDescription>Ingredients gaining popularity in the market</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trendAnalysis.trendingIngredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Leaf className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="font-medium text-sm">{ingredient.name}</div>
                              <div className="text-xs text-gray-600">{ingredient.seasonality}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              {getTrendIcon(ingredient.costTrend)}
                              <span className="text-sm font-medium">+{ingredient.growthRate}%</span>
                            </div>
                            <div className="text-xs text-gray-600">{ingredient.availability}% available</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Preferences</CardTitle>
                    <CardDescription>Evolving customer dining preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trendAnalysis.customerPreferences.map((pref, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{pref.preference}</span>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(pref.trend)}
                              <span className="text-sm">{pref.percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${pref.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600">{pref.category}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Competitive Analysis</CardTitle>
                  <CardDescription>How your pricing compares to competitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Dish</th>
                          <th className="text-left py-3 px-4 font-medium">Our Price</th>
                          <th className="text-left py-3 px-4 font-medium">Market Average</th>
                          <th className="text-left py-3 px-4 font-medium">Difference</th>
                          <th className="text-left py-3 px-4 font-medium">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trendAnalysis.competitorAnalysis.map((item, index) => {
                          const difference = item.ourPrice - item.competitorAvg
                          const percentDiff = ((difference / item.competitorAvg) * 100).toFixed(1)
                          
                          return (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{item.dish}</td>
                              <td className="py-3 px-4">฿{item.ourPrice}</td>
                              <td className="py-3 px-4">฿{item.competitorAvg}</td>
                              <td className="py-3 px-4">
                                <span className={difference >= 0 ? 'text-red-600' : 'text-green-600'}>
                                  {difference >= 0 ? '+' : ''}฿{difference} ({percentDiff}%)
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge 
                                  className={
                                    item.marketPosition === 'premium' ? 'bg-purple-100 text-purple-800' :
                                    item.marketPosition === 'competitive' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }
                                >
                                  {item.marketPosition}
                                </Badge>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          {/* Location-Based Restaurant Discovery */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Location-Based Restaurant Discovery
                </CardTitle>
                <CardDescription>
                  Interactive map showing nearby restaurants with buffer radius visualization for market analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <RestaurantMap
                    showBufferRadius={true}
                    bufferRadius={5}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Density</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">High</div>
                  <p className="text-xs text-muted-foreground">15+ restaurants within 2km</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Competition Level</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">Moderate</div>
                  <p className="text-xs text-muted-foreground">Similar cuisine types nearby</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Opportunity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Good</div>
                  <p className="text-xs text-muted-foreground">Underserved customer segments</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Location Insights</CardTitle>
                <CardDescription>Market analysis based on nearby restaurant data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Prime Location</div>
                      <div className="text-xs text-gray-600">High foot traffic area with good visibility and accessibility</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Users className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Customer Demographics</div>
                      <div className="text-xs text-gray-600">Mixed demographic with high disposable income and dining frequency</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Price Point Analysis</div>
                      <div className="text-xs text-gray-600">Market supports mid to premium pricing with room for value positioning</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Peak Hours</div>
                      <div className="text-xs text-gray-600">Lunch: 12-2pm, Dinner: 6-9pm with weekend brunch opportunities</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          {/* Customer Journey Analysis */}
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Journey Analysis</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Detailed customer journey mapping and touchpoint analysis coming soon.
              This will include customer flow patterns, satisfaction metrics, and experience optimization recommendations.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
