/**
 * Location Intelligence Service
 * Frontend service for communicating with the Foursquare API backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface LocationData {
  lat: number
  lng: number
}

export interface VenueSearchParams {
  location: LocationData
  radius?: number
  categories?: string[]
  limit?: number
  sort?: 'popularity' | 'distance' | 'rating'
  price_range?: [number, number]
}

export interface CompetitorAnalysisParams {
  location: LocationData
  radius?: number
  restaurant_type?: string
}

export interface FootTrafficParams {
  location: LocationData
  radius?: number
  include_demographics?: boolean
}

export interface LocalEventsParams {
  location: LocationData
  radius_km?: number
  days_ahead?: number
  min_impact_score?: number
}

export interface BatchAnalysisParams {
  locations: LocationData[]
  analysis_type: 'competitor' | 'traffic'
  radius?: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
  status: number
}

export interface ServiceHealth {
  service: string
  timestamp: string
  overall_status: 'healthy' | 'degraded' | 'unhealthy'
  components: {
    foursquare_api: {
      status: string
      api_accessible: boolean
    }
    cache: {
      connected: boolean
    }
    database: {
      status: string
    }
  }
}

export interface CacheStats {
  cache_stats: {
    connected: boolean
    uptime?: string
    used_memory?: string
    keyspace?: Record<string, any>
  }
  cache_metrics: {
    hit_rate: number
    miss_rate: number
    total_operations: number
  }
}

export interface UsageStats {
  foursquare_api: {
    total_requests: number
    total_errors: number
    error_rate: number
    last_request_time: string | null
  }
}

class LocationIntelligenceService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/location${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Get service health status
   */
  async getHealth(): Promise<ServiceHealth> {
    const response = await this.request<ServiceHealth>('/health')
    return response.data
  }

  /**
   * Get comprehensive location analysis for a restaurant
   */
  async getRestaurantAnalysis(
    restaurantId: string, 
    options: {
      radius?: number
      force_refresh?: boolean
      include_events?: boolean
    } = {}
  ): Promise<any> {
    const params = new URLSearchParams()
    if (options.radius) params.set('radius', options.radius.toString())
    if (options.force_refresh) params.set('force_refresh', 'true')
    if (options.include_events !== false) params.set('include_events', 'true')

    const response = await this.request<any>(
      `/restaurants/${restaurantId}/analysis?${params.toString()}`
    )
    return response.data
  }

  /**
   * Get competitor analysis for a location
   */
  async getCompetitorAnalysis(params: CompetitorAnalysisParams): Promise<any> {
    const response = await this.request<any>('/competitor-analysis', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.data
  }

  /**
   * Get foot traffic analysis for an area
   */
  async getFootTrafficAnalysis(params: FootTrafficParams): Promise<any> {
    const response = await this.request<any>('/foot-traffic', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.data
  }

  /**
   * Search for venues near a location
   */
  async searchVenues(params: VenueSearchParams): Promise<any> {
    const response = await this.request<any>('/venue-search', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.data
  }

  /**
   * Get local events for an area
   */
  async getLocalEvents(params: LocalEventsParams): Promise<any> {
    const response = await this.request<any>('/local-events', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.data
  }

  /**
   * Get detailed information about a specific venue
   */
  async getVenueDetails(venueId: string, includeStats = false): Promise<any> {
    const params = new URLSearchParams()
    if (includeStats) params.set('include_stats', 'true')

    const response = await this.request<any>(
      `/venue/${venueId}/details?${params.toString()}`
    )
    return response.data
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<CacheStats> {
    const response = await this.request<CacheStats>('/cache/stats')
    return response.data
  }

  /**
   * Clear cache for a specific area
   */
  async clearAreaCache(location: LocationData, radius: number): Promise<any> {
    const response = await this.request<any>('/cache/clear', {
      method: 'DELETE',
      body: JSON.stringify({ location, radius }),
    })
    return response.data
  }

  /**
   * Get API usage statistics
   */
  async getUsageStats(): Promise<UsageStats> {
    const response = await this.request<UsageStats>('/usage-stats')
    return response.data
  }

  /**
   * Perform batch analysis for multiple locations
   */
  async batchAnalysis(params: BatchAnalysisParams): Promise<any> {
    const response = await this.request<any>('/batch-analysis', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.data
  }

  /**
   * Get real-time updates for a restaurant
   * This creates a polling mechanism for real-time data
   */
  createRealTimeUpdater(
    restaurantId: string,
    callback: (data: any) => void,
    intervalMs = 30000
  ): () => void {
    let isActive = true
    
    const poll = async () => {
      if (!isActive) return

      try {
        const data = await this.getRestaurantAnalysis(restaurantId, {
          force_refresh: false
        })
        callback(data)
      } catch (error) {
        console.warn('Real-time update failed:', error)
      }

      if (isActive) {
        setTimeout(poll, intervalMs)
      }
    }

    // Start polling
    poll()

    // Return cleanup function
    return () => {
      isActive = false
    }
  }

  /**
   * Monitor service health with periodic checks
   */
  createHealthMonitor(
    callback: (health: ServiceHealth) => void,
    intervalMs = 60000
  ): () => void {
    let isActive = true
    
    const check = async () => {
      if (!isActive) return

      try {
        const health = await this.getHealth()
        callback(health)
      } catch (error) {
        console.warn('Health check failed:', error)
        callback({
          service: 'LocationIntelligenceService',
          timestamp: new Date().toISOString(),
          overall_status: 'unhealthy',
          components: {
            foursquare_api: { status: 'error', api_accessible: false },
            cache: { connected: false },
            database: { status: 'unknown' }
          }
        })
      }

      if (isActive) {
        setTimeout(check, intervalMs)
      }
    }

    // Start monitoring
    check()

    // Return cleanup function
    return () => {
      isActive = false
    }
  }

  /**
   * Batch operations helper
   */
  async batchRequests<T>(
    requests: Array<() => Promise<T>>,
    concurrency = 3
  ): Promise<Array<T | Error>> {
    const results: Array<T | Error> = []
    const executing: Array<Promise<void>> = []

    for (const request of requests) {
      const promise = request()
        .then(result => {
          results.push(result)
        })
        .catch(error => {
          results.push(error)
        })

      executing.push(promise)

      if (executing.length >= concurrency) {
        await Promise.race(executing)
        executing.splice(executing.findIndex(p => p === promise), 1)
      }
    }

    await Promise.all(executing)
    return results
  }

  /**
   * Get cached or fresh data with fallback
   */
  async getCachedOrFresh<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    maxAgeMs = 300000 // 5 minutes
  ): Promise<T> {
    // Check if we have cached data in localStorage
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        const age = Date.now() - timestamp
        
        if (age < maxAgeMs) {
          return data
        }
      } catch (error) {
        console.warn('Failed to parse cached data:', error)
      }
    }

    // Fetch fresh data
    const freshData = await fetchFn()
    
    // Cache the fresh data
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: freshData,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }

    return freshData
  }

  /**
   * Clear all cached data
   */
  clearLocalCache(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('location_intelligence_')) {
        localStorage.removeItem(key)
      }
    })
  }
}

// Export singleton instance
export const locationIntelligenceService = new LocationIntelligenceService()

// Export class for custom instances
export default LocationIntelligenceService