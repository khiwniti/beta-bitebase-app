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
  id: string;
  publicId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  cuisine: string;
  price_range: string;
  rating: number;
  platform: string;
  phone?: string;
  website?: string;
  hours?: string;
  features: string[];
  images?: string[];
  wongnai_data?: {
    publicId: string;
    isDeliveryAvailable: boolean;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
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
    // Use environment variables or fallback to runtime URLs
    // Backend Restaurant API on localhost:12001 - User Backend Service
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
    // AI Agent on localhost:8000, accessed via frontend proxy
    this.agentUrl = process.env.NEXT_PUBLIC_AGENT_URL || '';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    useAgent = false
  ): Promise<ApiResponse<T>> {
    const url = `${useAgent ? this.agentUrl : this.baseUrl}${endpoint}`;
    
    console.log(`🌐 Making API request to: ${url}`, { method: options.method || 'GET', body: options.body });
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status}`, data);
        return {
          error: data.message || `HTTP ${response.status}`,
          status: response.status,
        };
      }

      console.log(`✅ API Success:`, data);
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`💥 Network Error:`, error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Health checks
  async checkBackendHealth(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request('/health');
  }

  async checkAgentHealth(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.request('/api/status', {}, true);
  }

  // Restaurant data endpoints
  async getAllRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    const response = await this.request<{ restaurants: Restaurant[]; total: number; limit: number; offset: number }>('/api/restaurants');
    if (response.error) {
      return response;
    }
    return {
      data: response.data?.restaurants || [],
      status: response.status,
    };
  }

  async getRestaurantById(id: string): Promise<ApiResponse<Restaurant>> {
    return this.request(`/api/restaurants/${id}`);
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
    return this.request(`/api/restaurants/search?${params}`);
  }

  // Wongnai integration endpoints
  async searchWongnaiRestaurants(params: {
    latitude?: number;
    longitude?: number;
    query?: string;
    cuisine?: string;
    limit?: number;
  }): Promise<ApiResponse<{ restaurants: Restaurant[]; total: number }>> {
    return this.request('/api/wongnai/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getRestaurantMenu(publicId: string): Promise<ApiResponse<RestaurantMenu>> {
    return this.request(`/api/restaurants/${publicId}/menu`);
  }

  async getBatchMenus(publicIds: string[]): Promise<ApiResponse<{
    status: string;
    total_requested: number;
    successful_count: number;
    failed_count: number;
    menus: RestaurantMenu[];
    errors: string[];
  }>> {
    return this.request('/api/restaurants/menus/batch', {
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
    return this.request('/api/restaurants/fetch-real-data', {
      method: 'POST',
      body: JSON.stringify({
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius || 5,
        platforms: params.platforms || ['wongnai', 'google']
      }),
    });
  }

  // Market analysis endpoints
  async createMarketAnalysis(params: {
    latitude: number;
    longitude: number;
    radius: number;
    analysis_type: string;
  }): Promise<ApiResponse<MarketAnalysis>> {
    return this.request('/api/market-analyses', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getAllMarketAnalyses(): Promise<ApiResponse<MarketAnalysis[]>> {
    return this.request('/api/market-analyses');
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
    return this.request(`/api/restaurants/${id}/analytics`);
  }

  // AI Agent endpoints (using local proxy)
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
    return this.request('/api/ai', {
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
    return this.request('/api/ai', {
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
    return this.request('/api/ai', {
      method: 'GET',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type { Restaurant, RestaurantMenu, MarketAnalysis, MenuItem, MenuCategory };