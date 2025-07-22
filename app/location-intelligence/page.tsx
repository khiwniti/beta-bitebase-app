'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Filter, ChevronDown, Star, MapPin, TrendingUp, BarChart3 } from 'lucide-react';

interface RestaurantData {
  id: string;
  brand: string;
  city: string;
  area: string;
  cuisine: string;
  rating: number;
  totalReviews: number;
  medianPrice: number;
  logo?: string;
}

interface SearchFilters {
  searchBy: 'brand' | 'branch' | 'item';
  query: string;
  area: string;
  cuisine: string;
  exactMatch: boolean;
  excludeItem: boolean;
}

export default function LocationIntelligencePage() {
  // Fallback translations for when NextIntl context is not available
  const fallbackTranslations = {
    title: 'Location Intelligence',
    description: 'Discover the best restaurant locations with AI-powered insights',
    'search.title': 'Search',
    'search.searchBy': 'Search by',
    'search.brand': 'Brand',
    'search.branch': 'Branch', 
    'search.item': 'Item',
    'search.itemName': 'Item name',
    'search.area': 'Area',
    'search.cuisine': 'Cuisine',
    'search.selectCuisine': 'Select a cuisine',
    'search.exactMatch': 'Exact match',
    'search.excludeItem': 'Exclude this item',
    'search.searchButton': 'Search',
    'search.averagePrice': 'Average price',
    'search.brands': 'Brands',
    'search.items': 'Items',
    'search.showing': 'Showing',
    'search.results': 'results',
    'table.brand': 'Brand',
    'table.city': 'City',
    'table.area': 'Area',
    'table.cuisines': 'Cuisines',
    'table.rating': 'Rating / total',
    'table.median': 'Median',
    'filters.burger': 'Burger',
    'filters.pizza': 'Pizza',
    'filters.thai': 'Thai',
    'filters.japanese': 'Japanese',
    'filters.italian': 'Italian',
    'filters.drinks': 'Drinks'
  };

  let t: (key: string) => string;
  try {
    t = useTranslations('locationIntelligence');
  } catch (error) {
    // Fallback when NextIntl context is not available
    t = (key: string) => fallbackTranslations[key as keyof typeof fallbackTranslations] || key;
  }
  const [filters, setFilters] = useState<SearchFilters>({
    searchBy: 'brand',
    query: '',
    area: '',
    cuisine: '',
    exactMatch: false,
    excludeItem: false
  });

  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    averagePrice: 0,
    totalBrands: 0,
    totalItems: 0
  });

  // Mock data for demonstration
  const mockRestaurants: RestaurantData[] = [
    {
      id: '1',
      brand: "McDonald's",
      city: 'Bangkok',
      area: 'Siam',
      cuisine: 'Burger',
      rating: 4.2,
      totalReviews: 22450,
      medianPrice: 150,
      logo: '🍟'
    },
    {
      id: '2',
      brand: 'Burger King',
      city: 'Bangkok',
      area: 'Sukhumvit',
      cuisine: 'Burger',
      rating: 4.1,
      totalReviews: 9517,
      medianPrice: 120,
      logo: '👑'
    },
    {
      id: '3',
      brand: 'KFC',
      city: 'Bangkok',
      area: 'Chatuchak',
      cuisine: 'Burger',
      rating: 4.0,
      totalReviews: 1893,
      medianPrice: 140,
      logo: '🍗'
    },
    {
      id: '4',
      brand: 'Pizza Hut',
      city: 'Bangkok',
      area: 'Silom',
      cuisine: 'Pizza',
      rating: 3.9,
      totalReviews: 1922,
      medianPrice: 280,
      logo: '🍕'
    },
    {
      id: '5',
      brand: 'Starbucks',
      city: 'Bangkok',
      area: 'Phrom Phong',
      cuisine: 'Coffee',
      rating: 4.3,
      totalReviews: 12890,
      medianPrice: 180,
      logo: '☕'
    }
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        lat: '13.7563', // Bangkok coordinates
        lng: '100.5018',
        radius: '5000',
        ...(filters.searchBy && { searchBy: filters.searchBy }),
        ...(filters.query && { query: filters.query }),
        ...(filters.area && { area: filters.area }),
        ...(filters.cuisine && { cuisine: filters.cuisine })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/location-intelligence/search?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.restaurants || []);
        setStats(data.stats || {
          averagePrice: 0,
          totalBrands: 0,
          totalItems: 0
        });
      } else {
        console.error('Failed to fetch restaurants');
        // Fallback to mock data only if API fails
        setMockData();
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Fallback to mock data only if API fails
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setRestaurants(mockRestaurants);
    setStats({
      averagePrice: 174,
      totalBrands: 25,
      totalItems: 1234
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    
    try {
      // Call the backend API
      const queryParams = new URLSearchParams({
        searchBy: filters.searchBy,
        query: filters.query,
        area: filters.area,
        cuisine: filters.cuisine,
        exactMatch: filters.exactMatch.toString(),
        excludeItem: filters.excludeItem.toString()
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/location-intelligence/search?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.restaurants || mockRestaurants);
        setStats(data.stats || stats);
      } else {
        // Fallback to mock data
        setRestaurants(mockRestaurants);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data
      setRestaurants(mockRestaurants);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filters.query) {
      const searchField = filters.searchBy === 'brand' ? restaurant.brand : 
                         filters.searchBy === 'branch' ? restaurant.area : 
                         restaurant.cuisine;
      
      if (filters.exactMatch) {
        return searchField.toLowerCase() === filters.query.toLowerCase();
      } else {
        return searchField.toLowerCase().includes(filters.query.toLowerCase());
      }
    }
    
    if (filters.area && !restaurant.area.toLowerCase().includes(filters.area.toLowerCase())) {
      return false;
    }
    
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
      return false;
    }
    
    return true;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
              <p className="text-gray-600">{t('description')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <span className="text-gray-700 text-sm">EN</span>
                <ChevronDown className="w-4 h-4 text-gray-700 ml-2 inline" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('search.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search By */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">{t('search.searchBy')}</label>
              <div className="flex space-x-2">
                {['brand', 'branch', 'item'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({ ...prev, searchBy: type as any }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.searchBy === type
                        ? 'bg-white text-blue-900'
                        : 'bg-white/20 text-gray-700 hover:bg-white/30'
                    }`}
                  >
                    {t(`search.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">{t('search.itemName')}</label>
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                placeholder="McDonald's"
                className="w-full px-3 py-2 rounded-lg bg-white/20 text-gray-700 placeholder-white/60 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">{t('search.area')}</label>
              <input
                type="text"
                value={filters.area}
                onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                placeholder="Siam"
                className="w-full px-3 py-2 rounded-lg bg-white/20 text-gray-700 placeholder-white/60 border border-white/30 focus:border-white focus:outline-none"
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">{t('search.cuisine')}</label>
              <select
                value={filters.cuisine}
                onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/20 text-gray-700 border border-white/30 focus:border-white focus:outline-none"
              >
                <option value="">{t('search.selectCuisine')}</option>
                <option value="Burger">{t('filters.burger')}</option>
                <option value="Pizza">{t('filters.pizza')}</option>
                <option value="Thai">{t('filters.thai')}</option>
                <option value="Japanese">{t('filters.japanese')}</option>
                <option value="Italian">{t('filters.italian')}</option>
                <option value="Coffee">{t('filters.drinks')}</option>
              </select>
            </div>
          </div>

          {/* Search Options */}
          <div className="flex items-center space-x-6 mb-4">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={filters.exactMatch}
                onChange={(e) => setFilters(prev => ({ ...prev, exactMatch: e.target.checked }))}
                className="mr-2 rounded"
              />
              {t('search.exactMatch')}
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={filters.excludeItem}
                onChange={(e) => setFilters(prev => ({ ...prev, excludeItem: e.target.checked }))}
                className="mr-2 rounded"
              />
              {t('search.excludeItem')}
            </label>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : t('search.searchButton')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="text-gray-700 text-sm">{t('search.averagePrice')}</div>
            <div className="text-gray-700 text-2xl font-bold">฿{stats.averagePrice}</div>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="text-gray-700 text-sm">{t('search.brands')}</div>
            <div className="text-gray-700 text-2xl font-bold">{stats.totalBrands}</div>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="text-gray-700 text-sm">{t('search.items')}</div>
            <div className="text-gray-700 text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="text-gray-700 mb-4">
            {t('search.showing')} {filteredRestaurants.length.toLocaleString()} {t('search.results')}
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 mb-4 pb-2 border-b border-white/20">
            <div className="text-gray-700 font-medium flex items-center">
              {t('table.brand')} <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            <div className="text-gray-700 font-medium flex items-center">
              {t('table.city')} <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            <div className="text-gray-700 font-medium flex items-center">
              {t('table.area')} <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            <div className="text-gray-700 font-medium flex items-center">
              {t('table.cuisines')} <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            <div className="text-gray-700 font-medium flex items-center">
              {t('table.rating')} <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            <div className="text-gray-700 font-medium flex items-center">
              {t('table.median')} <ChevronDown className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="grid grid-cols-6 gap-4 items-center py-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">
                    {restaurant.logo}
                  </div>
                  <span className="text-gray-700 font-medium">{restaurant.brand}</span>
                </div>
                <div className="text-gray-700">{restaurant.city}</div>
                <div className="text-gray-700">{restaurant.area}</div>
                <div>
                  <span className="bg-white/20 text-gray-700 px-2 py-1 rounded text-sm">
                    {restaurant.cuisine}
                  </span>
                  <span className="bg-white/10 text-gray-700 px-2 py-1 rounded text-xs ml-1">
                    +2
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(restaurant.rating)}
                  </div>
                  <span className="text-gray-700 text-sm">
                    {restaurant.totalReviews.toLocaleString()}
                  </span>
                </div>
                <div className="text-gray-700 font-medium">
                  {restaurant.medianPrice.toFixed(0)}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredRestaurants.length > 0 && (
            <div className="mt-6 text-center">
              <button className="bg-white/20 text-gray-700 px-6 py-2 rounded-lg hover:bg-white/30 transition-colors">
                Load More Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}