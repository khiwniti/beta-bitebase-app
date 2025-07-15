'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';

export interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  context?: Array<{ id: string; text: string }>;
}

export interface SearchBoxProps {
  onLocationSelect: (lat: number, lng: number, placeName: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onLocationSelect,
  placeholder = "Search for a location...",
  className = "",
  defaultValue = ""
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Mapbox Geocoding API
  const searchLocations = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim() || searchQuery.length < 3) return [];

    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${accessToken}&limit=5&types=place,locality,neighborhood,address,poi`
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      return data.features.map((feature: any) => ({
        id: feature.id,
        place_name: feature.place_name,
        center: feature.center,
        place_type: feature.place_type,
        context: feature.context
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= 3) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        const searchResults = await searchLocations(query);
        setResults(searchResults);
        setIsLoading(false);
        setShowResults(true);
        setSelectedIndex(-1);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    setQuery(result.place_name);
    setShowResults(false);
    setSelectedIndex(-1);
    onLocationSelect(result.center[1], result.center[0], result.place_name);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  // Handle clear search
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    searchRef.current?.focus();
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format place name for display
  const formatPlaceName = (placeName: string) => {
    const parts = placeName.split(', ');
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[1]}`;
    }
    return placeName;
  };

  // Get place type icon
  const getPlaceTypeIcon = (placeType: string[]) => {
    if (placeType.includes('poi')) return '🏢';
    if (placeType.includes('address')) return '📍';
    if (placeType.includes('neighborhood')) return '🏘️';
    if (placeType.includes('locality') || placeType.includes('place')) return '🏙️';
    return '📍';
  };

  return (
    <div className={`relative ${className}`} ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Searching...
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultSelect(result)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3 mt-0.5">
                    {getPlaceTypeIcon(result.place_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {formatPlaceName(result.place_name)}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {result.place_type.join(', ')}
                    </div>
                  </div>
                  <MapPin className="h-4 w-4 text-gray-400 ml-2 mt-0.5 flex-shrink-0" />
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* No results message */}
      {showResults && !isLoading && results.length === 0 && query.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500">
            No locations found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;