"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Star, Clock, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { useLocationBasedRestaurants } from '../../hooks/useRestaurantData';

interface Restaurant {
  id: number;
  name: string;
  cuisine?: string;
  rating?: number;
  price_range?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  phone?: string;
  platform?: string;
  images?: any;
  description?: string;
  hours?: any;
  website?: string;
}

interface RestaurantMapProps {
  className?: string;
}

export default function RestaurantMap({ className = "" }: RestaurantMapProps) {
  const { restaurants, loading, error, userLocation, refetch } = useLocationBasedRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Simple map visualization using CSS positioning
  const renderSimpleMap = () => {
    if (!userLocation) return null;

    const mapWidth = 600;
    const mapHeight = 400;
    const centerLat = userLocation.lat;
    const centerLng = userLocation.lng;
    const latRange = 0.02; // ~2km range
    const lngRange = 0.02;

    return (
      <div 
        ref={mapRef}
        className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="border border-gray-300 dark:border-gray-600"></div>
            ))}
          </div>
        </div>

        {/* User Location Marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500/30 rounded-full animate-ping"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              You are here
            </div>
          </div>
        </div>

        {/* Restaurant Markers */}
        {restaurants.map((restaurant) => {
          if (!restaurant.latitude || !restaurant.longitude) return null;

          const latOffset = (restaurant.latitude - centerLat) / latRange;
          const lngOffset = (restaurant.longitude - centerLng) / lngRange;
          
          const x = 50 + (lngOffset * 40); // Convert to percentage
          const y = 50 - (latOffset * 40); // Invert Y axis for map coordinates
          
          // Keep markers within bounds
          if (x < 5 || x > 95 || y < 5 || y > 95) return null;

          return (
            <div
              key={restaurant.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              style={{
                left: `${x}%`,
                top: `${y}%`
              }}
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform"></div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {restaurant.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-30">
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading restaurants...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Nearby Restaurants
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {userLocation 
              ? `Found ${restaurants.length} restaurants near you`
              : 'Getting your location...'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {error && (
            <span className="text-sm text-red-600 dark:text-red-400">
              {error}
            </span>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          {renderSimpleMap()}
        </div>

        {/* Restaurant List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {restaurants.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No restaurants found nearby</p>
              <Button onClick={refetch} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedRestaurant?.id === restaurant.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedRestaurant(restaurant)}
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
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {restaurant.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {restaurant.cuisine}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {restaurant.rating && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                            {restaurant.rating}
                          </span>
                        </div>
                      )}
                      {restaurant.price_range && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {restaurant.price_range}
                        </span>
                      )}
                      {restaurant.platform && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 rounded">
                          {restaurant.platform}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Restaurant Details */}
      {selectedRestaurant && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedRestaurant.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedRestaurant.cuisine}
              </p>
            </div>
            <Button
              onClick={() => setSelectedRestaurant(null)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {selectedRestaurant.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                  <span className="font-medium">{selectedRestaurant.rating}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">rating</span>
                </div>
              )}
              
              {selectedRestaurant.address && (
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRestaurant.address}
                  </span>
                </div>
              )}

              {selectedRestaurant.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRestaurant.phone}
                  </span>
                </div>
              )}

              {selectedRestaurant.hours && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {typeof selectedRestaurant.hours === 'string' ? selectedRestaurant.hours : 'See website for hours'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {selectedRestaurant.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRestaurant.description}
                </p>
              )}

              {selectedRestaurant.website && (
                <a
                  href={selectedRestaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}