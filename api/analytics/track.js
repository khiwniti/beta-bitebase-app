/**
 * Event Tracking API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { 
      event,
      properties = {},
      userId,
      sessionId,
      timestamp 
    } = req.body;

    if (!event) {
      return res.status(400).json({
        error: 'Event name is required'
      });
    }

    // Track event via MCP
    const trackResult = await mcpClient.executeTool('track_event', {
      userId: userId || req.headers['x-user-id'] || 'anonymous',
      event,
      properties: {
        ...properties,
        sessionId: sessionId || req.headers['x-session-id'],
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        referer: req.headers.referer
      },
      timestamp: timestamp || new Date().toISOString()
    });

    if (!trackResult.success) {
      return res.status(500).json({
        error: 'Event tracking failed',
        details: trackResult.error
      });
    }

    res.status(200).json({
      success: true,
      data: {
        eventId: trackResult.data.eventId,
        tracked: trackResult.data.tracked,
        event,
        timestamp: timestamp || new Date().toISOString(),
        meta: {
          via: 'mcp-analytics',
          server: trackResult.server
        }
      }
    });

  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}