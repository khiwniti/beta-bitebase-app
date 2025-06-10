"use client"

import * as React from "react"
import { Button } from "@bitebase/ui"
import { Input } from "@bitebase/ui"
import { Label } from "@bitebase/ui"
import { MapContainer } from "../../components/geospatial/MapContainer"
import { RestaurantMarker } from "../../components/geospatial/RestaurantMarker"
import { AnalysisOverlay } from "../../components/geospatial/AnalysisOverlay"
import { DemographicLayer } from "../../components/geospatial/DemographicLayer"
import { MapPin, BarChart3, Users, DollarSign, TrendingUp, Filter, Download, RefreshCw, Eye, Target, Star, Clock } from "lucide-react"

import { MetricCard, ChartCard, InsightCard, DashboardSection } from "../../components/dashboard/DashboardGrid"
import { DataTable } from "../../components/ui/data-table"
import { ChartContainer, SimpleLineChart, SimpleBarChart } from "../../components/ui/chart-container"

// Production data interfaces
interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  position: [number, number]
  address?: string
  priceRange?: string
}

interface Demographics {
  area: string
  population: number
  medianIncome: number
  ageGroups: {
    "18-25": number
    "26-35": number
    "36-50": number
    "51-65": number
    "65+": number
  }
  coordinates: [number, number][]
}

