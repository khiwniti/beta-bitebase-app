/**
 * External API Configuration
 * Centralized configuration for all external API integrations
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Bank of Thailand API Configuration
export const BANK_OF_THAILAND_CONFIG = {
  BASE_URL: "https://www.bot.or.th/App/BTWS_STAT/statistics",
  ENDPOINTS: {
    GDP_GROWTH: "/BOTWEBSTAT.aspx?reportID=223&language=ENG",
    INFLATION_RATE: "/BOTWEBSTAT.aspx?reportID=409&language=ENG",
    UNEMPLOYMENT_RATE: "/BOTWEBSTAT.aspx?reportID=398&language=ENG",
    CONSUMER_CONFIDENCE: "/BOTWEBSTAT.aspx?reportID=761&language=ENG",
    TOURISM_INDEX: "/BOTWEBSTAT.aspx?reportID=417&language=ENG",
    FOOD_PRICE_INDEX: "/BOTWEBSTAT.aspx?reportID=420&language=ENG",
    RESTAURANT_SECTOR: "/BOTWEBSTAT.aspx?reportID=425&language=ENG"
  },
  HEADERS: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": "BiteBase-Analytics/1.0"
  },
  RATE_LIMIT: {
    requests: 100,
    windowMs: 60000 // 1 minute
  },
  CACHE_TTL: 60 * 60 * 1000, // 1 hour
  ENABLED: process.env.ENABLE_BOT_API !== "false"
};

// Facebook API Configuration
export const FACEBOOK_API_CONFIG = {
  BASE_URL: "https://graph.facebook.com/v18.0",
  ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN || "",
  APP_ID: process.env.FACEBOOK_APP_ID || "",
  APP_SECRET: process.env.FACEBOOK_APP_SECRET || "",
  ENDPOINTS: {
    PAGE_INSIGHTS: "/insights",
    POSTS: "/posts",
    COMMENTS: "/comments",
    PAGE_INFO: "",
    FEED: "/feed"
  },
  METRICS: [
    "page_impressions",
    "page_engaged_users", 
    "page_post_engagements",
    "page_fans",
    "page_reach"
  ],
  RATE_LIMIT: {
    requests: 200,
    windowMs: 60000 // 1 minute
  },
  CACHE_TTL: 30 * 60 * 1000, // 30 minutes
  ENABLED: !!process.env.FACEBOOK_ACCESS_TOKEN
};

// Instagram API Configuration
export const INSTAGRAM_API_CONFIG = {
  BASE_URL: "https://graph.instagram.com/v18.0",
  ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || "",
  ENDPOINTS: {
    MEDIA: "/media",
    INSIGHTS: "/insights",
    USER_INFO: "/me",
    MEDIA_INSIGHTS: "/insights"
  },
  METRICS: [
    "impressions",
    "reach",
    "profile_views",
    "website_clicks",
    "engagement"
  ],
  RATE_LIMIT: {
    requests: 200,
    windowMs: 60000 // 1 minute
  },
  CACHE_TTL: 30 * 60 * 1000, // 30 minutes
  ENABLED: !!process.env.INSTAGRAM_ACCESS_TOKEN
};

// Twitter API Configuration
export const TWITTER_API_CONFIG = {
  BASE_URL: "https://api.twitter.com/2",
  BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || "",
  API_KEY: process.env.TWITTER_API_KEY || "",
  API_SECRET: process.env.TWITTER_API_SECRET || "",
  ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN || "",
  ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
  ENDPOINTS: {
    TWEETS_SEARCH: "/tweets/search/recent",
    USERS_BY_USERNAME: "/users/by/username",
    TWEET_COUNTS: "/tweets/counts/recent",
    USER_MENTIONS: "/users/:id/mentions"
  },
  SEARCH_PARAMS: {
    max_results: 100,
    tweet_fields: "created_at,author_id,public_metrics,context_annotations",
    user_fields: "public_metrics,verified"
  },
  RATE_LIMIT: {
    requests: 300,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  CACHE_TTL: 15 * 60 * 1000, // 15 minutes
  ENABLED: !!process.env.TWITTER_BEARER_TOKEN
};

// Google Places API Configuration
export const GOOGLE_PLACES_CONFIG = {
  BASE_URL: "https://maps.googleapis.com/maps/api/place",
  API_KEY: process.env.GOOGLE_PLACES_API_KEY || "",
  ENDPOINTS: {
    PLACE_DETAILS: "/details/json",
    NEARBY_SEARCH: "/nearbysearch/json",
    TEXT_SEARCH: "/textsearch/json",
    PLACE_PHOTOS: "/photo",
    AUTOCOMPLETE: "/autocomplete/json"
  },
  FIELDS: [
    "place_id",
    "name",
    "rating",
    "user_ratings_total",
    "opening_hours",
    "popular_times",
    "geometry",
    "formatted_address",
    "photos",
    "reviews"
  ],
  RATE_LIMIT: {
    requests: 1000,
    windowMs: 60000 // 1 minute
  },
  CACHE_TTL: 2 * 60 * 60 * 1000, // 2 hours
  ENABLED: !!process.env.GOOGLE_PLACES_API_KEY
};

// TikTok API Configuration (for future integration)
export const TIKTOK_API_CONFIG = {
  BASE_URL: "https://open-api.tiktok.com/platform/oauth/connect",
  CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY || "",
  CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET || "",
  ENDPOINTS: {
    USER_INFO: "/user/info",
    VIDEO_LIST: "/video/list",
    VIDEO_QUERY: "/video/query"
  },
  RATE_LIMIT: {
    requests: 100,
    windowMs: 60000 // 1 minute
  },
  CACHE_TTL: 30 * 60 * 1000, // 30 minutes
  ENABLED: !!process.env.TIKTOK_CLIENT_KEY
};

// Yelp API Configuration (for additional review data)
export const YELP_API_CONFIG = {
  BASE_URL: "https://api.yelp.com/v3",
  API_KEY: process.env.YELP_API_KEY || "",
  ENDPOINTS: {
    BUSINESS_SEARCH: "/businesses/search",
    BUSINESS_DETAILS: "/businesses",
    BUSINESS_REVIEWS: "/businesses/:id/reviews"
  },
  RATE_LIMIT: {
    requests: 5000,
    windowMs: 24 * 60 * 60 * 1000 // 24 hours
  },
  CACHE_TTL: 4 * 60 * 60 * 1000, // 4 hours
  ENABLED: !!process.env.YELP_API_KEY
};

// Comprehensive API Configuration
export const EXTERNAL_API_CONFIG = {
  BANK_OF_THAILAND: BANK_OF_THAILAND_CONFIG,
  FACEBOOK: FACEBOOK_API_CONFIG,
  INSTAGRAM: INSTAGRAM_API_CONFIG,
  TWITTER: TWITTER_API_CONFIG,
  GOOGLE_PLACES: GOOGLE_PLACES_CONFIG,
  TIKTOK: TIKTOK_API_CONFIG,
  YELP: YELP_API_CONFIG
};

// Global settings
export const GLOBAL_API_SETTINGS = {
  DEFAULT_TIMEOUT: 15000, // 15 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  EXPONENTIAL_BACKOFF: true,
  
  // Circuit breaker settings
  CIRCUIT_BREAKER: {
    failure_threshold: 5,
    recovery_timeout: 60000, // 1 minute
    monitor_timeout: 30000 // 30 seconds
  },
  
  // Cache settings
  CACHE: {
    DEFAULT_TTL: 30 * 60 * 1000, // 30 minutes
    MAX_SIZE: 1000, // Maximum cache entries
    CLEANUP_INTERVAL: 5 * 60 * 1000 // 5 minutes
  },
  
  // Monitoring settings
  MONITORING: {
    HEALTH_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
    PERFORMANCE_TRACKING: true,
    ERROR_REPORTING: true,
    METRICS_COLLECTION: true
  }
};

// API Status and Health Check URLs
export const API_HEALTH_ENDPOINTS = {
  BANK_OF_THAILAND: `${BANK_OF_THAILAND_CONFIG.BASE_URL}/health`,
  FACEBOOK: `${FACEBOOK_API_CONFIG.BASE_URL}/me?access_token=${FACEBOOK_API_CONFIG.ACCESS_TOKEN}`,
  INSTAGRAM: `${INSTAGRAM_API_CONFIG.BASE_URL}/me?access_token=${INSTAGRAM_API_CONFIG.ACCESS_TOKEN}`,
  TWITTER: `${TWITTER_API_CONFIG.BASE_URL}/tweets/search/recent?query=test&max_results=10`,
  GOOGLE_PLACES: `${GOOGLE_PLACES_CONFIG.BASE_URL}/textsearch/json?query=restaurant&key=${GOOGLE_PLACES_CONFIG.API_KEY}`,
  TIKTOK: `${TIKTOK_API_CONFIG.BASE_URL}/user/info`,
  YELP: `${YELP_API_CONFIG.BASE_URL}/businesses/search?term=restaurant&location=bangkok`
};

// Environment-specific configurations
export const ENVIRONMENT_CONFIG = {
  development: {
    LOG_LEVEL: "debug",
    MOCK_APIS: true,
    RATE_LIMITING: false,
    CACHE_ENABLED: true
  },
  staging: {
    LOG_LEVEL: "info",
    MOCK_APIS: false,
    RATE_LIMITING: true,
    CACHE_ENABLED: true
  },
  production: {
    LOG_LEVEL: "error",
    MOCK_APIS: false,
    RATE_LIMITING: true,
    CACHE_ENABLED: true
  }
};

// Get current environment configuration
export const getCurrentEnvironmentConfig = () => {
  if (isProduction) return ENVIRONMENT_CONFIG.production;
  if ((process.env.NODE_ENV as string) === "staging") return ENVIRONMENT_CONFIG.staging;
  return ENVIRONMENT_CONFIG.development;
};

// API Validation
export const validateAPIConfiguration = () => {
  const issues: string[] = [];
  
  // Check required environment variables
  if (!process.env.FACEBOOK_ACCESS_TOKEN && FACEBOOK_API_CONFIG.ENABLED) {
    issues.push("Facebook Access Token is missing");
  }
  
  if (!process.env.INSTAGRAM_ACCESS_TOKEN && INSTAGRAM_API_CONFIG.ENABLED) {
    issues.push("Instagram Access Token is missing");
  }
  
  if (!process.env.TWITTER_BEARER_TOKEN && TWITTER_API_CONFIG.ENABLED) {
    issues.push("Twitter Bearer Token is missing");
  }
  
  if (!process.env.GOOGLE_PLACES_API_KEY && GOOGLE_PLACES_CONFIG.ENABLED) {
    issues.push("Google Places API Key is missing");
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    enabledAPIs: Object.entries(EXTERNAL_API_CONFIG)
      .filter(([_, config]) => config.ENABLED)
      .map(([name]) => name)
  };
};

// Export utility functions
export const getAPIConfig = (apiName: keyof typeof EXTERNAL_API_CONFIG) => {
  return EXTERNAL_API_CONFIG[apiName];
};

export const isAPIEnabled = (apiName: keyof typeof EXTERNAL_API_CONFIG) => {
  return EXTERNAL_API_CONFIG[apiName].ENABLED;
};

export const getEnabledAPIs = () => {
  return Object.entries(EXTERNAL_API_CONFIG)
    .filter(([_, config]) => config.ENABLED)
    .map(([name, config]) => ({ name, config }));
};

// Development helpers
export const API_DOCUMENTATION = {
  BANK_OF_THAILAND: {
    name: "Bank of Thailand Statistics API",
    documentation: "https://www.bot.or.th/App/BTWS_STAT/statistics/ReportPage.aspx",
    description: "Official economic indicators from Thailand's central bank"
  },
  FACEBOOK: {
    name: "Facebook Graph API",
    documentation: "https://developers.facebook.com/docs/graph-api",
    description: "Access Facebook page insights and social media data"
  },
  INSTAGRAM: {
    name: "Instagram Basic Display API",
    documentation: "https://developers.facebook.com/docs/instagram-basic-display-api",
    description: "Instagram media and insights data"
  },
  TWITTER: {
    name: "Twitter API v2",
    documentation: "https://developer.twitter.com/en/docs/twitter-api",
    description: "Twitter mentions, tweets, and engagement data"
  },
  GOOGLE_PLACES: {
    name: "Google Places API",
    documentation: "https://developers.google.com/maps/documentation/places/web-service",
    description: "Location data, reviews, and foot traffic information"
  }
};

export default EXTERNAL_API_CONFIG;