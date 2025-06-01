/**
 * React hooks for restaurant data management
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Restaurant, RestaurantMenu, MarketAnalysis } from '../lib/api-client';

export interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseRestaurantMenuResult {
  menu: RestaurantMenu | null;
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
  const [menu, setMenu] = useState<RestaurantMenu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    if (!publicId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getRestaurantMenu(publicId);
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