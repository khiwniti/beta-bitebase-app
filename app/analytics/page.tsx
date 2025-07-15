'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LocationSelector from '@/components/analytics/LocationSelector';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle location from URL parameters
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const address = searchParams.get('address');
    
    if (lat && lng) {
      const location = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        address: address || `${lat}, ${lng}`
      };
      setSelectedLocation(location);
      generateAnalysis(location);
    }
  }, [searchParams]);

  const generateAnalysis = async (location, businessType = 'restaurant') => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          businessType,
          radius: 1000
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Transform the data to match our dashboard expectations
        const transformedData = {
          summary: {
            overallScore: result.data.locationScore || 85,
            keyInsights: [
              `Market saturation: ${result.data.marketSaturation}/10`,
              `Success probability: ${result.data.successProbability}%`,
              `Competition density: ${result.data.competitionDensity}`,
              `Location score: ${result.data.locationScore}/100`
            ]
          },
          marketAnalysis: result.data,
          salesForecast: {
            // Mock data - in production this would come from AI
            monthly: generateMockSalesData()
          },
          customerSegmentation: {
            segments: result.data.demographicInsights?.targetDemographics || []
          },
          businessRecommendations: {
            recommendations: result.data.recommendations || []
          }
        };
        
        setAnalysisData(transformedData);
      } else {
        setError(result.error || 'Failed to generate analysis');
      }
    } catch (err) {
      console.error('Analysis generation error:', err);
      setError('Failed to connect to analysis service');
    } finally {
      setLoading(false);
    }
  };

  const generateMockSalesData = () => {
    // Generate mock sales forecast data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      revenue: 45000 + (index * 2000) + (Math.random() * 10000),
      customers: 800 + (index * 50) + (Math.random() * 200),
      orders: 1200 + (index * 75) + (Math.random() * 300)
    }));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    
    // Update URL with location parameters
    const params = new URLSearchParams();
    params.set('lat', location.latitude.toString());
    params.set('lng', location.longitude.toString());
    params.set('address', location.address);
    
    router.push(`/analytics?${params.toString()}`);
    generateAnalysis(location);
  };

  const handleRegenerateAnalysis = (businessType) => {
    if (selectedLocation) {
      generateAnalysis(selectedLocation, businessType);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive market intelligence and business insights powered by AI
              </p>
            </div>
            
            {selectedLocation && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Analyzing location:</p>
                <p className="font-medium text-gray-900">
                  {selectedLocation.address}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedLocation ? (
          /* Location Selection */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Select a Location to Analyze
              </h2>
              <p className="text-gray-600">
                Choose a location to get comprehensive AI-powered market analysis, 
                competitor insights, and business recommendations.
              </p>
            </div>
            
            <LocationSelector onLocationSelect={handleLocationSelect} />
            
            {/* Quick Examples */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Try these popular locations:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Times Square, NYC', lat: 40.7589, lng: -73.9851 },
                  { name: 'Downtown LA', lat: 34.0522, lng: -118.2437 },
                  { name: 'Chicago Loop', lat: 41.8781, lng: -87.6298 },
                  { name: 'Miami Beach', lat: 25.7617, lng: -80.1918 }
                ].map((location) => (
                  <button
                    key={location.name}
                    onClick={() => handleLocationSelect({
                      latitude: location.lat,
                      longitude: location.lng,
                      address: location.name
                    })}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.lat}, {location.lng}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="large" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Generating AI Analysis
            </h3>
            <p className="mt-2 text-gray-600 text-center max-w-md">
              Our AI is analyzing market conditions, competitors, demographics, 
              and generating personalized business recommendations...
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <span>🔍 Market Research</span>
              <span>🏪 Competitor Analysis</span>
              <span>📊 Demographics</span>
              <span>🤖 AI Insights</span>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="max-w-md mx-auto text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analysis Failed
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => generateAnalysis(selectedLocation)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setSelectedLocation(null)}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Select Different Location
              </button>
            </div>
          </div>
        ) : analysisData ? (
          /* Analytics Dashboard */
          <AnalyticsDashboard
            data={analysisData}
            location={selectedLocation}
            onRegenerateAnalysis={handleRegenerateAnalysis}
            onChangeLocation={() => setSelectedLocation(null)}
          />
        ) : null}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
              <Skeleton className="h-3 w-[80px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}