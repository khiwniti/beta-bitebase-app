"use client"

import React from 'react'
import mapboxgl, { MapMouseEvent } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker } from 'react-map-gl';

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'your-mapbox-token-here';

interface MapContainerProps {
  center: [number, number]
  zoom: number
  height: string
  className?: string
  children?: React.ReactNode
  onViewportChange?: (viewport: any) => void;
  onClick?: (event: MapMouseEvent) => void;
}

export function MapContainer({ center, zoom, height, className = "", children, onViewportChange, onClick }: MapContainerProps) {
  const initialViewState = {
    longitude: center[1], // center[1] is longitude
    latitude: center[0],  // center[0] is latitude
    zoom: zoom,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  };

  const handleMove = (evt: any) => {
    if (onViewportChange) {
      onViewportChange(evt.viewState);
    }
  };

  const handleClick = (evt: MapMouseEvent) => {
    if (onClick) {
      onClick(evt);
    }
  };

  // Check if Mapbox token is available
  if (!mapboxgl.accessToken) {
    return (
      <div
        className={`relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Map Unavailable</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to environment variables.
          </p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      <Map
        mapboxAccessToken={mapboxgl.accessToken}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={handleMove}
        onClick={handleClick}
        attributionControl={false}
      >
        {children}
      </Map>
    </div>
  )
}
