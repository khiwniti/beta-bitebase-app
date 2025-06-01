'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getMapboxTileUrl } from '../../lib/mapbox'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

// Removed unused components - using ProductionMapComponent for real functionality

// Create a dynamic component for map events
const MapEventsComponent = dynamic(
  () => import('./MapEventsHandler'),
  { ssr: false }
)

interface RestaurantMarker {
  id: number
  position: [number, number]
  title: string
  type: 'restaurant' | 'cafe' | 'competitor' | 'opportunity'
  color: string
  rating?: number
  priceRange?: string
  cuisine?: string
  status?: 'active' | 'closed' | 'coming_soon'
}

interface RealMapComponentProps {
  center: [number, number]
  zoom: number
  className?: string
  onClick?: (e: any) => void
  children?: React.ReactNode
  markers?: RestaurantMarker[]
  showHeatmap?: boolean
  selectedLocation?: { lat: number; lng: number; address: string } | null
}

// Using ProductionMapComponent for real restaurant data

export default function RealMapComponent({
  center,
  zoom,
  className = '',
  onClick,
  children
}: RealMapComponentProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Import Leaflet on client side for default marker fix
    import('leaflet').then((leaflet) => {
      // Fix for default markers
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    })
  }, [])

  // Using ProductionMapComponent for custom icons

  if (!isClient) {
    // Loading state
    return (
      <div className={`relative ${className} bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">BiteBase Market Intelligence</h3>
            <p className="text-gray-600 font-medium mb-1">Loading interactive map...</p>
            <p className="text-gray-500 text-sm mb-4">Powered by Mapbox</p>
          </div>
        </div>
      </div>
    )
  }

  const tileUrl = getMapboxTileUrl('streets')

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          maxZoom={19}
          tileSize={512}
          zoomOffset={-1}
        />

        {/* Map click handler */}
        <MapEventsComponent onClick={onClick} />

        {/* No mock markers - using real data from ProductionMapComponent */}

        {children}
      </MapContainer>

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
        Powered by Mapbox
      </div>
    </div>
  )
}
