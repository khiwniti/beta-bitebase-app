'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Star, 
  MapPin, 
  Target,
  ShoppingBag,
  GraduationCap,
  Building,
  Plane,
  RefreshCw,
  BarChart3,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface CustomerSegment {
  segment: string;
  confidence: string;
  indicators: string[];
  characteristics: string[];
}

interface MarketOpportunity {
  opportunity: string;
  description: string;
  potential: string;
}

interface CustomerInsights {
  demographics: {
    analysis: {
      customerSegments: CustomerSegment[];
      trafficPatterns: {
        peakHours: string[];
        weekendTraffic: string;
        seasonalTrends: string[];
      };
      competitorDensity: number;
      marketOpportunities: MarketOpportunity[];
    };
  };
  marketMetrics: {
    competitorCount: number;
    averageRating: string;
    priceDistribution: Record<string, number>;
    marketSaturation: string;
  };
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
  }>;
}

export default function CustomersPage() {
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState(5000);

  // Default location (Bangkok city center)
  const defaultLocation = { lat: 13.7563, lng: 100.5018 };

  const fetchCustomerInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getCustomerInsights(
        defaultLocation.lat, 
        defaultLocation.lng, 
        selectedRadius
      );
      
      if (response.error) {
        setError(response.error);
      } else {
        setInsights(response.data || null);
      }
    } catch (err) {
      setError('Failed to fetch customer insights');
      console.error('Customer insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerInsights();
  }, [selectedRadius]);

  const getSegmentIcon = (segment: string) => {
    switch (segment.toLowerCase()) {
      case 'students': return <GraduationCap className="w-5 h-5" />;
      case 'shoppers & families': return <ShoppingBag className="w-5 h-5" />;
      case 'working professionals': return <Building className="w-5 h-5" />;
      case 'tourists': return <Plane className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSaturationColor = (saturation: string) => {
    switch (saturation.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <MainLayout pageTitle="Customer Management" pageDescription="Analyze customer demographics using Google Places data">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analyze customer demographics around your target buffer radius
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={selectedRadius} 
              onChange={(e) => setSelectedRadius(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value={1000}>1km radius</option>
              <option value={2000}>2km radius</option>
              <option value={5000}>5km radius</option>
              <option value={10000}>10km radius</option>
            </select>
            <Button onClick={fetchCustomerInsights} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">4.6</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retention Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600 dark:text-gray-400">Analyzing customer demographics...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {insights && !loading && (
          <>
            {/* Market Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Market Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Competitors</span>
                      <span className="font-medium">{insights.marketMetrics.competitorCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Rating</span>
                      <span className="font-medium">{insights.marketMetrics.averageRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Saturation</span>
                      <span className={`font-medium ${getSaturationColor(insights.marketMetrics.marketSaturation)}`}>
                        {insights.marketMetrics.marketSaturation}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Traffic Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Peak Hours</span>
                      <div className="mt-1">
                        {insights.demographics?.analysis?.trafficPatterns?.peakHours?.map((hour, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {hour}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weekend Traffic</span>
                      <span className="font-medium capitalize">
                        {insights.demographics?.analysis?.trafficPatterns?.weekendTraffic}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Price Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(insights.marketMetrics.priceDistribution).map(([level, count]) => (
                      <div key={level} className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          {level === 'unknown' ? 'Unknown' : `${'$'.repeat(parseInt(level))}`}
                        </span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Segments */}
            {insights.demographics?.analysis?.customerSegments && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Customer Segments
                  </CardTitle>
                  <CardDescription>
                    Identified customer segments based on nearby places and demographics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.demographics.analysis.customerSegments.map((segment, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {getSegmentIcon(segment.segment)}
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {segment.segment}
                          </h3>
                          <Badge className={getConfidenceColor(segment.confidence)}>
                            {segment.confidence} confidence
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Indicators:</p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                              {segment.indicators.map((indicator, i) => (
                                <li key={i}>{indicator}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Characteristics:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {segment.characteristics.map((char, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {char}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Opportunities */}
            {insights.demographics?.analysis?.marketOpportunities && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Market Opportunities
                  </CardTitle>
                  <CardDescription>
                    Identified opportunities based on demographic analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.demographics.analysis.marketOpportunities.map((opportunity, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {opportunity.opportunity}
                          </h3>
                          <Badge className={getPriorityColor(opportunity.potential)}>
                            {opportunity.potential} potential
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {opportunity.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {insights.recommendations && insights.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-powered recommendations based on customer analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {rec.title}
                          </h3>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {rec.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seasonal Trends */}
            {insights.demographics?.analysis?.trafficPatterns?.seasonalTrends && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Seasonal Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights.demographics.analysis.trafficPatterns.seasonalTrends.map((trend, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
