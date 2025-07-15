'use client';

import React, { useState } from 'react';
import { Filter, Star, DollarSign, MapPin, ChevronDown } from 'lucide-react';

export interface FilterOptions {
  cuisine: string[];
  priceRange: [number, number];
  rating: number;
  radius: number;
  sortBy: 'distance' | 'rating' | 'price' | 'name';
}

export interface RestaurantFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApplyFilters: () => void;
  className?: string;
  isLoading?: boolean;
}

const CUISINE_OPTIONS = [
  'italian', 'chinese', 'mexican', 'japanese', 'indian', 'thai', 'french',
  'american', 'mediterranean', 'korean', 'vietnamese', 'greek', 'spanish',
  'middle_eastern', 'seafood', 'steakhouse', 'pizza', 'sushi', 'barbecue'
];

const RADIUS_OPTIONS = [
  { value: 500, label: '0.5 km' },
  { value: 1000, label: '1 km' },
  { value: 2000, label: '2 km' },
  { value: 5000, label: '5 km' },
  { value: 10000, label: '10 km' }
];

const SORT_OPTIONS = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'price', label: 'Price' },
  { value: 'name', label: 'Name' }
];

const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  className = '',
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  // Update local filters
  const updateLocalFilters = (updates: Partial<FilterOptions>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Handle cuisine selection
  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = localFilters.cuisine.includes(cuisine)
      ? localFilters.cuisine.filter(c => c !== cuisine)
      : [...localFilters.cuisine, cuisine];
    
    updateLocalFilters({ cuisine: newCuisines });
  };

  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    updateLocalFilters({ priceRange: [min, max] });
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    updateLocalFilters({ rating });
  };

  // Handle radius change
  const handleRadiusChange = (radius: number) => {
    updateLocalFilters({ radius });
  };

  // Handle sort change
  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    updateLocalFilters({ sortBy });
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      cuisine: [],
      priceRange: [1, 4],
      rating: 0,
      radius: 2000,
      sortBy: 'distance'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.cuisine.length > 0) count++;
    if (localFilters.priceRange[0] > 1 || localFilters.priceRange[1] < 4) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.radius !== 2000) count++;
    if (localFilters.sortBy !== 'distance') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Filter Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Reset
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown 
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters (Always Visible) */}
      <div className="px-4 py-3 space-y-3">
        {/* Radius */}
        <div className="flex items-center space-x-3">
          <MapPin className="h-4 w-4 text-gray-500" />
          <select
            value={localFilters.radius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {RADIUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                Within {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200 space-y-4">
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <div className="flex items-center space-x-2">
              {[0, 3, 3.5, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    localFilters.rating === rating
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating === 0 ? (
                    'Any'
                  ) : (
                    <>
                      <Star className="h-3 w-3 mr-1" />
                      {rating}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map(price => (
                <button
                  key={price}
                  onClick={() => {
                    const newMin = Math.min(price, localFilters.priceRange[1]);
                    const newMax = Math.max(price, localFilters.priceRange[0]);
                    if (localFilters.priceRange[0] <= price && price <= localFilters.priceRange[1]) {
                      // If already selected, toggle off
                      if (localFilters.priceRange[0] === price && localFilters.priceRange[1] === price) {
                        handlePriceRangeChange(1, 4);
                      } else if (localFilters.priceRange[0] === price) {
                        handlePriceRangeChange(price + 1, localFilters.priceRange[1]);
                      } else if (localFilters.priceRange[1] === price) {
                        handlePriceRangeChange(localFilters.priceRange[0], price - 1);
                      }
                    } else {
                      // Extend range to include this price
                      handlePriceRangeChange(
                        Math.min(localFilters.priceRange[0], price),
                        Math.max(localFilters.priceRange[1], price)
                      );
                    }
                  }}
                  className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    localFilters.priceRange[0] <= price && price <= localFilters.priceRange[1]
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <DollarSign className="h-3 w-3" />
                  {'$'.repeat(price)}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Types
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {CUISINE_OPTIONS.map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => handleCuisineToggle(cuisine)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    localFilters.cuisine.includes(cuisine)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cuisine.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button
          onClick={onApplyFilters}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            'Apply Filters'
          )}
        </button>
      </div>
    </div>
  );
};

export default RestaurantFilters;