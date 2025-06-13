/**
 * Restaurant Details API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Restaurant ID is required' });
  }

  try {
    const mcpClient = getMCPClient();

    switch (req.method) {
      case 'GET':
        // Get restaurant details via MCP
        const detailsResult = await mcpClient.executeTool('get_restaurant_details', {
          restaurantId: id
        });

        if (!detailsResult.success) {
          return res.status(404).json({
            error: 'Restaurant not found',
            details: detailsResult.error
          });
        }

        // Get similar restaurants
        const similarResult = await mcpClient.executeTool('get_similar_restaurants', {
          restaurantId: id,
          limit: 5
        });

        // Track view event
        await mcpClient.executeTool('track_event', {
          userId: req.headers['x-user-id'] || 'anonymous',
          event: 'restaurant_view',
          properties: {
            restaurantId: id,
            timestamp: new Date().toISOString()
          }
        });

        res.status(200).json({
          success: true,
          data: {
            restaurant: detailsResult.data,
            similar: similarResult.success ? similarResult.data : [],
            meta: {
              viewedAt: new Date().toISOString(),
              via: 'mcp'
            }
          }
        });
        break;

      case 'PUT':
        // Update restaurant (admin only)
        const updateData = req.body;
        
        const updateResult = await mcpClient.executeTool('update_record', {
          table: 'restaurants',
          id: id,
          data: updateData
        });

        if (!updateResult.success) {
          return res.status(500).json({
            error: 'Update failed',
            details: updateResult.error
          });
        }

        res.status(200).json({
          success: true,
          data: updateResult.data
        });
        break;

      case 'DELETE':
        // Delete restaurant (admin only)
        const deleteResult = await mcpClient.executeTool('delete_record', {
          table: 'restaurants',
          id: id
        });

        if (!deleteResult.success) {
          return res.status(500).json({
            error: 'Delete failed',
            details: deleteResult.error
          });
        }

        res.status(200).json({
          success: true,
          message: 'Restaurant deleted successfully'
        });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Restaurant API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}