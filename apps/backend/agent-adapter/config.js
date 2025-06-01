/**
 * BiteBase Agent Adapter Configuration
 *
 * This file manages the configuration for the agent adapter,
 * reading from environment variables and providing defaults.
 */

// Load environment variables from .env file
require("dotenv").config();

// Server configuration
const SERVER = {
  PORT: parseInt(process.env.PORT || "3002", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "0.0.0.0",
};

// Agent service URLs
const SERVICES = {
  FASTAPI_URL: process.env.AGENT_FASTAPI_URL || "http://localhost:8001",
  GATEWAY_URL: process.env.AGENT_GATEWAY_URL || "http://localhost:5000",
};

// Timeout configuration (in milliseconds)
const TIMEOUTS = {
  RESEARCH: parseInt(process.env.RESEARCH_TIMEOUT || "30000", 10),
  RESTAURANTS: parseInt(process.env.RESTAURANTS_TIMEOUT || "30000", 10),
  ANALYZE: parseInt(process.env.ANALYZE_TIMEOUT || "45000", 10),
  GEOCODE: parseInt(process.env.GEOCODE_TIMEOUT || "15000", 10),
  HEALTH: parseInt(process.env.HEALTH_TIMEOUT || "5000", 10),
};

// CORS configuration
const CORS = {
  ORIGIN: process.env.CORS_ORIGIN || "*",
  METHODS: process.env.CORS_METHODS || "GET,POST,PUT,DELETE,OPTIONS",
  ALLOWED_HEADERS:
    process.env.CORS_ALLOWED_HEADERS ||
    "Origin,X-Requested-With,Content-Type,Accept,Authorization",
};

// Logging configuration
const LOGGING = {
  LEVEL: process.env.LOG_LEVEL || "info",
  ENABLED: process.env.ENABLE_LOGGING !== "false",
};

// Export the configuration
module.exports = {
  SERVER,
  SERVICES,
  TIMEOUTS,
  CORS,
  LOGGING,
};
