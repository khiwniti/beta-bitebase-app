/**
 * Unified configuration for BiteBase Frontend
 * Centralizes all environment variables and API endpoints
 */

// Environment detection
export const isDevelopment = process.env.NODE_ENV === "development";
export const isStaging = process.env.VERCEL_ENV === "preview";
export const isProduction = process.env.NODE_ENV === "production";

// API Configuration for separate deployment
export const API_CONFIG = {
  // Production backend URL - deployed separately
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (isProduction 
      ? "https://bitebase-backend-prod.bitebase.workers.dev" 
      : typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : "http://localhost:3001"),
  
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 
    (isProduction ? "https://beta.bitebase.app" : "http://localhost:12000"),
  
  // Backend service URL - Points to custom domain
  BACKEND_SERVICE_URL: 
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (isProduction 
      ? "https://bitebase-backend-prod.bitebase.workers.dev"
      : "http://localhost:3001"),

  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Map Configuration
export const MAP_CONFIG = {
  MAPBOX_TOKEN:
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    "pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ",
  DEFAULT_CENTER: [100.5018, 13.7563] as [number, number], // Bangkok
  DEFAULT_ZOOM: 12,
  SEARCH_RADIUS: 5, // km
  MAX_ZOOM: 19,
  MIN_ZOOM: 8,
};

// Feature Flags - Production Ready Configuration
export const FEATURES = {
  ENABLE_MAPS: process.env.NEXT_PUBLIC_ENABLE_MAPS !== "false", // Default enabled
  ENABLE_REAL_DATA: true, // Always enabled in production
  ENABLE_AI_CHAT: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT !== "false", // Default enabled
  ENABLE_LOCATION_TRACKING: true,
  ENABLE_REAL_TIME_SEARCH: true,
  ENABLE_MOCK_FALLBACK: process.env.NODE_ENV === "development", // Only in development
};

// API Endpoints - Aligned with Backend Phase 1 Implementation
export const ENDPOINTS = {
  // Health & Status
  HEALTH: "/health",
  AI_STATUS: "/ai",
  TEST: "/test",

  // Restaurant endpoints
  RESTAURANTS: {
    SEARCH: "/restaurants/search",
    FEATURED: "/restaurants/featured",
    DETAILS: (id: string) => `/restaurants/${id}`,
    REAL_TIME_SEARCH: "/restaurants/search/realtime",
  },

  // Location endpoints
  LOCATION: {
    UPDATE: "/user/location/update",
    STREAM: "/user/location/stream",
  },

  // AI Analytics endpoints - NEW in Phase 1
  AI: {
    PREDICTIVE_ANALYTICS: "/ai/predictive-analytics",
    MARKET_SEGMENTATION: "/ai/market-segmentation",
    SALES_PREDICTION: "/ai/sales-prediction",
    SEASONAL_ANALYSIS: "/ai/seasonal-analysis",
    SENTIMENT_ANALYSIS: "/ai/sentiment-analysis",
    MODEL_PERFORMANCE: "/ai/model-performance",
  },

  // Data Integration endpoints - NEW in Phase 1
  DATA: {
    ECONOMIC_INDICATORS: "/data/economic-indicators/thailand",
    SOCIAL_SENTIMENT: (restaurantId: string) => `/data/social-sentiment/${restaurantId}`,
    FOOT_TRAFFIC: (locationId: string) => `/data/foot-traffic/${locationId}`,
    ETL_STATUS: "/data/etl/status",
    QUALITY_METRICS: "/data/quality/metrics",
    HEALTH_CHECK: "/data/health-check",
    SOURCES_STATUS: "/data/sources/status",
  },

  // Enterprise endpoints - NEW in Phase 1
  ENTERPRISE: {
    SECURITY_STATUS: "/enterprise/security/status",
    PERFORMANCE_METRICS: "/enterprise/performance/metrics",
    SCALABILITY_STATUS: "/enterprise/scalability/status",
  },

  // Beta Testing endpoints - NEW in Phase 1
  BETA: {
    FEEDBACK_SUBMIT: "/beta/feedback/submit",
    USERS_ANALYTICS: "/beta/users/analytics",
    USER_DETAILS: (userId: string) => `/beta/users/${userId}`,
  },
};

// Default request headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Location settings
export const LOCATION_CONFIG = {
  HIGH_ACCURACY: true,
  TIMEOUT: 10000, // 10 seconds
  MAXIMUM_AGE: 300000, // 5 minutes
  AUTO_SEARCH_RADIUS: 3, // km
  BUFFER_RADIUS: 0.5, // km
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network connection failed. Please check your internet connection.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  LOCATION_DENIED: "Location access denied. Please enable location services.",
  LOCATION_UNAVAILABLE: "Location services unavailable.",
  API_ERROR: "API request failed. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

// Development helpers
export const DEBUG = {
  LOG_API_CALLS: isDevelopment,
  LOG_LOCATION_UPDATES: isDevelopment,
  LOG_MAP_EVENTS: isDevelopment,
};

// Foursquare API Configuration
export const FOURSQUARE_CONFIG = {
  CLIENT_ID: "UFEXNGODOGBQRX35NGIP0ZU0XDT2GJMIV0LGNGBMLU5RBVAN",
  CLIENT_SECRET: "W4LHPBI1PVAKU4BLVQJ1YA2XNPZGVNNV44LCBQNRKJZHYDNZ",
  API_KEY: "fsq3Ciis2M5OLrAUQqL2V5z+bsUMKpCCdQe1ULDMN23ISSo=",
  VERSION: "20250617",
  RADIUS: 5000, // 5km in meters
  LIMIT: 20,
  CATEGORY_ID: "13000", // Food category
};

export default {
  API_CONFIG,
  MAP_CONFIG,
  FEATURES,
  ENDPOINTS,
  DEFAULT_HEADERS,
  LOCATION_CONFIG,
  ERROR_MESSAGES,
  DEBUG,
  FOURSQUARE_CONFIG,
};
