'use client';

import React, { useState, useEffect } from 'react';
import { LocationIntelligenceWrapper } from '../../../components/dashboard';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { ErrorBoundary } from '../../../components/ui/error-boundary';
import { LocationIntelligenceSkeleton } from '../../../components/ui/skeleton';
import { 
  MapPin, 
  Zap, 
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function LocationIntelligencePage() {
  const [serviceStatus, setServiceStatus] = useState<'healthy' | 'degraded' | 'unhealthy'>('unhealthy');
  const [selectedRestaurant, setSelectedRestaurant] = useState('demo-restaurant-id');
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsPageLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock restaurant data - in a real app, this would come from your restaurant management system
  const availableRestaurants = [
    { id: 'demo-restaurant-id', name: 'Demo Restaurant', address: 'New York, NY' },
    { id: 'restaurant-2', name: 'Sample Bistro', address: 'Los Angeles, CA' },
    { id: 'restaurant-3', name: 'Test Kitchen', address: 'Chicago, IL' }
  ];

  const handleServiceStatusChange = (status: 'healthy' | 'degraded' | 'unhealthy') => {
    setServiceStatus(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unhealthy': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <LocationIntelligenceSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-all duration-1000 transform ${
        isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="space-y-6 p-6">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-6">
              <Link 
                href="/place" 
                className="group p-3 hover:bg-primary/10 rounded-2xl transition-all duration-300 hover:scale-110"
              >
                <ArrowLeft className="h-6 w-6 text-primary group-hover:text-primary-600" />
              </Link>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-primary">Location Intelligence</h1>
                  <Badge className={`${getStatusColor(serviceStatus)} transform transition-all duration-300 hover:scale-105`}>
                    {getStatusIcon(serviceStatus)}
                    <span className="ml-2 font-medium">{serviceStatus}</span>
                  </Badge>
                </div>
                <p className="text-gray-600 text-lg">
                  Real-time location analytics powered by Foursquare API
                </p>
              </div>
            </div>
            
            {/* Enhanced Restaurant Selector */}
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Restaurant:
              </label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="border border-primary/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                {availableRestaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Info Alert */}
        <Alert className="border-primary/20 bg-primary/5 backdrop-blur-sm rounded-2xl transform transition-all duration-500 hover:scale-[1.02]">
          <Info className="h-5 w-5 text-primary" />
          <AlertDescription className="text-primary-800">
            <strong className="text-primary">Real-time Location Intelligence:</strong> This dashboard provides live data from Foursquare API including 
            foot traffic patterns, competitor analysis, local events, and demographic insights. Data is automatically refreshed 
            every 30 seconds when auto-refresh is enabled.
          </AlertDescription>
        </Alert>

        {/* Enhanced Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group border-primary/20 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-primary/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <MapPin className="h-5 w-5 text-primary group-hover:text-white" />
                </div>
                Location Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-600">
                Comprehensive location scoring based on foot traffic, accessibility, and market potential.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-primary/20 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-primary/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Activity className="h-5 w-5 text-primary group-hover:text-white" />
                </div>
                Real-time Traffic
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-600">
                Live foot traffic data, peak hours analysis, and demographic breakdowns.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-primary/20 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-primary/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Users className="h-5 w-5 text-primary group-hover:text-white" />
                </div>
                Competitor Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-600">
                Detailed competitor analysis, market opportunities, and competitive threats.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-primary/20 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-primary/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Calendar className="h-5 w-5 text-primary group-hover:text-white" />
                </div>
                Event Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-600">
                Local events tracking and traffic impact analysis for strategic planning.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <div className="transform transition-all duration-700 delay-300">
          <LocationIntelligenceWrapper
            restaurantId={selectedRestaurant}
            onServiceStatusChange={handleServiceStatusChange}
          />
        </div>

        {/* Enhanced Footer Info */}
        <Card className="border-primary/20 bg-white/90 backdrop-blur-sm shadow-xl transform transition-all duration-700 delay-500 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              About Location Intelligence
            </CardTitle>
            <CardDescription className="text-gray-600">
              Understanding the technology behind your location insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Data Sources
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Foursquare Places API - 105M+ global venues
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Real-time foot traffic patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Local events and entertainment data
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Demographic and behavioral insights
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Analysis Features
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Automated competitor discovery
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Peak hours and traffic optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    Market opportunity identification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    AI-powered recommendations
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary/10">
              <p className="text-xs text-gray-500 bg-primary/5 rounded-lg p-3">
                🔒 Data is updated in real-time from Foursquare API. Cache optimization ensures fast performance 
                while respecting rate limits. All location data is processed securely and stored according 
                to privacy best practices.
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}