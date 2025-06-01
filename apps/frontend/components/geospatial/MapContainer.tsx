"use client"

import React from 'react'

interface MapContainerProps {
  center: [number, number]
  zoom: number
  height: string
  className?: string
  children?: React.ReactNode
}

export function MapContainer({ center, zoom, height, className = "", children }: MapContainerProps) {
  return (
    <div 
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Map placeholder with interactive elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Map center indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </div>
        
        {/* Zoom level indicator */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-lg shadow-lg">
          <span className="text-sm text-gray-700">Zoom: {zoom}</span>
        </div>
        
        {/* Coordinates indicator */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-lg shadow-lg">
          <span className="text-sm text-gray-700">
            {center[0].toFixed(4)}, {center[1].toFixed(4)}
          </span>
        </div>
        
        {/* Interactive map message */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
          <div className="bg-white bg-opacity-95 px-4 py-3 rounded-lg shadow-lg text-center max-w-sm">
            <div className="text-green-600 mb-2">🗺️</div>
            <p className="text-sm text-gray-700 font-medium">Interactive Map</p>
            <p className="text-xs text-gray-500 mt-1">
              Click anywhere to analyze restaurant opportunities
            </p>
          </div>
        </div>
      </div>
      
      {/* Render children (overlays, markers, etc.) */}
      {children}
    </div>
  )
}
