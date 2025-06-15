'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { apiClient, Restaurant } from '../../lib/api-client';
import { MAPBOX_TOKEN } from '../../lib/mapbox';

// Dynamically import map component
const CleanMapComponent = dynamic(
  () => import('../../components/map/CleanMapComponent'),
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

export default function CleanDashboardPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('checking...');
  const [restaurantCount, setRestaurantCount] = useState<number>(0);

  useEffect(() => {
    // Test API connectivity on page load
    const testAPI = async () => {
      try {
        const response = await apiClient.searchRestaurantsByLocation(13.7563, 100.5018, 5);
        if (response.data) {
          setRestaurantCount(response.data.length);
          setApiStatus('✅ Connected');
        } else {
          setApiStatus('❌ API Error: ' + response.error);
        }
      } catch (error) {
        setApiStatus('❌ Connection Error');
      }
    };

    testAPI();
  }, []);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🍽️ BiteBase Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Restaurant Intelligence Platform
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">API Status</div>
              <div className="font-medium">{apiStatus}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Restaurant Map
                </h2>
                <div className="text-sm text-gray-500">
                  {restaurantCount} restaurants found
                </div>
              </div>
              
              <CleanMapComponent
                center={[13.7563, 100.5018]}
                zoom={13}
                className="w-full h-96"
                onRestaurantSelect={handleRestaurantSelect}
              />
              
              <div className="mt-4 text-sm text-gray-600">
                <p>• Click on restaurant markers to see details</p>
                <p>• Different colors represent different cuisine types</p>
                <p>• Larger markers indicate higher ratings (4.5+ stars)</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Selected Restaurant */}
            {selectedRestaurant ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Restaurant
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedRestaurant.name}</h4>
                    <p className="text-sm text-gray-600">{selectedRestaurant.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Cuisine:</span>
                      <p className="font-medium">{selectedRestaurant.cuisine}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating:</span>
                      <p className="font-medium">⭐ {selectedRestaurant.rating}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-medium">{selectedRestaurant.price_range}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Source:</span>
                      <p className="font-medium">{selectedRestaurant.platform}</p>
                    </div>
                  </div>

                  {selectedRestaurant.description && (
                    <div>
                      <span className="text-gray-500 text-sm">Description:</span>
                      <p className="text-sm mt-1">{selectedRestaurant.description}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Restaurant Details
                </h3>
                <p className="text-gray-500 text-center py-8">
                  Click on a restaurant marker to see details
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Restaurants:</span>
                  <span className="font-medium">{restaurantCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Map Center:</span>
                  <span className="font-medium">Bangkok</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Sources:</span>
                  <span className="font-medium">Wongnai, Google</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">Just now</span>
                </div>
              </div>
            </div>

            {/* Environment Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Environment</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>API: {process.env.NEXT_PUBLIC_API_URL || 'localhost:12001'}</div>
                <div>Maps: {MAPBOX_TOKEN ? '✅' : '❌'}</div>
                <div>Mode: {process.env.NODE_ENV || 'development'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
