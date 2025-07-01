'use client'

import React, { useState, useEffect } from 'react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { 
  DollarSign, 
  BarChart3, 
  TrendingUp,
  Utensils,
  MapPin,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Eye,
  ShoppingCart,
  PieChart
} from 'lucide-react'
import { apiClient } from '../../../lib/api-client'
import { useLocationBasedRestaurants } from '../../../hooks/useRestaurantData'

interface MenuPricingData {
  restaurant: {
    id: string;
    name: string;
    cuisine_type: string;
    rating: number;
    price_range: number;
    delivery_available: boolean;
    wongnai_public_id?: string;
    has_delivery_menu: boolean;
  };
  menu_pricing: {
    total_items: number;
    price_range: {
      min: number;
      max: number;
      average: number;
      median: number;
    };
    menu_categories: Array<{
      name: string;
      items: Array<{
        name: string;
        price: number;
        category: string;
        is_available: boolean;
        popularity_score: number;
      }>;
    }>;
    popular_items: Array<{
      name: string;
      price: number;
      category: string;
      popularity_score: number;
    }>;
    pricing_insights: Array<{
      type: string;
      title: string;
      description: string;
      impact: string;
    }>;
    sample_data?: boolean;
  };
  data_source: string;
  integration_status: {
    wongnai_connected: boolean;
    delivery_menu_available: boolean;
    real_data_available: boolean;
  };
}

export default function RestaurantMenuPricingPage() {
  const { restaurants, loading: restaurantsLoading } = useLocationBasedRestaurants()
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)
  const [menuPricingData, setMenuPricingData] = useState<MenuPricingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Analyze menu pricing for selected restaurant
  const analyzeMenuPricing = async (restaurant: any) => {
    setSelectedRestaurant(restaurant)
    setLoading(true)
    setError(null)
    
    try {
      console.log(`🍽️ Analyzing menu pricing for: ${restaurant.name}`)
      
      const response = await apiClient.getRestaurantMenuPricing(restaurant.id)
      
      if (response.data) {
        setMenuPricingData(response.data)
        console.log(`✅ Menu pricing data loaded:`, response.data.data_source)
      } else {
        setError(response.error || 'Failed to fetch menu pricing data')
      }
    } catch (err) {
      console.error('❌ Menu pricing error:', err)
      setError('Failed to analyze menu pricing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout pageTitle="Restaurant Menu Pricing" pageDescription="Analyze restaurant menu pricing strategies using real data">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Utensils className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant Menu Pricing</h1>
                <p className="text-gray-600 dark:text-gray-400">Analyze menu pricing strategies from real restaurant data</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Real Restaurant Data
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Wongnai Integration
              </Badge>
            </div>
          </div>
        </div>

        {/* Restaurant Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Select Restaurant to Analyze
            </CardTitle>
            <CardDescription>
              Choose from nearby restaurants to analyze their menu pricing strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {restaurantsLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading restaurants...</p>
              </div>
            ) : restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.slice(0, 12).map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRestaurant?.id === restaurant.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => analyzeMenuPricing(restaurant)}
                  >
                    <div className="flex items-start space-x-3">
                      {restaurant.images && (
                        <img
                          src={typeof restaurant.images === 'string' ? restaurant.images : restaurant.images[0]}
                          alt={restaurant.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {restaurant.cuisine || (restaurant as any).cuisine_type || 'Restaurant'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {restaurant.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {restaurant.price_range}
                          </span>
                          {restaurant.delivery_available && (
                            <Badge variant="outline" className="text-xs">
                              Delivery
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No restaurants found nearby</p>
                <p className="text-sm mt-1">Try enabling location access or refresh the page</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Pricing Analysis */}
        {menuPricingData && (
          <>
            {/* Restaurant Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{menuPricingData.restaurant.name} - Menu Analysis</span>
                  <div className="flex items-center space-x-2">
                    {menuPricingData.integration_status.wongnai_connected && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Wongnai Connected
                      </Badge>
                    )}
                    {menuPricingData.integration_status.real_data_available ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Real Menu Data
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Sample Data
                      </Badge>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  {menuPricingData.restaurant.cuisine_type} • Rating: {menuPricingData.restaurant.rating} • 
                  Data Source: {menuPricingData.data_source}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pricing Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {menuPricingData.menu_pricing.total_items}
                      </p>
                    </div>
                    <Utensils className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Price</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ฿{Math.round(menuPricingData.menu_pricing.price_range.average)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Price Range</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ฿{menuPricingData.menu_pricing.price_range.min} - ฿{menuPricingData.menu_pricing.price_range.max}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {menuPricingData.menu_pricing.menu_categories.length}
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Items */}
            {menuPricingData.menu_pricing.popular_items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Popular Menu Items
                  </CardTitle>
                  <CardDescription>
                    Top-selling items with pricing analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuPricingData.menu_pricing.popular_items.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ฿{item.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              Score: {Math.round(item.popularity_score)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing Insights */}
            {menuPricingData.menu_pricing.pricing_insights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Pricing Strategy Insights
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis of pricing patterns and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuPricingData.menu_pricing.pricing_insights.map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-600' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {insight.impact === 'high' ? <AlertCircle className="h-4 w-4" /> :
                             insight.impact === 'medium' ? <TrendingUp className="h-4 w-4" /> :
                             <CheckCircle className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {insight.description}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {insight.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Analyzing Menu Pricing...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fetching menu data and calculating pricing insights
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
