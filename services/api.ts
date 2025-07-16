import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { monitoring } from './monitoring-service';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:56222';

// Reliability Configuration
const RELIABILITY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  EXPONENTIAL_BACKOFF: true,
  CIRCUIT_BREAKER_THRESHOLD: 5,
  CIRCUIT_BREAKER_TIMEOUT: 60000, // 1 minute
  CACHE_TTL: 300000, // 5 minutes
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
};

// Circuit Breaker State
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

const circuitBreakers = new Map<string, CircuitBreakerState>();

// Cache for responses
const responseCache = new Map<string, { data: any; timestamp: number }>();

// Create axios instance with enhanced configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  },
  // Enhanced reliability settings
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
  maxRedirects: 5,
});

// Utility functions for reliability
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCircuitBreakerKey(config: AxiosRequestConfig): string {
  return `${config.method?.toUpperCase()}_${config.url}`;
}

function isCircuitBreakerOpen(key: string): boolean {
  const breaker = circuitBreakers.get(key);
  if (!breaker) return false;
  
  if (breaker.state === 'OPEN') {
    const timeSinceLastFailure = Date.now() - breaker.lastFailureTime;
    if (timeSinceLastFailure > RELIABILITY_CONFIG.CIRCUIT_BREAKER_TIMEOUT) {
      breaker.state = 'HALF_OPEN';
      return false;
    }
    return true;
  }
  return false;
}

function recordCircuitBreakerFailure(key: string): void {
  let breaker = circuitBreakers.get(key);
  if (!breaker) {
    breaker = { failures: 0, lastFailureTime: 0, state: 'CLOSED' };
    circuitBreakers.set(key, breaker);
  }
  
  const oldState = breaker.state;
  breaker.failures++;
  breaker.lastFailureTime = Date.now();
  
  if (breaker.failures >= RELIABILITY_CONFIG.CIRCUIT_BREAKER_THRESHOLD) {
    breaker.state = 'OPEN';
    if (oldState !== 'OPEN') {
      monitoring.logCircuitBreakerStateChange(key, 'OPEN', breaker.failures);
    }
  }
}

function recordCircuitBreakerSuccess(key: string): void {
  const breaker = circuitBreakers.get(key);
  if (breaker) {
    const oldState = breaker.state;
    breaker.failures = 0;
    breaker.state = 'CLOSED';
    if (oldState !== 'CLOSED') {
      monitoring.logCircuitBreakerStateChange(key, 'CLOSED', 0);
    }
  }
}

function getCacheKey(config: AxiosRequestConfig): string {
  return `${config.method?.toUpperCase()}_${config.url}_${JSON.stringify(config.params || {})}`;
}

function getCachedResponse(key: string): any | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < RELIABILITY_CONFIG.CACHE_TTL) {
    monitoring.logCacheEvent('hit', key);
    return cached.data;
  }
  if (cached) {
    monitoring.logCacheEvent('evict', key);
    responseCache.delete(key); // Remove expired cache
  }
  monitoring.logCacheEvent('miss', key);
  return null;
}

function setCachedResponse(key: string, data: any): void {
  monitoring.logCacheEvent('set', key);
  responseCache.set(key, { data, timestamp: Date.now() });
}

