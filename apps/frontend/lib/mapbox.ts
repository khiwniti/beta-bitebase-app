/**
 * Mapbox API utilities for BiteBase
 * Replaces Google Maps API functionality with Mapbox services
 */

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || 'pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ'

export interface MapboxPlace {
  id: string
  place_name: string
  center: [number, number] // [longitude, latitude]
  place_type: string[]
  properties: {
    category?: string
    address?: string
    tel?: string
    website?: string
  }
  context?: Array<{
    id: string
    text: string
    short_code?: string
  }>
}

export interface GeocodeResult {
  latitude: number
  longitude: number
  formatted_address: string
  place_id: string
  place_name: string
  city?: string
  country?: string
  postal_code?: string
}

export interface PlaceSearchResult {
  id: string
  name: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  category: string
  phone?: string
  website?: string
  rating?: number
}

/**
 * Geocode an address using Mapbox Geocoding API
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&limit=1`

    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const feature = data.features[0]
      const [longitude, latitude] = feature.center

      // Extract city and country from context
      let city = ''
      let country = ''
      let postal_code = ''

      if (feature.context) {
        for (const ctx of feature.context) {
          if (ctx.id.startsWith('place.')) {
            city = ctx.text
          } else if (ctx.id.startsWith('country.')) {
            country = ctx.text
          } else if (ctx.id.startsWith('postcode.')) {
            postal_code = ctx.text
          }
        }
      }

      return {
        latitude,
        longitude,
        formatted_address: feature.place_name,
        place_id: feature.id,
        place_name: feature.place_name,
        city,
        country,
        postal_code
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult | null> {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&limit=1`

    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const feature = data.features[0]

      return {
        latitude,
        longitude,
        formatted_address: feature.place_name,
        place_id: feature.id,
        place_name: feature.place_name
      }
    }

    return null
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

/**
 * Search for places near a location using Mapbox Search API
 */
export async function searchNearbyPlaces(
  latitude: number,
  longitude: number,
  query: string = 'restaurant',
  radius: number = 1000, // meters
  limit: number = 20
): Promise<PlaceSearchResult[]> {
  try {
    // Use Mapbox Search API for POI search
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
      `access_token=${MAPBOX_TOKEN}&` +
      `proximity=${longitude},${latitude}&` +
      `limit=${limit}&` +
      `types=poi`

    const response = await fetch(url)
    const data = await response.json()

    if (data.features) {
      return data.features
        .filter((feature: MapboxPlace) => {
          // Filter by distance if needed
          const [lng, lat] = feature.center
          const distance = calculateDistance(latitude, longitude, lat, lng)
          return distance <= radius
        })
        .map((feature: MapboxPlace) => ({
          id: feature.id,
          name: feature.place_name.split(',')[0], // Get just the name part
          address: feature.place_name,
          coordinates: {
            latitude: feature.center[1],
            longitude: feature.center[0]
          },
          category: feature.properties?.category || 'restaurant',
          phone: feature.properties?.tel,
          website: feature.properties?.website
        }))
    }

    return []
  } catch (error) {
    console.error('Place search error:', error)
    return []
  }
}

/**
 * Get detailed information about a specific place
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null> {
  try {
    // Mapbox doesn't have a direct place details API like Google Maps
    // We'll use the place ID to get basic information
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeId}.json?access_token=${MAPBOX_TOKEN}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const feature = data.features[0]

      return {
        id: feature.id,
        name: feature.place_name.split(',')[0],
        address: feature.place_name,
        coordinates: {
          latitude: feature.center[1],
          longitude: feature.center[0]
        },
        category: feature.properties?.category || 'restaurant',
        phone: feature.properties?.tel,
        website: feature.properties?.website
      }
    }

    return null
  } catch (error) {
    console.error('Place details error:', error)
    return null
  }
}

/**
 * Calculate distance between two coordinates in meters
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

/**
 * Get map style URL for Mapbox
 */
export function getMapboxStyleUrl(style: 'streets' | 'light' | 'dark' | 'satellite' | 'outdoors' = 'streets'): string {
  const styleMap = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12'
  }

  return styleMap[style]
}

/**
 * Get tile URL for Leaflet integration
 */
export function getMapboxTileUrl(style: 'streets' | 'light' | 'dark' | 'satellite' | 'outdoors' = 'streets'): string {
  const styleMap = {
    streets: 'streets-v12',
    light: 'light-v11',
    dark: 'dark-v11',
    satellite: 'satellite-v9',
    outdoors: 'outdoors-v12'
  }

  return `https://api.mapbox.com/styles/v1/mapbox/${styleMap[style]}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
}

export { MAPBOX_TOKEN }
