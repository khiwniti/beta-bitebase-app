/**
 * MCP-Powered API Client for BiteBase Frontend
 * Handles all API communications with the MCP backend
 */

interface MCPResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    via: string;
    [key: string]: any;
  };
  error?: string;
}

interface RestaurantSearchParams {
  location: string;
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  features?: string[];
  limit?: number;
  offset?: number;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  priceRange: string;
  features?: string[];
  description?: string;
  images?: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

interface AIRecommendation {
  restaurantId: string;
  name: string;
  score: number;
  reason: string;
}

interface ChatMessage {
  message: string;
  context?: any;
  userId?: string;
}

interface ChatResponse {
  response: string;
  suggestions?: string[];
  sentiment?: any;
  meta: {
    timestamp: string;
    via: string;
    messageId: string;
  };
}

class MCPApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<MCPResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
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

  // Health Check
  async healthCheck(): Promise<MCPResponse> {
    return this.request('/health');
  }

  // MCP Tools
  async getMCPTools(): Promise<MCPResponse> {
    return this.request('/mcp/tools');
  }

  async executeMCPTool(tool: string, parameters: any): Promise<MCPResponse> {
    return this.request('/mcp/execute', {
      method: 'POST',
      body: JSON.stringify({ tool, parameters }),
    });
  }

  // Restaurant APIs
  async searchRestaurants(params: RestaurantSearchParams): Promise<MCPResponse<{
    restaurants: Restaurant[];
    recommendations: AIRecommendation[];
    total: number;
    location: string;
    filters: any;
    pagination: any;
  }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return this.request(`/restaurants/search?${searchParams.toString()}`);
  }

  async getRestaurantDetails(id: string): Promise<MCPResponse<{
    restaurant: Restaurant;
    similar: Restaurant[];
    meta: any;
  }>> {
    return this.request(`/restaurants/${id}`);
  }

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<MCPResponse> {
    return this.request(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRestaurant(id: string): Promise<MCPResponse> {
    return this.request(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  // AI APIs
  async chatWithAI(message: ChatMessage): Promise<MCPResponse<ChatResponse>> {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getAIRecommendations(params: {
    userId: string;
    location: string | { latitude: number; longitude: number };
    preferences?: any;
    context?: any;
  }): Promise<MCPResponse<{
    recommendations: AIRecommendation[];
    trends: any;
    location: any;
    preferences: any;
    meta: any;
  }>> {
    return this.request('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Analytics APIs
  async getAnalyticsDashboard(params: {
    timeframe?: string;
    metrics?: string;
    userId?: string;
    restaurantId?: string;
  } = {}): Promise<MCPResponse<{
    metrics: any;
    insights: any;
    timeframe: string;
    filters: any;
    meta: any;
  }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/analytics/dashboard?${searchParams.toString()}`);
  }

  async trackEvent(event: {
    event: string;
    properties?: any;
    userId?: string;
    sessionId?: string;
    timestamp?: string;
  }): Promise<MCPResponse<{
    eventId: string;
    tracked: boolean;
    event: string;
    timestamp: string;
    meta: any;
  }>> {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  // Location APIs
  async geocodeAddress(address: string): Promise<MCPResponse> {
    return this.request(`/location/geocode?address=${encodeURIComponent(address)}`);
  }

  async reverseGeocode(lat: number, lng: number): Promise<MCPResponse> {
    return this.request(`/location/geocode?lat=${lat}&lng=${lng}`);
  }

  async findNearbyRestaurants(params: {
    lat: number;
    lng: number;
    radius?: number;
    cuisine?: string;
    priceRange?: string;
    rating?: number;
    limit?: number;
  }): Promise<MCPResponse<{
    restaurants: Restaurant[];
    recommendations: AIRecommendation[];
    location: { latitude: number; longitude: number };
    searchRadius: number;
    filters: any;
    meta: any;
  }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/location/nearby?${searchParams.toString()}`);
  }

  // Payment APIs
  async createPaymentIntent(params: {
    amount: number;
    currency?: string;
    customerId?: string;
    restaurantId?: string;
    reservationDetails?: any;
    metadata?: any;
  }): Promise<MCPResponse<{
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
    meta: any;
  }>> {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Notification APIs
  async sendNotification(params: {
    type: 'email' | 'push' | 'sms';
    recipient: string;
    subject?: string;
    message?: string;
    template?: string;
    data?: any;
    userId?: string;
  }): Promise<MCPResponse<{
    notificationId: string;
    type: string;
    status: string;
    recipient: string;
    meta: any;
  }>> {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Utility methods
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`,
    };
  }

  setUserId(userId: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'X-User-ID': userId,
    };
  }

  setSessionId(sessionId: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'X-Session-ID': sessionId,
    };
  }

  clearAuth() {
    const { Authorization, 'X-User-ID': userId, 'X-Session-ID': sessionId, ...rest } = this.defaultHeaders as any;
    this.defaultHeaders = rest;
  }
}

// Create singleton instance
const mcpApiClient = new MCPApiClient();

export default mcpApiClient;
export type { MCPResponse, Restaurant, AIRecommendation, ChatMessage, ChatResponse };