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
    // Use local backend for development
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
    // AI Agent is part of the local backend
    this.agentUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    useAgent = false
  ): Promise<ApiResponse<T>> {
    // Connect directly to backend without /api prefix
    const url = `${this.baseUrl}${endpoint}`;
    
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
}

// Export singleton instance
export const apiClient = new ApiClient();

// Types are already exported above as interfaces