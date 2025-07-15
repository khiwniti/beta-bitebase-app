'use client';

import React from 'react';
import { Star, MapPin, DollarSign, Clock, Phone, ExternalLink } from 'lucide-react';
import { Restaurant } from './MapContainer';

export interface RestaurantListProps {
  restaurants: Restaurant[];
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onRestaurantHover?: (restaurant: Restaurant | null) => void;
  className?: string;
  isLoading?: boolean;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onRestaurantClick,
  onRestaurantHover,
  className = '',
  isLoading = false
}) => {
  // Format price level
  const formatPriceLevel = (priceLevel?: number) => {
    if (!priceLevel) return '$';
    return '$'.repeat(Math.min(priceLevel, 4));
  };

  // Format cuisine
  const formatCuisine = (cuisine: string) => {
    return cuisine.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format review count
  const formatReviewCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Get data source badge color
  const getSourceBadgeColor = (source?: string) => {
    switch (source) {
      case 'google_places':
        return 'bg-blue-100 text-blue-800';
      case 'foursquare':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-500">Try adjusting your search location or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} Found
        </h3>
      </div>

      {/* Restaurant List */}
      <div className="max-h-96 overflow-y-auto">
        {restaurants.map((restaurant, index) => (
          <div
            key={restaurant.id || `${restaurant.name}-${index}`}
            className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onRestaurantClick?.(restaurant)}
            onMouseEnter={() => onRestaurantHover?.(restaurant)}
            onMouseLeave={() => onRestaurantHover?.(null)}
          >
            <div className="p-4">
              <div className="flex space-x-4">
                {/* Restaurant Image */}
                <div className="flex-shrink-0">
                  {restaurant.photo_url ? (
                    <img
                      src={restaurant.photo_url}
                      alt={restaurant.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Restaurant Details */}
                <div className="flex-1 min-w-0">
                  {/* Name and Rating */}
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
                      {restaurant.name}
                    </h4>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {restaurant.rating}
                      </span>
                    </div>
                  </div>

                  {/* Cuisine and Price */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm text-gray-600">
                      {formatCuisine(restaurant.cuisine)}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {formatPriceLevel(restaurant.price_level)}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {restaurant.review_count && (
                        <span>{formatReviewCount(restaurant.review_count)} reviews</span>
                      )}
                    </div>

                    {/* Data Source Badge */}
                    {restaurant.data_source && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSourceBadgeColor(restaurant.data_source)}`}>
                        {restaurant.data_source === 'google_places' ? 'Google' : 
                         restaurant.data_source === 'foursquare' ? 'Foursquare' : 
                         'Local'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestaurantClick?.(restaurant);
                  }}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  View on Map
                </button>
                
                {restaurant.data_source === 'google_places' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open Google Maps
                      const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {restaurants.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Showing {restaurants.length} result{restaurants.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;