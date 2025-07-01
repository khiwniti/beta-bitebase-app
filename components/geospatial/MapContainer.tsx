"use client"

import React from 'react'
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, { Marker } from 'react-map-gl';

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapContainerProps {
  center: [number, number]
  zoom: number
  height: string
  className?: string
  children?: React.ReactNode
  onViewportChange?: (viewport: any) => void;
  onClick?: (event: mapboxgl.MapMouseEvent) => void;
}

export function MapContainer({ center, zoom, height, className = "", children, onViewportChange, onClick }: MapContainerProps) {
  const initialViewState = {
    longitude: center[0],
    latitude: center[1],
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

  const handleClick = (evt: mapboxgl.MapMouseEvent) => {
    if (onClick) {
      onClick(evt);
    }
  };

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
