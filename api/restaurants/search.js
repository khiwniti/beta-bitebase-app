/**
 * Restaurant Search API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    
    const {
      location,
      cuisine,
      priceRange,
      rating,
      features,
      limit = 20,
      offset = 0
    } = req.query;

    if (!location) {
      return res.status(400).json({
        error: 'Location parameter is required'
      });
    }

    // Execute restaurant search via MCP
    const searchResult = await mcpClient.executeTool('search_restaurants', {
      location,
      cuisine,
      priceRange,
      rating: rating ? parseFloat(rating) : undefined,
      features: features ? features.split(',') : undefined
    });

    if (!searchResult.success) {
      return res.status(500).json({
        error: 'Search failed',
        details: searchResult.error
      });
    }

    // Also get AI-powered recommendations
    const recommendationResult = await mcpClient.executeTool('generate_recommendations', {
      userId: req.headers['x-user-id'] || 'anonymous',
      location,
      preferences: {
        cuisine,
        priceRange,
        rating
      },
      context: {
        searchQuery: true,
        timestamp: new Date().toISOString()
      }
    });

    // Track search event
    await mcpClient.executeTool('track_event', {
      userId: req.headers['x-user-id'] || 'anonymous',
      event: 'restaurant_search',
      properties: {
        location,
        cuisine,
        priceRange,
        resultsCount: searchResult.data.restaurants?.length || 0
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        restaurants: searchResult.data.restaurants || [],
        recommendations: recommendationResult.success ? recommendationResult.data.recommendations : [],
        total: searchResult.data.total || 0,
        location: searchResult.data.location,
        filters: {
          cuisine,
          priceRange,
          rating,
          features
        },
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      },
      meta: {
        searchVia: 'mcp',
        servers: ['search', 'recommendation', 'analytics'],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Restaurant search error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}