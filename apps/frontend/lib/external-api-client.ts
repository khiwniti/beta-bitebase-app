/**
 * External API Client for BiteBase
 * Connects to api.bitebase.app instead of local backends
 */

const API_BASE_URL = 'https://api.bitebase.app';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  website: string;
  price_range: number;
  rating: string;
  review_count: number;
  hours: any;
  features: string[];
  images: string[] | null;
  menu_url: string | null;
  delivery_available: boolean;
  takeout_available: boolean;
  reservations_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchParams {
  location?: string;
  cuisine?: string;
  price_range?: number;
  rating?: number;
  delivery?: boolean;
  takeout?: boolean;
  reservations?: boolean;
  features?: string[];
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface RestaurantSearchResponse {
  restaurants: Restaurant[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
  };
}

class ExternalApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Restaurant search
  async searchRestaurants(params: SearchParams = {}): Promise<ApiResponse<RestaurantSearchResponse>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const endpoint = `/restaurants/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<ApiResponse<RestaurantSearchResponse>>(endpoint);
  }

  // Get all restaurants (simplified search)
  async getRestaurants(limit: number = 20): Promise<ApiResponse<RestaurantSearchResponse>> {
    return this.searchRestaurants({ limit });
  }

  // Get restaurant by ID
  async getRestaurant(id: string): Promise<Restaurant> {
    return this.request<Restaurant>(`/restaurants/${id}`);
  }

  // Get restaurants by location
  async getRestaurantsByLocation(
    latitude: number,
    longitude: number,
    radius: number = 5,
    limit: number = 20
  ): Promise<ApiResponse<RestaurantSearchResponse>> {
    const params = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
      limit: limit.toString()
    };
    
    const searchParams = new URLSearchParams(params);
    const endpoint = `/restaurants/nearby?${searchParams.toString()}`;
    
    try {
      return await this.request<ApiResponse<RestaurantSearchResponse>>(endpoint);
    } catch (error) {
      // Fallback to regular search if nearby endpoint doesn't exist
      console.warn('Nearby endpoint not available, falling back to regular search');
      return this.searchRestaurants({ limit });
    }
  }

  // Get restaurants by cuisine
  async getRestaurantsByCuisine(cuisine: string, limit: number = 20): Promise<ApiResponse<RestaurantSearchResponse>> {
    return this.searchRestaurants({ cuisine, limit });
  }

  // Get featured restaurants (high rating)
  async getFeaturedRestaurants(limit: number = 10): Promise<ApiResponse<RestaurantSearchResponse>> {
    return this.searchRestaurants({ rating: 4.5, limit });
  }

  // Analytics tracking (if supported by external API)
  async trackEvent(eventType: string, eventData: any): Promise<void> {
    try {
      await this.request('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          event_type: eventType,
          event_data: eventData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Analytics failures shouldn't break the app
      console.warn('Analytics tracking failed:', error);
    }
  }
}

// Create singleton instance
export const apiClient = new ExternalApiClient();

// Export default instance and class for flexibility
export default apiClient;
export { ExternalApiClient };

// Utility functions for common operations
export const restaurantUtils = {
  // Format price range for display
  formatPriceRange: (priceRange: number): string => {
    const ranges = ['$', '$$', '$$$', '$$$$'];
    return ranges[priceRange - 1] || '$';
  },

  // Format rating for display
  formatRating: (rating: string | number): string => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return numRating.toFixed(1);
  },

  // Get distance between two points (Haversine formula)
  getDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  },

  // Filter restaurants by features
  filterByFeatures: (restaurants: Restaurant[], features: string[]): Restaurant[] => {
    return restaurants.filter(restaurant => 
      features.every(feature => restaurant.features.includes(feature))
    );
  }
};