export default function MarketAnalysisPage() {
  const [selectedLocation, setSelectedLocation] = React.useState("Bangkok, Thailand")
  const [analysisType, setAnalysisType] = React.useState<"heatmap" | "density" | "competition" | "demographics">("heatmap")
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([])
  const [demographics, setDemographics] = React.useState<Demographics[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch real restaurant data
  const fetchRestaurants = React.useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${backendUrl}/api/restaurants?latitude=${lat}&longitude=${lng}&radius=5000`)

      if (response.ok) {
        const data = await response.json()
        const formattedRestaurants: Restaurant[] = (data.restaurants || []).map((r: any) => ({
          id: r.id.toString(),
          name: r.name,
          cuisine: r.cuisine || 'Unknown',
          rating: r.rating || 0,
          position: [r.latitude, r.longitude] as [number, number],
          address: r.address,
          priceRange: r.price_range
        }))
        setRestaurants(formattedRestaurants)
      } else {
        throw new Error('Failed to fetch restaurant data')
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError('Failed to load restaurant data')
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch demographics data from AI agent
  const fetchDemographics = React.useCallback(async (location: string) => {
    try {
      const aiAgentsUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:8080'
      const response = await fetch(`${aiAgentsUrl}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          cuisine_type: 'demographic analysis',
          additional_context: { analysis_type: 'demographics' }
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Parse demographics from AI response
        // For now, use default structure until AI provides structured data
        setDemographics([])
      }
    } catch (err) {
      console.error('Error fetching demographics:', err)
    }
  }, [])

  // Load data on component mount
  React.useEffect(() => {
    // Default Bangkok coordinates
    fetchRestaurants(13.7563, 100.5018)
    fetchDemographics(selectedLocation)
  }, [selectedLocation, fetchRestaurants, fetchDemographics])
  const [showDemographics, setShowDemographics] = React.useState(false)

  return (
    <div className="space-y-8">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => console.log('Save analysis')}>
            <Download className="w-4 h-4 mr-2" />
            Save Analysis
          </Button>
          <Button onClick={() => console.log('Generate report')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Analysis Controls */}
        <ChartCard
          title="Analysis Configuration"
          actions={[
            {
              label: "Reset",
              icon: <RefreshCw className="h-4 w-4" />,
              onClick: () => {
                setSelectedLocation("Bangkok, Thailand")
                setAnalysisType("heatmap")
              }
            }
          ]}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="location">Target Location</Label>
              <Input
                id="location"
                placeholder="e.g., Sukhumvit, Bangkok or 13.7563, 100.5018"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-input-theme"
              />
            </div>
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <div className="flex space-x-2">
                {(["heatmap", "density", "competition", "demographics"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={analysisType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnalysisType(type)}
                    className={analysisType === type ? "btn-tool-active" : "btn-tool-inactive"}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Layers</Label>
              <div className="flex space-x-2">
                <Button
                  variant={showDemographics ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowDemographics(!showDemographics)}
                  className={showDemographics ? "btn-tool-active" : "btn-tool-inactive"}
                >
                  Demographics
                </Button>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Main Analysis View */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map */}
          <ChartCard
            title="Interactive Market Map"
            actions={[
              {
                label: "Fullscreen",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => console.log('Fullscreen map')
              },
              {
                label: "Export Map",
                icon: <Download className="h-4 w-4" />,
                onClick: () => console.log('Export map')
              }
            ]}
          >
              <MapContainer
                center={[13.7563, 100.5018]}
                zoom={14}
                height="600px"
                className="relative"
              >
                <AnalysisOverlay type={analysisType} visible={true} />

                {/* Loading indicator */}
                {loading && (
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg z-10">
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm text-gray-700">Loading restaurants...</span>
                    </div>
                  </div>
                )}

                {/* Error indicator */}
                {error && (
                  <div className="absolute top-4 left-4 bg-red-50 border border-red-200 px-3 py-2 rounded-lg shadow-lg z-10">
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                {/* Restaurant count */}
                {!loading && !error && restaurants.length > 0 && (
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg z-10">
                    <span className="text-sm text-gray-700">
                      {restaurants.length} restaurants found
                    </span>
                  </div>
                )}

                {/* Demographics overlay */}
                {showDemographics && demographics.length > 0 && (
                  <DemographicLayer
                    data={demographics}
                    metric="population"
                    visible={true}
                  />
                )}

                {/* Real restaurant markers */}
                {restaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${50 + (index % 5 - 2) * 10}%`,
                      top: `${50 + (Math.floor(index / 5) % 5 - 2) * 10}%`,
                    }}
                    onClick={() => {
                      // Handle restaurant click for detailed analysis
                      console.log('Restaurant clicked:', restaurant)
                    }}
                  >
                    <RestaurantMarker restaurant={restaurant} />
                  </div>
                ))}
              </MapContainer>
            </ChartCard>

          {/* Analysis Results */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <DashboardSection
              title="Market Metrics"
              description="Key performance indicators for this location"
            >
              <div className="grid grid-cols-1 gap-4">
                <MetricCard
                  title="Market Opportunity"
                  value="8.5/10"
                  change={{ value: 12, period: "vs last month", trend: "up" as const }}
                  icon={<TrendingUp className="h-5 w-5" />}
                  actionLabel="Analyze"
                  onAction={() => console.log('Analyze opportunity')}
                />
                <MetricCard
                  title="Competition Density"
                  value="Medium"
                  description="3.2 restaurants per 1000 residents"
                  icon={<Users className="h-5 w-5" />}
                  actionLabel="View Competitors"
                  onAction={() => console.log('View competitors')}
                />
                <MetricCard
                  title="Foot Traffic"
                  value="15.2K"
                  change={{ value: 8, period: "vs last month", trend: "up" as const }}
                  description="Daily pedestrian count"
                  icon={<Eye className="h-5 w-5" />}
                  actionLabel="Traffic Analysis"
                  onAction={() => console.log('Traffic analysis')}
                />
                <MetricCard
                  title="Average Rating"
                  value="4.2"
                  change={{ value: 0.3, period: "vs last month", trend: "up" as const }}
                  description="Competitor average rating"
                  icon={<Star className="h-5 w-5" />}
                  actionLabel="Rating Analysis"
                  onAction={() => console.log('Rating analysis')}
                />
              </div>
            </DashboardSection>

            {/* AI Insights */}
            <DashboardSection
              title="AI Insights"
              description="AI-powered market analysis insights"
            >
              <div className="space-y-4">
                <InsightCard
                  type="opportunity"
                  title="Optimal Location"
                  description="Sukhumvit Soi 11 shows highest potential"
                  priority={1}
                  impact={"High" as const}
                  action="View Details"
                  onAction={() => console.log('View location details')}
                  icon={<Target className="w-5 h-5" />}
                />
                <InsightCard
                  type="opportunity"
                  title="Cuisine Gap"
                  description="Authentic Mexican cuisine underrepresented"
                  priority={2}
                  impact={"Medium" as const}
                  action="Explore Gap"
                  onAction={() => console.log('Explore cuisine gap')}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <InsightCard
                  type="info"
                  title="Peak Hours"
                  description="Lunch: 12-2pm, Dinner: 7-10pm, Late night: 10pm-1am"
                  priority={3}
                  impact={"Low" as const}
                  action="Optimize Schedule"
                  onAction={() => console.log('Optimize schedule')}
                  icon={<Clock className="w-5 h-5" />}
                />
              </div>
            </DashboardSection>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Trends Chart */}
          <ChartCard
            title="Market Trends"
            actions={[
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: () => console.log('Export chart')
              },
              {
                label: "Refresh",
                icon: <RefreshCw className="h-4 w-4" />,
                onClick: () => fetchRestaurants(13.7563, 100.5018)
              }
            ]}
          >
            <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Restaurant density and foot traffic trends</p>
            </div>
          </ChartCard>

          {/* Competition Analysis Chart */}
          <ChartCard
            title="Competition Analysis"
            actions={[
              {
                label: "Export",
                icon: <Download className="h-4 w-4" />,
                onClick: () => console.log('Export chart')
              },
              {
                label: "Refresh",
                icon: <RefreshCw className="h-4 w-4" />,
                onClick: () => fetchRestaurants(13.7563, 100.5018)
              }
            ]}
          >
            <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Restaurant distribution by cuisine type</p>
            </div>
          </ChartCard>
        </div>

        {/* Restaurant Analysis Table */}
        {restaurants.length > 0 && (
          <ChartCard
            title="Nearby Restaurants Analysis"
            actions={[
              {
                label: "Export Data",
                icon: <Download className="h-4 w-4" />,
                onClick: () => console.log('Export restaurant data')
              }
            ]}
          >
            <DataTable
              data={restaurants.slice(0, 20)}
              columns={[
                { key: 'name', title: 'Restaurant Name', sortable: true },
                { key: 'cuisine', title: 'Cuisine Type', sortable: true },
                {
                  key: 'rating',
                  title: 'Rating',
                  sortable: true,
                  render: (value: number) => (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {value || 'N/A'}
                    </div>
                  )
                },
                {
                  key: 'priceRange',
                  title: 'Price Range',
                  sortable: true,
                  render: (value: string) => value || 'Unknown'
                },
                {
                  key: 'address',
                  title: 'Address',
                  render: (value: string) => (
                    <span className="text-sm text-gray-600 truncate max-w-xs block">
                      {value || 'Address not available'}
                    </span>
                  )
                }
              ]}
              searchable={true}
              exportable={true}
              pagination={true}
              pageSize={10}
            />
          </ChartCard>
        )}

        {/* Market Insights Summary */}
        <ChartCard
          title="Market Analysis Summary"
          actions={[
            {
              label: "Export Insights",
              icon: <Download className="h-4 w-4" />,
              onClick: () => console.log('Export insights')
            }
          ]}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard
              type="opportunity"
              title="Growth Opportunity"
              description="High foot traffic area with moderate competition density"
              priority={1}
              impact={"High" as const}
              action="Analyze Location"
              onAction={() => console.log('Analyze location')}
              icon={<TrendingUp className="w-5 h-5" />}
            />

            <InsightCard
              type="info"
              title="Target Demographics"
              description="Young professionals and tourists dominate the area"
              priority={2}
              impact={"Medium" as const}
              action="View Demographics"
              onAction={() => console.log('View demographics')}
              icon={<Users className="w-5 h-5" />}
            />

            <InsightCard
              type="info"
              title="Peak Hours"
              description="Clear patterns in customer traffic throughout the day"
              priority={3}
              impact={"Low" as const}
              action="Optimize Hours"
              onAction={() => console.log('Optimize hours')}
              icon={<Clock className="w-5 h-5" />}
            />
          </div>
        </ChartCard>
      </div>
  )
}
