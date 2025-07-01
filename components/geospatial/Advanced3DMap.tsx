"use client"

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Select } from '../ui/select'
import { 
  Map as MapIcon, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Navigation,
  Building,
  Thermometer,
  Clock,
  DollarSign
} from 'lucide-react'

// Ensure Mapbox token is set
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'your-mapbox-token-here'

interface Advanced3DMapProps {
  className?: string;
  initialLocation?: [number, number];
  restaurantId?: string;
}

interface LayerConfig {
  id: string;
  name: string;
  type: 'heatmap' | 'markers' | '3d-buildings' | 'demographic' | 'traffic';
  visible: boolean;
  color: string;
  icon: React.ReactNode;
}

interface RestaurantMarker {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'competitor' | 'own' | 'potential';
  cuisine: string[];
  priceRange: number;
  rating: number;
  footTraffic: number;
  revenue?: number;
}

interface DemographicData {
  area: string;
  coordinates: [number, number];
  population: number;
  medianIncome: number;
  ageGroups: Record<string, number>;
  diningFrequency: number;
}

export default function Advanced3DMap({ 
  className = "",
  initialLocation = [-74.0060, 40.7128], // NYC default
  restaurantId
}: Advanced3DMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('overview')
  const [activeLayers, setActiveLayers] = useState<LayerConfig[]>([
    {
      id: 'competitors',
      name: 'Competitors',
      type: 'markers',
      visible: true,
      color: '#ef4444',
      icon: <Building className="w-4 h-4" />
    },
    {
      id: 'foot-traffic',
      name: 'Foot Traffic',
      type: 'heatmap',
      visible: true,
      color: '#3b82f6',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'demographics',
      name: 'Demographics',
      type: 'demographic',
      visible: false,
      color: '#10b981',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'buildings',
      name: '3D Buildings',
      type: '3d-buildings',
      visible: true,
      color: '#6b7280',
      icon: <Building className="w-4 h-4" />
    }
  ])

  // Sample data - replace with real API calls
  const restaurantData: RestaurantMarker[] = [
    {
      id: 'competitor-1',
      name: 'Bella Vista Italian',
      coordinates: [-74.0070, 40.7130],
      type: 'competitor',
      cuisine: ['Italian'],
      priceRange: 3,
      rating: 4.2,
      footTraffic: 850
    },
    {
      id: 'competitor-2',
      name: 'Marco\'s Pizzeria',
      coordinates: [-74.0050, 40.7125],
      type: 'competitor',
      cuisine: ['Italian', 'Pizza'],
      priceRange: 2,
      rating: 4.0,
      footTraffic: 650
    },
    {
      id: 'own-restaurant',
      name: 'Your Restaurant',
      coordinates: [-74.0060, 40.7128],
      type: 'own',
      cuisine: ['Italian', 'Mediterranean'],
      priceRange: 3,
      rating: 4.5,
      footTraffic: 720,
      revenue: 125000
    }
  ]

  const demographicData: DemographicData[] = [
    {
      area: 'Financial District',
      coordinates: [-74.0060, 40.7128],
      population: 35000,
      medianIncome: 95000,
      ageGroups: { '25-34': 35, '35-44': 28, '45-54': 20, '55+': 17 },
      diningFrequency: 4.2
    }
  ]

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLocation,
      zoom: 15,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    })

    map.current.on('load', () => {
      setMapLoaded(true)
      initializeMapLayers()
      addInteractiveFeatures()
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const initializeMapLayers = () => {
    if (!map.current) return

    // Add 3D buildings layer
    map.current.addLayer({
      id: '3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    })

    // Add restaurant markers
    addRestaurantMarkers()
    
    // Add foot traffic heatmap
    addFootTrafficHeatmap()
    
    // Add demographic overlays
    addDemographicOverlays()
  }

  const addRestaurantMarkers = () => {
    if (!map.current) return

    restaurantData.forEach(restaurant => {
      const el = document.createElement('div')
      el.className = 'restaurant-marker'
      el.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 12px;
        background-color: ${
          restaurant.type === 'own' ? '#10b981' : 
          restaurant.type === 'competitor' ? '#ef4444' : 
          '#6b7280'
        };
      `
      
      el.innerHTML = restaurant.type === 'own' ? '★' : '•'

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-2">${restaurant.name}</h3>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span>Type:</span>
              <span class="capitalize">${restaurant.type}</span>
            </div>
            <div class="flex justify-between">
              <span>Cuisine:</span>
              <span>${restaurant.cuisine.join(', ')}</span>
            </div>
            <div class="flex justify-between">
              <span>Price:</span>
              <span>${'$'.repeat(restaurant.priceRange)}</span>
            </div>
            <div class="flex justify-between">
              <span>Rating:</span>
              <span>${restaurant.rating}/5 ⭐</span>
            </div>
            <div class="flex justify-between">
              <span>Foot Traffic:</span>
              <span>${restaurant.footTraffic}/day</span>
            </div>
            ${restaurant.revenue ? `
              <div class="flex justify-between">
                <span>Monthly Revenue:</span>
                <span>$${(restaurant.revenue / 1000).toFixed(0)}k</span>
              </div>
            ` : ''}
          </div>
        </div>
      `)

      new mapboxgl.Marker(el)
        .setLngLat(restaurant.coordinates)
        .setPopup(popup)
        .addTo(map.current!)
    })
  }

  const addFootTrafficHeatmap = () => {
    if (!map.current) return

    // Generate sample foot traffic data
    const footTrafficData = {
      type: 'FeatureCollection',
      features: restaurantData.map(restaurant => ({
        type: 'Feature',
        properties: {
          traffic: restaurant.footTraffic
        },
        geometry: {
          type: 'Point',
          coordinates: restaurant.coordinates
        }
      }))
    }

    map.current.addSource('foot-traffic', {
      type: 'geojson',
      data: footTrafficData as any
    })

    map.current.addLayer({
      id: 'foot-traffic-heatmap',
      type: 'heatmap',
      source: 'foot-traffic',
      maxzoom: 24,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'traffic'],
          0, 0,
          1000, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          24, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          24, 20
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          24, 0.5
        ]
      }
    })
  }

  const addDemographicOverlays = () => {
    if (!map.current) return

    demographicData.forEach((data, index) => {
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-2">${data.area}</h3>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span>Population:</span>
              <span>${(data.population / 1000).toFixed(1)}k</span>
            </div>
            <div class="flex justify-between">
              <span>Median Income:</span>
              <span>$${(data.medianIncome / 1000).toFixed(0)}k</span>
            </div>
            <div class="flex justify-between">
              <span>Dining Frequency:</span>
              <span>${data.diningFrequency}x/week</span>
            </div>
            <div class="mt-2">
              <div class="text-xs font-medium mb-1">Age Distribution:</div>
              ${Object.entries(data.ageGroups).map(([age, percent]) => 
                `<div class="flex justify-between"><span>${age}:</span><span>${percent}%</span></div>`
              ).join('')}
            </div>
          </div>
        </div>
      `)

      // Create demographic overlay circle
      const circle = {
        type: 'Feature',
        properties: {
          income: data.medianIncome,
          population: data.population
        },
        geometry: {
          type: 'Point',
          coordinates: data.coordinates
        }
      }

      map.current!.addSource(`demographic-${index}`, {
        type: 'geojson',
        data: circle as any
      })

      map.current!.addLayer({
        id: `demographic-circle-${index}`,
        type: 'circle',
        source: `demographic-${index}`,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            10000, 20,
            100000, 50
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'income'],
            30000, '#fee2e2',
            60000, '#fbbf24',
            100000, '#10b981'
          ],
          'circle-opacity': 0.3,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#10b981'
        }
      })
    })
  }

  const addInteractiveFeatures = () => {
    if (!map.current) return

    // Add drawing controls for catchment area analysis
    map.current.on('click', (e) => {
      console.log('Clicked coordinates:', e.lngLat)
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    
    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
  }

  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    )

    if (map.current) {
      const layer = activeLayers.find(l => l.id === layerId)
      if (layer) {
        const visibility = layer.visible ? 'none' : 'visible'
        
        // Handle different layer types
        switch (layerId) {
          case 'foot-traffic':
            map.current.setLayoutProperty('foot-traffic-heatmap', 'visibility', visibility)
            break
          case 'buildings':
            map.current.setLayoutProperty('3d-buildings', 'visibility', visibility)
            break
          case 'demographics':
            demographicData.forEach((_, index) => {
              map.current!.setLayoutProperty(`demographic-circle-${index}`, 'visibility', visibility)
            })
            break
        }
      }
    }
  }

  const analysisOptions = [
    { value: 'overview', label: 'Market Overview' },
    { value: 'competition', label: 'Competitive Analysis' },
    { value: 'demographics', label: 'Demographics Study' },
    { value: 'traffic', label: 'Foot Traffic Analysis' },
    { value: 'expansion', label: 'Expansion Opportunities' }
  ]

  return (
    <div className={`relative h-full ${className}`}>
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      
      {/* Control Panel */}
      <Card className="absolute top-4 left-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <MapIcon className="w-4 h-4" />
            <span>Location Intelligence</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Analysis Type Selector */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Analysis Type
            </label>
            <select 
              value={selectedAnalysis}
              onChange={(e) => setSelectedAnalysis(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            >
              {analysisOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Layer Controls */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Layers className="w-3 h-3 mr-1" />
              Map Layers
            </h4>
            <div className="space-y-2">
              {activeLayers.map(layer => (
                <div key={layer.id} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayer(layer.id)}
                      className="w-3 h-3"
                    />
                    <span className="flex items-center space-x-1 text-xs">
                      {layer.icon}
                      <span>{layer.name}</span>
                    </span>
                  </label>
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: layer.color }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Market Insights</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-xs text-blue-600 font-medium">
                  <Users className="w-3 h-3 mx-auto mb-1" />
                  Foot Traffic
                </div>
                <div className="text-xs font-bold text-blue-800">2.1k/day</div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-xs text-green-600 font-medium">
                  <DollarSign className="w-3 h-3 mx-auto mb-1" />
                  Avg Income
                </div>
                <div className="text-xs font-bold text-green-800">$95k</div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center">
                <div className="text-xs text-red-600 font-medium">
                  <Building className="w-3 h-3 mx-auto mb-1" />
                  Competitors
                </div>
                <div className="text-xs font-bold text-red-800">12 nearby</div>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <div className="text-xs text-purple-600 font-medium">
                  <TrendingUp className="w-3 h-3 mx-auto mb-1" />
                  Market Score
                </div>
                <div className="text-xs font-bold text-purple-800">8.2/10</div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          {selectedAnalysis === 'competition' && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Competitive Analysis</h4>
              <div className="space-y-2">
                {restaurantData.filter(r => r.type === 'competitor').map(competitor => (
                  <div key={competitor.id} className="bg-gray-50 p-2 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium">{competitor.name}</span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {competitor.rating}★
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      {competitor.cuisine.join(', ')} • {'$'.repeat(competitor.priceRange)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {competitor.footTraffic} daily visitors
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              size="sm" 
              className="w-full text-xs"
              onClick={() => {
                // Generate detailed report
                console.log('Generating detailed report...')
              }}
            >
              Generate Detailed Report
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => {
                // Export data
                console.log('Exporting map data...')
              }}
            >
              Export Map Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tools */}
      <Card className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="text-xs">
              <Navigation className="w-3 h-3 mr-1" />
              Measure Distance
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Draw Catchment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}
    </div>
  )
}