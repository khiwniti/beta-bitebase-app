'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { apiClient } from '../../lib/api-client';
import { MAPBOX_TOKEN } from '../../lib/mapbox';

// Dynamically import map component to avoid SSR issues
const ProductionMapComponent = dynamic(
  () => import('../../components/geospatial/ProductionMapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading Map...</p>
        </div>
      </div>
    )
  }
);

export default function MapTestPage() {
  const [apiStatus, setApiStatus] = useState<string>('checking...');
  const [restaurantCount, setRestaurantCount] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.7563, 100.5018]); // Bangkok

  useEffect(() => {
    // Test API connectivity
    const testAPI = async () => {
      try {
        // Test basic restaurant search
        const searchResponse = await apiClient.searchRestaurantsByLocation(13.7563, 100.5018, 5);
        if (searchResponse.data) {
          setRestaurantCount(searchResponse.data.length);
          setApiStatus('✅ Connected');
        } else {
          setApiStatus('❌ API Error: ' + searchResponse.error);
        }

        // Test real data endpoint
        const realDataResponse = await apiClient.fetchRealRestaurantData({
          latitude: 13.7563,
          longitude: 100.5018,
          radius: 5,
          platforms: ['wongnai', 'google']
        });

        if (realDataResponse.data) {
          console.log('✅ Real data endpoint working:', realDataResponse.data);
        }
      } catch (error) {
        setApiStatus('❌ Connection Error');
        console.error('API Test Error:', error);
      }
    };

    testAPI();
  }, []);

  const handleMapClick = (event: any) => {
    console.log('Map clicked:', event);
    if (event.latlng) {
      setMapCenter([event.latlng.lat, event.latlng.lng]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🗺️ Map & Restaurant Data Test
          </h1>

          {/* API Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">API Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Backend Connection</h3>
                <p className="text-lg">{apiStatus}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Restaurants Found</h3>
                <p className="text-lg">{restaurantCount} restaurants</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Map Center</h3>
                <p className="text-sm">{mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001'}
              </div>
              <div>
                <strong>Mapbox Token:</strong> {MAPBOX_TOKEN ? '✅ Configured' : '❌ Missing'}
              </div>
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
              </div>
              <div>
                <strong>Maps Enabled:</strong> {process.env.NEXT_PUBLIC_ENABLE_MAPS || 'true'}
              </div>
            </div>
          </div>
        </div>

        {/* Map Component */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Interactive Restaurant Map</h2>
          <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
            <ProductionMapComponent
              center={mapCenter}
              zoom={13}
              searchRadius={5000}
              onClick={handleMapClick}
              className="w-full h-full"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>• Click on the map to change the center location</p>
            <p>• Restaurant markers should appear automatically</p>
            <p>• Click on markers to see restaurant details</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Testing Instructions</h3>
          <ul className="text-blue-800 space-y-1">
            <li>1. Verify that the API status shows "✅ Connected"</li>
            <li>2. Check that restaurants are found (should show 3+ restaurants)</li>
            <li>3. Confirm the map loads with Mapbox tiles</li>
            <li>4. Look for restaurant markers on the map</li>
            <li>5. Click on markers to see restaurant popups</li>
            <li>6. Try clicking different locations on the map</li>
          </ul>
        </div>
      </div>
    </div>
  );
}