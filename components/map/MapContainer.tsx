'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

export interface MapContainerProps {
  restaurants: Restaurant[];
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  searchRadius?: number;
  className?: string;
}

const MapContainer: React.FC<MapContainerProps> = ({
  restaurants = [],
  center = [-74.0060, 40.7128], // NYC default
  zoom = 13,
  onLocationSelect,
  onRestaurantClick,
  searchRadius,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const radiusCircleRef = useRef<string | null>(null);
  
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

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
    });

    // Handle map clicks for location selection
    if (onLocationSelect) {
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onLocationSelect(lat, lng);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, onLocationSelect]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, []);

  // Add restaurant markers
  const addRestaurantMarkers = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    clearMarkers();

    restaurants.forEach((restaurant) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'restaurant-marker';
      markerElement.innerHTML = `
        <div class="marker-pin">
          <div class="marker-content">
            <span class="marker-rating">${restaurant.rating}</span>
          </div>
        </div>
      `;

      // Add marker styles
      markerElement.style.cssText = `
        cursor: pointer;
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #ff6b6b;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .marker-content {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
        }
        .marker-rating {
          color: white;
          font-size: 10px;
          font-weight: bold;
        }
      `;

      // Create popup content
      const popupContent = `
        <div class="restaurant-popup">
          <h3 class="popup-title">${restaurant.name}</h3>
          <div class="popup-details">
            <div class="popup-rating">
              ⭐ ${restaurant.rating} ${restaurant.review_count ? `(${restaurant.review_count} reviews)` : ''}
            </div>
            <div class="popup-price">
              ${'$'.repeat(restaurant.price_level || 1)}
            </div>
            <div class="popup-cuisine">${restaurant.cuisine}</div>
            <div class="popup-address">${restaurant.address}</div>
          </div>
          ${restaurant.photo_url ? `<img src="${restaurant.photo_url}" alt="${restaurant.name}" class="popup-image" />` : ''}
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupContent);

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
  }, [restaurants, mapLoaded, onRestaurantClick, clearMarkers]);

  // Add search radius circle
  const addRadiusCircle = useCallback((lat: number, lng: number, radius: number) => {
    if (!map.current || !mapLoaded) return;

    // Remove existing circle
    if (radiusCircleRef.current) {
      if (map.current.getLayer(radiusCircleRef.current)) {
        map.current.removeLayer(radiusCircleRef.current);
      }
      if (map.current.getSource(radiusCircleRef.current)) {
        map.current.removeSource(radiusCircleRef.current);
      }
    }

    const circleId = 'search-radius-circle';
    radiusCircleRef.current = circleId;

    // Create circle geometry
    const center = [lng, lat];
    const radiusInKm = radius / 1000;
    const points = 64;
    const coordinates = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = radiusInKm * Math.cos(angle);
      const dy = radiusInKm * Math.sin(angle);
      
      // Convert to lat/lng (approximate)
      const deltaLat = dy / 111.32;
      const deltaLng = dx / (111.32 * Math.cos(lat * Math.PI / 180));
      
      coordinates.push([lng + deltaLng, lat + deltaLat]);
    }
    coordinates.push(coordinates[0]); // Close the circle

    // Add source and layer
    map.current.addSource(circleId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        },
        properties: {}
      }
    });

    map.current.addLayer({
      id: circleId,
      type: 'fill',
      source: circleId,
      paint: {
        'fill-color': '#007cbf',
        'fill-opacity': 0.1
      }
    });

    map.current.addLayer({
      id: `${circleId}-border`,
      type: 'line',
      source: circleId,
      paint: {
        'line-color': '#007cbf',
        'line-width': 2,
        'line-opacity': 0.8
      }
    });
  }, [mapLoaded]);

  // Update markers when restaurants change
  useEffect(() => {
    addRestaurantMarkers();
  }, [addRestaurantMarkers]);

  // Update search radius when it changes
  useEffect(() => {
    if (searchRadius && center) {
      addRadiusCircle(center[1], center[0], searchRadius);
    }
  }, [searchRadius, center, addRadiusCircle]);

  // Fit map to show all restaurants
  const fitToRestaurants = useCallback(() => {
    if (!map.current || !restaurants.length) return;

    const bounds = new mapboxgl.LngLatBounds();
    restaurants.forEach(restaurant => {
      bounds.extend([restaurant.longitude, restaurant.latitude]);
    });

    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  }, [restaurants]);

  // Expose fit function
  useEffect(() => {
    if (restaurants.length > 0) {
      fitToRestaurants();
    }
  }, [restaurants, fitToRestaurants]);

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
          </div>
        </div>
      )}

      {/* Restaurant count badge */}
      {restaurants.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium">
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Map controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <button
          onClick={fitToRestaurants}
          className="bg-white hover:bg-gray-50 rounded-lg shadow-lg px-3 py-2 text-sm font-medium transition-colors"
          disabled={restaurants.length === 0}
        >
          Fit to Results
        </button>
      </div>

      {/* Custom styles for popups */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .restaurant-popup {
          padding: 16px;
          min-width: 250px;
        }
        
        .popup-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #1f2937;
        }
        
        .popup-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }
        
        .popup-rating {
          font-size: 14px;
          color: #374151;
        }
        
        .popup-price {
          font-size: 14px;
          color: #059669;
          font-weight: 500;
        }
        
        .popup-cuisine {
          font-size: 14px;
          color: #6b7280;
          text-transform: capitalize;
        }
        
        .popup-address {
          font-size: 12px;
          color: #9ca3af;
        }
        
        .popup-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default MapContainer;