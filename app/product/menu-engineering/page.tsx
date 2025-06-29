"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
  Utensils,
  TrendingUp,
  DollarSign,
  Star,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Percent,
  ChefHat,
  Calculator,
  TrendingDown,
  Award,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Eye,
  Filter,
  Search,
  Calendar,
  ShoppingCart,
  Package,
  Timer,
  Scale,
  Leaf,
  AlertCircle,
  Heart,
  Flame
} from "lucide-react"

// Professional Menu Engineering Data Structures
interface MenuItemAnalysis {
  id: string
  name: string
  category: string
  price: number
  cost: number
  margin: number
  popularity: number
  profitability: number
  menuEngineering: 'star' | 'plow_horse' | 'puzzle' | 'dog'
  orders: number
  revenue: number
  rating: number
  prepTime: number
  ingredients: string[]
  allergens: string[]
  dietary: string[]
  seasonality: number
  trendScore: number
  competitorPrice: number
  lastUpdated: string
}

interface FoodCostAnalysis {
  totalFoodCost: number
  foodCostPercentage: number
  averageMargin: number
  topCostDrivers: Array<{
    ingredient: string
    cost: number
    usage: number
    impact: number
  }>
  seasonalVariations: Array<{
    month: string
    costIndex: number
    availability: number
  }>
}

