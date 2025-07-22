'use client';

import React, { useState, useEffect } from 'react';
import AdminTabs from '../../../components/admin/AdminTabs';
import { useTranslations } from '../../../hooks/useTranslations';
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

export default function AdminLocationIntelligencePage() {
  const t = useTranslations('locationIntelligence');
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchBy: 'brand',
    query: "McDonald's",
    area: 'Siam',
    cuisine: '',
    exactMatch: false,
    excludeItem: false
  });

  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    averagePrice: 174,
    totalBrands: 25,
    totalItems: 1234
  });

  // Mock data that matches the user's provided images
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
      rating: 3.8,
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
    setRestaurants(mockRestaurants);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setLoading(false);
    }, 500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const cuisines = ['Burger', 'Pizza', 'Thai', 'Japanese', 'Italian', 'Coffee'];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTabs />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('locationIntelligence.title') || 'Location Intelligence'}
              </h1>
              <p className="text-gray-600 mt-2">
                {t('locationIntelligence.description') || 'Discover the best restaurant locations with AI-powered insights'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('locationIntelligence.search.title') || 'Search'}
          </h2>
          
          {/* Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search By Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('locationIntelligence.search.searchBy') || 'Search by'}
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['brand', 'branch', 'item'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({ ...prev, searchBy: type }))}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      filters.searchBy === type
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t(`locationIntelligence.search.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('locationIntelligence.search.itemName') || 'Item name'}
              </label>
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="McDonald's"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('locationIntelligence.search.area') || 'Area'}
              </label>
              <input
                type="text"
                value={filters.area}
                onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Siam"
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('locationIntelligence.search.cuisine') || 'Cuisine'}
              </label>
              <select
                value={filters.cuisine}
                onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">{t('locationIntelligence.search.selectCuisine') || 'Select a cuisine'}</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Checkboxes and Search Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.exactMatch}
                  onChange={(e) => setFilters(prev => ({ ...prev, exactMatch: e.target.checked }))}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {t('locationIntelligence.search.exactMatch') || 'Exact match'}
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.excludeItem}
                  onChange={(e) => setFilters(prev => ({ ...prev, excludeItem: e.target.checked }))}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {t('locationIntelligence.search.excludeItem') || 'Exclude this item'}
                </span>
              </label>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Searching...' : (t('locationIntelligence.search.searchButton') || 'Search')}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('locationIntelligence.search.averagePrice') || 'Average price'}
                </p>
                <p className="text-2xl font-bold text-gray-900">฿{stats.averagePrice}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('locationIntelligence.search.brands') || 'Brands'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBrands}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('locationIntelligence.search.items') || 'Items'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {t('locationIntelligence.search.showing') || 'Showing'} {restaurants.length} {t('locationIntelligence.search.results') || 'results'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('locationIntelligence.table.brand') || 'Brand'}
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('locationIntelligence.table.city') || 'City'}
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('locationIntelligence.table.area') || 'Area'}
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('locationIntelligence.table.cuisines') || 'Cuisines'}
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('locationIntelligence.table.rating') || 'Rating / total'}
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('locationIntelligence.table.median') || 'Median'}
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{restaurant.logo}</div>
                        <div className="text-sm font-medium text-gray-900">
                          {restaurant.brand}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {restaurant.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {restaurant.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {restaurant.cuisine}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +2
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {renderStars(restaurant.rating)}
                        </div>
                        <span className="text-sm text-gray-900">
                          {restaurant.totalReviews.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {restaurant.medianPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              {t('locationIntelligence.loadMore') || 'Load More Results'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}