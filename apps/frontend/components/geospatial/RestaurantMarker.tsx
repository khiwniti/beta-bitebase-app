"use client"

import React from 'react'

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  position: [number, number]
  address?: string
  priceRange?: string
}

interface RestaurantMarkerProps {
  restaurant: Restaurant
  onClick?: () => void
}

export function RestaurantMarker({ restaurant, onClick }: RestaurantMarkerProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  
  return (
    <div 
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Marker */}
      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform">
        <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">🍽️</span>
        </div>
      </div>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-48">
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {restaurant.name}
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {restaurant.cuisine}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <span className="text-yellow-500">⭐</span>
                <span className="ml-1 text-gray-700">{restaurant.rating}</span>
              </div>
              {restaurant.priceRange && (
                <span className="text-green-600 font-medium">
                  {restaurant.priceRange}
                </span>
              )}
            </div>
            {restaurant.address && (
              <div className="text-xs text-gray-500 mt-1 truncate">
                {restaurant.address}
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </div>
  )
}
