'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../../hooks/useTranslations';
import { MapPin, Search, Filter, Layers } from 'lucide-react';

export default function MapPage() {
  const t = useTranslations('place');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Location Map
          </h1>
          <p className="text-gray-600">
            Interactive map for location analysis and insights
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Layers className="h-4 w-4 mr-2" />
                  Layers
                </button>
              </div>
            </div>
          </div>

          <div className="relative h-96 bg-gray-100">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive map will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Map integration with Mapbox/Google Maps</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Restaurants</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">McDonald's</span>
                <span className="text-sm text-gray-500">0.2 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Starbucks</span>
                <span className="text-sm text-gray-500">0.3 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">KFC</span>
                <span className="text-sm text-gray-500">0.5 km</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Peak Hours:</span>
                <span className="text-sm font-medium">12-2 PM, 6-8 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Foot Traffic:</span>
                <span className="text-sm font-medium text-green-600">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Accessibility:</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Age Group:</span>
                <span className="text-sm font-medium">25-40</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Income Level:</span>
                <span className="text-sm font-medium">Middle-High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lifestyle:</span>
                <span className="text-sm font-medium">Urban Professional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}