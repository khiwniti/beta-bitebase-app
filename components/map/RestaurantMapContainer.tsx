'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { apiClient } from '@/services/api';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface Restaurant {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  price_level?: number;
  cuisine: string;
  address: string;
  photo_url?: string;
  review_count?: number;
  data_source?: string;
}

export interface RestaurantMapContainerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onRestaurantClick?: (restaurant: Restaurant) => void;
}

const RestaurantMapContainer: React.FC<RestaurantMapContainerProps> = ({
  center = [-74.0060, 40.7128], // NYC default
  zoom = 13,
  className = '',
  onRestaurantClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add attribution control
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right');

      // Handle map load
      map.current.on('load', () => {
        setMapLoaded(true);
        console.log('Map loaded successfully');
        // Load restaurants for initial location
        loadRestaurants(center[1], center[0]);
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Failed to load map');
      });

      // Handle map move end to load restaurants for new area
      map.current.on('moveend', () => {
        if (map.current) {
          const mapCenter = map.current.getCenter();
          loadRestaurants(mapCenter.lat, mapCenter.lng);
        }
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
    }

    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, []);

  // Load restaurants for a location
  const loadRestaurants = useCallback(async (lat: number, lng: number) => {
    if (isLoadingRestaurants) return;

    setIsLoadingRestaurants(true);
    try {
      const response = await apiClient.post('/restaurants/search', {
        latitude: lat,
        longitude: lng,
        radius: 2000,
        limit: 20
      });

      if (response.data.success) {
        const restaurantData = response.data.data.restaurants || [];
        setRestaurants(restaurantData);
        addRestaurantMarkers(restaurantData);
      }
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setIsLoadingRestaurants(false);
    }
  }, [isLoadingRestaurants]);

  // Add restaurant markers to map
  const addRestaurantMarkers = useCallback((restaurantData: Restaurant[]) => {
    if (!map.current || !mapLoaded) return;

    clearMarkers();

    restaurantData.forEach((restaurant) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'restaurant-marker';
      
      // Create marker content
      const markerContent = document.createElement('div');
      markerContent.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        position: relative;
        transform: rotate(-45deg);
        border: 3px solid #fff;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.2s ease;
      `;

      // Add rating display
      const ratingElement = document.createElement('div');
      ratingElement.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        color: white;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        line-height: 1;
      `;
      ratingElement.textContent = restaurant.rating.toString();
      
      markerContent.appendChild(ratingElement);
      markerElement.appendChild(markerContent);

      // Add hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerContent.style.transform = 'rotate(-45deg) scale(1.1)';
        markerContent.style.zIndex = '1000';
      });

      markerElement.addEventListener('mouseleave', () => {
        markerContent.style.transform = 'rotate(-45deg) scale(1)';
        markerContent.style.zIndex = 'auto';
      });

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.style.cssText = 'padding: 12px; min-width: 200px;';
      popupContent.innerHTML = `
        <div style="margin-bottom: 8px;">
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${restaurant.name}</h3>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="color: #f59e0b;">⭐ ${restaurant.rating}</span>
            <span style="color: #059669; font-weight: 500;">${'$'.repeat(restaurant.price_level || 1)}</span>
          </div>
          <div style="font-size: 14px; color: #6b7280; text-transform: capitalize;">${restaurant.cuisine}</div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">${restaurant.address}</div>
        </div>
        ${restaurant.photo_url ? `
          <img src="${restaurant.photo_url}" alt="${restaurant.name}" 
               style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; margin-top: 8px;" />
        ` : ''}
        <div style="margin-top: 8px;">
          <button onclick="window.restaurantClick && window.restaurantClick('${restaurant.name}')" 
                  style="width: 100%; background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
            View Details
          </button>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setDOMContent(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([restaurant.longitude, restaurant.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Handle marker click
      markerElement.addEventListener('click', () => {
        if (onRestaurantClick) {
          onRestaurantClick(restaurant);
        }
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, onRestaurantClick, clearMarkers]);

  // Set up global restaurant click handler
  useEffect(() => {
    (window as any).restaurantClick = (restaurantName: string) => {
      const restaurant = restaurants.find(r => r.name === restaurantName);
      if (restaurant && onRestaurantClick) {
        onRestaurantClick(restaurant);
      }
    };

    return () => {
      delete (window as any).restaurantClick;
    };
  }, [restaurants, onRestaurantClick]);

  if (error) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-700 font-medium">Map Error</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
            <p className="text-xs text-gray-500 mt-1">Connecting to Mapbox</p>
          </div>
        </div>
      )}

      {/* Restaurant loading indicator */}
      {isLoadingRestaurants && (
        <div className="absolute top-4 right-4 bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded-lg text-xs font-medium flex items-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
          Loading restaurants...
        </div>
      )}

      {/* Restaurant count */}
      {restaurants.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium">
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Map status */}
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg shadow px-3 py-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Map Ready</span>
            <span>•</span>
            <span>{restaurants.length} restaurants</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMapContainer;