/**
 * BiteBase Agent Mock Server
 * 
 * This is a simple mock server that simulates the agent services
 * to test the agent adapter without needing the actual agent services.
 */

const express = require('express');
const app = express();
const PORT = 8001;

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

// Research endpoint
app.post('/research', (req, res) => {
  const { query, type } = req.body;
  
  console.log(`Received research request: ${query} (${type})`);
  
  // Simulate processing time
  setTimeout(() => {
    res.json({
      query,
      type,
      results: [
        {
          title: 'Sample Research Result',
          content: `This is a mock research response for: ${query}`,
          confidence: 0.85
        }
      ],
      timestamp: new Date().toISOString()
    });
  }, 500);
});

// Start the mock server
app.listen(PORT, () => {
  console.log(`Mock FastAPI service running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /health');
  console.log('- POST /research');
});

// Create a second server to mock the Gateway API
const gatewayApp = express();
const GATEWAY_PORT = 5000;

gatewayApp.use(express.json());

// Health endpoint
gatewayApp.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

// Restaurants endpoint
gatewayApp.get('/api/restaurants', (req, res) => {
  const { latitude, longitude, radius, platforms } = req.query;
  
  console.log(`Received restaurants request: [${latitude}, ${longitude}] within ${radius}km`);
  
  // Simulate processing time
  setTimeout(() => {
    res.json([
      {
        id: 'mock-restaurant-1',
        name: 'Mock Thai Restaurant',
        address: '123 Mock Street',
        latitude: parseFloat(latitude) + 0.01,
        longitude: parseFloat(longitude) - 0.01,
        rating: 4.5,
        price_level: '$$',
        cuisine: 'Thai'
      },
      {
        id: 'mock-restaurant-2',
        name: 'Mock Italian Restaurant',
        address: '456 Mock Avenue',
        latitude: parseFloat(latitude) - 0.01,
        longitude: parseFloat(longitude) + 0.01,
        rating: 4.2,
        price_level: '$$$',
        cuisine: 'Italian'
      }
    ]);
  }, 500);
});

// Analyze endpoint
gatewayApp.get('/api/analyze', (req, res) => {
  const { latitude, longitude, radius, analysis_type } = req.query;
  
  console.log(`Received analysis request: [${latitude}, ${longitude}] within ${radius}km (${analysis_type})`);
  
  // Simulate processing time
  setTimeout(() => {
    res.json({
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseFloat(radius)
      },
      analysis_type,
      results: {
        demographics: {
          population: 12500,
          average_income: 65000,
          age_distribution: {
            '18-24': 0.15,
            '25-34': 0.25,
            '35-44': 0.20,
            '45-54': 0.15,
            '55+': 0.25
          }
        },
        competition: {
          restaurant_count: 24,
          average_rating: 4.1,
          cuisine_distribution: {
            'Thai': 0.12,
            'Italian': 0.18,
            'American': 0.25,
            'Mexican': 0.15,
            'Other': 0.30
          }
        }
      },
      timestamp: new Date().toISOString()
    });
  }, 800);
});

// Geocode endpoint
gatewayApp.get('/api/geocode', (req, res) => {
  const { address } = req.query;
  
  console.log(`Received geocoding request: ${address}`);
  
  // Simulate processing time
  setTimeout(() => {
    res.json({
      address,
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 'high',
      timestamp: new Date().toISOString()
    });
  }, 300);
});

// Start the gateway mock server
gatewayApp.listen(GATEWAY_PORT, () => {
  console.log(`Mock Gateway service running on http://localhost:${GATEWAY_PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/health');
  console.log('- GET /api/restaurants');
  console.log('- GET /api/analyze');
  console.log('- GET /api/geocode');
}); 