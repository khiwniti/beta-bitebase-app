# BiteBase Agent Adapter

A lightweight Express server that acts as an adapter between your application and the BiteBase agent system.

## Overview

This adapter provides a simplified API to interact with BiteBase's agent system, handling request routing, error handling, and response formatting. It serves as a bridge between your frontend/backend services and the AI agent functionality.

## Features

- Simple REST API for agent interactions
- Health monitoring of agent services
- Automatic error handling and retries
- Configurable timeouts and endpoints
- CORS support for browser-based applications

## API Endpoints

The adapter exposes the following endpoints:

### Health Check

```
GET /health
```

Returns the health status of the agent services.

### Research

```
POST /api/research
```

Performs AI-powered research on restaurant-related topics.

**Request body:**
```json
{
  "query": "Thai restaurant business model",
  "type": "restaurant"
}
```

### Restaurants

```
GET /api/restaurants?latitude=40.7128&longitude=-74.0060&radius=5&platforms=all
```

Returns restaurant data for a specific location.

**Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `radius` (required): Search radius in kilometers
- `platforms` (optional): Data sources to include

### Market Analysis

```
GET /api/analyze?latitude=40.7128&longitude=-74.0060&radius=5&analysis_type=comprehensive
```

Performs market analysis for a specific location.

**Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `radius` (required): Analysis radius in kilometers
- `analysis_type` (optional): Type of analysis (comprehensive, competition, demographics)

### Geocoding

```
GET /api/geocode?address=350 5th Ave, New York, NY 10118
```

Geocodes an address to latitude and longitude coordinates.

**Parameters:**
- `address` (required): The address to geocode

## Setup

1. Ensure you have Node.js installed (v14 or later)
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` file (optional):
   ```
   PORT=3002
   AGENT_FASTAPI_URL=http://localhost:8001
   AGENT_GATEWAY_URL=http://localhost:5000
   ```
4. Start the server: `npm start`

## Example Usage

See `example-client.js` for a complete example of how to use the adapter in your Node.js application:

```javascript
const { researchRestaurant } = require('./example-client');

async function main() {
  const results = await researchRestaurant('Thai restaurant business model');
  console.log(results);
}

main().catch(console.error);
```

### Using in Frontend Applications

```javascript
// Using fetch API
fetch('http://localhost:3002/api/restaurants?latitude=40.7128&longitude=-74.0060&radius=5')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Using axios
axios.get('http://localhost:3002/api/restaurants', {
  params: { latitude: 40.7128, longitude: -74.0060, radius: 5 }
})
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port to run the adapter on | 3002 |
| AGENT_FASTAPI_URL | URL for the FastAPI agent service | http://localhost:8001 |
| AGENT_GATEWAY_URL | URL for the agent gateway service | http://localhost:5000 |

## Troubleshooting

If you encounter issues:

1. Check the health endpoint (`/health`) to verify agent services are available
2. Ensure your environment variables are correctly configured
3. Check network connectivity between the adapter and agent services
4. Review the server logs for detailed error messages

## License

MIT 