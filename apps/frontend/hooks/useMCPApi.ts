/**
 * React Hooks for MCP API Integration
 */

import { useState, useEffect, useCallback } from 'react';
import mcpApiClient, { MCPResponse, Restaurant, AIRecommendation } from '../lib/mcp-api-client';

// Generic hook for MCP API calls
export function useMCPApi<T>(
  apiCall: () => Promise<MCPResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'API call failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// Restaurant search hook
export function useRestaurantSearch(params: {
  location: string;
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  features?: string[];
  limit?: number;
  offset?: number;
}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!params.location) return;

    setLoading(true);
    setError(null);

    try {
      const response = await mcpApiClient.searchRestaurants(params);
      if (response.success) {
        setRestaurants(response.data.restaurants);
        setRecommendations(response.data.recommendations);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error');
    } finally {
      setLoading(false);
    }
  }, [params.location, params.cuisine, params.priceRange, params.rating, params.limit, params.offset]);

  useEffect(() => {
    search();
  }, [search]);

  return {
    restaurants,
    recommendations,
    total,
    loading,
    error,
    refetch: search
  };
}

// Restaurant details hook
export function useRestaurantDetails(id: string) {
  return useMCPApi(
    () => mcpApiClient.getRestaurantDetails(id),
    [id]
  );
}

// AI Chat hook
export function useAIChat() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, context?: any) => {
    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await mcpApiClient.chatWithAI({
        message,
        context,
        userId: 'current_user' // Replace with actual user ID
      });

      if (response.success) {
        const aiMessage = {
          id: response.data.meta.messageId,
          type: 'ai' as const,
          content: response.data.response,
          timestamp: response.data.meta.timestamp
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError(response.error || 'Chat failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat error');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages
  };
}

// AI Recommendations hook
export function useAIRecommendations(params: {
  userId: string;
  location: string | { latitude: number; longitude: number };
  preferences?: any;
  context?: any;
}) {
  return useMCPApi(
    () => mcpApiClient.getAIRecommendations(params),
    [params.userId, JSON.stringify(params.location), JSON.stringify(params.preferences)]
  );
}

// Nearby restaurants hook
export function useNearbyRestaurants(params: {
  lat: number;
  lng: number;
  radius?: number;
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  limit?: number;
}) {
  return useMCPApi(
    () => mcpApiClient.findNearbyRestaurants(params),
    [params.lat, params.lng, params.radius, params.cuisine, params.priceRange, params.rating, params.limit]
  );
}

// Analytics dashboard hook
export function useAnalyticsDashboard(params: {
  timeframe?: string;
  metrics?: string;
  userId?: string;
  restaurantId?: string;
} = {}) {
  return useMCPApi(
    () => mcpApiClient.getAnalyticsDashboard(params),
    [params.timeframe, params.metrics, params.userId, params.restaurantId]
  );
}

// Event tracking hook
export function useEventTracking() {
  const trackEvent = useCallback(async (event: {
    event: string;
    properties?: any;
    userId?: string;
    sessionId?: string;
  }) => {
    try {
      await mcpApiClient.trackEvent(event);
    } catch (error) {
      console.error('Event tracking failed:', error);
    }
  }, []);

  return { trackEvent };
}

// Geocoding hook
export function useGeocoding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpApiClient.geocodeAddress(address);
      setLoading(false);
      return response.success ? response.data : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Geocoding error');
      setLoading(false);
      return null;
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpApiClient.reverseGeocode(lat, lng);
      setLoading(false);
      return response.success ? response.data : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reverse geocoding error');
      setLoading(false);
      return null;
    }
  }, []);

  return {
    geocodeAddress,
    reverseGeocode,
    loading,
    error
  };
}

// Payment hook
export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (params: {
    amount: number;
    currency?: string;
    customerId?: string;
    restaurantId?: string;
    reservationDetails?: any;
    metadata?: any;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mcpApiClient.createPaymentIntent(params);
      setLoading(false);
      return response.success ? response.data : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment error');
      setLoading(false);
      return null;
    }
  }, []);

  return {
    createPaymentIntent,
    loading,
    error
  };
}

// MCP Tools hook
export function useMCPTools() {
  return useMCPApi(
    () => mcpApiClient.getMCPTools(),
    []
  );
}

// Health check hook
export function useHealthCheck() {
  return useMCPApi(
    () => mcpApiClient.healthCheck(),
    []
  );
}