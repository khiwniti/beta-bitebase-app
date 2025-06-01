/**
 * BiteBase Agent Adapter
 *
 * A simple Express-based adapter for the Bitebase agent system.
 */

// Import required modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { SERVER, SERVICES, TIMEOUTS, CORS, LOGGING } = require("./config");
const logger = require("./logger");

// Create Express app
const app = express();

// Ensure logs directory exists
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: CORS.ORIGIN,
    methods: CORS.METHODS.split(","),
    allowedHeaders: CORS.ALLOWED_HEADERS.split(","),
  }),
);

// Request logging
app.use((req, res, next) => {
  const startTime = Date.now();

  logger.logRequest(req);

  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    logger.logResponse(req, res, { responseTime });
  });

  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.logError(req, err);
  res
    .status(500)
    .json({ error: "Internal server error", message: err.message });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const [fastApiHealth, gatewayHealth] = await Promise.allSettled([
      axios.get(`${SERVICES.FASTAPI_URL}/health`, { timeout: TIMEOUTS.HEALTH }),
      axios.get(`${SERVICES.GATEWAY_URL}/api/health`, {
        timeout: TIMEOUTS.HEALTH,
      }),
    ]);

    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      fastapi: {
        status: fastApiHealth.status === "fulfilled" ? "healthy" : "unhealthy",
        url: SERVICES.FASTAPI_URL,
        error:
          fastApiHealth.status === "rejected"
            ? fastApiHealth.reason.message
            : null,
      },
      gateway: {
        status: gatewayHealth.status === "fulfilled" ? "healthy" : "unhealthy",
        url: SERVICES.GATEWAY_URL,
        error:
          gatewayHealth.status === "rejected"
            ? gatewayHealth.reason.message
            : null,
      },
    };

    res.json(healthStatus);
  } catch (error) {
    logger.error("Health check failed", { error: error.message });
    res
      .status(500)
      .json({ error: "Health check failed", details: error.message });
  }
});

// Agent API Routes

// Research endpoint (FastAPI)
app.post("/api/research", async (req, res) => {
  try {
    logger.info("AI Research request", { body: req.body });

    const response = await axios.post(
      `${SERVICES.FASTAPI_URL}/research`,
      req.body,
      {
        headers: { "Content-Type": "application/json" },
        timeout: TIMEOUTS.RESEARCH,
      },
    );

    res.json(response.data);
  } catch (error) {
    logger.error("AI Research error", { error: error.message });

    if (error.response) {
      res.status(error.response.status).json({
        error: "AI research failed",
        details: error.response.data,
      });
    } else {
      res.status(500).json({
        error: "AI service unavailable",
        details: error.message,
      });
    }
  }
});

// Restaurant data from agents (Gateway)
app.get("/api/restaurants", async (req, res) => {
  try {
    const { latitude, longitude, radius, platforms } = req.query;

    if (!latitude || !longitude || !radius) {
      return res
        .status(400)
        .json({
          error: "Missing required parameters: latitude, longitude, radius",
        });
    }

    logger.info("AI Restaurant data request", { query: req.query });

    const response = await axios.get(
      `${SERVICES.GATEWAY_URL}/api/restaurants`,
      {
        params: { latitude, longitude, radius, platforms },
        timeout: TIMEOUTS.RESTAURANTS,
      },
    );

    res.json(response.data);
  } catch (error) {
    logger.error("AI Restaurant data error", { error: error.message });

    if (error.response) {
      res.status(error.response.status).json({
        error: "AI restaurant data failed",
        details: error.response.data,
      });
    } else {
      res.status(500).json({
        error: "AI service unavailable",
        details: error.message,
      });
    }
  }
});

// Market analysis from agents (Gateway)
app.get("/api/analyze", async (req, res) => {
  try {
    const { latitude, longitude, radius, platforms, analysis_type } = req.query;

    if (!latitude || !longitude || !radius) {
      return res
        .status(400)
        .json({
          error: "Missing required parameters: latitude, longitude, radius",
        });
    }

    logger.info("AI Analysis request", { query: req.query });

    const response = await axios.get(`${SERVICES.GATEWAY_URL}/api/analyze`, {
      params: { latitude, longitude, radius, platforms, analysis_type },
      timeout: TIMEOUTS.ANALYZE,
    });

    res.json(response.data);
  } catch (error) {
    logger.error("AI Analysis error", { error: error.message });

    if (error.response) {
      res.status(error.response.status).json({
        error: "AI analysis failed",
        details: error.response.data,
      });
    } else {
      res.status(500).json({
        error: "AI service unavailable",
        details: error.message,
      });
    }
  }
});

// Geocoding from agents (Gateway)
app.get("/api/geocode", async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res
        .status(400)
        .json({ error: "Missing required parameter: address" });
    }

    logger.info("AI Geocoding request", { query: req.query });

    const response = await axios.get(`${SERVICES.GATEWAY_URL}/api/geocode`, {
      params: { address },
      timeout: TIMEOUTS.GEOCODE,
    });

    res.json(response.data);
  } catch (error) {
    logger.error("AI Geocoding error", { error: error.message });

    if (error.response) {
      res.status(error.response.status).json({
        error: "AI geocoding failed",
        details: error.response.data,
      });
    } else {
      res.status(500).json({
        error: "AI service unavailable",
        details: error.message,
      });
    }
  }
});

// Start server
const server = app.listen(SERVER.PORT, SERVER.HOST, () => {
  logger.info(
    `BiteBase Agent Adapter running on http://${SERVER.HOST}:${SERVER.PORT}`,
  );
  logger.info(`Health check: http://${SERVER.HOST}:${SERVER.PORT}/health`);
  logger.info(
    `Research API: http://${SERVER.HOST}:${SERVER.PORT}/api/research`,
  );
  logger.info(
    `Restaurants API: http://${SERVER.HOST}:${SERVER.PORT}/api/restaurants`,
  );
  logger.info(
    `Market Analysis API: http://${SERVER.HOST}:${SERVER.PORT}/api/analyze`,
  );
  logger.info(
    `Geocoding API: http://${SERVER.HOST}:${SERVER.PORT}/api/geocode`,
  );
});

// Handle shutdown gracefully
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
  });
});

module.exports = app;
