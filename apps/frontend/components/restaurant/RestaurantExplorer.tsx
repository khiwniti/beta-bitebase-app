/**
 * Restaurant Explorer Component
 * Interactive component for exploring restaurants with Wongnai integration
 */

"use client"

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Clock, 
  Truck, 
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Utensils,
  DollarSign
} from 'lucide-react';
import { useRestaurantSearch, useRestaurantMenu } from '../../hooks/useRestaurantData';
import { Restaurant, RestaurantMenu } from '../../lib/api-client';

interface RestaurantExplorerProps {
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function RestaurantExplorer({ initialLocation }: RestaurantExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState(initialLocation || {
    latitude: 13.7563,
    longitude: 100.5018
  });

  const { restaurants, loading, error, searchWongnai } = useRestaurantSearch();
  const { menu, loading: menuLoading, error: menuError } = useRestaurantMenu(
    selectedRestaurant?.platform_id || null
  );

  const cuisines = ['Thai', 'Japanese', 'Korean', 'Chinese', 'Western', 'Italian'];

  useEffect(() => {
    // Initial search
    handleSearch();
  }, []);

  const handleSearch = async () => {
    const searchParams: any = {
      latitude: location.latitude,
      longitude: location.longitude,
      limit: 20
    };

    if (searchQuery) {
      searchParams.query = searchQuery;
    }

    if (selectedCuisine) {
      searchParams.cuisine = selectedCuisine;
    }

    await searchWongnai(searchParams);
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const getPriceDisplay = (priceRange: string) => {
    const priceMap: Record<string, string> = {
      budget: '฿',
      moderate: '฿฿',
      upscale: '฿฿฿',
      luxury: '฿฿฿฿'
    };
    return priceMap[priceRange] || '฿';
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'delivery':
        return <Truck className="w-4 h-4" />;
      case 'takeout':
        return <Utensils className="w-4 h-4" />;
      case 'dine_in':
        return <MapPin className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🇹🇭 Bangkok Restaurant Finder
        </h1>
        <p className="text-gray-600 mb-6">
          Discover amazing restaurants in Bangkok with real-time data
        </p>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>

          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Cuisines</option>
                    {cuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={location.latitude}
                    onChange={(e) => setLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={location.longitude}
                    onChange={(e) => setLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Restaurant List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Found {restaurants.length} restaurants
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => handleRestaurantSelect(restaurant)}
                    className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{parseFloat(String(restaurant.rating || '0')).toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-primary-600 font-medium">
                        {getPriceDisplay(restaurant.price_range || '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{restaurant.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {(restaurant.features as string[] || []).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-1 text-xs text-gray-500">
                          {getFeatureIcon(feature)}
                          <span className="capitalize">{feature.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Restaurant Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {selectedRestaurant ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedRestaurant.name}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{parseFloat(String(selectedRestaurant.rating || '0')).toFixed(1)}</span>
                    <span className="text-gray-500">• {selectedRestaurant.cuisine}</span>
                    <span className="text-primary-600 font-medium">
                      {getPriceDisplay(selectedRestaurant.price_range || '')}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{selectedRestaurant.address}</span>
                  </div>

                  {selectedRestaurant.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{selectedRestaurant.phone}</span>
                    </div>
                  )}

                  {selectedRestaurant.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a 
                        href={selectedRestaurant.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        View on Wongnai
                      </a>
                    </div>
                  )}

                  {selectedRestaurant.hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{selectedRestaurant.hours}</span>
                    </div>
                  )}
                </div>

                {/* Menu Section */}
                {selectedRestaurant.platform_id && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>
                    
                    {menuLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-3 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      </div>
                    ) : menuError ? (
                      <p className="text-red-600">{menuError}</p>
                    ) : menu ? (
                      <div className="space-y-4">
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {menu.slice(0, 10).map((item) => (
                            <div key={item.id} className="flex justify-between items-start border-b pb-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                {item.description && (
                                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                )}
                                {item.category && (
                                  <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full mt-1 inline-block">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm font-medium text-primary-600 ml-2">
                                ฿{item.price}
                              </span>
                            </div>
                          ))}
                          {menu.length > 10 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{menu.length - 10} more items
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No menu available</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a restaurant to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}