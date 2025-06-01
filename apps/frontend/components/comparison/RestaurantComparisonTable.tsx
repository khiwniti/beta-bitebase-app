import React, { useState } from 'react';
import { MapPin, Star, Users, Utensils, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RestaurantData {
  id: string;
  name: string;
  address: string;
  cuisineType: string;
  rating?: number;
  priceLevel: string;
  distance?: number; // in km
  
  // Metrics
  footTraffic?: number; // daily average
  peakHours?: string;
  targetMatch?: number; // 0-100
  revenueEstimate?: number;
  competitionLevel?: 'Low' | 'Medium' | 'High';
  rentEstimate?: number; // monthly
  operationalCosts?: number; // monthly
  breakEvenEstimate?: number; // months
  demographicMatch?: number; // 0-100
}

interface RestaurantComparisonTableProps {
  restaurants: RestaurantData[];
  highlightedId?: string;
  onSelect?: (restaurant: RestaurantData) => void;
  className?: string;
}

export default function RestaurantComparisonTable({
  restaurants,
  highlightedId,
  onSelect,
  className = '',
}: RestaurantComparisonTableProps) {
  const [sortField, setSortField] = useState<keyof RestaurantData>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sort changes
  const handleSort = (field: keyof RestaurantData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort restaurants
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (a[sortField] === undefined || b[sortField] === undefined) {
      return 0;
    }

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Simplified table if there are too many restaurants
  const isSimplified = restaurants.length > 3;

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Table header with sort buttons
  const renderTableHeader = (label: string, field: keyof RestaurantData) => {
    return (
      <th 
        className={cn(
          "p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50",
          sortField === field && "bg-gray-50"
        )}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center">
          <span>{label}</span>
          <span className="ml-1">
            {sortField === field ? (
              sortDirection === 'asc' ? '↑' : '↓'
            ) : (
              <span className="opacity-0 group-hover:opacity-50">↕</span>
            )}
          </span>
        </div>
      </th>
    );
  };

  // Render score with color based on value
  const renderScore = (score?: number) => {
    if (score === undefined) return <span className="text-gray-400">-</span>;
    
    let color;
    if (score >= 80) color = "text-green-600";
    else if (score >= 60) color = "text-blue-600";
    else if (score >= 40) color = "text-amber-600";
    else color = "text-red-600";
    
    return <span className={color}>{score}</span>;
  };

  // Get color for competition level
  const getCompetitionColor = (level?: string) => {
    if (!level) return "text-gray-400";
    
    switch (level) {
      case 'Low': return "text-green-600";
      case 'Medium': return "text-amber-600";
      case 'High': return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className={`overflow-x-auto shadow-sm border border-gray-200 rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            {renderTableHeader("Restaurant", "name")}
            
            {!isSimplified && (
              <>
                {renderTableHeader("Address", "address")}
                {renderTableHeader("Cuisine", "cuisineType")}
              </>
            )}
            
            {renderTableHeader("Rating", "rating")}
            
            {!isSimplified && renderTableHeader("Price", "priceLevel")}
            
            {renderTableHeader("Target Match", "targetMatch")}
            
            {renderTableHeader("Foot Traffic", "footTraffic")}
            
            {!isSimplified && (
              <>
                {renderTableHeader("Competition", "competitionLevel")}
                {renderTableHeader("Est. Revenue", "revenueEstimate")}
              </>
            )}
            
            {renderTableHeader("Demographics", "demographicMatch")}
            
            {!isSimplified && (
              <>
                {renderTableHeader("Operating Costs", "operationalCosts")}
                {renderTableHeader("Break Even", "breakEvenEstimate")}
              </>
            )}
            
            <th className="px-3 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRestaurants.map((restaurant) => (
            <tr 
              key={restaurant.id} 
              className={cn(
                "hover:bg-gray-50 transition-colors",
                highlightedId === restaurant.id && "bg-green-50"
              )}
            >
              {/* Restaurant Name */}
              <td className="px-3 py-4">
                <div className="font-medium text-gray-900">{restaurant.name}</div>
                {isSimplified && (
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <Utensils size={12} />
                    <span>{restaurant.cuisineType}</span>
                  </div>
                )}
              </td>
              
              {/* Address */}
              {!isSimplified && (
                <td className="px-3 py-4">
                  <div className="flex items-center text-sm">
                    <MapPin size={14} className="mr-1 text-gray-500" />
                    <span className="truncate max-w-[200px]">{restaurant.address}</span>
                  </div>
                  {restaurant.distance && (
                    <div className="text-gray-500 text-xs mt-1">
                      {restaurant.distance < 1 
                        ? `${Math.round(restaurant.distance * 1000)}m` 
                        : `${restaurant.distance.toFixed(1)}km`}
                    </div>
                  )}
                </td>
              )}
              
              {/* Cuisine Type */}
              {!isSimplified && (
                <td className="px-3 py-4">
                  <div className="flex items-center text-sm">
                    <Utensils size={14} className="mr-1 text-gray-500" />
                    <span>{restaurant.cuisineType}</span>
                  </div>
                </td>
              )}
              
              {/* Rating */}
              <td className="px-3 py-4">
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="ml-1">{restaurant.rating?.toFixed(1) || '-'}</span>
                </div>
              </td>
              
              {/* Price Level */}
              {!isSimplified && (
                <td className="px-3 py-4">
                  <div className="text-gray-900">{restaurant.priceLevel}</div>
                </td>
              )}
              
              {/* Target Match */}
              <td className="px-3 py-4">
                <div className="font-medium">
                  {renderScore(restaurant.targetMatch)}
                </div>
                {restaurant.targetMatch && (
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        restaurant.targetMatch >= 80 ? "bg-green-500" :
                        restaurant.targetMatch >= 60 ? "bg-blue-500" :
                        restaurant.targetMatch >= 40 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${restaurant.targetMatch}%` }}
                    />
                  </div>
                )}
              </td>
              
              {/* Foot Traffic */}
              <td className="px-3 py-4">
                <div className="flex items-center text-sm">
                  <Users size={14} className="mr-1 text-gray-500" />
                  <span>{formatNumber(restaurant.footTraffic)}</span>
                </div>
                {!isSimplified && restaurant.peakHours && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock size={12} className="mr-1" />
                    <span>{restaurant.peakHours}</span>
                  </div>
                )}
              </td>
              
              {/* Competition Level */}
              {!isSimplified && (
                <td className="px-3 py-4">
                  <span className={getCompetitionColor(restaurant.competitionLevel)}>
                    {restaurant.competitionLevel || '-'}
                  </span>
                </td>
              )}
              
              {/* Estimated Revenue */}
              {!isSimplified && (
                <td className="px-3 py-4">
                  <div className="text-gray-900">{formatCurrency(restaurant.revenueEstimate)}</div>
                </td>
              )}
              
              {/* Demographic Match */}
              <td className="px-3 py-4">
                <div className="font-medium">
                  {renderScore(restaurant.demographicMatch)}
                </div>
                {restaurant.demographicMatch && (
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        restaurant.demographicMatch >= 80 ? "bg-green-500" :
                        restaurant.demographicMatch >= 60 ? "bg-blue-500" :
                        restaurant.demographicMatch >= 40 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${restaurant.demographicMatch}%` }}
                    />
                  </div>
                )}
              </td>
              
              {/* Operational Costs */}
              {!isSimplified && (
                <td className="px-3 py-4">
                  <div className="text-gray-900">{formatCurrency(restaurant.operationalCosts)}</div>
                  {restaurant.rentEstimate && (
                    <div className="text-gray-500 text-xs mt-1">
                      Rent: {formatCurrency(restaurant.rentEstimate)}
                    </div>
                  )}
                </td>
              )}
              
              {/* Break Even Estimate */}
              {!isSimplified && (
                <td className="px-3 py-4">
                  <div className="text-gray-900">
                    {restaurant.breakEvenEstimate ? `${restaurant.breakEvenEstimate} months` : '-'}
                  </div>
                </td>
              )}
              
              {/* Actions */}
              <td className="px-3 py-4 text-sm text-center">
                <button
                  onClick={() => onSelect && onSelect(restaurant)}
                  className={cn(
                    "inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded",
                    highlightedId === restaurant.id
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {highlightedId === restaurant.id ? 'Selected' : 'Select'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 