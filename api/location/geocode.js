/**
 * Geocoding API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { address, lat, lng } = req.query;

    let result;

    if (address) {
      // Forward geocoding: address to coordinates
      result = await mcpClient.executeTool('geocode_address', {
        address
      });
    } else if (lat && lng) {
      // Reverse geocoding: coordinates to address
      result = await mcpClient.executeTool('reverse_geocode', {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      });
    } else {
      return res.status(400).json({
        error: 'Either address or lat/lng parameters are required'
      });
    }

    if (!result.success) {
      return res.status(500).json({
        error: 'Geocoding failed',
        details: result.error
      });
    }

    // Track geocoding event
    await mcpClient.executeTool('track_event', {
      userId: req.headers['x-user-id'] || 'anonymous',
      event: 'geocoding_request',
      properties: {
        type: address ? 'forward' : 'reverse',
        address: address || undefined,
        coordinates: lat && lng ? `${lat},${lng}` : undefined
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: {
        timestamp: new Date().toISOString(),
        via: 'mcp-location',
        type: address ? 'forward_geocoding' : 'reverse_geocoding'
      }
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}