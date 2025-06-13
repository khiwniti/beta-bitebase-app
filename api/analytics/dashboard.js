/**
 * Analytics Dashboard API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { 
      timeframe = '7d',
      metrics = 'all',
      userId,
      restaurantId 
    } = req.query;

    // Get analytics dashboard data via MCP
    const dashboardResult = await mcpClient.executeTool('get_analytics_dashboard', {
      timeframe,
      metrics: metrics === 'all' ? [
        'page_views',
        'restaurant_searches',
        'recommendations_requested',
        'user_registrations',
        'ai_chat_sessions',
        'conversion_rate'
      ] : metrics.split(','),
      filters: {
        userId: userId || undefined,
        restaurantId: restaurantId || undefined
      }
    });

    if (!dashboardResult.success) {
      return res.status(500).json({
        error: 'Dashboard data failed',
        details: dashboardResult.error
      });
    }

    // Generate insights from the data
    const insightsResult = await mcpClient.executeTool('generate_insights', {
      dataSource: 'analytics_dashboard',
      analysisType: 'trend_analysis',
      parameters: {
        timeframe,
        metrics: dashboardResult.data.metrics
      }
    });

    // Track dashboard view
    await mcpClient.executeTool('track_event', {
      userId: req.headers['x-user-id'] || 'anonymous',
      event: 'dashboard_viewed',
      properties: {
        timeframe,
        metricsRequested: metrics,
        hasFilters: !!(userId || restaurantId)
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        metrics: dashboardResult.data.metrics || {},
        insights: insightsResult.success ? insightsResult.data : null,
        timeframe,
        filters: {
          userId,
          restaurantId
        },
        meta: {
          timestamp: new Date().toISOString(),
          via: 'mcp-analytics',
          dataPoints: Object.keys(dashboardResult.data.metrics || {}).length
        }
      }
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}