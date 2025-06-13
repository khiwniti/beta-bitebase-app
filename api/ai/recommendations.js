/**
 * AI Recommendations API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { userId, location, preferences, context } = req.body;

    if (!userId || !location) {
      return res.status(400).json({
        error: 'userId and location are required'
      });
    }

    // Get personalized recommendations via MCP
    const recommendationsResult = await mcpClient.executeTool('get_personalized_recommendations', {
      userId,
      location,
      preferences: preferences || {},
      context: context || {}
    });

    if (!recommendationsResult.success) {
      return res.status(500).json({
        error: 'Recommendations failed',
        details: recommendationsResult.error
      });
    }

    // Predict trends for the location
    const trendsResult = await mcpClient.executeTool('predict_trends', {
      location: typeof location === 'string' ? location : `${location.latitude},${location.longitude}`,
      timeframe: '30d',
      factors: ['cuisine', 'price', 'rating', 'popularity']
    });

    // Update user preferences based on this request
    if (preferences) {
      await mcpClient.executeTool('update_user_preferences', {
        userId,
        preferences,
        interactions: [{
          type: 'recommendation_request',
          timestamp: new Date().toISOString(),
          location,
          context
        }]
      });
    }

    // Track recommendation event
    await mcpClient.executeTool('track_event', {
      userId,
      event: 'recommendations_requested',
      properties: {
        location: typeof location === 'string' ? location : 'coordinates',
        preferencesProvided: !!preferences,
        contextProvided: !!context,
        recommendationsCount: recommendationsResult.data.recommendations?.length || 0
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        recommendations: recommendationsResult.data.recommendations || [],
        trends: trendsResult.success ? trendsResult.data : null,
        location,
        preferences,
        meta: {
          timestamp: new Date().toISOString(),
          via: 'mcp-ai',
          algorithm: 'personalized-ml',
          version: '3.0'
        }
      }
    });

  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}