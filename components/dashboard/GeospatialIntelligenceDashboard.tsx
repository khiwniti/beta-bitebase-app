"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  GeospatialAnalysis, 
  HeatMapData, 
  CompetitorAnalysis, 
  CatchmentArea, 
  SpatialCluster 
} from '@/lib/geospatial-analysis-service';
import HeatMapLayer from '@/components/geospatial/HeatMapLayer';
import { 
  Map, 
  Target, 
  Users, 
  TrendingUp, 
  MapPin, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';

interface GeospatialIntelligenceDashboardProps {
  className?: string;
}

export default function GeospatialIntelligenceDashboard({ className }: GeospatialIntelligenceDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("heatmap");
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([13.7563, 100.5018]); // Bangkok
  const [analysisRadius, setAnalysisRadius] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [catchmentArea, setCatchmentArea] = useState<CatchmentArea | null>(null);
  const [spatialClusters, setSpatialClusters] = useState<SpatialCluster[]>([]);

  // Map bounds for Bangkok area
  const mapBounds = {
    north: selectedLocation[0] + 0.05,
    south: selectedLocation[0] - 0.05,
    east: selectedLocation[1] + 0.05,
    west: selectedLocation[1] - 0.05
  };

  // Load all geospatial data
  const loadGeospatialData = async () => {
    setLoading(true);
    try {
      // Load competitor analysis
      const competitors = await GeospatialAnalysis.analyzeCompetitors(selectedLocation, analysisRadius);
      setCompetitorAnalysis(competitors);

      // Load catchment area
      const catchment = await GeospatialAnalysis.analyzeCatchmentArea(selectedLocation);
      setCatchmentArea(catchment);

      // Generate mock restaurant data for clustering
      const mockRestaurants = Array.from({ length: 30 }, (_, i) => ({
        id: `restaurant_${i}`,
        name: `Restaurant ${i + 1}`,
        coordinates: [
          selectedLocation[0] + (Math.random() - 0.5) * 0.02,
          selectedLocation[1] + (Math.random() - 0.5) * 0.02
        ],
        cuisine: ["Thai", "Italian", "Japanese", "American", "Chinese"][Math.floor(Math.random() * 5)],
        rating: 3 + Math.random() * 2,
        price_range: Math.floor(Math.random() * 4) + 1
      }));

      // Load spatial clusters
      const clusters = await GeospatialAnalysis.performSpatialClustering(mockRestaurants);
      setSpatialClusters(clusters);

    } catch (error) {
      console.error('Failed to load geospatial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and location change
  useEffect(() => {
    loadGeospatialData();
  }, [selectedLocation, analysisRadius]);

  // Format coordinates for display
  const formatCoordinates = (coords: [number, number]) => {
    return `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
  };

  // Get threat level color
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-orange-600 bg-orange-50";
      case "critical": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Map className="h-6 w-6" />
            Geospatial Intelligence
          </h2>
          <p className="text-muted-foreground">
            Advanced location-based market analysis and competitive intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadGeospatialData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Location Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Analysis Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Location</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={selectedLocation[0]}
                  onChange={(e) => setSelectedLocation([parseFloat(e.target.value) || 0, selectedLocation[1]])}
                  className="flex-1"
                />
                <Input
                  placeholder="Longitude"
                  value={selectedLocation[1]}
                  onChange={(e) => setSelectedLocation([selectedLocation[0], parseFloat(e.target.value) || 0])}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Radius</label>
              <Select value={analysisRadius.toString()} onValueChange={(value) => setAnalysisRadius(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 km</SelectItem>
                  <SelectItem value="2">2 km</SelectItem>
                  <SelectItem value="3">3 km</SelectItem>
                  <SelectItem value="5">5 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={loadGeospatialData} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Analyze Location
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Heat Maps
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Competitors
          </TabsTrigger>
          <TabsTrigger value="catchment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Catchment
          </TabsTrigger>
          <TabsTrigger value="clusters" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Clusters
          </TabsTrigger>
        </TabsList>

        {/* Heat Map Analysis */}
        <TabsContent value="heatmap" className="space-y-4">
          <HeatMapLayer 
            bounds={mapBounds}
            onDataUpdate={setHeatMapData}
          />
        </TabsContent>

        {/* Competitor Analysis */}
        <TabsContent value="competitors" className="space-y-4">
          {competitorAnalysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Saturation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Market Saturation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {Math.round(competitorAnalysis.market_saturation.score * 100)}%
                    </div>
                    <Badge 
                      variant={competitorAnalysis.market_saturation.level === 'optimal' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {competitorAnalysis.market_saturation.level.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {competitorAnalysis.market_saturation.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Competitor Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Competitors
                    </span>
                    <Badge variant="outline">
                      {competitorAnalysis.competitors.length} found
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {competitorAnalysis.competitors.slice(0, 8).map((competitor, index) => (
                      <div key={competitor.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{competitor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {competitor.distance_km.toFixed(2)} km away
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className={getThreatLevelColor(competitor.threat_level)}
                          >
                            {competitor.threat_level}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {Math.round(competitor.similarity_score * 100)}% similar
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Opportunity Zones */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Opportunity Zones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {competitorAnalysis.opportunity_zones.map((zone, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Zone {index + 1}</span>
                          <Badge variant="outline">
                            {Math.round(zone.opportunity_score * 100)}% score
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {formatCoordinates(zone.coordinates)}
                        </div>
                        <div className="space-y-1">
                          {zone.reasons.map((reason, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Analyzing competitors...</p>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No competitor analysis available</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Catchment Area Analysis */}
        <TabsContent value="catchment" className="space-y-4">
          {catchmentArea ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Potential */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Market Potential
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {catchmentArea.market_potential.estimated_daily_customers}
                      </div>
                      <div className="text-xs text-muted-foreground">Daily Customers</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ฿{Math.round(catchmentArea.market_potential.revenue_potential / 1000)}K
                      </div>
                      <div className="text-xs text-muted-foreground">Monthly Revenue</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Addressable Market:</span>
                      <span>฿{Math.round(catchmentArea.market_potential.total_addressable_market).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level:</span>
                      <span>{Math.round(catchmentArea.market_potential.confidence_level * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Primary Zone ({catchmentArea.primary_zone.radius_km}km)</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Population:</span>
                          <span>{catchmentArea.primary_zone.population.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Spending Power:</span>
                          <span>฿{Math.round(catchmentArea.primary_zone.spending_power).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Secondary Zone ({catchmentArea.secondary_zone.radius_km}km)</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Population:</span>
                          <span>{catchmentArea.secondary_zone.population.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Spending Power:</span>
                          <span>฿{Math.round(catchmentArea.secondary_zone.spending_power).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accessibility */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Accessibility Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.round(catchmentArea.accessibility.public_transport_score)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Public Transport</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.round(catchmentArea.accessibility.parking_availability)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Parking</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.round(catchmentArea.accessibility.walkability_score)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Walkability</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.round(catchmentArea.accessibility.traffic_congestion)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Traffic</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Analyzing catchment area...</p>
                    </>
                  ) : (
                    <>
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No catchment analysis available</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Spatial Clusters */}
        <TabsContent value="clusters" className="space-y-4">
          {spatialClusters.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {spatialClusters.map((cluster) => (
                <Card key={cluster.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {cluster.id.replace('_', ' ').toUpperCase()}
                      </span>
                      <Badge variant="outline">
                        {cluster.restaurants.length} restaurants
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Center: {formatCoordinates(cluster.center)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Dominant Cuisine:</span>
                        <span className="font-medium">{cluster.characteristics.dominant_cuisine}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg Rating:</span>
                        <span className="font-medium">{cluster.characteristics.avg_rating}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg Price Range:</span>
                        <span className="font-medium">{'$'.repeat(Math.round(cluster.characteristics.avg_price_range))}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Market Dynamics</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Competition:</span>
                          <span>{Math.round(cluster.market_dynamics.competition_intensity * 100)}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Growth Potential:</span>
                          <span>{Math.round(cluster.market_dynamics.growth_potential * 100)}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Customer Loyalty:</span>
                          <span>{Math.round(cluster.market_dynamics.customer_loyalty * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Analyzing spatial clusters...</p>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No spatial clusters available</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}