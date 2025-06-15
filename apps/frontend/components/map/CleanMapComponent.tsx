'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { apiClient, Restaurant } from '../../lib/api-client';
import { getMapboxTileUrl } from '../../lib/mapbox';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface CleanMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onRestaurantSelect?: (restaurant: Restaurant) => void;
}

export default function CleanMapComponent({
  center = [13.7563, 100.5018], // Bangkok default
  zoom = 13,
  className = "w-full h-96",
  onRestaurantSelect
}: CleanMapProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
    
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
      fetchRestaurants(center[0], center[1]);
    }
  }, [isClient, center, fetchRestaurants]);

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
    const size = restaurant.rating && restaurant.rating > 4.5 ? 24 : 20;

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
      ">${restaurant.cuisine?.charAt(0).toUpperCase() || 'R'}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }, [L]);

  // Loading state
  if (!isClient) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url={getMapboxTileUrl('streets')}
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          tileSize={512}
          zoomOffset={-1}
        />

        {/* Restaurant markers */}
        {L && restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
            icon={createRestaurantIcon(restaurant)}
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
                {onRestaurantSelect && (
                  <button 
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => onRestaurantSelect(restaurant)}
                  >
                    Select Restaurant
                  </button>
                )}
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
              <span className="text-sm text-gray-700">Loading restaurants...</span>
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
              {restaurants.length} restaurants found
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