export default function MenuEngineeringPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [menuItems, setMenuItems] = useState<MenuItemAnalysis[]>([])
  const [foodCostData, setFoodCostData] = useState<FoodCostAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [engineeringFilter, setEngineeringFilter] = useState('all')

  // Professional Menu Engineering Classification
  const getMenuEngineeringClass = (popularity: number, profitability: number) => {
    if (popularity >= 70 && profitability >= 70) return 'star'
    if (popularity >= 70 && profitability < 70) return 'plow_horse'
    if (popularity < 70 && profitability >= 70) return 'puzzle'
    return 'dog'
  }

  const getEngineeringColor = (classification: string) => {
    switch (classification) {
      case 'star': return 'bg-green-100 text-green-800 border-green-200'
      case 'plow_horse': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'puzzle': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'dog': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEngineeringIcon = (classification: string) => {
    switch (classification) {
      case 'star': return <Award className="w-4 h-4" />
      case 'plow_horse': return <TrendingUp className="w-4 h-4" />
      case 'puzzle': return <Target className="w-4 h-4" />
      case 'dog': return <TrendingDown className="w-4 h-4" />
      default: return <Utensils className="w-4 h-4" />
    }
  }

  const getEngineeringStrategy = (classification: string) => {
    switch (classification) {
      case 'star': return 'Promote heavily, maintain quality, consider price increase'
      case 'plow_horse': return 'Reduce costs, improve efficiency, reposition'
      case 'puzzle': return 'Increase marketing, improve presentation, relocate on menu'
      case 'dog': return 'Remove from menu or completely redesign'
      default: return 'Analyze further'
    }
  }

  // Mock data generation with professional insights
  useEffect(() => {
    const generateProfessionalMenuData = () => {
      const menuTemplates = [
        { name: 'Pad Thai', category: 'Main Courses', basePrice: 180, baseCost: 65 },
        { name: 'Tom Yum Soup', category: 'Appetizers', basePrice: 120, baseCost: 45 },
        { name: 'Green Curry', category: 'Main Courses', basePrice: 200, baseCost: 75 },
        { name: 'Mango Sticky Rice', category: 'Desserts', basePrice: 90, baseCost: 25 },
        { name: 'Thai Iced Tea', category: 'Beverages', basePrice: 60, baseCost: 15 },
        { name: 'Som Tam Salad', category: 'Appetizers', basePrice: 100, baseCost: 35 },
        { name: 'Massaman Curry', category: 'Main Courses', basePrice: 220, baseCost: 85 },
        { name: 'Coconut Ice Cream', category: 'Desserts', basePrice: 80, baseCost: 20 },
        { name: 'Fresh Coconut Water', category: 'Beverages', basePrice: 70, baseCost: 25 },
        { name: 'Chef\'s Special Seafood', category: 'Specials', basePrice: 350, baseCost: 140 }
      ]

      const items: MenuItemAnalysis[] = menuTemplates.map((template, index) => {
        const popularity = Math.random() * 100
        const profitability = ((template.basePrice - template.baseCost) / template.basePrice) * 100
        const orders = Math.floor(Math.random() * 500) + 50
        
        return {
          id: `item_${index + 1}`,
          name: template.name,
          category: template.category,
          price: template.basePrice,
          cost: template.baseCost,
          margin: profitability,
          popularity,
          profitability,
          menuEngineering: getMenuEngineeringClass(popularity, profitability),
          orders,
          revenue: orders * template.basePrice,
          rating: 3.5 + Math.random() * 1.5,
          prepTime: Math.floor(Math.random() * 20) + 5,
          ingredients: ['ingredient1', 'ingredient2', 'ingredient3'],
          allergens: Math.random() > 0.7 ? ['nuts', 'dairy'] : [],
          dietary: Math.random() > 0.5 ? ['vegetarian'] : [],
          seasonality: Math.random() * 100,
          trendScore: Math.random() * 100,
          competitorPrice: template.basePrice * (0.8 + Math.random() * 0.4),
          lastUpdated: new Date().toISOString()
        }
      })

      setMenuItems(items)

      // Generate food cost analysis
      setFoodCostData({
        totalFoodCost: 125000,
        foodCostPercentage: 32.5,
        averageMargin: 67.5,
        topCostDrivers: [
          { ingredient: 'Premium Seafood', cost: 25000, usage: 85, impact: 20 },
          { ingredient: 'Imported Spices', cost: 15000, usage: 95, impact: 12 },
          { ingredient: 'Organic Vegetables', cost: 18000, usage: 75, impact: 14 },
          { ingredient: 'Premium Rice', cost: 8000, usage: 100, impact: 6 }
        ],
        seasonalVariations: [
          { month: 'Jan', costIndex: 95, availability: 90 },
          { month: 'Feb', costIndex: 98, availability: 85 },
          { month: 'Mar', costIndex: 102, availability: 95 },
          { month: 'Apr', costIndex: 110, availability: 80 },
          { month: 'May', costIndex: 115, availability: 75 },
          { month: 'Jun', costIndex: 108, availability: 85 }
        ]
      })

      setLoading(false)
    }

    generateProfessionalMenuData()
  }, [])

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesEngineering = engineeringFilter === 'all' || item.menuEngineering === engineeringFilter
    return matchesSearch && matchesCategory && matchesEngineering
  })

  // Calculate overview metrics
  const overviewMetrics = {
    totalItems: menuItems.length,
    avgRating: menuItems.reduce((sum, item) => sum + item.rating, 0) / menuItems.length,
    totalRevenue: menuItems.reduce((sum, item) => sum + item.revenue, 0),
    avgMargin: menuItems.reduce((sum, item) => sum + item.margin, 0) / menuItems.length,
    starItems: menuItems.filter(item => item.menuEngineering === 'star').length,
    dogItems: menuItems.filter(item => item.menuEngineering === 'dog').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading menu engineering analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Engineering</h1>
          <p className="text-muted-foreground">
            Professional menu optimization using popularity vs profitability analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Analysis
          </Button>
          <Button>
            <Target className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.totalItems}</div>
            <p className="text-xs text-muted-foreground">Menu items analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stars</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overviewMetrics.starItems}</div>
            <p className="text-xs text-muted-foreground">High profit & popular</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dogs</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overviewMetrics.dogItems}</div>
            <p className="text-xs text-muted-foreground">Low profit & unpopular</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{(overviewMetrics.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">From menu items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.avgMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Profit margin</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Menu Matrix</TabsTrigger>
          <TabsTrigger value="items">Item Analysis</TabsTrigger>
          <TabsTrigger value="costs">Food Costs</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Menu Engineering Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Menu Engineering Matrix
              </CardTitle>
              <CardDescription>
                Professional menu classification based on popularity vs profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 h-96">
                {/* Stars - High Popularity, High Profitability */}
                <div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Stars</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {menuItems.filter(item => item.menuEngineering === 'star').length} items
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 mb-3">High Popularity + High Profitability</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {menuItems.filter(item => item.menuEngineering === 'star').map(item => (
                      <div key={item.id} className="bg-white p-2 rounded border">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          ฿{item.price} • {item.margin.toFixed(1)}% margin • {item.orders} orders
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Puzzles - Low Popularity, High Profitability */}
                <div className="border-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Puzzles</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {menuItems.filter(item => item.menuEngineering === 'puzzle').length} items
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Low Popularity + High Profitability</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {menuItems.filter(item => item.menuEngineering === 'puzzle').map(item => (
                      <div key={item.id} className="bg-white p-2 rounded border">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          ฿{item.price} • {item.margin.toFixed(1)}% margin • {item.orders} orders
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plow Horses - High Popularity, Low Profitability */}
                <div className="border-2 border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">Plow Horses</h3>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {menuItems.filter(item => item.menuEngineering === 'plow_horse').length} items
                    </Badge>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">High Popularity + Low Profitability</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {menuItems.filter(item => item.menuEngineering === 'plow_horse').map(item => (
                      <div key={item.id} className="bg-white p-2 rounded border">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          ฿{item.price} • {item.margin.toFixed(1)}% margin • {item.orders} orders
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dogs - Low Popularity, Low Profitability */}
                <div className="border-2 border-red-200 bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Dogs</h3>
                    <Badge className="bg-red-100 text-red-800">
                      {menuItems.filter(item => item.menuEngineering === 'dog').length} items
                    </Badge>
                  </div>
                  <p className="text-sm text-red-700 mb-3">Low Popularity + Low Profitability</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {menuItems.filter(item => item.menuEngineering === 'dog').map(item => (
                      <div key={item.id} className="bg-white p-2 rounded border">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          ฿{item.price} • {item.margin.toFixed(1)}% margin • {item.orders} orders
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Menu Item Analysis</CardTitle>
              <CardDescription>Detailed analysis of individual menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search Items</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Appetizers">Appetizers</SelectItem>
                      <SelectItem value="Main Courses">Main Courses</SelectItem>
                      <SelectItem value="Desserts">Desserts</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Specials">Specials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Classification</Label>
                  <Select value={engineeringFilter} onValueChange={setEngineeringFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="star">Stars</SelectItem>
                      <SelectItem value="plow_horse">Plow Horses</SelectItem>
                      <SelectItem value="puzzle">Puzzles</SelectItem>
                      <SelectItem value="dog">Dogs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
