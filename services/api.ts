import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:56222';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API Error class
export class APIError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Generic API response interface
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  via?: string;
}

// Restaurant interfaces
export interface Restaurant {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  price_level?: number;
  cuisine: string;
  address: string;
  photo_url?: string;
  review_count?: number;
  data_source?: string;
}

export interface SearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  cuisine?: string | string[];
  priceRange?: [number, number];
  rating?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'distance' | 'rating' | 'price' | 'name';
}

export interface SearchResponse {
  restaurants: Restaurant[];
  total: number;
  sources: {
    local: number;
    external: number;
  };
  query?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  searchParams: SearchParams;
}

// Auth interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  user_type: 'NEW_ENTREPRENEUR' | 'EXISTING_OWNER' | 'FRANCHISE' | 'ORGANIZATION';
  subscription_tier: 'FREE' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  user_type: User['user_type'];
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Methods
export const api = {
  // Auth endpoints
  auth: {
    login: async (credentials: LoginRequest): Promise<APIResponse<AuthResponse>> => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },

    register: async (userData: RegisterRequest): Promise<APIResponse<AuthResponse>> => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },

    logout: async (): Promise<APIResponse> => {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    },

    me: async (): Promise<APIResponse<User>> => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
  },

  // Restaurant endpoints
  restaurants: {
    search: async (params: SearchParams): Promise<APIResponse<SearchResponse>> => {
      const response = await apiClient.post('/restaurants/search', params);
      return response.data;
    },

    getById: async (id: string): Promise<APIResponse<Restaurant>> => {
      const response = await apiClient.get(`/restaurants/${id}`);
      return response.data;
    },

    getFeatured: async (): Promise<APIResponse<Restaurant[]>> => {
      const response = await apiClient.get('/restaurants/featured');
      return response.data;
    },

    getHealth: async (): Promise<APIResponse> => {
      const response = await apiClient.get('/restaurants/health');
      return response.data;
    },

    getStats: async (): Promise<APIResponse> => {
      const response = await apiClient.get('/restaurants/stats');
      return response.data;
    },
  },

  // AI endpoints
  ai: {
    marketAnalysis: async (params: {
      location: { latitude: number; longitude: number };
      radius: number;
      businessType?: string;
    }): Promise<APIResponse> => {
      const response = await apiClient.post('/ai/market-analysis', params);
      return response.data;
    },

    predictiveAnalytics: async (params: any): Promise<APIResponse> => {
      const response = await apiClient.post('/ai/predictive-analytics', params);
      return response.data;
    },

    salesPrediction: async (params: any): Promise<APIResponse> => {
      const response = await apiClient.post('/ai/sales-prediction', params);
      return response.data;
    },
  },

  // Health check
  health: async (): Promise<APIResponse> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Export the configured axios instance
export { apiClient };

// Export default api object
export default api;