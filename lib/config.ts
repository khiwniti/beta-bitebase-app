/**
 * Unified configuration for BiteBase Frontend
 * Centralizes all environment variables and API endpoints
 */

// Environment detection
export const isDevelopment = process.env.NODE_ENV === "development";
export const isStaging = process.env.NODE_ENV === "staging";
export const isProduction = process.env.NODE_ENV === "production";

// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:3001`
      : "http://localhost:3001"),
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:12000",

  // Timeouts
  REQUEST_TIMEOUT: 15000, // 15 seconds

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

// API Endpoints
export const ENDPOINTS = {
  // Health & Status
  HEALTH: "/health",
  AI_STATUS: "/ai",

  // Restaurant endpoints
  RESTAURANTS: {
    SEARCH: "/restaurants/search",
    DETAILS: (id: string) => `/restaurants/${id}`,
    MENU: (id: string) => `/restaurants/${id}/menu-items`,
    ANALYTICS: (id: string) => `/restaurants/${id}/analytics`,
    NEARBY: "/restaurants/nearby",
    REAL_TIME_SEARCH: "/restaurants/search/realtime",
    WONGNAI_SEARCH: "/restaurants/wongnai/search",
    FETCH_REAL_DATA: "/restaurants/fetch-real-data",
    FOURSQUARE_SEARCH: "/restaurants/foursquare/search",
  },

  // Location endpoints
  LOCATION: {
    UPDATE: "/user/location/update",
    CURRENT: (userId: string) => `/user/location/current/${userId}`,
    HISTORY: (userId: string) => `/user/location/history/${userId}`,
    STREAM: "/user/location/stream",
    PREFERENCES: "/user/preferences/location",
    GET_PREFERENCES: (userId: string) => `/user/preferences/location/${userId}`,
  },

  // AI endpoints
  AI: {
    CHAT: "/api/ai/chat",
    HISTORY: (userId: string) => `/api/ai/history/${userId}`,
    CLEAR: (userId: string) => `/api/ai/clear/${userId}`,
  },

  // MCP endpoints
  MCP: {
    TOOLS: "/api/mcp/tools",
    EXECUTE: "/api/mcp/execute",
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    TRACK: "/analytics/track",
  },

  // Database
  DATABASE: {
    INIT: "/init-database",
  },

  // Foursquare
  FOURSQUARE: {
    SEARCH: "/foursquare/search",
    DETAILS: (id: string) => `/foursquare/venues/${id}`,
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
