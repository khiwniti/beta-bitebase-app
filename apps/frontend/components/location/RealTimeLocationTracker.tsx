'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Activity
} from 'lucide-react'
import { useLocationBasedRestaurants } from '../../hooks/useRestaurantData'

interface RealTimeLocationTrackerProps {
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
  onRestaurantsUpdate?: (restaurants: any[]) => void;
  autoStart?: boolean;
  showRestaurants?: boolean;
  className?: string;
}

export default function RealTimeLocationTracker({
  onLocationUpdate,
  onRestaurantsUpdate,
  autoStart = false,
  showRestaurants = true,
  className = ''
}: RealTimeLocationTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [trackingError, setTrackingError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null)
  const [updateCount, setUpdateCount] = useState(0)

  const {
    restaurants,
    loading,
    error,
    userLocation,
    searchRadius,
    bufferRadius,
    autoAdjustRadius,
    searchMetrics,
    sessionId,
    updateUserLocationOnBackend,
    setSearchRadius,
    setBufferRadius,
    setAutoAdjustRadius
  } = useLocationBasedRestaurants()

  // Start real-time location tracking
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setTrackingError('Geolocation is not supported by this browser')
      return
    }

    setIsTracking(true)
    setTrackingError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // 30 seconds
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      setLocationAccuracy(position.coords.accuracy)
      setLastUpdate(new Date())
      setUpdateCount(prev => prev + 1)

      // Update location with enhanced backend integration
      updateUserLocationOnBackend(position.coords, {
        auto_search: autoAdjustRadius,
        search_radius: searchRadius,
        include_nearby: showRestaurants,
        use_streaming: true
      })

      // Notify parent components
      onLocationUpdate?.(location)
      if (showRestaurants && restaurants.length > 0) {
        onRestaurantsUpdate?.(restaurants)
      }
    }

    const handleError = (error: GeolocationPositionError) => {
      console.error('Location tracking error:', error)
      setTrackingError(`Location error: ${error.message}`)
      setIsTracking(false)
    }

    // Start watching position
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options)
    setWatchId(id)
  }, [
    autoAdjustRadius, 
    searchRadius, 
    showRestaurants, 
    updateUserLocationOnBackend, 
    onLocationUpdate, 
    onRestaurantsUpdate, 
    restaurants
  ])

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
    setTrackingError(null)
  }, [watchId])

  // Auto-start tracking if enabled
  useEffect(() => {
    if (autoStart) {
      startTracking()
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [autoStart, startTracking, watchId])

  const getAccuracyStatus = () => {
    if (!locationAccuracy) return { status: 'unknown', color: 'gray' }
    if (locationAccuracy <= 10) return { status: 'excellent', color: 'green' }
    if (locationAccuracy <= 50) return { status: 'good', color: 'blue' }
    if (locationAccuracy <= 100) return { status: 'fair', color: 'yellow' }
    return { status: 'poor', color: 'red' }
  }

  const accuracyStatus = getAccuracyStatus()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Navigation className="h-5 w-5 mr-2" />
            Real-Time Location Tracker
          </div>
          <div className="flex items-center space-x-2">
            {isTracking && (
              <Badge variant="default" className="bg-green-500">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
            <Badge variant="outline">
              Session: {sessionId.slice(-8)}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Real-time GPS tracking with automatic restaurant discovery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tracking Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!isTracking ? (
              <Button onClick={startTracking} disabled={loading}>
                <MapPin className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            ) : (
              <Button onClick={stopTracking} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Location Status</h4>
            {userLocation ? (
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Lat: {userLocation.lat.toFixed(6)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Lng: {userLocation.lng.toFixed(6)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className={`h-4 w-4 text-${accuracyStatus.color}-500 mr-2`} />
                  <span>Accuracy: {locationAccuracy ? `${Math.round(locationAccuracy)}m` : 'Unknown'}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {accuracyStatus.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                No location data
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Tracking Info</h4>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <span>Updates: {updateCount}</span>
              </div>
              {lastUpdate && (
                <div className="flex items-center text-sm">
                  <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Last: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              )}
              {searchMetrics && (
                <div className="flex items-center text-sm">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Search: {searchMetrics.search_time_ms}ms</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(trackingError || error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">
                {trackingError || error}
              </span>
            </div>
          </div>
        )}

        {/* Search Settings */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Search Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-600">Search Radius</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">{searchRadius}km</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-600">Buffer Radius</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={bufferRadius}
                  onChange={(e) => setBufferRadius(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">{bufferRadius}km</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoAdjust"
                checked={autoAdjustRadius}
                onChange={(e) => setAutoAdjustRadius(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="autoAdjust" className="text-sm">
                Auto-adjust radius
              </label>
            </div>
          </div>
        </div>

        {/* Restaurant Results */}
        {showRestaurants && restaurants.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">
              Nearby Restaurants ({restaurants.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {restaurants.slice(0, 5).map((restaurant, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{restaurant.name}</p>
                    <p className="text-xs text-gray-600">{restaurant.cuisine || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {restaurant.price_range || 'Unknown'}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(restaurant.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
