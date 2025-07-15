"use client";

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  marketAnalyses: number;
  locationsAnalyzed: number;
  aiInsights: number;
  restaurantsExplored: number;
  totalRevenue?: number;
  activeUsers?: number;
}

export interface MarketAnalysisData {
  id: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  competitorCount: number;
  marketScore: number;
  recommendations: string[];
  analysis: {
    total_restaurants: number;
    avg_rating: number;
    price_distribution: Record<string, number>;
    cuisine_distribution: Record<string, number>;
  };
  createdAt: string;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'recommendation' | 'trend';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
}

export interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  visitors: {
    current: number;
    previous: number;
    change: number;
  };
  conversion: {
    current: number;
    previous: number;
    change: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
    visitors: number;
    conversion: number;
  }>;
}

export interface LocationIntelligence {
  hotspots: Array<{
    id: string;
    name: string;
    score: number;
    type: string;
    coordinates: [number, number];
    footTraffic: number;
    demographics: {
      avgAge: number;
      avgIncome: number;
      lifestyle: string[];
    };
  }>;
  demographics: {
    avgIncome: number;
    ageGroups: Record<string, number>;
    lifestyle: string[];
    population: number;
  };
  competition: {
    density: number;
    avgRating: number;
    priceRange: Record<string, number>;
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    marketAnalyses: 0,
    locationsAnalyzed: 0,
    aiInsights: 0,
    restaurantsExplored: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analytics data from backend
      const response = await fetch('/api/analytics/dashboard-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      } else {
        // Fallback to mock data if API is not available
        setStats({
          marketAnalyses: 12,
          locationsAnalyzed: 8,
          aiInsights: 24,
          restaurantsExplored: 156,
          totalRevenue: 45000,
          activeUsers: 1250,
        });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      // Use mock data as fallback
      setStats({
        marketAnalyses: 12,
        locationsAnalyzed: 8,
        aiInsights: 24,
        restaurantsExplored: 156,
        totalRevenue: 45000,
        activeUsers: 1250,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useMarketAnalyses() {
  const [analyses, setAnalyses] = useState<MarketAnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analytics/market-analyses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses || []);
      } else {
        // Fallback to mock data
        setAnalyses([
          {
            id: '1',
            location: 'Downtown Bangkok',
            coordinates: { latitude: 13.7563, longitude: 100.5018 },
            competitorCount: 23,
            marketScore: 8.5,
            recommendations: ['High foot traffic area', 'Strong lunch market', 'Tourist-friendly location'],
            analysis: {
              total_restaurants: 23,
              avg_rating: 4.2,
              price_distribution: { '$': 30, '$$': 45, '$$$': 20, '$$$$': 5 },
              cuisine_distribution: { 'Thai': 40, 'International': 35, 'Asian': 25 },
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            location: 'Sukhumvit Road',
            coordinates: { latitude: 13.7308, longitude: 100.5418 },
            competitorCount: 31,
            marketScore: 7.2,
            recommendations: ['Evening dining focus', 'Expat community', 'Higher price tolerance'],
            analysis: {
              total_restaurants: 31,
              avg_rating: 4.0,
              price_distribution: { '$': 20, '$$': 40, '$$$': 30, '$$$$': 10 },
              cuisine_distribution: { 'International': 50, 'Thai': 30, 'Asian': 20 },
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch market analyses:', err);
      setError('Failed to load market analyses');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAnalysis = useCallback(async (params: {
    latitude: number;
    longitude: number;
    businessType?: string;
    radius?: number;
  }) => {
    try {
      const response = await fetch('/api/ai/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchAnalyses(); // Refresh the list
        return data;
      } else {
        throw new Error('Failed to generate market analysis');
      }
    } catch (err) {
      console.error('Failed to generate market analysis:', err);
      throw err;
    }
  }, [fetchAnalyses]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return { analyses, loading, error, refetch: fetchAnalyses, generateAnalysis };
}

export function useAIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/ai/insights', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      } else {
        // Fallback to mock data
        setInsights([
          {
            id: '1',
            type: 'opportunity',
            title: 'Breakfast Market Gap',
            description: 'Limited breakfast options in your target area present a significant opportunity for early morning dining.',
            confidence: 0.89,
            actionable: true,
            priority: 'high',
            category: 'market-opportunity',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'trend',
            title: 'Plant-Based Demand Rising',
            description: 'Vegetarian and vegan options showing 34% increase in local searches over the past 3 months.',
            confidence: 0.76,
            actionable: true,
            priority: 'medium',
            category: 'consumer-trend',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            type: 'warning',
            title: 'High Competition Zone',
            description: 'Your selected area has 40% more restaurants than city average, requiring strong differentiation.',
            confidence: 0.92,
            actionable: false,
            priority: 'high',
            category: 'competition',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: '4',
            type: 'recommendation',
            title: 'Optimal Pricing Strategy',
            description: 'Based on local market analysis, mid-range pricing ($15-25) shows highest success rate.',
            confidence: 0.84,
            actionable: true,
            priority: 'medium',
            category: 'pricing',
            createdAt: new Date(Date.now() - 10800000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
      setError('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { insights, loading, error, refetch: fetchInsights };
}

export function useAnalyticsData(timeRange: string = 'month') {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/realtime?range=${timeRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || null);
      } else {
        // Fallback to mock data
        const mockTrends = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 5000) + 2000,
          visitors: Math.floor(Math.random() * 500) + 200,
          conversion: Math.random() * 10 + 5,
        }));

        setAnalytics({
          revenue: { current: 45000, previous: 42000, change: 7.1 },
          visitors: { current: 12500, previous: 11800, change: 5.9 },
          conversion: { current: 8.4, previous: 7.9, change: 6.3 },
          trends: mockTrends,
        });
      }
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

export function useLocationIntelligence() {
  const [locationData, setLocationData] = useState<LocationIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationData = useCallback(async (latitude?: number, longitude?: number) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (latitude) params.append('latitude', latitude.toString());
      if (longitude) params.append('longitude', longitude.toString());

      const response = await fetch(`/api/location/intelligence?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocationData(data.intelligence || null);
      } else {
        // Fallback to mock data
        setLocationData({
          hotspots: [
            {
              id: '1',
              name: 'Central Business District',
              score: 9.2,
              type: 'business',
              coordinates: [13.7563, 100.5018],
              footTraffic: 8500,
              demographics: { avgAge: 32, avgIncome: 65000, lifestyle: ['professional', 'urban'] },
            },
            {
              id: '2',
              name: 'Shopping District',
              score: 8.7,
              type: 'retail',
              coordinates: [13.7308, 100.5418],
              footTraffic: 12000,
              demographics: { avgAge: 28, avgIncome: 45000, lifestyle: ['shopping', 'entertainment'] },
            },
          ],
          demographics: {
            avgIncome: 55000,
            ageGroups: { '18-25': 25, '26-35': 35, '36-45': 25, '46+': 15 },
            lifestyle: ['urban', 'professional', 'tech-savvy'],
            population: 125000,
          },
          competition: {
            density: 2.3,
            avgRating: 4.1,
            priceRange: { '$': 30, '$$': 45, '$$$': 20, '$$$$': 5 },
          },
        });
      }
    } catch (err) {
      console.error('Failed to fetch location intelligence:', err);
      setError('Failed to load location intelligence');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocationData();
  }, [fetchLocationData]);

  return { locationData, loading, error, refetch: fetchLocationData };
}

export function useRestaurantExplorer() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async (params?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    cuisine?: string;
    priceRange?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getAllRestaurants();
      
      if (response.data) {
        setRestaurants(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchRestaurants = useCallback(async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    cuisine?: string;
    priceRange?: number;
  }) => {
    try {
      setLoading(true);
      const response = await apiClient.searchRestaurantsByLocation(
        params.latitude,
        params.longitude,
        params.radius,
        params.cuisine,
        params.priceRange
      );
      
      if (response.data) {
        setRestaurants(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Failed to search restaurants:', err);
      setError('Failed to search restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return { restaurants, loading, error, refetch: fetchRestaurants, searchRestaurants };
}