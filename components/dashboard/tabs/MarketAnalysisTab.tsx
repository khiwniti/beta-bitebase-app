"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  Search,
  Target,
  BarChart3,
  Zap,
  Utensils
} from "lucide-react";
import { useMarketAnalyses } from "@/hooks/useDashboardData";

interface MarketAnalysisTabProps {
  className?: string;
}

export default function MarketAnalysisTab({ className }: MarketAnalysisTabProps) {
  const { analyses, loading, error, refetch, generateAnalysis } = useMarketAnalyses();
  const [isGenerating, setIsGenerating] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: "", longitude: "" });

  const handleGenerateAnalysis = async () => {
    if (!coordinates.latitude || !coordinates.longitude) {
      alert("Please enter valid coordinates");
      return;
    }

    setIsGenerating(true);
    try {
      await generateAnalysis({
        latitude: parseFloat(coordinates.latitude),
        longitude: parseFloat(coordinates.longitude),
        businessType: "restaurant",
        radius: 1000
      });
    } catch (err) {
      console.error("Failed to generate analysis:", err);
      alert("Failed to generate market analysis. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading && analyses.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generate New Analysis */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Generate Market Analysis
          </CardTitle>
          <CardDescription className="text-slate-300">
            Analyze market opportunities for a specific location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude" className="text-white">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="13.7563"
                value={coordinates.latitude}
                onChange={(e) => setCoordinates(prev => ({ ...prev, latitude: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-white">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="100.5018"
                value={coordinates.longitude}
                onChange={(e) => setCoordinates(prev => ({ ...prev, longitude: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
          <Button 
            onClick={handleGenerateAnalysis}
            disabled={isGenerating || !coordinates.latitude || !coordinates.longitude}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Generating Analysis...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Generate Market Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-4" onClick={refetch}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Analyses */}
      {analyses.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Recent Market Analyses</h3>
            <Button variant="outline" onClick={refetch} className="border-white/20 text-white hover:bg-white/10">
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {analysis.location}
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        Generated on {new Date(analysis.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={`${getScoreColor(analysis.marketScore)} font-semibold`}>
                      Score: {analysis.marketScore}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300 text-sm">Competitors</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{analysis.competitorCount}</div>
                      <div className="text-xs text-slate-400">Restaurants found</div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-green-400" />
                        <span className="text-slate-300 text-sm">Avg Rating</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.analysis.avg_rating.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-400">Out of 5.0</div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                        <span className="text-slate-300 text-sm">Market Score</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{analysis.marketScore}</div>
                      <div className="text-xs text-slate-400">Opportunity rating</div>
                    </div>
                  </div>

                  {/* Price Distribution */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Price Distribution</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(analysis.analysis.price_distribution).map(([range, percentage]) => (
                        <div key={range} className="text-center">
                          <div className="text-white font-semibold">{range}</div>
                          <div className="text-slate-300 text-sm">{percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine Distribution */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Cuisine Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(analysis.analysis.cuisine_distribution).map(([cuisine, percentage]) => (
                        <Badge key={cuisine} variant="outline" className="border-white/20 text-slate-300">
                          {cuisine}: {percentage}%
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Key Recommendations</h4>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                          <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Detailed Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="text-center py-12">
            <Globe className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Market Analyses Yet</h3>
            <p className="text-slate-400 mb-6">
              Generate your first market analysis to understand competition, 
              demographics, and business opportunities in your target area.
            </p>
            <Button 
              onClick={() => {
                setCoordinates({ latitude: "13.7563", longitude: "100.5018" });
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Target className="h-4 w-4 mr-2" />
              Try Sample Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}