/**
 * Notification Sending API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { 
      type, // 'email', 'push', 'sms'
      recipient,
      subject,
      message,
      template,
      data = {},
      userId
    } = req.body;

    if (!type || !recipient || (!message && !template)) {
      return res.status(400).json({
        error: 'Type, recipient, and message/template are required'
      });
    }

    let result;

    switch (type) {
      case 'email':
        result = await mcpClient.executeTool('send_email', {
          to: recipient,
          subject: subject || 'BiteBase Notification',
          template: template || 'generic',
          data: {
            ...data,
            message: message || data.message
          }
        });
        break;

      case 'push':
        result = await mcpClient.executeTool('send_push_notification', {
          userId: userId || recipient,
          title: subject || 'BiteBase',
          body: message,
          data
        });
        break;

      case 'sms':
        result = await mcpClient.executeTool('send_sms', {
          phone: recipient,
          message: message
        });
        break;

      default:
        return res.status(400).json({
          error: 'Invalid notification type. Must be email, push, or sms'
        });
    }

    if (!result.success) {
      return res.status(500).json({
        error: 'Notification sending failed',
        details: result.error
      });
    }

    // Track notification sent
    await mcpClient.executeTool('track_event', {
      userId: userId || req.headers['x-user-id'] || 'system',
      event: 'notification_sent',
      properties: {
        type,
        recipient: type === 'email' ? recipient : 'masked',
        template: template || 'custom',
        hasData: Object.keys(data).length > 0
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        notificationId: result.data.id || `notif_${Date.now()}`,
        type,
        status: 'sent',
        recipient: type === 'email' ? recipient : 'masked',
        meta: {
          timestamp: new Date().toISOString(),
          via: 'mcp-notification',
          server: result.server
        }
      }
    });

  } catch (error) {
    console.error('Notification sending error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}