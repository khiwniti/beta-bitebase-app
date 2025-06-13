/**
 * Health Check Endpoint for Vercel
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'bitebase-mcp-backend',
      version: '3.0.0',
      environment: process.env.NODE_ENV || 'development',
      mcp: {
        enabled: true,
        servers: [
          'restaurant',
          'analytics', 
          'ai',
          'payment',
          'location',
          'notification',
          'database',
          'file',
          'search',
          'recommendation'
        ]
      }
    };

    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}