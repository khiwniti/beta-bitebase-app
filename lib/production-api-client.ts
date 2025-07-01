/**
 * Production-ready API client for BiteBase
 * Implements the requirements from IMPROVEMENTS.md
 */

interface APIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  apiKey?: string;
}

interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  status: number;
}

interface RestaurantAnalytics {
  restaurant_id: string;
  restaurant_name: string;
  cuisine_types: string[];
  price_range: number;
  rating: number;
  period: {
    range: string;
    start: string;
    end: string;
    days_analyzed: number;
  };
  metrics: {
    total_revenue: number;
    average_revenue: number;
    total_customers: number;
    average_customers: number;
    average_order_value: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
    customers: number;
    avg_order_value: number;
  }>;
  generated_at: string;
}

interface AIResponse {
  response: string;
  intent: string;
  language: string;
  suggestions: string[];
  model: string;
  data_source: string;
  tokens_used: number;
  conversation_id: string;
  restaurant_id?: string;
}

interface RestaurantSearchParams {
  location: {
    latitude: number;
    longitude: number;
  };
  cuisine_types?: string[];
  price_range?: [number, number];
  rating_min?: number;
  radius_km?: number;
  limit?: number;
  offset?: number;
}

interface RestaurantSearchResult {
  restaurants: Array<{
    id: string;
    name: string;
    cuisine_types: string[];
    price_range: number;
    rating: number;
    location: {
      latitude: number;
      longitude: number;
    };
    distance_km: number;
    created_at: string;
    updated_at: string;
  }>;
  search_params: RestaurantSearchParams;
  total_found: number;
  generated_at: string;
}

class ProductionAPIClient {
  private config: APIConfig;
  private abortController?: AbortController;

  constructor(config?: Partial<APIConfig>) {
    this.config = {
      baseURL: this.detectBackendURL(),
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      ...config
    };
  }

  private detectBackendURL(): string {
    // Auto-detect backend URL based on environment
    if (typeof window === 'undefined') {
      // Server-side rendering
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    }

    // Client-side detection
    const hostname = window.location.hostname;
    
    // Production detection
    if (hostname === 'beta.bitebase.app' || hostname === 'bitebase.app') {
      return 'https://bitebase-intelligence-backend.vercel.app';
    }
    
    // Vercel preview detection
    if (hostname.includes('.vercel.app')) {
      // Try to find corresponding backend deployment
      const frontendName = hostname.split('.')[0];
      return `https://${frontendName}-backend.vercel.app`;
    }
    
    // Development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    
    // Default fallback
    return process.env.NEXT_PUBLIC_API_URL || 'https://bitebase-intelligence-backend.vercel.app';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    // Create new abort controller for each request
    this.abortController = new AbortController();
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey })
      },
      signal: this.abortController.signal
    };

    // Add timeout
    const timeoutId = setTimeout(() => {
      if (this.abortController) {
        this.abortController.abort();
      }
    }, this.config.timeout);

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: APIResponse<T> = await response.json();
      
      console.log(`✅ API Success: ${endpoint}`, {
        status: data.status,
        timestamp: data.timestamp
      });
      
      return data;

    } catch (error: any) {
      clearTimeout(timeoutId);
      
      console.error(`❌ API Error: ${endpoint}`, {
        error: error.message,
        retryCount,
        maxRetries: this.config.retryAttempts
      });

      // Retry logic for specific errors
      if (
        retryCount < this.config.retryAttempts &&
        (error.name === 'AbortError' || 
         error.message.includes('timeout') ||
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('500'))
      ) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`🔄 Retrying request in ${delay}ms (attempt ${retryCount + 1}/${this.config.retryAttempts})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<any> {
    try {
      const response = await this.makeRequest('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  // AI Chat endpoint
  async sendAIMessage(
    message: string,
    restaurantId?: string,
    conversationId?: string,
    context?: {
      language?: string;
      location?: { latitude: number; longitude: number };
    }
  ): Promise<AIResponse> {
    const response = await this.makeRequest<AIResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        restaurant_id: restaurantId,
        conversation_id: conversationId,
        context
      })
    });

    return response.data;
  }

  // Restaurant analytics endpoint
  async getRestaurantAnalytics(
    restaurantId: string,
    dateRange: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<RestaurantAnalytics> {
    const response = await this.makeRequest<RestaurantAnalytics>(
      `/api/restaurants/${restaurantId}/analytics?date_range=${dateRange}`
    );

    return response.data;
  }

  // Restaurant search endpoint
  async searchRestaurants(params: RestaurantSearchParams): Promise<RestaurantSearchResult> {
    const response = await this.makeRequest<RestaurantSearchResult>('/api/restaurants/search', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    return response.data;
  }

  // AI status endpoint
  async getAIStatus(): Promise<any> {
    const response = await this.makeRequest('/ai');
    return response.data;
  }

  // Connection monitoring
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === 'healthy';
    } catch {
      return false;
    }
  }

  // Cancel ongoing requests
  cancelRequests(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<APIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): APIConfig {
    return { ...this.config };
  }
}

// Singleton instance
let apiClient: ProductionAPIClient | null = null;

export function getAPIClient(config?: Partial<APIConfig>): ProductionAPIClient {
  if (!apiClient) {
    apiClient = new ProductionAPIClient(config);
  }
  return apiClient;
}

export default ProductionAPIClient;

// Export types
export type {
  APIResponse,
  RestaurantAnalytics,
  AIResponse,
  RestaurantSearchParams,
  RestaurantSearchResult
};