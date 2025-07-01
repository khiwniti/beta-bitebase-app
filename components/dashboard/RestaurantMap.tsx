"use client";

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Star, Clock, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { useLocationBasedRestaurants } from '../../hooks/useRestaurantData';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '../../lib/mapbox';

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
  showBufferRadius?: boolean;
  bufferRadius?: number; // in kilometers
}

export default function RestaurantMap({
  className = "",
  showBufferRadius = true,
  bufferRadius = 2
}: RestaurantMapProps) {
  const { restaurants, loading, error: hookError, userLocation, refetch } = useLocationBasedRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [popupInfo, setPopupInfo] = useState<Restaurant | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [localError, setLocalError] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 100.5018, // Default to Bangkok
    latitude: 13.7563,
    zoom: 12
  });
  const [currentBufferRadius, setCurrentBufferRadius] = useState(bufferRadius);

  // Combine hook error and local error
  const error = hookError || localError;

  // Function to create circle GeoJSON for buffer radius
  const createCircleGeoJSON = (center: { lat: number; lng: number }, radiusKm: number) => {
    const points = 64;
    const coords = [];
    const distanceX = radiusKm / (111.32 * Math.cos(center.lat * Math.PI / 180));
    const distanceY = radiusKm / 110.54;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      coords.push([center.lng + x, center.lat + y]);
    }
    coords.push(coords[0]); // Close the polygon

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords]
      }
    };
  };

  // Check location permission status
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        console.log('📍 Location permission status:', result.state);
      });
    }
  }, []);

  // Update map center when user location is available
  useEffect(() => {
    if (userLocation) {
      console.log('📍 Updating map center to user location:', userLocation);
      setViewState(prev => ({
        ...prev,
        longitude: userLocation.lng,
        latitude: userLocation.lat,
        zoom: 14
      }));
    }
  }, [userLocation]);

  // Manual location request function
  const requestLocation = () => {
    if (navigator.geolocation) {
      console.log('📍 Requesting location permission...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('📍 Manual location obtained:', location);
          setLocationPermission('granted');
          setViewState({
            longitude: location.lng,
            latitude: location.lat,
            zoom: 14
          });
          refetch(); // Refresh restaurants for new location
        },
        (error) => {
          console.error('📍 Location error:', error.message, error.code);
          setLocationPermission('denied');

          // Show user-friendly error message
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocalError('Location access denied. Please enable location in your browser settings.');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocalError('Location information unavailable. Using default Bangkok location.');
              break;
            case error.TIMEOUT:
              setLocalError('Location request timed out. Using default Bangkok location.');
              break;
            default:
              setLocalError('Unknown location error. Using default Bangkok location.');
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      setLocalError('Geolocation is not supported by this browser.');
      setLocationPermission('denied');
    }
  };

  // Fallback to simple map if no Mapbox token
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

        {/* Buffer Radius Circle */}
        {showBufferRadius && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: '50%',
              top: '50%',
              width: `${(currentBufferRadius / latRange) * 80}%`,
              height: `${(currentBufferRadius / latRange) * 80}%`,
            }}
          >
            <div className="w-full h-full border-2 border-green-500 border-opacity-60 bg-green-500 bg-opacity-10 rounded-full"></div>
          </div>
        )}

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
            onClick={() => refetch()}
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

  // Render Mapbox map if token is available
  const renderMapboxMap = () => {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your-mapbox-token-here') {
      return renderSimpleMap();
    }

    return (
      <div className="relative w-full h-96 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {/* Buffer Radius Circle */}
          {userLocation && showBufferRadius && (
            <Source
              id="buffer-radius"
              type="geojson"
              data={{
                type: 'FeatureCollection',
                features: [createCircleGeoJSON(userLocation, currentBufferRadius)]
              }}
            >
              <Layer
                id="buffer-radius-fill"
                type="fill"
                paint={{
                  'fill-color': '#74C365',
                  'fill-opacity': 0.1
                }}
              />
              <Layer
                id="buffer-radius-line"
                type="line"
                paint={{
                  'line-color': '#74C365',
                  'line-width': 2,
                  'line-opacity': 0.8
                }}
              />
            </Source>
          )}

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              longitude={userLocation!.lng}
              latitude={userLocation!.lat}
              anchor="bottom"
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500/30 rounded-full animate-ping"></div>
              </div>
            </Marker>
          )}

          {/* Restaurant Markers */}
          {restaurants.map((restaurant) => {
            if (!restaurant.latitude || !restaurant.longitude) return null;

            return (
              <Marker
                key={restaurant.id}
                longitude={restaurant.longitude}
                latitude={restaurant.latitude}
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(restaurant);
                }}
              >
                <div className="cursor-pointer transform hover:scale-110 transition-transform">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </Marker>
            );
          })}

          {/* Popup for selected restaurant */}
          {popupInfo && (
            <Popup
              longitude={popupInfo!.longitude}
              latitude={popupInfo!.latitude}
              anchor="bottom"
              closeOnClick={false}
              onClose={() => setPopupInfo(null)}
              className="restaurant-popup"
            >
              <div className="p-2">
                <h3 className="font-semibold text-base">{popupInfo!.name}</h3>
                <p className="text-sm text-gray-600">{popupInfo!.address}</p>
                {popupInfo!.rating && (
                  <div className="flex items-center mt-1">
                    <div className="text-yellow-500">
                      {Array(Math.round(popupInfo!.rating))
                        .fill(0)
                        .map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">{popupInfo!.rating}</span>
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Map>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => refetch()}
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
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-20">
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
              ? `Found ${restaurants.length} real restaurants near you (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
              : locationPermission === 'denied'
                ? `Showing ${restaurants.length} real Bangkok restaurants (location access denied)`
                : 'Getting your location to show nearby restaurants...'
            }
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              Real Restaurant Data
            </span>
            {showBufferRadius && (
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {currentBufferRadius}km Search Radius
              </span>
            )}
            {locationPermission === 'denied' && (
              <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                Enable Location for Nearby Results
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {showBufferRadius && userLocation && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Radius:</label>
              <select
                value={currentBufferRadius}
                onChange={(e) => setCurrentBufferRadius(Number(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
              >
                <option value={1}>1km</option>
                <option value={2}>2km</option>
                <option value={3}>3km</option>
                <option value={5}>5km</option>
                <option value={10}>10km</option>
              </select>
            </div>
          )}
          {!userLocation && locationPermission !== 'denied' && (
            <Button
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={loading}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get Location
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
          {renderMapboxMap()}
        </div>

        {/* Restaurant List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {restaurants.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No restaurants found nearby</p>
              <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2">
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