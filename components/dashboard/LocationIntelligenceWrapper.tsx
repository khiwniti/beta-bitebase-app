"use client"

import React, { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Wifi, 
  WifiOff,
  Settings,
  BarChart3
} from 'lucide-react'
import EnhancedLocationIntelligenceDashboard from './EnhancedLocationIntelligenceDashboard'
import { locationIntelligenceService } from '../../lib/location-intelligence-service'

interface LocationIntelligenceWrapperProps {
  restaurantId?: string
  onServiceStatusChange?: (status: 'healthy' | 'degraded' | 'unhealthy') => void
}

export default function LocationIntelligenceWrapper({
  restaurantId = 'demo-restaurant-id',
  onServiceStatusChange
}: LocationIntelligenceWrapperProps) {
  const [serviceHealth, setServiceHealth] = useState<any>(null)
  const [locationData, setLocationData] = useState<any>(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check service configuration and health
  useEffect(() => {
    const checkServiceHealth = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const health = await locationIntelligenceService.getHealth()
        setServiceHealth(health)
        setIsConfigured(health.overall_status !== 'unhealthy')
        onServiceStatusChange?.(health.overall_status)
        
      } catch (err) {
        console.error('Service health check failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsConfigured(false)
        onServiceStatusChange?.('unhealthy')
      } finally {
        setIsLoading(false)
      }
    }

    checkServiceHealth()

    // Set up periodic health monitoring
    const healthMonitorCleanup = locationIntelligenceService.createHealthMonitor(
      (health) => {
        setServiceHealth(health)
        setIsConfigured(health.overall_status !== 'unhealthy')
        onServiceStatusChange?.(health.overall_status)
      },
      60000 // Check every minute
    )

    return healthMonitorCleanup
  }, [onServiceStatusChange])

  const handleLocationDataChange = (data: any) => {
    setLocationData(data)
  }

  const renderServiceStatus = () => {
    if (!serviceHealth) return null

    const { overall_status, components } = serviceHealth
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Location Intelligence Service
            </CardTitle>
            <Badge variant={
              overall_status === 'healthy' ? 'default' : 
              overall_status === 'degraded' ? 'secondary' : 
              'destructive'
            }>
              {overall_status}
            </Badge>
          </div>
          <CardDescription>
            Real-time location analytics powered by Foursquare API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Foursquare API Status */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`p-2 rounded-full ${
                components.foursquare_api?.api_accessible 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {components.foursquare_api?.api_accessible ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm">Foursquare API</div>
                <div className="text-xs text-gray-500">
                  {components.foursquare_api?.api_accessible ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>

            {/* Cache Status */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`p-2 rounded-full ${
                components.cache?.connected 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {components.cache?.connected ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm">Cache</div>
                <div className="text-xs text-gray-500">
                  {components.cache?.connected ? 'Available' : 'Unavailable'}
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`p-2 rounded-full ${
                components.database?.status === 'healthy' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {components.database?.status === 'healthy' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm">Database</div>
                <div className="text-xs text-gray-500">
                  {components.database?.status || 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderConfigurationHelp = () => (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Settings className="h-5 w-5" />
          Service Configuration Required
        </CardTitle>
        <CardDescription className="text-yellow-700">
          The Location Intelligence service needs to be configured before you can view location analytics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-yellow-800">
            <p className="mb-3">To enable location intelligence features, ensure the following:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Foursquare API key is configured in backend environment</li>
              <li>Location intelligence service is running</li>
              <li>Database connection is established</li>
              <li>Redis cache is available (optional but recommended)</li>
            </ul>
          </div>
          
          <div className="pt-4 border-t border-yellow-200">
            <p className="text-sm text-yellow-700 mb-3">
              <strong>Quick Setup:</strong>
            </p>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Add <code className="bg-yellow-100 px-1 rounded">FOURSQUARE_API_KEY</code> to your backend .env file</li>
              <li>Start the backend server: <code className="bg-yellow-100 px-1 rounded">npm run dev</code></li>
              <li>Refresh this page to connect to the service</li>
            </ol>
          </div>

          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Check Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderError = () => (
    <Alert className="border-red-200 bg-red-50 mb-6">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>Service Connection Error:</strong> {error}
        <div className="mt-2">
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
            className="mr-2"
          >
            Retry Connection
          </Button>
          <Button 
            onClick={() => setError(null)} 
            variant="ghost" 
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )

  const renderLocationSummary = () => {
    if (!locationData) return null

    return (
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <MapPin className="h-5 w-5" />
            Current Location Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-blue-600 font-medium">Location Score</div>
              <div className="text-2xl font-bold text-blue-800">{locationData.location_score}/100</div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">Daily Traffic</div>
              <div className="text-2xl font-bold text-blue-800">
                {locationData.foot_traffic?.average_daily_visits?.toLocaleString() || '0'}
              </div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">Competitors</div>
              <div className="text-2xl font-bold text-blue-800">
                {locationData.competitor_analysis?.total_competitors || '0'}
              </div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">Events</div>
              <div className="text-2xl font-bold text-blue-800">
                {locationData.local_events?.total_events || '0'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Checking location intelligence service...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Service Status */}
      {renderServiceStatus()}

      {/* Error Display */}
      {error && renderError()}

      {/* Location Summary */}
      {renderLocationSummary()}

      {/* Main Content */}
      {isConfigured ? (
        <EnhancedLocationIntelligenceDashboard
          restaurantId={restaurantId}
          onLocationChange={handleLocationDataChange}
        />
      ) : (
        renderConfigurationHelp()
      )}

      {/* Degraded Service Warning */}
      {serviceHealth?.overall_status === 'degraded' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Service Degraded:</strong> Some features may be limited. 
            {!serviceHealth.components.cache?.connected && ' Caching is unavailable, which may result in slower performance.'}
            {!serviceHealth.components.foursquare_api?.api_accessible && ' Foursquare API is not accessible.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}