/**
 * React hooks for restaurant data management
 */

import { useState, useEffect, useCallback } from "react";
import {
  apiClient,
  Restaurant,
  RestaurantMenu,
  MarketAnalysis,
  MenuItem,
} from "../lib/api-client";
import { FEATURES, FOURSQUARE_CONFIG } from "../lib/config";

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
      setError(
        err instanceof Error ? err.message : "Failed to fetch restaurants",
      );
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

  const searchByLocation = useCallback(
    async (latitude: number, longitude: number, radius: number = 5) => {
      setLoading(true);
      setError(null);

      try {
        // First try to get restaurants from Foursquare
        const foursquareResponse = await apiClient.searchFoursquareRestaurants({
          latitude,
          longitude,
          radius,
          limit: 20,
        });

        if (
          foursquareResponse.data &&
          foursquareResponse.data.restaurants &&
          foursquareResponse.data.restaurants.length > 0
        ) {
          console.log(
            "✅ Found restaurants from Foursquare:",
            foursquareResponse.data.restaurants.length,
          );
          setRestaurants(foursquareResponse.data.restaurants);
          setLoading(false);
          return;
        }

        // If Foursquare fails, fall back to regular search
        const response = await apiClient.searchRestaurantsByLocation(
          latitude,
          longitude,
          radius,
        );
        if (response.error) {
          setError(response.error);
          setRestaurants([]);
        } else {
          setRestaurants(response.data || []);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search restaurants",
        );
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const searchWongnai = useCallback(
    async (params: {
      latitude?: number;
      longitude?: number;
      query?: string;
      cuisine?: string;
      limit?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        // First try Foursquare if we have coordinates
        if (params.latitude && params.longitude) {
          const foursquareResponse =
            await apiClient.searchFoursquareRestaurants({
              latitude: params.latitude,
              longitude: params.longitude,
              query: params.query,
              limit: params.limit || 20,
            });

          if (
            foursquareResponse.data &&
            foursquareResponse.data.restaurants &&
            foursquareResponse.data.restaurants.length > 0
          ) {
            console.log(
              "✅ Found restaurants from Foursquare:",
              foursquareResponse.data.restaurants.length,
            );
            setRestaurants(foursquareResponse.data.restaurants);
            setLoading(false);
            return;
          }
        }

        // Fall back to Wongnai search
        const response = await apiClient.searchWongnaiRestaurants({
          latitude: params.latitude,
          longitude: params.longitude,
          query: params.query,
          cuisine: params.cuisine,
          limit: params.limit || 10,
        });

        if (response.error) {
          setError(response.error);
          setRestaurants([]);
        } else {
          setRestaurants(response.data?.restaurants || []);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search restaurants",
        );
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    restaurants,
    loading,
    error,
    searchByLocation,
    searchWongnai,
  };
}

// Hook for fetching restaurant menu
export function useRestaurantMenu(
  publicId: string | null,
): UseRestaurantMenuResult {
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
        setError("Invalid restaurant ID");
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
      setError(err instanceof Error ? err.message : "Failed to fetch menu");
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
      setError(
        err instanceof Error ? err.message : "Failed to fetch market analyses",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnalysis = useCallback(
    async (params: {
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
            setAnalyses((prev) => [newAnalysis, ...prev]);
          }
          return newAnalysis || null;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create market analysis",
        );
        return null;
      }
    },
    [],
  );

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

  const fetchRealData = useCallback(
    async (params: {
      latitude: number;
      longitude: number;
      radius?: number;
      platforms?: string[];
    }) => {
      setLoading(true);
      setError(null);

      try {
        // First try Foursquare
        const foursquareResponse = await apiClient.searchFoursquareRestaurants({
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius,
          limit: 20,
        });

        if (
          foursquareResponse.data &&
          foursquareResponse.data.restaurants &&
          foursquareResponse.data.restaurants.length > 0
        ) {
          console.log(
            "✅ Found restaurants from Foursquare:",
            foursquareResponse.data.restaurants.length,
          );
          setLastResult({
            status: "success",
            source: "foursquare",
            restaurants: foursquareResponse.data.restaurants,
            total: foursquareResponse.data.restaurants.length,
          });
          return foursquareResponse.data.restaurants;
        }

        // Fall back to the regular API
        const response = await apiClient.fetchRealRestaurantData(params);
        if (response.error) {
          setError(response.error);
          setLastResult(null);
        } else {
          setLastResult(response.data);
        }
        return response.data;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch real data";
        setError(errorMsg);
        setLastResult(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    lastResult,
    fetchRealData,
  };
}

// Enhanced hook for real-time location-based restaurant data with buffer radius
export function useLocationBasedRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchRadius, setSearchRadius] = useState(5);
  const [bufferRadius, setBufferRadius] = useState(0.5);
  const [autoAdjustRadius, setAutoAdjustRadius] = useState(true);
  const [bufferZones, setBufferZones] = useState<any>(null);
  const [searchMetrics, setSearchMetrics] = useState<any>(null);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );

  // Fetch restaurants from Foursquare
  const fetchRestaurantsFromFoursquare = useCallback(
    async (lat: number, lng: number, radius: number = 5) => {
      setLoading(true);
      setError(null);

      try {
        console.log(
          `🔍 Fetching restaurants from Foursquare near: ${lat}, ${lng} within ${radius}km`,
        );

        const response = await apiClient.searchFoursquareRestaurants({
          latitude: lat,
          longitude: lng,
          radius: radius * 1000, // Convert to meters
          limit: 20,
        });

        if (
          response.data &&
          response.data.restaurants &&
          response.data.restaurants.length > 0
        ) {
          console.log(
            `✅ Found ${response.data.restaurants.length} restaurants from Foursquare API`,
          );
          setRestaurants(response.data.restaurants);

          // Update search metrics
          setSearchMetrics({
            search_radius: radius,
            results_count: response.data.restaurants.length,
            data_source: "foursquare_api",
            last_search: new Date().toISOString(),
          });

          setLoading(false);
          return;
        }

        // If Foursquare fails, fall back to regular search
        console.log(
          "⚠️ No restaurants found from Foursquare, falling back to regular search",
        );
        fetchNearbyRestaurants(lat, lng, radius);
      } catch (err) {
        console.error("❌ Error fetching from Foursquare:", err);
        // Fall back to regular search
        fetchNearbyRestaurants(lat, lng, radius);
      }
    },
    [],
  );

  // Enhanced location tracking with real-time updates
  const getCurrentLocation = useCallback(
    (options?: {
      enableHighAccuracy?: boolean;
      timeout?: number;
      maximumAge?: number;
    }) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser");
        return;
      }

      setLoading(true);
      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
        ...options,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);

          // Enhanced location update with streaming and auto-search
          updateUserLocationOnBackend(position.coords, {
            auto_search: autoAdjustRadius,
            search_radius: searchRadius,
            include_nearby: true,
            use_streaming: true,
          });

          // Try Foursquare first
          fetchRestaurantsFromFoursquare(
            location.lat,
            location.lng,
            searchRadius,
          );
        },
        (error) => {
          // Better error handling for geolocation
          let errorMessage = "Location access denied";
          if (error.code === 1) {
            errorMessage = "Location permission denied by user";
          } else if (error.code === 2) {
            errorMessage = "Location unavailable";
          } else if (error.code === 3) {
            errorMessage = "Location request timeout";
          }

          console.log(`📍 Location error: ${errorMessage} ${error.code}`);

          // Default to Bangkok center if location access denied
          const bangkokCenter = { lat: 13.7563, lng: 100.5018 };
          setUserLocation(bangkokCenter);

          // Try Foursquare with default location
          fetchRestaurantsFromFoursquare(
            bangkokCenter.lat,
            bangkokCenter.lng,
            searchRadius,
          );
        },
        defaultOptions,
      );
    },
    [searchRadius, autoAdjustRadius, fetchRestaurantsFromFoursquare],
  );

  // Fetch nearby restaurants using real data endpoint
  const fetchNearbyRestaurants = useCallback(
    async (lat: number, lng: number, radius: number = 5) => {
      setLoading(true);
      setError(null);

      try {
        console.log(
          `🔍 Fetching real restaurants near: ${lat}, ${lng} within ${radius}km`,
        );

        // Use the searchRestaurantsByLocation method which calls /restaurants/search with coordinates
        const response = await apiClient.searchRestaurantsByLocation(
          lat,
          lng,
          radius,
        );

        if (response.data && response.data.length > 0) {
          console.log(`✅ Found ${response.data.length} real restaurants`);
          setRestaurants(response.data);

          // Update search metrics
          setSearchMetrics({
            search_radius: radius,
            results_count: response.data.length,
            data_source: "api_search",
            last_search: new Date().toISOString(),
          });
        } else {
          // If API returns no data (empty array or null)
          setRestaurants(response.data || []); // Set to empty array if null/undefined
          if (response.error) setError(response.error); // Preserve error from response if any
        }
      } catch (err) {
        console.error("❌ Error fetching restaurants:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to fetch nearby restaurants";
        setError(errorMsg);
        setRestaurants([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Enhanced location update with streaming and nearby restaurant discovery
  const updateUserLocationOnBackend = useCallback(
    async (
      coords: GeolocationCoordinates,
      options?: {
        auto_search?: boolean;
        search_radius?: number;
        include_nearby?: boolean;
        use_streaming?: boolean;
      },
    ) => {
      try {
        const updateParams = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          altitude: coords.altitude,
          heading: coords.heading,
          speed: coords.speed,
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          device_info: {
            user_agent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
          },
        };

        // Use streaming endpoint if enabled and auto_search is true
        if (options?.use_streaming && options?.auto_search) {
          const streamResponse = await apiClient.streamUserLocation({
            ...updateParams,
            auto_search: options.auto_search,
            search_radius: options.search_radius || searchRadius,
            max_results: 10,
            include_nearby: options.include_nearby ?? true,
          });

          if (streamResponse.data) {
            // Update restaurants from streaming response
            setRestaurants(streamResponse.data.restaurants || []);
            setSearchMetrics(streamResponse.data.search_metrics || null);

            console.log(
              `📍 Location streamed with ${streamResponse.data.restaurants?.length || 0} nearby restaurants`,
            );
          } else if (streamResponse.error) {
            console.warn("Location streaming failed:", streamResponse.error);
            // Fall back to Foursquare
            fetchRestaurantsFromFoursquare(
              coords.latitude,
              coords.longitude,
              options.search_radius || searchRadius,
            );
          }
        } else {
          // Use regular location update
          const response = await apiClient.updateUserLocation(updateParams);

          if (response.data?.nearby_restaurants) {
            setRestaurants(response.data.nearby_restaurants);
          } else {
            // Fall back to Foursquare
            fetchRestaurantsFromFoursquare(
              coords.latitude,
              coords.longitude,
              options?.search_radius || searchRadius,
            );
          }
        }
      } catch (error) {
        console.warn("Failed to update location on backend:", error);
        // Fall back to Foursquare
        fetchRestaurantsFromFoursquare(
          coords.latitude,
          coords.longitude,
          options?.search_radius || searchRadius,
        );
      }
    },
    [sessionId, searchRadius, fetchRestaurantsFromFoursquare],
  );

  // Enhanced fetch with auto-radius adjustment and buffer zones
  const fetchNearbyRestaurantsWithAutoRadius = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      setError(null);

      try {
        // Try Foursquare first
        const foursquareResponse = await apiClient.searchFoursquareRestaurants({
          latitude: lat,
          longitude: lng,
          radius: 5000, // 5km in meters
          limit: 20,
        });

        if (
          foursquareResponse.data &&
          foursquareResponse.data.restaurants &&
          foursquareResponse.data.restaurants.length > 0
        ) {
          console.log(
            `✅ Found ${foursquareResponse.data.restaurants.length} restaurants from Foursquare API`,
          );
          setRestaurants(foursquareResponse.data.restaurants);

          // Update search metrics
          setSearchMetrics({
            search_radius: 5,
            results_count: foursquareResponse.data.restaurants.length,
            data_source: "foursquare_api",
            last_search: new Date().toISOString(),
          });

          setLoading(false);
          return;
        }

        // If Foursquare fails, try the realtime search endpoint
        console.log(
          "⚠️ No restaurants found from Foursquare, trying realtime search...",
        );
        const response = await apiClient.searchRestaurantsRealtime({
          latitude: lat,
          longitude: lng,
          initial_radius: 2,
          max_radius: 15,
          min_results: 5,
          limit: 20,
          buffer_zones: true,
          session_id: sessionId,
        });

        if (response.data) {
          setRestaurants(response.data.restaurants || []);
          setBufferZones(response.data.buffer_zones || null);
          setSearchMetrics({
            searchParams: response.data.search_params,
            autoAdjustment: response.data.auto_adjustment,
          });
        } else {
          throw new Error(response.error || "Failed to fetch restaurant data");
        }
      } catch (err) {
        console.warn(
          "Realtime search failed, falling back to regular search:",
          err,
        );

        // Fallback to regular search if realtime fails
        try {
          const fallbackResponse = await apiClient.searchRestaurantsByLocation(
            lat,
            lng,
            10,
          );
          if (fallbackResponse.data && fallbackResponse.data.length > 0) {
            setRestaurants(fallbackResponse.data);
            setSearchMetrics({
              search_radius: 10,
              results_count: fallbackResponse.data.length,
              data_source: "fallback_search",
              last_search: new Date().toISOString(),
            });
          } else {
            setRestaurants(fallbackResponse.data || []);
          }
        } catch (fallbackErr) {
          console.error("Fallback search also failed:", fallbackErr);
          const errorMsg =
            fallbackErr instanceof Error
              ? fallbackErr.message
              : "Failed to fetch nearby restaurants";
          setError(errorMsg);
          setRestaurants([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [sessionId],
  );

  // Enhanced fetch with buffer radius
  const fetchNearbyRestaurantsWithBuffer = useCallback(
    async (lat: number, lng: number, radius: number = 5) => {
      setLoading(true);
      setError(null);

      try {
        // Try Foursquare first
        const foursquareResponse = await apiClient.searchFoursquareRestaurants({
          latitude: lat,
          longitude: lng,
          radius: radius * 1000, // Convert to meters
          limit: 20,
        });

        if (
          foursquareResponse.data &&
          foursquareResponse.data.restaurants &&
          foursquareResponse.data.restaurants.length > 0
        ) {
          console.log(
            `✅ Found ${foursquareResponse.data.restaurants.length} restaurants from Foursquare API`,
          );
          setRestaurants(foursquareResponse.data.restaurants);

          // Update search metrics
          setSearchMetrics({
            search_radius: radius,
            results_count: foursquareResponse.data.restaurants.length,
            data_source: "foursquare_api",
            last_search: new Date().toISOString(),
          });

          setLoading(false);
          return;
        }

        // If Foursquare fails, try the buffer search endpoint
        console.log(
          "⚠️ No restaurants found from Foursquare, trying buffer search...",
        );
        const response = await apiClient.getNearbyRestaurantsWithBuffer({
          latitude: lat,
          longitude: lng,
          radius: radius,
          buffer_radius: bufferRadius,
          platforms: ["foursquare", "wongnai", "google"],
          limit: 20,
          real_time: true,
        });

        if (response.data) {
          setRestaurants(response.data.restaurants || []);
          setSearchMetrics({
            searchParams: response.data.search_params,
            dataSources: response.data.data_sources,
          });
        } else {
          throw new Error(response.error || "Failed to fetch restaurant data");
        }
      } catch (err) {
        console.warn(
          "Buffer search failed, falling back to regular search:",
          err,
        );

        // Fallback to regular search if buffer search fails
        try {
          const fallbackResponse = await apiClient.searchRestaurantsByLocation(
            lat,
            lng,
            radius,
          );
          if (fallbackResponse.data && fallbackResponse.data.length > 0) {
            setRestaurants(fallbackResponse.data);
            setSearchMetrics({
              search_radius: radius,
              results_count: fallbackResponse.data.length,
              data_source: "fallback_search",
              last_search: new Date().toISOString(),
            });
          } else {
            setRestaurants(fallbackResponse.data || []);
          }
        } catch (fallbackErr) {
          console.error("Fallback search also failed:", fallbackErr);
          const errorMsg =
            fallbackErr instanceof Error
              ? fallbackErr.message
              : "Failed to fetch nearby restaurants";
          setError(errorMsg);
          setRestaurants([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [bufferRadius],
  );

  // Auto-fetch on mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    restaurants,
    loading,
    error,
    userLocation,
    searchRadius,
    bufferRadius,
    autoAdjustRadius,
    bufferZones,
    searchMetrics,
    sessionId,
    refetch: getCurrentLocation,
    fetchNearbyRestaurants,
    fetchNearbyRestaurantsWithAutoRadius,
    fetchNearbyRestaurantsWithBuffer,
    setSearchRadius,
    setBufferRadius,
    setAutoAdjustRadius,
    updateUserLocationOnBackend,
    fetchRestaurantsFromFoursquare,
  };
}

// Hook for location preferences management
export function useLocationPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<{
    default_search_radius: number;
    max_search_radius: number;
    location_sharing_enabled: boolean;
    auto_location_update: boolean;
    distance_unit: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getLocationPreferences(userId);
      if (response.error) {
        setError(response.error);
      } else {
        setPreferences(response.data?.preferences || null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch preferences",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updatePreferences = useCallback(
    async (newPreferences: {
      default_search_radius?: number;
      max_search_radius?: number;
      location_sharing_enabled?: boolean;
      auto_location_update?: boolean;
      distance_unit?: "km" | "miles";
    }) => {
      if (!userId) return false;

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.setLocationPreferences({
          user_id: userId,
          ...newPreferences,
        });

        if (response.error) {
          setError(response.error);
          return false;
        } else {
          setPreferences(response.data?.preferences || null);
          return true;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update preferences",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (userId) {
      fetchPreferences();
    }
  }, [userId, fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  };
}

// Hook for location history
export function useLocationHistory(userId?: string) {
  const [locations, setLocations] = useState<
    Array<{
      latitude: number;
      longitude: number;
      accuracy?: number;
      altitude?: number;
      heading?: number;
      speed?: number;
      timestamp: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(
    async (options?: { limit?: number; hours?: number }) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getUserLocationHistory(
          userId,
          options,
        );
        if (response.error) {
          setError(response.error);
        } else {
          setLocations(response.data?.locations || []);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch location history",
        );
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId, fetchHistory]);

  return {
    locations,
    loading,
    error,
    fetchHistory,
    refetch: fetchHistory,
  };
}

// Hook for service health checks
export function useServiceHealth() {
  const [backendHealth, setBackendHealth] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [agentHealth, setAgentHealth] = useState<{
    status: string;
    version: string;
  } | null>(null);
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
      console.error("Health check failed:", err);
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
