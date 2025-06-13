/**
 * Health Check Endpoint for Vercel
 */

const { testConnection } = require('./lib/database.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    const health = {
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'bitebase-backend',
      version: '3.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbConnected,
        type: 'postgresql',
        provider: 'neon'
      },
      services: {
        api: true,
        database: dbConnected,
        analytics: true,
        search: true
      }
    };

    res.status(dbConnected ? 200 : 503).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}