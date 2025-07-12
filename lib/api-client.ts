/**
 * BiteBase API Client
 * Centralized API client for connecting to backend services
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  cuisine?: string;
  price_range?: string;
  rating?: number;
  review_count?: number;
  platform?: string;
  platform_id?: string;
  featured?: boolean;
  promotion?: string; // Added for featured promotions
  user_id?: string;
  phone?: string;
  website?: string;
  hours?: any; // Can be string or object
  features?: any; // Can be string or array
  images?: string | string[]; // Now supports single string or array
  description?: string;
  menu_url?: string;
  delivery_available?: string;
  takeout_available?: string;
  reservations_available?: string;
  created_at?: string;
  updated_at?: string;
  // For detailed view
  reviews?: any[];
  menu_items?: MenuItem[];
  avg_rating?: number;
  similar_restaurants?: Restaurant[];
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  is_available?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface RestaurantMenu {
  publicId: string;
  restaurant_name: string;
  menu_categories: MenuCategory[];
  delivery_info: {
    isAvailable: boolean;
    minimumOrder: number;
    deliveryFee: number;
    estimatedTime: string;
  };
  last_updated: string;
}

export interface MarketAnalysis {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  analysis_type: string;
  results: {
    total_restaurants: number;
    avg_rating: number;
    price_distribution: Record<string, number>;
    cuisine_distribution: Record<string, number>;
    recommendations: string[];
  };
  created_at: string;
}

import {
  API_CONFIG,
  ENDPOINTS,
  DEFAULT_HEADERS,
  DEBUG,
  FOURSQUARE_CONFIG,
} from "./config";

class ApiClient {
  private baseUrl: string;
  private agentUrl: string;

  constructor() {
    // Use unified configuration with fallback
    this.baseUrl = API_CONFIG.BASE_URL;
    this.agentUrl = this.baseUrl; // Unified backend

    // Ensure we have a valid base URL
    if (!this.baseUrl || this.baseUrl === "undefined") {
      this.baseUrl = "http://localhost:3001";
      console.warn(
        "⚠️ API_CONFIG.BASE_URL is undefined, using fallback:",
        this.baseUrl,
      );
    }

    if (DEBUG.LOG_API_CALLS) {
      console.log("🔗 API Client initialized with:", this.baseUrl);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      if (DEBUG.LOG_API_CALLS) {
        console.log(`🌐 API Request: ${options.method || "GET"} ${url}`);
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.REQUEST_TIMEOUT,
      );

      const response = await fetch(url, {
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        signal: controller.signal,
        mode: "cors",
        credentials: "include",
        ...options,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn(
          `⚠️ Failed to parse JSON response from ${endpoint}:`,
          parseError,
        );
        data = { message: "Invalid JSON response" };
      }

      if (!response.ok) {
        if (DEBUG.LOG_API_CALLS) {
          console.error(
            `❌ API Error ${response.status}:`,
            data.message || "Unknown error",
          );
        }
        return {
          error:
            data.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      if (DEBUG.LOG_API_CALLS) {
        console.log(`✅ API Success: ${endpoint}`);
      }
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error(`⏰ Request timeout for ${endpoint}`);
        return {
          error: "Request timeout - please check your connection",
          status: 408,
        };
      }

      // Enhanced error handling for network issues
      let errorMessage = "Network error";
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to server - please check if the backend is running";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error(`❌ Network Error for ${endpoint}:`, error);
      return {
        error: errorMessage,
        status: 0,
      };
    }
  }

  // Health checks
  async checkBackendHealth(): Promise<
    ApiResponse<{ status: string; message: string }>
  > {
    return this.request(ENDPOINTS.HEALTH);
  }

  async checkAgentHealth(): Promise<
    ApiResponse<{ status: string; version: string }>
  > {
    return this.request(ENDPOINTS.AI_STATUS);
  }

  // Restaurant data endpoints
  async getAllRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    const response = await this.request<{
      data: { restaurants: Restaurant[]; total: number; pagination: any };
      success: boolean;
    }>("/restaurants/search");
    if (response.error || !response.data?.success) {
      return {
        error: response.error || "Failed to fetch restaurants",
        status: response.status,
      };
    }
    return {
      data: response.data?.data?.restaurants || [],
      status: response.status,
    };
  }

  async getRestaurantById(id: string): Promise<ApiResponse<Restaurant>> {
    const response = await this.request<{
      data: { restaurant: Restaurant; similar_restaurants: Restaurant[] };
    }>(`/restaurants/${id}`);
    if (response.error || !response.data?.data) {
      return {
        error: response.error || "Failed to fetch restaurant",
        status: response.status,
      };
    }
    // Combine the data
    const restaurantData = response.data.data.restaurant;
    restaurantData.similar_restaurants = response.data.data.similar_restaurants;

    return {
      data: restaurantData,
      status: response.status,
    };
  }

  async searchRestaurantsByLocation(
    latitude: number,
    longitude: number,
    radius: number = 5,
    cuisine_filter?: string,
    price_range_filter?: number,
    rating_filter?: number,
  ): Promise<ApiResponse<Restaurant[]>> {
    const params = new URLSearchParams();
    params.append("latitude", latitude.toString());
    params.append("longitude", longitude.toString());
    params.append("radius", radius.toString());

    if (cuisine_filter) {
      params.append("cuisine", cuisine_filter);
    }
    if (price_range_filter) {
      params.append("price_range", price_range_filter.toString());
    }
    if (rating_filter) {
      params.append("rating", rating_filter.toString());
    }

    const response = await this.request<Restaurant[]>(
      `${ENDPOINTS.RESTAURANTS.SEARCH}?${params.toString()}`,
    );
    if (response.error) {
      return {
        error: response.error,
        status: response.status,
      };
    }
    return {
      data: response.data || [],
      status: response.status,
    };
  }

  // Foursquare integration endpoints
  async searchFoursquareRestaurants(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    query?: string;
    limit?: number;
  }): Promise<ApiResponse<{ restaurants: Restaurant[]; total: number }>> {
    const urlParams = new URLSearchParams();
    urlParams.append("latitude", params.latitude.toString());
    urlParams.append("longitude", params.longitude.toString());
    if (params.radius) {
      urlParams.append("radius", params.radius.toString());
    }
    if (params.query) {
      urlParams.append("query", params.query);
    }
    if (params.limit) {
      urlParams.append("limit", params.limit.toString());
    }
    return this.request(`/restaurants/search?${urlParams.toString()}`, {
      method: "GET",
    });
  }

  // Wongnai integration endpoints
  async searchWongnaiRestaurants(params: {
    latitude?: number;
    longitude?: number;
    query?: string;
    cuisine?: string;
    limit?: number;
  }): Promise<ApiResponse<{ restaurants: Restaurant[]; total: number }>> {
    return this.request("/restaurants/wongnai/search", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getRestaurantMenu(
    restaurantId: number,
  ): Promise<ApiResponse<MenuItem[]>> {
    return this.request(`/restaurants/${restaurantId}/menu-items`);
  }

  async getBatchMenus(publicIds: string[]): Promise<
    ApiResponse<{
      status: string;
      total_requested: number;
      successful_count: number;
      failed_count: number;
      menus: RestaurantMenu[];
      errors: string[];
    }>
  > {
    return this.request("/restaurants/menus/batch", {
      method: "POST",
      body: JSON.stringify({ publicIds }),
    });
  }

  // Wongnai API integration endpoints
  async getWongnaiBusinesses(params?: {
    query?: string;
    location?: string;
    limit?: number;
  }): Promise<
    ApiResponse<{
      businesses: Array<{
        id: string;
        publicId: string;
        name: string;
        description: string;
        cuisine: string[];
        rating: number;
        review_count: number;
        price_range: string;
        location: {
          latitude: number;
          longitude: number;
          address: string;
          district: string;
          city: string;
        };
        contact: {
          phone: string;
          website: string;
          email: string;
        };
        hours: any;
        features: string[];
        images: string[];
        delivery_available: boolean;
        takeout_available: boolean;
        source: string;
        last_updated: string;
      }>;
      total: number;
      query_params: any;
    }>
  > {
    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.append("query", params.query);
    if (params?.location) queryParams.append("location", params.location);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return this.request(`/restaurants/wongnai/businesses${query}`);
  }

  async getWongnaiDeliveryMenu(publicId: string): Promise<
    ApiResponse<{
      publicId: string;
      restaurant_name: string;
      restaurant_info: {
        id: string;
        name: string;
        cuisine: string[];
        rating: number;
        review_count: number;
        price_range: string;
        location: any;
        phone: string;
        hours: any;
      };
      menu_categories: Array<{
        id: string;
        name: string;
        description: string;
        items: Array<{
          id: string;
          name: string;
          description: string;
          price: number;
          discounted_price?: number;
          image_url: string;
          is_available: boolean;
          options: any[];
          tags: string[];
          nutrition: any;
          popularity_score: number;
        }>;
      }>;
      delivery_info: {
        isAvailable: boolean;
        minimumOrder: number;
        deliveryFee: number;
        estimatedTime: string;
        delivery_areas: string[];
      };
      pricing_analytics: {
        total_items: number;
        price_range: {
          min: number;
          max: number;
          average: number;
          median: number;
        };
        category_stats: Record<
          string,
          {
            item_count: number;
            min_price: number;
            max_price: number;
            avg_price: number;
            price_distribution: Record<string, number>;
          }
        >;
        popular_items: Array<{
          name: string;
          price: number;
          category: string;
          popularity_score: number;
        }>;
        price_distribution: Record<string, number>;
        pricing_insights: Array<{
          type: string;
          title: string;
          description: string;
          impact: string;
        }>;
      };
      last_updated: string;
    }>
  > {
    return this.request(`/restaurants/wongnai/${publicId}/delivery-menu`);
  }

  // Restaurant-to-Menu Integration endpoints
  async getRestaurantMenuPricing(restaurantId: string): Promise<
    ApiResponse<{
      restaurant: {
        id: string;
        name: string;
        cuisine_type: string;
        rating: number;
        price_range: number;
        delivery_available: boolean;
        wongnai_public_id?: string;
        has_delivery_menu: boolean;
      };
      menu_pricing: {
        total_items: number;
        price_range: {
          min: number;
          max: number;
          average: number;
          median: number;
        };
        menu_categories: Array<{
          name: string;
          items: Array<{
            name: string;
            price: number;
            category: string;
            is_available: boolean;
            popularity_score: number;
          }>;
        }>;
        popular_items: Array<{
          name: string;
          price: number;
          category: string;
          popularity_score: number;
        }>;
        pricing_insights: Array<{
          type: string;
          title: string;
          description: string;
          impact: string;
        }>;
        sample_data?: boolean;
      };
      data_source: string;
      integration_status: {
        wongnai_connected: boolean;
        delivery_menu_available: boolean;
        real_data_available: boolean;
      };
    }>
  > {
    return this.request(`/restaurants/${restaurantId}/menu-pricing`);
  }

  async getBatchRestaurantMenuPricing(restaurantIds: string[]): Promise<
    ApiResponse<{
      results: Array<{
        restaurant_id: string;
        success: boolean;
        restaurant?: any;
        menu_pricing?: any;
        data_source?: string;
        error?: string;
      }>;
      summary: {
        total_requested: number;
        successful: number;
        failed: number;
        wongnai_data: number;
        sample_data: number;
      };
    }>
  > {
    return this.request("/restaurants/batch-menu-pricing", {
      method: "POST",
      body: JSON.stringify({ restaurant_ids: restaurantIds }),
    });
  }

  // Real data fetching
  async fetchRealRestaurantData(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    platforms?: string[];
  }): Promise<
    ApiResponse<{
      status: string;
      location: { latitude: number; longitude: number; radius: number };
      platforms_searched: string[];
      restaurants_found: Record<string, number>;
      all_restaurants: Restaurant[];
      sample_restaurants: Restaurant[];
      message: string;
    }>
  > {
    return this.request("/restaurants/fetch-real-data", {
      method: "POST",
      body: JSON.stringify({
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius || 5,
        platforms: params.platforms || ["foursquare", "wongnai", "google"],
      }),
    });
  }

  // Scraped data status
  async getScrapedDataStatus(): Promise<
    ApiResponse<{
      status: string;
      total_restaurants: number;
      cuisine_distribution: Record<string, number>;
      rating_statistics: {
        average_rating: number;
        min_rating: number;
        max_rating: number;
        rated_restaurants: number;
      };
      last_updated: string;
    }>
  > {
    return this.request("/restaurants/scraped-data/status");
  }

  // Scrape and populate restaurants
  async scrapeAndPopulateRestaurants(params: {
    region?: string;
    category?: string;
    max_pages?: number;
  }): Promise<
    ApiResponse<{
      status: string;
      message: string;
      region: string;
      category: string;
      restaurants_scraped: number;
      restaurants_stored: number;
      stored_restaurants: Restaurant[];
    }>
  > {
    const queryParams = new URLSearchParams({
      region: params.region || "bangkok",
      category: params.category || "restaurant",
      max_pages: (params.max_pages || 2).toString(),
    });
    return this.request(`/restaurants/scrape-and-populate?${queryParams}`, {
      method: "POST",
    });
  }

  // Market analysis endpoints
  async createMarketAnalysis(params: {
    latitude: number;
    longitude: number;
    radius: number;
    analysis_type: string;
  }): Promise<ApiResponse<MarketAnalysis>> {
    return this.request("/market-analyses", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getAllMarketAnalyses(): Promise<ApiResponse<MarketAnalysis[]>> {
    return this.request("/market-analyses");
  }

  async getRestaurantAnalytics(id: string): Promise<
    ApiResponse<{
      restaurant_id: string;
      metrics: {
        total_visits: number;
        avg_rating: number;
        revenue_estimate: number;
        market_share: number;
      };
      trends: {
        visits_trend: number[];
        rating_trend: number[];
      };
      recommendations: string[];
    }>
  > {
    return this.request(`/restaurants/${id}/analytics`);
  }

  // AI Agent endpoints (now part of main FastAPI backend)
  async runMarketResearch(params: {
    location: string;
    business_type: string;
    target_audience: string;
    budget_range: string;
  }): Promise<
    ApiResponse<{
      research_id: string;
      location: string;
      business_type: string;
      analysis: {
        market_size: string;
        competition_level: string;
        target_demographics: string;
        recommended_strategies: string[];
        risk_factors: string[];
        success_probability: string;
      };
      recommendations: string[];
      created_at: string;
    }>
  > {
    return this.request("/ai/market-research", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Market analysis endpoint for AI agent
  async runMarketAnalysis(params: {
    location: string;
    cuisine_type: string;
    radius_km: number;
  }): Promise<ApiResponse<any>> {
    return this.request("/ai/market-analysis", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // AI Agent health check (alternative endpoint)
  async checkAgentHealthAlt(): Promise<
    ApiResponse<{
      status: string;
      service: string;
      version: string;
    }>
  > {
    return this.request("/ai", {
      method: "GET",
    });
  }

  // Enhanced location tracking endpoints
  async updateUserLocation(params: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
    user_id?: string;
    session_id?: string;
    timestamp?: string;
    device_info?: any;
  }): Promise<
    ApiResponse<{
      success: boolean;
      location: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        altitude?: number;
        heading?: number;
        speed?: number;
      };
      message: string;
      nearby_restaurants?: Restaurant[];
      location_context?: {
        area: string;
        district: string;
      };
    }>
  > {
    return this.request("/user/location/update", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async streamUserLocation(params: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    user_id?: string;
    session_id?: string;
    auto_search?: boolean;
    search_radius?: number;
    max_results?: number;
    include_nearby?: boolean;
  }): Promise<
    ApiResponse<{
      tracking_id: string;
      location: {
        latitude: number;
        longitude: number;
        accuracy?: number;
      };
      restaurants: Restaurant[];
      search_metrics?: {
        search_time_ms: number;
        radius_km: number;
        results_found: number;
        location: { latitude: number; longitude: number };
      };
      timestamp: string;
      location_context?: {
        area: string;
        district: string;
      };
    }>
  > {
    return this.request("/user/location/stream", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getCurrentUserLocation(userId: string): Promise<
    ApiResponse<{
      location: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        altitude?: number;
        heading?: number;
        speed?: number;
      };
      last_updated: string;
    }>
  > {
    return this.request(`/user/location/current/${userId}`);
  }

  async getUserLocationHistory(
    userId: string,
    options?: {
      limit?: number;
      hours?: number;
    },
  ): Promise<
    ApiResponse<{
      user_id: string;
      locations: Array<{
        latitude: number;
        longitude: number;
        accuracy?: number;
        altitude?: number;
        heading?: number;
        speed?: number;
        timestamp: string;
      }>;
      total: number;
      time_range_hours: number;
    }>
  > {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.hours) params.append("hours", options.hours.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/user/location/history/${userId}${query}`);
  }

  async setLocationPreferences(params: {
    user_id?: string;
    session_id?: string;
    default_search_radius?: number;
    max_search_radius?: number;
    location_sharing_enabled?: boolean;
    auto_location_update?: boolean;
    distance_unit?: "km" | "miles";
  }): Promise<
    ApiResponse<{
      user_id: string;
      preferences: {
        default_search_radius: number;
        max_search_radius: number;
        location_sharing_enabled: boolean;
        auto_location_update: boolean;
        distance_unit: string;
      };
      message: string;
    }>
  > {
    return this.request("/user/preferences/location", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getLocationPreferences(userId: string): Promise<
    ApiResponse<{
      user_id: string;
      preferences: {
        default_search_radius: number;
        max_search_radius: number;
        location_sharing_enabled: boolean;
        auto_location_update: boolean;
        distance_unit: string;
      };
      last_updated: string | null;
    }>
  > {
    return this.request(`/user/preferences/location/${userId}`);
  }

  // Enhanced real-time restaurant search with buffer zones
  async searchRestaurantsRealtime(params: {
    latitude: number;
    longitude: number;
    initial_radius?: number;
    max_radius?: number;
    min_results?: number;
    cuisine_filter?: string;
    price_range_filter?: number;
    rating_filter?: number;
    limit?: number;
    buffer_zones?: boolean;
    user_id?: string;
    session_id?: string;
  }): Promise<
    ApiResponse<{
      restaurants: Restaurant[];
      total: number;
      search_params: {
        center: { latitude: number; longitude: number };
        initial_radius_km: number;
        final_radius_km: number;
        max_radius_km: number;
        search_attempts: number;
        min_results_target: number;
        buffer_zones_enabled: boolean;
      };
      auto_adjustment: {
        radius_expanded: boolean;
        expansion_factor: number;
        results_sufficient: boolean;
        search_efficiency: number;
      };
      buffer_zones?: {
        inner_zone: {
          radius_km: number;
          count: number;
          restaurants: Restaurant[];
        };
        middle_zone: {
          radius_km: number;
          count: number;
          restaurants: Restaurant[];
        };
        outer_zone: {
          radius_km: number;
          count: number;
          restaurants: Restaurant[];
        };
      };
    }>
  > {
    return this.request("/restaurants/search/realtime", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Enhanced nearby restaurants with buffer radius
  async getNearbyRestaurantsWithBuffer(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    buffer_radius?: number;
    platforms?: string[];
    cuisine_filter?: string;
    price_range_filter?: number;
    rating_filter?: number;
    limit?: number;
    real_time?: boolean;
  }): Promise<
    ApiResponse<{
      restaurants: Restaurant[];
      total: number;
      search_params: {
        center: { latitude: number; longitude: number };
        radius_km: number;
        buffer_radius_km: number;
        effective_radius_km: number;
        filters: {
          cuisine?: string;
          price_range?: number;
          min_rating: number;
        };
      };
      platforms_searched: string[];
      data_sources: {
        database_results: number;
        mock_results: number;
        total_before_filtering: number;
      };
    }>
  > {
    return this.request("/restaurants/nearby", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Types are already exported above as interfaces
