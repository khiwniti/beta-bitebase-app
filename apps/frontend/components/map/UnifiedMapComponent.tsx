"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Star, RefreshCw, Layers, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { apiClient, Restaurant } from '../../lib/api-client';
import { MAPBOX_TOKEN } from '../../lib/mapbox';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface UnifiedMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  showControls?: boolean;
  showRestaurantList?: boolean;
  compact?: boolean;
}

export default function UnifiedMapComponent({
  center = [13.7563, 100.5018], // Bangkok default
  zoom = 13,
  className = "",
  height = "h-96",
  onRestaurantSelect,
  showControls = true,
  showRestaurantList = true,
  compact = false
}: UnifiedMapProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Initialize client-side rendering and get user location
  useEffect(() => {
    setIsClient(true);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default location');
        }
      );
    }
    
    // Import Leaflet on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      // Fix for default markers
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  // Fetch restaurants for the current location
  const fetchRestaurants = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.fetchRealRestaurantData({
        latitude: lat,
        longitude: lng,
        radius: 5,
        platforms: ['wongnai', 'google']
      });
      
      if (response.data?.all_restaurants) {
        setRestaurants(response.data.all_restaurants);
      } else {
        throw new Error(response.error || 'Failed to fetch restaurants');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch restaurants when component mounts or center changes
  useEffect(() => {
    if (isClient) {
      const targetLocation = userLocation || { lat: center[0], lng: center[1] };
      fetchRestaurants(targetLocation.lat, targetLocation.lng);
    }
  }, [isClient, center, userLocation, fetchRestaurants]);

  // Create custom restaurant icon
  const createRestaurantIcon = useCallback((restaurant: Restaurant) => {
    if (!L) return null;

    const getColor = () => {
      switch (restaurant.cuisine?.toLowerCase()) {
        case 'italian': return '#e74c3c';
        case 'japanese': return '#9b59b6';
        case 'thai': return '#f39c12';
        case 'american': return '#3498db';
        case 'chinese': return '#e67e22';
        case 'indian': return '#e91e63';
        default: return '#27ae60';
      }
    };

    const color = getColor();
    const size = restaurant.rating && restaurant.rating > 4.5 ? 28 : 24;

    return new L.DivIcon({
      className: 'custom-restaurant-marker',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: bold;
        cursor: pointer;
      ">${restaurant.cuisine?.charAt(0).toUpperCase() || 'R'}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }, [L]);

  // Create user location icon
  const createUserLocationIcon = useCallback(() => {
    if (!L) return null;

    return new L.DivIcon({
      className: 'user-location-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #3b82f6;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -5px;
          left: -5px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.3);
          animation: pulse 2s infinite;
        "></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }, [L]);

  const getTileUrl = () => {
    if (!MAPBOX_TOKEN) {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    
    const styleMap = {
      streets: 'streets-v12',
      satellite: 'satellite-streets-v12',
      terrain: 'outdoors-v12'
    };
    
    return `https://api.mapbox.com/styles/v1/mapbox/${styleMap[mapStyle]}/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    if (onRestaurantSelect) {
      onRestaurantSelect(restaurant);
    }
  };

  const refreshData = () => {
    const targetLocation = userLocation || { lat: center[0], lng: center[1] };
    fetchRestaurants(targetLocation.lat, targetLocation.lng);
  };

  // Loading state
  if (!isClient) {
    return (
      <div className={`${className} ${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading Map...</p>
        </div>
      </div>
    );
  }

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] as [number, number] : center;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Restaurant Map
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {userLocation 
                ? `Found ${restaurants.length} restaurants near you`
                : `Showing ${restaurants.length} restaurants in Bangkok`
              }
            </p>
          </div>
          {showControls && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapStyle(mapStyle === 'streets' ? 'satellite' : mapStyle === 'satellite' ? 'terrain' : 'streets')}
              >
                <Layers className="w-4 h-4 mr-2" />
                {mapStyle}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div className={`grid grid-cols-1 ${showRestaurantList && !compact ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Map */}
        <div className={showRestaurantList && !compact ? 'lg:col-span-2' : ''}>
          <div className={`relative ${height} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700`}>
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                url={getTileUrl()}
                attribution={MAPBOX_TOKEN ? '&copy; <a href="https://www.mapbox.com/">Mapbox</a>' : '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'}
                tileSize={MAPBOX_TOKEN ? 512 : 256}
                zoomOffset={MAPBOX_TOKEN ? -1 : 0}
              />

              {/* User Location Marker */}
              {L && userLocation && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={createUserLocationIcon()}
                >
                  <Popup>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Navigation className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="font-medium">Your Location</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Lat: {userLocation.lat.toFixed(4)}<br />
                        Lng: {userLocation.lng.toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Restaurant markers */}
              {L && restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  position={[restaurant.latitude, restaurant.longitude]}
                  icon={createRestaurantIcon(restaurant)}
                  eventHandlers={{
                    click: () => handleRestaurantClick(restaurant)
                  }}
                >
                  <Popup>
                    <div className="text-center min-w-[200px]">
                      <h3 className="font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                        {restaurant.rating && (
                          <p><strong>Rating:</strong> ⭐ {restaurant.rating}</p>
                        )}
                        {restaurant.price_range && (
                          <p><strong>Price:</strong> {restaurant.price_range}</p>
                        )}
                        <p className="text-gray-500 text-xs">Source: {restaurant.platform}</p>
                      </div>
                      <Button 
                        className="mt-3 w-full"
                        size="sm"
                        onClick={() => handleRestaurantClick(restaurant)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Status overlay */}
            <div className="absolute top-4 right-4 space-y-2">
              {loading && (
                <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-700">Loading...</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 px-3 py-2 rounded-lg shadow-lg">
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
              
              {!loading && !error && restaurants.length > 0 && (
                <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg">
                  <span className="text-sm text-gray-700">
                    {restaurants.length} restaurants
                  </span>
                </div>
              )}
            </div>

            {/* Compact controls */}
            {compact && showControls && (
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Restaurant List */}
        {showRestaurantList && !compact && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {restaurants.length === 0 && !loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No restaurants found</p>
                <Button onClick={refreshData} variant="outline" size="sm" className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRestaurant?.id === restaurant.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <CardContent className="p-3">
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
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected Restaurant Details */}
      {selectedRestaurant && !compact && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
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
            </CardTitle>
          </CardHeader>
          <CardContent>
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

                {selectedRestaurant.price_range && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-2">
                      Price Range:
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedRestaurant.price_range}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {selectedRestaurant.platform && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-2">
                      Source:
                    </span>
                    <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                      {selectedRestaurant.platform}
                    </span>
                  </div>
                )}

                {selectedRestaurant.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block mb-1">
                      Description:
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedRestaurant.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}