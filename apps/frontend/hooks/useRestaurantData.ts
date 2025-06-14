/**
 * React hooks for restaurant data management
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Restaurant, RestaurantMenu, MarketAnalysis, MenuItem } from '../lib/api-client';

export interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseRestaurantMenuResult {
  menu: MenuItem[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseMarketAnalysisResult {
  analyses: MarketAnalysis[];
  loading: boolean;
  error: string | null;
  createAnalysis: (params: {
    latitude: number;
    longitude: number;
    radius: number;
    analysis_type: string;
  }) => Promise<MarketAnalysis | null>;
  refetch: () => Promise<void>;
}

// Hook for fetching all restaurants
export function useRestaurants(): UseRestaurantsResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getAllRestaurants();
      if (response.error) {
        setError(response.error);
      } else {
        setRestaurants(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants,
  };
}

// Hook for searching restaurants by location
export function useRestaurantSearch() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByLocation = useCallback(async (
    latitude: number,
    longitude: number,
    radius: number = 5
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.searchRestaurantsByLocation(latitude, longitude, radius);
      if (response.error) {
        setError(response.error);
        setRestaurants([]);
      } else {
        setRestaurants(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchWongnai = useCallback(async (params: {
    latitude?: number;
    longitude?: number;
    query?: string;
    cuisine?: string;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.searchWongnaiRestaurants(params);
      if (response.error) {
        setError(response.error);
        setRestaurants([]);
      } else {
        setRestaurants(response.data?.restaurants || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search Wongnai restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    restaurants,
    loading,
    error,
    searchByLocation,
    searchWongnai,
  };
}

// Hook for fetching restaurant menu
export function useRestaurantMenu(publicId: string | null): UseRestaurantMenuResult {
  const [menu, setMenu] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    if (!publicId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const restaurantId = parseInt(publicId, 10);
      if (isNaN(restaurantId)) {
        setError('Invalid restaurant ID');
        setMenu(null);
        return;
      }
      
      const response = await apiClient.getRestaurantMenu(restaurantId);
      if (response.error) {
        setError(response.error);
        setMenu(null);
      } else {
        setMenu(response.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu');
      setMenu(null);
    } finally {
      setLoading(false);
    }
  }, [publicId]);

  useEffect(() => {
    if (publicId) {
      fetchMenu();
    } else {
      setMenu(null);
      setError(null);
      setLoading(false);
    }
  }, [publicId, fetchMenu]);

  return {
    menu,
    loading,
    error,
    refetch: fetchMenu,
  };
}

// Hook for market analysis
export function useMarketAnalysis(): UseMarketAnalysisResult {
  const [analyses, setAnalyses] = useState<MarketAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getAllMarketAnalyses();
      if (response.error) {
        setError(response.error);
      } else {
        setAnalyses(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market analyses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnalysis = useCallback(async (params: {
    latitude: number;
    longitude: number;
    radius: number;
    analysis_type: string;
  }): Promise<MarketAnalysis | null> => {
    try {
      const response = await apiClient.createMarketAnalysis(params);
      if (response.error) {
        setError(response.error);
        return null;
      } else {
        const newAnalysis = response.data;
        if (newAnalysis) {
          setAnalyses(prev => [newAnalysis, ...prev]);
        }
        return newAnalysis || null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create market analysis');
      return null;
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return {
    analyses,
    loading,
    error,
    createAnalysis,
    refetch: fetchAnalyses,
  };
}

// Hook for real data fetching
export function useRealDataFetcher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const fetchRealData = useCallback(async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    platforms?: string[];
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.fetchRealRestaurantData(params);
      if (response.error) {
        setError(response.error);
        setLastResult(null);
      } else {
        setLastResult(response.data);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch real data';
      setError(errorMsg);
      setLastResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    lastResult,
    fetchRealData,
  };
}

// Hook for real-time location-based restaurant data
export function useLocationBasedRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        fetchNearbyRestaurants(location.lat, location.lng);
      },
      (error) => {
        console.error('Error getting location:', error);
        // Default to Bangkok center if location access denied
        const bangkokCenter = { lat: 13.7563, lng: 100.5018 };
        setUserLocation(bangkokCenter);
        fetchNearbyRestaurants(bangkokCenter.lat, bangkokCenter.lng);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Fetch nearby restaurants from Wongnai
  const fetchNearbyRestaurants = useCallback(async (lat: number, lng: number, radius: number = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from Wongnai API first
      const wongnaiResponse = await apiClient.searchWongnaiRestaurants({
        latitude: lat,
        longitude: lng,
        limit: 50
      });

      if (wongnaiResponse.data?.restaurants) {
        setRestaurants(wongnaiResponse.data.restaurants);
      } else {
        // Fallback to general restaurant search
        const generalResponse = await apiClient.searchRestaurantsByLocation(lat, lng, radius);
        setRestaurants(generalResponse.data || []);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to fetch nearby restaurants');
      // Load some demo data as fallback
      setRestaurants(getDemoRestaurants(lat, lng));
    } finally {
      setLoading(false);
    }
  }, []);

  // Demo restaurants for fallback
  const getDemoRestaurants = (lat: number, lng: number): Restaurant[] => [
    {
      id: 1,
      name: "Gaggan Anand",
      cuisine: "Progressive Indian",
      rating: 4.8,
      price_range: "฿฿฿฿",
      latitude: lat + 0.001,
      longitude: lng + 0.001,
      address: "68/1 Soi Langsuan, Ploenchit Rd",
      phone: "+66 2 652 1700",
      platform: "wongnai",
      images: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      description: "World-renowned progressive Indian cuisine",
      hours: "18:00-23:00",
      website: "https://www.gaggan.com"
    },
    {
      id: 2,
      name: "Sorn",
      cuisine: "Southern Thai",
      rating: 4.7,
      price_range: "฿฿฿฿",
      latitude: lat - 0.002,
      longitude: lng + 0.003,
      address: "56 Sukhumvit Soi 26",
      phone: "+66 2 663 3710",
      platform: "wongnai",
      images: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
      description: "Authentic Southern Thai flavors",
      hours: "18:00-22:00",
      website: "https://www.sornbangkok.com"
    },
    {
      id: 3,
      name: "Le Du",
      cuisine: "Modern Thai",
      rating: 4.6,
      price_range: "฿฿฿",
      latitude: lat + 0.003,
      longitude: lng - 0.001,
      address: "399/3 Silom Rd, Silom",
      phone: "+66 2 919 9918",
      platform: "wongnai",
      images: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
      description: "Contemporary Thai cuisine with local ingredients",
      hours: "18:00-23:00",
      website: "https://www.ledubkk.com"
    }
  ];

  // Auto-fetch on mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    restaurants,
    loading,
    error,
    userLocation,
    refetch: getCurrentLocation,
    fetchNearbyRestaurants
  };
}

// Hook for service health checks
export function useServiceHealth() {
  const [backendHealth, setBackendHealth] = useState<{ status: string; message: string } | null>(null);
  const [agentHealth, setAgentHealth] = useState<{ status: string; version: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    
    try {
      const [backendResponse, agentResponse] = await Promise.all([
        apiClient.checkBackendHealth(),
        apiClient.checkAgentHealth(),
      ]);

      setBackendHealth(backendResponse.data || null);
      setAgentHealth(agentResponse.data || null);
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    backendHealth,
    agentHealth,
    loading,
    refetch: checkHealth,
  };
}