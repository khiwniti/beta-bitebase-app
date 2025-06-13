/**
 * AI Chat API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { message, context, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    // Chat with AI via MCP
    const chatResult = await mcpClient.executeTool('chat_with_ai', {
      message,
      context: context || {},
      userId: userId || req.headers['x-user-id'] || 'anonymous'
    });

    if (!chatResult.success) {
      return res.status(500).json({
        error: 'AI chat failed',
        details: chatResult.error
      });
    }

    // Analyze sentiment of the message
    const sentimentResult = await mcpClient.executeTool('analyze_sentiment', {
      text: message,
      type: 'user_message'
    });

    // Track chat event
    await mcpClient.executeTool('track_event', {
      userId: userId || req.headers['x-user-id'] || 'anonymous',
      event: 'ai_chat',
      properties: {
        messageLength: message.length,
        sentiment: sentimentResult.success ? sentimentResult.data.sentiment : 'unknown',
        hasContext: !!context
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        response: chatResult.data.response,
        suggestions: chatResult.data.suggestions || [],
        sentiment: sentimentResult.success ? sentimentResult.data : null,
        meta: {
          timestamp: new Date().toISOString(),
          via: 'mcp-ai',
          messageId: `msg_${Date.now()}`
        }
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}