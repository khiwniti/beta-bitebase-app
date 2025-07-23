'use client';

import React, { useState } from 'react';
// import { useAuth } from '@/components/auth';
import RestaurantMapContainer, { Restaurant } from './RestaurantMapContainer';

export interface SimpleMapDashboardProps {
  className?: string;
}

const SimpleMapDashboard: React.FC<SimpleMapDashboardProps> = ({ className = '' }) => {
  // const { user } = useAuth();
  // Temporary bypass for development
  const user = {
    restaurantName: 'BiteBase Intelligence',
    displayName: 'Restaurant Manager',
    email: 'manager@bitebase.app'
  };
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Handle restaurant selection
  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    console.log('Selected restaurant:', restaurant);
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Explorer</h1>
            <p className="text-sm text-gray-600 mt-1">
              Discover restaurants with interactive mapping
            </p>
          </div>
          {user && (
            <div className="text-sm text-gray-500">
              Welcome, {user.name}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Restaurant Info</h3>
              {selectedRestaurant ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedRestaurant.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-yellow-600">⭐ {selectedRestaurant.rating}</span>
                      <span className="text-green-600">{'$'.repeat(selectedRestaurant.price_level || 1)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 capitalize">{selectedRestaurant.cuisine}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedRestaurant.address}</p>
                  </div>
                  {selectedRestaurant.photo_url && (
                    <img 
                      src={selectedRestaurant.photo_url} 
                      alt={selectedRestaurant.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  )}
                  <button 
                    onClick={() => setSelectedRestaurant(null)}
                    className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
                  >
                    Clear Selection
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Click on a restaurant marker to view details</p>
              )}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-gray-100 p-4">
          <RestaurantMapContainer 
            center={[-74.0060, 40.7128]}
            zoom={13}
            className="h-full"
            onRestaurantClick={handleRestaurantClick}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            <span>BiteBase Intelligence Platform - Phase 2B</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Mapbox & Google Places</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMapDashboard;