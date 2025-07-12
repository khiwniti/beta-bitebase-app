'use client'

import React, { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MAPBOX_TOKEN, getMapboxTileUrl } from '../../lib/mapbox'
import { Restaurant as ApiRestaurant } from '../../lib/api-client'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)

// Create a dynamic component for map events
const MapEventsComponent = dynamic(
  () => import('./MapEventsHandler'),
  { ssr: false }
)

// Use the Restaurant type from API client
type Restaurant = ApiRestaurant

interface ProductionMapComponentProps {
  center: [number, number]
  zoom: number
  className?: string
  onClick?: (e: any) => void
  children?: React.ReactNode
  selectedLocation?: { lat: number; lng: number; address: string } | null
  searchRadius?: number
}

export default function ProductionMapComponent({
  center,
  zoom,
  className = '',
  onClick,
  children,
  selectedLocation,
  searchRadius = 1000
}: ProductionMapComponentProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Import Leaflet on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)

      // Fix for default markers
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    })
  }, [])

  // Fetch real restaurant data using location-based search with Foursquare integration
  const fetchRestaurants = useCallback(async (lat: number, lng: number, radius: number) => {
    setLoading(true)
    setError(null)

    try {
      const { apiClient } = await import('../../lib/api-client')

      console.log(`🔍 Fetching restaurants near: ${lat}, ${lng} within ${radius}km`)

      // Use the new location-based search with Foursquare integration
      const response = await apiClient.searchRestaurantsByLocation(lat, lng, radius)

      if (response.data && response.data.length > 0) {
        console.log(`✅ Found ${response.data.length} real restaurants via Foursquare API`)
        setRestaurants(response.data)
      } else {
        console.warn('⚠️ No restaurants found, this might be expected for some locations')
        setRestaurants([])
      }
    } catch (err) {
      console.error('❌ Restaurant fetch error:', err)
      setError(`Failed to load restaurant data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch restaurants when center changes
  useEffect(() => {
    if (isClient && center) {
      fetchRestaurants(center[0], center[1], searchRadius)
    }
  }, [isClient, center, searchRadius, fetchRestaurants])

  // Create custom icons based on restaurant type
  const createRestaurantIcon = useCallback((restaurant: Restaurant) => {
    if (!L) return null

    const getColor = () => {
      switch (restaurant.cuisine?.toLowerCase()) {
        case 'italian': return '#e74c3c'
        case 'japanese': return '#9b59b6'
        case 'thai': return '#f39c12'
        case 'american': return '#3498db'
        case 'chinese': return '#e67e22'
        case 'indian': return '#e91e63'
        default: return '#27ae60'
      }
    }

    const color = getColor()
    const size = restaurant.rating && restaurant.rating > 4.5 ? 24 : 20

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
    })
  }, [L])

  if (!isClient) {
    // Loading state
    return (
      <div className={`relative ${className} bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">BiteBase Market Analysis</h3>
            <p className="text-gray-600 font-medium mb-1">Loading interactive map...</p>
            <p className="text-gray-500 text-sm mb-4">Powered by Mapbox & Real Data</p>
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

        {/* Search radius circle */}
        {selectedLocation && (
          <Circle
            center={[selectedLocation.lat, selectedLocation.lng]}
            radius={searchRadius}
            pathOptions={{
              color: '#74C365',
              fillColor: '#74C365',
              fillOpacity: 0.1,
              weight: 2
            }}
          />
        )}

        {/* Real restaurant markers */}
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
                  <p className="text-gray-600">
                    <span className="font-medium">Cuisine:</span> {restaurant.cuisine}
                  </p>
                  {restaurant.rating && (
                    <p className="text-gray-600">
                      <span className="font-medium">Rating:</span> ⭐ {restaurant.rating}
                    </p>
                  )}
                  {restaurant.price_range && (
                    <p className="text-gray-600">
                      <span className="font-medium">Price:</span> {restaurant.price_range}
                    </p>
                  )}
                  {restaurant.platform && (
                    <p className="text-gray-500 text-xs">
                      Source: {restaurant.platform}
                    </p>
                  )}
                </div>
                <button 
                  className="mt-3 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                  onClick={() => {
                    if (onClick) {
                      onClick({
                        latlng: { lat: restaurant.latitude, lng: restaurant.longitude },
                        restaurant: restaurant
                      })
                    }
                  }}
                >
                  Analyze Competition
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected location marker */}
        {selectedLocation && L && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={new L.DivIcon({
              className: 'selected-location-marker',
              html: `<div style="
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #ef4444;
                border: 4px solid white;
                box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                animation: pulse 2s infinite;
              "></div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Selected Location</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedLocation.address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {children}
      </MapContainer>

      {/* Status indicators */}
      <div className="absolute top-4 right-4 space-y-2">
        {loading && (
          <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
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

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
        Powered by Mapbox • Real Restaurant Data
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
