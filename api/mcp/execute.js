/**
 * MCP Tool Execution API
 * Execute any MCP tool with parameters
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { tool, parameters = {} } = req.body;

    if (!tool) {
      return res.status(400).json({
        error: 'Tool name is required'
      });
    }

    // Execute the tool via MCP
    const result = await mcpClient.executeTool(tool, parameters);

    if (!result.success) {
      return res.status(500).json({
        error: 'Tool execution failed',
        details: result.error,
        tool: result.tool,
        server: result.server
      });
    }

    // Track tool execution
    await mcpClient.executeTool('track_event', {
      userId: req.headers['x-user-id'] || 'anonymous',
      event: 'mcp_tool_executed',
      properties: {
        tool: result.tool,
        server: result.server,
        parametersCount: Object.keys(parameters).length,
        success: result.success
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: {
        tool: result.tool,
        server: result.server,
        executedAt: new Date().toISOString(),
        via: 'mcp-direct'
      }
    });

  } catch (error) {
    console.error('MCP tool execution error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}