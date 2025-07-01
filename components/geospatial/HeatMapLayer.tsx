"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GeospatialAnalysis, HeatMapData } from '@/lib/geospatial-analysis-service';
import { Loader2, Map, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface HeatMapLayerProps {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  onDataUpdate?: (data: HeatMapData[]) => void;
  className?: string;
}

type HeatMapCategory = "demand" | "competition" | "foot_traffic" | "revenue_potential";

const categoryConfig = {
  demand: {
    label: "Customer Demand",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    description: "Estimated customer demand based on demographics and economic factors"
  },
  competition: {
    label: "Competition Density",
    icon: TrendingUp,
    color: "from-red-500 to-orange-500",
    description: "Concentration of competing restaurants in the area"
  },
  foot_traffic: {
    label: "Foot Traffic",
    icon: Activity,
    color: "from-green-500 to-emerald-500",
    description: "Pedestrian traffic patterns and volume"
  },
  revenue_potential: {
    label: "Revenue Potential",
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
    description: "Estimated revenue opportunity based on multiple factors"
  }
};

export default function HeatMapLayer({ bounds, onDataUpdate, className }: HeatMapLayerProps) {
  const [selectedCategory, setSelectedCategory] = useState<HeatMapCategory>("demand");
  const [resolution, setResolution] = useState<number>(30);
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate heat map data
  const generateHeatMap = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await GeospatialAnalysis.generateHeatMap(bounds, selectedCategory, resolution);
      setHeatMapData(data);
      onDataUpdate?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate heat map');
      console.error('Heat map generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate on parameter changes
  useEffect(() => {
    generateHeatMap();
  }, [selectedCategory, resolution, JSON.stringify(bounds)]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (heatMapData.length === 0) return null;

    const values = heatMapData.map(point => point.value);
    const intensities = heatMapData.map(point => point.intensity);
    
    return {
      totalPoints: heatMapData.length,
      maxValue: Math.max(...values),
      minValue: Math.min(...values),
      avgValue: values.reduce((sum, val) => sum + val, 0) / values.length,
      maxIntensity: Math.max(...intensities),
      avgIntensity: intensities.reduce((sum, val) => sum + val, 0) / intensities.length,
      hotSpots: heatMapData.filter(point => point.intensity > 0.7).length
    };
  }, [heatMapData]);

  // Get intensity color
  const getIntensityColor = (intensity: number): string => {
    const config = categoryConfig[selectedCategory];
    const opacity = Math.max(0.1, intensity);
    
    if (intensity < 0.3) return `rgba(59, 130, 246, ${opacity})`; // Blue
    if (intensity < 0.6) return `rgba(34, 197, 94, ${opacity})`; // Green
    if (intensity < 0.8) return `rgba(251, 191, 36, ${opacity})`; // Yellow
    return `rgba(239, 68, 68, ${opacity})`; // Red
  };

  // Format value based on category
  const formatValue = (value: number, category: HeatMapCategory): string => {
    switch (category) {
      case "demand":
        return `${Math.round(value)} customers/day`;
      case "competition":
        return `${Math.round(value)} restaurants`;
      case "foot_traffic":
        return `${Math.round(value)} people/day`;
      case "revenue_potential":
        return `฿${Math.round(value).toLocaleString()}/month`;
      default:
        return Math.round(value).toString();
    }
  };

  const CategoryIcon = categoryConfig[selectedCategory].icon;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Heat Map Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Type</label>
              <Select value={selectedCategory} onValueChange={(value: HeatMapCategory) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution</label>
              <Select value={resolution.toString()} onValueChange={(value) => setResolution(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">Low (20x20)</SelectItem>
                  <SelectItem value="30">Medium (30x30)</SelectItem>
                  <SelectItem value="50">High (50x50)</SelectItem>
                  <SelectItem value="75">Ultra (75x75)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generateHeatMap} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Refresh Heat Map'
                )}
              </Button>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <CategoryIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{categoryConfig[selectedCategory].label}</p>
                <p className="text-xs text-muted-foreground">
                  {categoryConfig[selectedCategory].description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <span className="text-sm font-medium">Error:</span>
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {statistics && !loading && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Heat Map Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {statistics.totalPoints}
                </div>
                <div className="text-xs text-muted-foreground">Data Points</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatValue(statistics.maxValue, selectedCategory).split(' ')[0]}
                </div>
                <div className="text-xs text-muted-foreground">Peak Value</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatValue(statistics.avgValue, selectedCategory).split(' ')[0]}
                </div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.hotSpots}
                </div>
                <div className="text-xs text-muted-foreground">Hot Spots</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Intensity Range:</span>
                <span>{Math.round(statistics.maxIntensity * 100)}% max</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Intensity:</span>
                <span>{Math.round(statistics.avgIntensity * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heat Map Visualization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Heat Map Visualization</span>
            <Badge variant="outline">
              {heatMapData.length} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Generating heat map...</p>
              </div>
            </div>
          ) : heatMapData.length > 0 ? (
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Intensity Scale:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-blue-500 opacity-30"></div>
                    <span className="text-xs">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-green-500 opacity-60"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-yellow-500 opacity-80"></div>
                    <span className="text-xs">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-xs">Peak</span>
                  </div>
                </div>
              </div>

              {/* Simplified Grid Visualization */}
              <div className="relative bg-gray-50 rounded-lg p-4 min-h-[300px]">
                <div className="grid grid-cols-10 gap-1 h-full">
                  {Array.from({ length: 100 }, (_, i) => {
                    const dataPoint = heatMapData[Math.floor(i * heatMapData.length / 100)];
                    const intensity = dataPoint?.intensity || 0;
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-sm transition-all hover:scale-110 cursor-pointer"
                        style={{ backgroundColor: getIntensityColor(intensity) }}
                        title={dataPoint ? formatValue(dataPoint.value, selectedCategory) : 'No data'}
                      />
                    );
                  })}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                    <CategoryIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{categoryConfig[selectedCategory].label}</p>
                    <p className="text-xs text-muted-foreground">Interactive heat map visualization</p>
                  </div>
                </div>
              </div>

              {/* Top Hot Spots */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Top Hot Spots</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {heatMapData
                    .sort((a, b) => b.intensity - a.intensity)
                    .slice(0, 5)
                    .map((point, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getIntensityColor(point.intensity) }}
                          />
                          <span>
                            {point.coordinates[0].toFixed(4)}, {point.coordinates[1].toFixed(4)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatValue(point.value, selectedCategory)}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(point.intensity * 100)}% intensity
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No heat map data available</p>
                <p className="text-sm">Try adjusting the bounds or category</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}