'use client';

import React, { useState, useCallback, useEffect } from 'react';
// import { useAuth } from '@/components/auth';
import MapContainer, { Restaurant } from './MapContainer';
import SearchBox from './SearchBox';
import RestaurantFilters, { FilterOptions } from './RestaurantFilters';
import RestaurantList from './RestaurantList';
import { apiClient } from '@/services/api';

export interface MapDashboardProps {
  className?: string;
}

const MapDashboard: React.FC<MapDashboardProps> = ({ className = '' }) => {
  // const { user } = useAuth();
  // Temporary bypass for development
  const user = {
    id: '1',
    name: 'Restaurant Manager',
    email: 'admin@bitebase.app',
    role: 'admin',
    subscription_tier: 'pro' as const
  };
  
  // State management
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  }>({
    lat: 40.7128,
    lng: -74.0060,
    name: 'New York, NY'
  });

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: [],
    priceRange: [1, 4],
    rating: 0,
    radius: 2000,
    sortBy: 'distance'
  });

  // UI state
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<Restaurant | null>(null);

  // Search restaurants
  const searchRestaurants = useCallback(async () => {
    if (!searchLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = {
        latitude: searchLocation.lat,
        longitude: searchLocation.lng,
        radius: filters.radius,
        limit: 20,
        ...(filters.cuisine.length > 0 && { cuisine: filters.cuisine }),
        ...(filters.rating > 0 && { rating: filters.rating }),
        ...((filters.priceRange[0] > 1 || filters.priceRange[1] < 4) && { 
          priceRange: filters.priceRange 
        }),
        sortBy: filters.sortBy
      };

      const response = await apiClient.post('/restaurants/search', searchParams);
      
      if (response.data.success) {
        setRestaurants(response.data.data.restaurants || []);
      } else {
        throw new Error(response.data.message || 'Search failed');
      }
    } catch (err: any) {
      console.error('Restaurant search error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to search restaurants');
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchLocation, filters]);

  // Handle location selection from search
  const handleLocationSelect = useCallback((lat: number, lng: number, placeName: string) => {
    setSearchLocation({ lat, lng, name: placeName });
    setSelectedRestaurant(null);
  }, []);

  // Handle location selection from map click
  const handleMapLocationSelect = useCallback((lat: number, lng: number) => {
    setSearchLocation({ 
      lat, 
      lng, 
      name: `${lat.toFixed(4)}, ${lng.toFixed(4)}` 
    });
    setSelectedRestaurant(null);
  }, []);

  // Handle restaurant selection
  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    // You could also center the map on this restaurant
  }, []);

  // Handle restaurant hover
  const handleRestaurantHover = useCallback((restaurant: Restaurant | null) => {
    setHoveredRestaurant(restaurant);
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    searchRestaurants();
  }, [searchRestaurants]);

  // Initial search when location changes
  useEffect(() => {
    if (searchLocation) {
      searchRestaurants();
    }
  }, [searchLocation.lat, searchLocation.lng]);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Your Location'
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Keep default NYC location
        }
      );
    }
  }, []);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Explorer</h1>
            <p className="text-sm text-gray-600 mt-1">
              Discover restaurants near {searchLocation.name}
            </p>
          </div>
          {user && (
            <div className="text-sm text-gray-500">
              Welcome, {user.name}
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <SearchBox
          onLocationSelect={handleLocationSelect}
          placeholder="Search for a location to explore restaurants..."
          defaultValue={searchLocation.name}
          className="max-w-md"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="p-4">
            <RestaurantFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              isLoading={isLoading}
            />
          </div>

          {/* Restaurant List */}
          <div className="flex-1 p-4 pt-0 overflow-hidden">
            <RestaurantList
              restaurants={restaurants}
              onRestaurantClick={handleRestaurantClick}
              onRestaurantHover={handleRestaurantHover}
              isLoading={isLoading}
              className="h-full"
            />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
              <div className="flex items-center">
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-3 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <MapContainer
            restaurants={restaurants}
            center={[searchLocation.lng, searchLocation.lat]}
            zoom={13}
            onLocationSelect={handleMapLocationSelect}
            onRestaurantClick={handleRestaurantClick}
            searchRadius={filters.radius}
            className="h-full"
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
              <div className="bg-white rounded-lg shadow-lg px-6 py-4 flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-700">Searching restaurants...</span>
              </div>
            </div>
          )}

          {/* Selected Restaurant Info */}
          {selectedRestaurant && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-30">
              <div className="flex items-start space-x-4">
                {selectedRestaurant.photo_url && (
                  <img
                    src={selectedRestaurant.photo_url}
                    alt={selectedRestaurant.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {selectedRestaurant.name}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-yellow-600">
                      ⭐ {selectedRestaurant.rating}
                    </span>
                    <span className="text-sm text-green-600">
                      {'$'.repeat(selectedRestaurant.price_level || 1)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {selectedRestaurant.cuisine}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {selectedRestaurant.address}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            {restaurants.length > 0 && (
              <span>
                Showing {restaurants.length} restaurants within {filters.radius/1000}km
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Google Places & Mapbox</span>
            {isLoading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                Loading...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;