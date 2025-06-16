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
  user_id?: string;
  phone?: string;
  website?: string;
  hours?: any; // Can be string or object
  features?: any; // Can be string or array
  images?: any; // Can be string or array
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

class ApiClient {
  private baseUrl: string;
  private agentUrl: string;

  constructor() {
    // Clean API URL configuration
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
    this.agentUrl = this.baseUrl; // Unified backend
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Health checks
  async checkBackendHealth(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request('/health'); // Health endpoint
  }

  async checkAgentHealth(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.request('/ai'); // AI status endpoint
  }

  // Restaurant data endpoints
  async getAllRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    const response = await this.request<{ data: { restaurants: Restaurant[]; total: number; pagination: any }; success: boolean }>('/restaurants/search');
    if (response.error || !response.data?.success) {
      return {
        error: response.error || 'Failed to fetch restaurants',
        status: response.status,
      };
    }
    return {
      data: response.data?.data?.restaurants || [],
      status: response.status,
    };
  }

  async getRestaurantById(id: string): Promise<ApiResponse<Restaurant>> {
    return this.request(`/restaurants/${id}`);
  }

  async searchRestaurantsByLocation(
    latitude: number, 
    longitude: number, 
    radius: number = 5
  ): Promise<ApiResponse<Restaurant[]>> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });
    const response = await this.request<{ data: { restaurants: Restaurant[]; total: number; pagination: any }; success: boolean }>(`/restaurants/search?${params}`);
    if (response.error || !response.data?.success) {
      return {
        error: response.error || 'Failed to search restaurants',
        status: response.status,
      };
    }
    return {
      data: response.data?.data?.restaurants || [],
      status: response.status,
    };
  }

  // Wongnai integration endpoints
  async searchWongnaiRestaurants(params: {
    latitude?: number;
    longitude?: number;
    query?: string;
    cuisine?: string;
    limit?: number;
  }): Promise<ApiResponse<{ restaurants: Restaurant[]; total: number }>> {
    return this.request('/restaurants/wongnai/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getRestaurantMenu(restaurantId: number): Promise<ApiResponse<MenuItem[]>> {
    return this.request(`/restaurants/${restaurantId}/menu-items`);
  }

  async getBatchMenus(publicIds: string[]): Promise<ApiResponse<{
    status: string;
    total_requested: number;
    successful_count: number;
    failed_count: number;
    menus: RestaurantMenu[];
    errors: string[];
  }>> {
    return this.request('/restaurants/menus/batch', {
      method: 'POST',
      body: JSON.stringify({ publicIds }),
    });
  }

  // Real data fetching
  async fetchRealRestaurantData(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    platforms?: string[];
  }): Promise<ApiResponse<{
    status: string;
    location: { latitude: number; longitude: number; radius: number };
    platforms_searched: string[];
    restaurants_found: Record<string, number>;
    all_restaurants: Restaurant[];
    sample_restaurants: Restaurant[];
    message: string;
  }>> {
    return this.request('/restaurants/fetch-real-data', {
      method: 'POST',
      body: JSON.stringify({
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius || 5,
        platforms: params.platforms || ['wongnai', 'google']
      }),
    });
  }

  // Scraped data status
  async getScrapedDataStatus(): Promise<ApiResponse<{
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
  }>> {
    return this.request('/restaurants/scraped-data/status');
  }

  // Scrape and populate restaurants
  async scrapeAndPopulateRestaurants(params: {
    region?: string;
    category?: string;
    max_pages?: number;
  }): Promise<ApiResponse<{
    status: string;
    message: string;
    region: string;
    category: string;
    restaurants_scraped: number;
    restaurants_stored: number;
    stored_restaurants: Restaurant[];
  }>> {
    const queryParams = new URLSearchParams({
      region: params.region || 'bangkok',
      category: params.category || 'restaurant',
      max_pages: (params.max_pages || 2).toString(),
    });
    return this.request(`/restaurants/scrape-and-populate?${queryParams}`, {
      method: 'POST',
    });
  }

  // Market analysis endpoints
  async createMarketAnalysis(params: {
    latitude: number;
    longitude: number;
    radius: number;
    analysis_type: string;
  }): Promise<ApiResponse<MarketAnalysis>> {
    return this.request('/market-analyses', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getAllMarketAnalyses(): Promise<ApiResponse<MarketAnalysis[]>> {
    return this.request('/market-analyses');
  }

  async getRestaurantAnalytics(id: string): Promise<ApiResponse<{
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
  }>> {
    return this.request(`/restaurants/${id}/analytics`);
  }

  // AI Agent endpoints (now part of main FastAPI backend)
  async runMarketResearch(params: {
    location: string;
    business_type: string;
    target_audience: string;
    budget_range: string;
  }): Promise<ApiResponse<{
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
  }>> {
    return this.request('/ai/market-research', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Market analysis endpoint for AI agent
  async runMarketAnalysis(params: {
    location: string;
    cuisine_type: string;
    radius_km: number;
  }): Promise<ApiResponse<any>> {
    return this.request('/ai/market-analysis', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // AI Agent health check (alternative endpoint)
  async checkAgentHealthAlt(): Promise<ApiResponse<{
    status: string;
    service: string;
    version: string;
  }>> {
    return this.request('/ai', {
      method: 'GET',
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
  }): Promise<ApiResponse<{
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
  }>> {
    return this.request('/user/location/update', {
      method: 'POST',
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
  }): Promise<ApiResponse<{
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
  }>> {
    return this.request('/user/location/stream', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getCurrentUserLocation(userId: string): Promise<ApiResponse<{
    location: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      altitude?: number;
      heading?: number;
      speed?: number;
    };
    last_updated: string;
  }>> {
    return this.request(`/user/location/current/${userId}`);
  }

  async getUserLocationHistory(userId: string, options?: {
    limit?: number;
    hours?: number;
  }): Promise<ApiResponse<{
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
  }>> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.hours) params.append('hours', options.hours.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/user/location/history/${userId}${query}`);
  }

  async setLocationPreferences(params: {
    user_id?: string;
    session_id?: string;
    default_search_radius?: number;
    max_search_radius?: number;
    location_sharing_enabled?: boolean;
    auto_location_update?: boolean;
    distance_unit?: 'km' | 'miles';
  }): Promise<ApiResponse<{
    user_id: string;
    preferences: {
      default_search_radius: number;
      max_search_radius: number;
      location_sharing_enabled: boolean;
      auto_location_update: boolean;
      distance_unit: string;
    };
    message: string;
  }>> {
    return this.request('/user/preferences/location', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getLocationPreferences(userId: string): Promise<ApiResponse<{
    user_id: string;
    preferences: {
      default_search_radius: number;
      max_search_radius: number;
      location_sharing_enabled: boolean;
      auto_location_update: boolean;
      distance_unit: string;
    };
    last_updated: string | null;
  }>> {
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
  }): Promise<ApiResponse<{
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
  }>> {
    return this.request('/restaurants/search/realtime', {
      method: 'POST',
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
  }): Promise<ApiResponse<{
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
  }>> {
    return this.request('/restaurants/nearby', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Types are already exported above as interfaces