// Enhanced request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add unique request ID and start time for monitoring
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    (config as any).__startTime = Date.now();
    
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Check circuit breaker
    const circuitKey = getCircuitBreakerKey(config);
    if (isCircuitBreakerOpen(circuitKey)) {
      const error = new Error('Circuit breaker is OPEN');
      (error as any).isCircuitBreakerError = true;
      throw error;
    }
    
    // Check cache for GET requests
    if (config.method?.toLowerCase() === 'get') {
      const cacheKey = getCacheKey(config);
      const cached = getCachedResponse(cacheKey);
      if (cached) {
        console.log(`Cache HIT for ${cacheKey}`);
        // Return cached response as a promise
        return Promise.reject({ 
          config, 
          response: { 
            data: cached, 
            status: 200, 
            statusText: 'OK (cached)',
            headers: { 'x-cache': 'HIT' },
            config 
          },
          isCached: true 
        });
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const startTime = (response.config as any).__startTime || Date.now();
    const duration = Date.now() - startTime;
    
    // Log API request
    monitoring.logApiRequest(
      response.config.url || 'unknown',
      response.config.method?.toUpperCase() || 'UNKNOWN',
      response.status,
      duration
    );
    
    // Record circuit breaker success
    const circuitKey = getCircuitBreakerKey(response.config);
    recordCircuitBreakerSuccess(circuitKey);
    
    // Cache GET responses
    if (response.config.method?.toLowerCase() === 'get' && response.status === 200) {
      const cacheKey = getCacheKey(response.config);
      setCachedResponse(cacheKey, response.data);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // Handle cached responses
    if ((error as any).isCached) {
      return error.response;
    }
    
    // Log API error and record metrics
    if (error.config) {
      const startTime = (error.config as any).__startTime || Date.now();
      const duration = Date.now() - startTime;
      
      monitoring.logApiRequest(
        error.config.url || 'unknown',
        error.config.method?.toUpperCase() || 'UNKNOWN',
        error.response?.status || 0,
        duration,
        error
      );
      
      // Record circuit breaker failure for 5xx errors
      if (error.response?.status && error.response.status >= 500) {
        const circuitKey = getCircuitBreakerKey(error.config);
        recordCircuitBreakerFailure(circuitKey);
      }
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    
    // Implement retry logic for retryable errors
    const config = error.config;
    if (config && shouldRetry(error)) {
      (config as any)._retryCount = (config as any)._retryCount || 0;
      
      if ((config as any)._retryCount < RELIABILITY_CONFIG.MAX_RETRIES) {
        (config as any)._retryCount++;
        
        const delay = RELIABILITY_CONFIG.EXPONENTIAL_BACKOFF 
          ? RELIABILITY_CONFIG.RETRY_DELAY * Math.pow(2, (config as any)._retryCount - 1)
          : RELIABILITY_CONFIG.RETRY_DELAY;
        
        console.log(`Retrying request (${(config as any)._retryCount}/${RELIABILITY_CONFIG.MAX_RETRIES}) after ${delay}ms`);
        
        await sleep(delay);
        return apiClient(config);
      }
    }
    
    return Promise.reject(error);
  }
);

// Determine if error should be retried
function shouldRetry(error: AxiosError): boolean {
  // Retry on network errors
  if (!error.response) {
    return true;
  }
  
  // Retry on 5xx server errors
  if (error.response.status >= 500) {
    return true;
  }
  
  // Retry on specific 4xx errors
  if ([408, 429].includes(error.response.status)) {
    return true;
  }
  
  // Don't retry circuit breaker errors
  if ((error as any).isCircuitBreakerError) {
    return false;
  }
  
  return false;
}

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

// Health monitoring system
class HealthMonitor {
  private static instance: HealthMonitor;
  private healthStatus = new Map<string, { status: string; lastCheck: number; consecutive_failures: number }>();
  private monitoring = false;

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  startMonitoring(): void {
    if (this.monitoring) return;
    this.monitoring = true;
    
    setInterval(async () => {
      await this.checkEndpointHealth();
    }, RELIABILITY_CONFIG.HEALTH_CHECK_INTERVAL);
  }

  async checkEndpointHealth(): Promise<void> {
    const endpoints = ['/health', '/restaurants/health', '/ai'];
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      try {
        const response = await apiClient.get(endpoint, { timeout: 5000 });
        const responseTime = Date.now() - startTime;
        this.recordHealthStatus(endpoint, 'healthy');
        monitoring.logHealthCheck(endpoint, 'healthy', responseTime);
      } catch (error) {
        const responseTime = Date.now() - startTime;
        this.recordHealthStatus(endpoint, 'unhealthy');
        monitoring.logHealthCheck(endpoint, 'unhealthy', responseTime);
      }
    }
  }

  private recordHealthStatus(endpoint: string, status: string): void {
    const current = this.healthStatus.get(endpoint) || { status: 'unknown', lastCheck: 0, consecutive_failures: 0 };
    
    if (status === 'unhealthy') {
      current.consecutive_failures++;
    } else {
      current.consecutive_failures = 0;
    }
    
    current.status = status;
    current.lastCheck = Date.now();
    this.healthStatus.set(endpoint, current);
    
    // Log health issues
    if (current.consecutive_failures >= 3) {
      console.error(`HEALTH ALERT: ${endpoint} has failed ${current.consecutive_failures} consecutive times`);
    }
  }

  getHealthStatus(endpoint?: string): Map<string, any> | any {
    if (endpoint) {
      return this.healthStatus.get(endpoint);
    }
    return this.healthStatus;
  }

  isEndpointHealthy(endpoint: string): boolean {
    const health = this.healthStatus.get(endpoint);
    return health?.status === 'healthy' && health.consecutive_failures < 3;
  }
}

// Fallback data for critical endpoints
const FALLBACK_DATA = {
  restaurants: {
    search: {
      restaurants: [
        {
          id: 'fallback-1',
          name: 'Sample Restaurant',
          latitude: 13.7563,
          longitude: 100.5018,
          rating: 4.0,
          cuisine: 'Thai',
          address: 'Bangkok, Thailand',
          data_source: 'fallback'
        }
      ],
      total: 1,
      sources: { local: 1, external: 0 },
      searchParams: {}
    }
  },
  health: {
    status: 'degraded',
    message: 'Using fallback data due to service unavailability',
    timestamp: new Date().toISOString(),
    via: 'fallback'
  }
};

// Enhanced API methods with fallback support
const enhancedApi = {
  ...api,
  
  // Override restaurants search with fallback
  restaurants: {
    ...api.restaurants,
    
    search: async (params: SearchParams): Promise<APIResponse<SearchResponse>> => {
      const healthMonitor = HealthMonitor.getInstance();
      
      try {
        // Try primary endpoint
        const response = await api.restaurants.search(params);
        return response;
      } catch (error) {
        console.warn('Primary restaurant search failed, attempting fallback');
        
        // Check if we should use fallback
        if (!healthMonitor.isEndpointHealthy('/restaurants/search')) {
          console.log('Using fallback data for restaurant search');
          return {
            success: true,
            message: 'Data retrieved from fallback source',
            data: FALLBACK_DATA.restaurants.search as SearchResponse,
            timestamp: new Date().toISOString(),
            via: 'fallback'
          };
        }
        
        throw error;
      }
    },
    
    getHealth: async (): Promise<APIResponse> => {
      try {
        return await api.restaurants.getHealth();
      } catch (error) {
        console.warn('Health check failed, returning fallback status');
        return {
          success: true,
          message: 'Fallback health status',
          data: FALLBACK_DATA.health,
          timestamp: new Date().toISOString(),
          via: 'fallback'
        };
      }
    }
  },
  
  // Enhanced health check with detailed monitoring
  health: async (): Promise<APIResponse> => {
    const healthMonitor = HealthMonitor.getInstance();
    
    try {
      const response = await api.health();
      return {
        ...response,
        data: {
          ...response.data,
          circuit_breakers: Object.fromEntries(circuitBreakers),
          cache_stats: {
            entries: responseCache.size,
            hit_rate: 'Not tracked' // Could implement hit rate tracking
          },
          endpoint_health: Object.fromEntries(healthMonitor.getHealthStatus())
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Service health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {
          status: 'unhealthy',
          circuit_breakers: Object.fromEntries(circuitBreakers),
          cache_stats: {
            entries: responseCache.size
          },
          endpoint_health: Object.fromEntries(healthMonitor.getHealthStatus())
        },
        timestamp: new Date().toISOString(),
        via: 'health-monitor'
      };
    }
  }
};

// Initialize health monitoring
if (typeof window !== 'undefined') {
  const healthMonitor = HealthMonitor.getInstance();
  healthMonitor.startMonitoring();
}

// Cache cleanup function
function cleanupCache(): void {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > RELIABILITY_CONFIG.CACHE_TTL) {
      responseCache.delete(key);
    }
  }
}

// Run cache cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupCache, 300000);
}

// Export the configured axios instance
export { apiClient };

// Export enhanced API with reliability features
export default enhancedApi;

// Export health monitor for external use
export { HealthMonitor };

// Export utility functions
export const ApiReliability = {
  getCacheStats: () => ({ entries: responseCache.size }),
  getCircuitBreakerStats: () => Object.fromEntries(circuitBreakers),
  clearCache: () => responseCache.clear(),
  resetCircuitBreakers: () => circuitBreakers.clear(),
  getHealthStatus: () => HealthMonitor.getInstance().getHealthStatus()
};