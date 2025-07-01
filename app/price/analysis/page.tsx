'use client'

import React, { useState, useEffect } from 'react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart,
  Target,
  Utensils,
  MapPin,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  Eye,
  ShoppingCart
} from 'lucide-react'
import { apiClient } from '../../../lib/api-client'

interface DishPricingData {
  publicId: string;
  restaurant_name: string;
  restaurant_info: any;
  menu_categories: Array<{
    id: string;
    name: string;
    description: string;
    items: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      discounted_price?: number;
      image_url: string;
      is_available: boolean;
      options: any[];
      tags: string[];
      nutrition: any;
      popularity_score: number;
    }>;
  }>;
  delivery_info: any;
  pricing_analytics: {
    total_items: number;
    price_range: {
      min: number;
      max: number;
      average: number;
      median: number;
    };
    category_stats: Record<string, any>;
    popular_items: Array<{
      name: string;
      price: number;
      category: string;
      popularity_score: number;
    }>;
    price_distribution: Record<string, number>;
    pricing_insights: Array<{
      type: string;
      title: string;
      description: string;
      impact: string;
    }>;
  };
  last_updated: string;
}

interface RestaurantBusiness {
  id: string;
  publicId: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  review_count: number;
  price_range: string;
  location: any;
  contact: any;
  hours: any;
  features: string[];
  images: string[];
  delivery_available: boolean;
  takeout_available: boolean;
  source: string;
  last_updated: string;
}

export default function DishPricingAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantBusiness | null>(null)
  const [dishPricingData, setDishPricingData] = useState<DishPricingData | null>(null)
  const [restaurants, setRestaurants] = useState<RestaurantBusiness[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceFilter, setPriceFilter] = useState<'all' | 'under_100' | '100_300' | '300_500' | 'over_500'>('all')

  // Search for restaurants
  const searchRestaurants = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getWongnaiBusinesses({
        query: searchQuery,
        location: 'Bangkok',
        limit: 20
      });
      
      if (response.data) {
        setRestaurants(response.data.businesses);
      }
    } catch (err) {
      setError('Failed to search restaurants');
      console.error('Restaurant search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get delivery menu and pricing data
  const analyzePricing = async (restaurant: RestaurantBusiness) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getWongnaiDeliveryMenu(restaurant.publicId);
      
      if (response.data) {
        setDishPricingData(response.data);
      }
    } catch (err) {
      setError('Failed to fetch menu pricing data');
      console.error('Menu pricing error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter dishes based on category and price
  const getFilteredDishes = () => {
    if (!dishPricingData) return [];
    
    let allDishes: any[] = [];
    
    dishPricingData.menu_categories.forEach(category => {
      if (selectedCategory === 'all' || category.name === selectedCategory) {
        category.items.forEach(item => {
          allDishes.push({
            ...item,
            category: category.name
          });
        });
      }
    });
    
    // Apply price filter
    if (priceFilter !== 'all') {
      allDishes = allDishes.filter(dish => {
        switch (priceFilter) {
          case 'under_100': return dish.price < 100;
          case '100_300': return dish.price >= 100 && dish.price < 300;
          case '300_500': return dish.price >= 300 && dish.price < 500;
          case 'over_500': return dish.price >= 500;
          default: return true;
        }
      });
    }
    
    return allDishes;
  };

  const filteredDishes = getFilteredDishes();

  return (
    <MainLayout pageTitle="Dish Pricing Analysis" pageDescription="Analyze restaurant menu pricing using Wongnai delivery data">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dish Pricing Analysis</h1>
                <p className="text-gray-600 dark:text-gray-400">Analyze menu pricing strategies using real Wongnai delivery data</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Live Wongnai Data
            </Badge>
          </div>
        </div>

        {/* Restaurant Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Restaurants
            </CardTitle>
            <CardDescription>
              Search for restaurants to analyze their menu pricing strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search restaurants (e.g., Som Tam Nua, Gaggan, etc.)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchRestaurants()}
                />
              </div>
              <Button onClick={searchRestaurants} disabled={loading || !searchQuery.trim()}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>
            
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

        {/* Restaurant Results */}
        {restaurants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({restaurants.length})</CardTitle>
              <CardDescription>
                Select a restaurant to analyze its menu pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRestaurant?.id === restaurant.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => analyzePricing(restaurant)}
                  >
                    <div className="flex items-start space-x-3">
                      {restaurant.images.length > 0 && (
                        <img
                          src={restaurant.images[0]}
                          alt={restaurant.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {restaurant.cuisine.join(', ')}
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
            </CardContent>
          </Card>
        )}

        {/* Pricing Analytics Dashboard */}
        {dishPricingData && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dishPricingData.pricing_analytics.total_items}
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
                        ฿{Math.round(dishPricingData.pricing_analytics.price_range.average)}
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
                        ฿{dishPricingData.pricing_analytics.price_range.min} - ฿{dishPricingData.pricing_analytics.price_range.max}
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
                        {dishPricingData.menu_categories.length}
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter Menu Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      {dishPricingData.menu_categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name} ({category.items.length} items)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Range
                    </label>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Prices</option>
                      <option value="under_100">Under ฿100</option>
                      <option value="100_300">฿100 - ฿300</option>
                      <option value="300_500">฿300 - ฿500</option>
                      <option value="over_500">Over ฿500</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  )
}
