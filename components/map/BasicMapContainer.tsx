'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface BasicMapContainerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const BasicMapContainer: React.FC<BasicMapContainerProps> = ({
  center = [-74.0060, 40.7128], // NYC default
  zoom = 13,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Failed to load map');
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom]);

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

      {/* Map loaded indicator */}
      {mapLoaded && (
        <div className="absolute top-4 left-4 bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-lg text-xs font-medium">
          ✅ Map Ready
        </div>
      )}

      {/* Map info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg shadow px-3 py-2 text-xs text-gray-600">
        <div>Center: {center[1].toFixed(4)}, {center[0].toFixed(4)}</div>
        <div>Zoom: {zoom}</div>
      </div>
    </div>
  );
};

export default BasicMapContainer;