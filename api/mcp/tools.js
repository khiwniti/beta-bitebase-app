/**
 * MCP Tools Registry API
 * Lists all available MCP tools and their capabilities
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    
    // Get all available tools
    const tools = mcpClient.getAvailableTools();
    
    // Get server status
    const serverStatus = await mcpClient.getServerStatus();

    res.status(200).json({
      success: true,
      data: {
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          server: tool.server,
          inputSchema: tool.inputSchema,
          available: serverStatus[tool.server]?.connected || false
        })),
        servers: serverStatus,
        meta: {
          totalTools: tools.length,
          totalServers: Object.keys(serverStatus).length,
          activeServers: Object.values(serverStatus).filter(s => s.connected).length,
          timestamp: new Date().toISOString(),
          mcpVersion: '1.0.0'
        }
      }
    });

  } catch (error) {
    console.error('MCP tools registry error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}