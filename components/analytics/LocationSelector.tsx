/**
 * Location Selector Component
 * Allows users to search and select locations for analysis
 */

import { useState, useRef, useEffect } from 'react';

export default function LocationSelector({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  // Debounced search for location suggestions
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Use a geocoding service or mock data for suggestions
        const mockSuggestions = await getMockSuggestions(searchQuery);
        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Location search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const getMockSuggestions = async (query) => {
    // Mock location suggestions - in production, use a real geocoding service
    const mockLocations = [
      { name: 'Times Square, New York, NY', lat: 40.7589, lng: -73.9851 },
      { name: 'Downtown Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
      { name: 'Chicago Loop, IL', lat: 41.8781, lng: -87.6298 },
      { name: 'Miami Beach, FL', lat: 25.7617, lng: -80.1918 },
      { name: 'San Francisco Financial District, CA', lat: 37.7749, lng: -122.4194 },
      { name: 'Boston Back Bay, MA', lat: 42.3601, lng: -71.0589 },
      { name: 'Seattle Downtown, WA', lat: 47.6062, lng: -122.3321 },
      { name: 'Austin Downtown, TX', lat: 30.2672, lng: -97.7431 },
      { name: 'Denver LoDo, CO', lat: 39.7392, lng: -104.9903 },
      { name: 'Atlanta Midtown, GA', lat: 33.7490, lng: -84.3880 }
    ];

    return mockLocations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setShowSuggestions(false);
    onLocationSelect({
      latitude: location.lat,
      longitude: location.lng,
      address: location.name
    });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect({
          latitude,
          longitude,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        });
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location. Please search manually.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location (e.g., Times Square, NYC)"
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    <div className="text-sm text-gray-500">
                      {suggestion.lat.toFixed(4)}, {suggestion.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Location Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCurrentLocation}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{loading ? 'Getting Location...' : 'Use Current Location'}</span>
        </button>
      </div>

      {/* Manual Coordinates Input */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Or enter coordinates manually:
        </h3>
        <ManualCoordinateInput onLocationSelect={onLocationSelect} />
      </div>
    </div>
  );
}

function ManualCoordinateInput({ onLocationSelect }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinate ranges (lat: -90 to 90, lng: -180 to 180)');
      return;
    }
    
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <input
        type="number"
        step="any"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        placeholder="Latitude"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <input
        type="number"
        step="any"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        placeholder="Longitude"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
      >
        Analyze
      </button>
    </form>
  );
}