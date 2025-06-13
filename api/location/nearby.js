/**
 * Nearby Restaurants API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { 
      lat, 
      lng, 
      radius = 5000, // 5km default
      cuisine,
      priceRange,
      rating,
      limit = 20 
    } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Latitude and longitude are required'
      });
    }

    // Find nearby restaurants via MCP
    const nearbyResult = await mcpClient.executeTool('find_nearby_restaurants', {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      radius: parseInt(radius),
      filters: {
        cuisine,
        priceRange,
        rating: rating ? parseFloat(rating) : undefined,
        limit: parseInt(limit)
      }
    });

    if (!nearbyResult.success) {
      return res.status(500).json({
        error: 'Nearby search failed',
        details: nearbyResult.error
      });
    }

    // Get personalized recommendations for this location
    const recommendationsResult = await mcpClient.executeTool('get_personalized_recommendations', {
      userId: req.headers['x-user-id'] || 'anonymous',
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      },
      preferences: {
        cuisine,
        priceRange,
        rating
      },
      context: {
        searchType: 'nearby',
        radius: parseInt(radius)
      }
    });

    // Track nearby search event
    await mcpClient.executeTool('track_event', {
      userId: req.headers['x-user-id'] || 'anonymous',
      event: 'nearby_search',
      properties: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        radius: parseInt(radius),
        filters: { cuisine, priceRange, rating },
        resultsCount: nearbyResult.data.restaurants?.length || 0
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        restaurants: nearbyResult.data.restaurants || [],
        recommendations: recommendationsResult.success ? recommendationsResult.data.recommendations : [],
        location: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng)
        },
        searchRadius: parseInt(radius),
        filters: {
          cuisine,
          priceRange,
          rating
        },
        meta: {
          timestamp: new Date().toISOString(),
          via: 'mcp-location',
          totalResults: nearbyResult.data.restaurants?.length || 0
        }
      }
    });

  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}