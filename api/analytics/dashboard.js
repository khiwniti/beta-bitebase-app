/**
 * Analytics Dashboard API using Database
 */

const { pool, trackEvent } = require('../lib/database.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      timeframe = '7d',
      metrics = 'all',
      userId,
      restaurantId 
    } = req.query;

    const client = await pool.connect();
    
    try {
      // Calculate date range based on timeframe
      const now = new Date();
      const timeframeDays = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 7;
      const startDate = new Date(now.getTime() - (timeframeDays * 24 * 60 * 60 * 1000));

      // Get analytics metrics from database
      const analyticsMetrics = {};

      // Total restaurants
      const restaurantCountResult = await client.query(
        'SELECT COUNT(*) as total FROM restaurants WHERE is_active = true'
      );
      analyticsMetrics.totalRestaurants = parseInt(restaurantCountResult.rows[0].total);

      // Total users
      const userCountResult = await client.query(
        'SELECT COUNT(*) as total FROM users WHERE is_active = true'
      );
      analyticsMetrics.totalUsers = parseInt(userCountResult.rows[0].total);

      // Recent searches
      const searchCountResult = await client.query(
        'SELECT COUNT(*) as total FROM analytics_events WHERE event_type = $1 AND created_at >= $2',
        ['restaurant_search', startDate]
      );
      analyticsMetrics.recentSearches = parseInt(searchCountResult.rows[0].total);

      // Recent views
      const viewCountResult = await client.query(
        'SELECT COUNT(*) as total FROM analytics_events WHERE event_type = $1 AND created_at >= $2',
        ['restaurant_view', startDate]
      );
      analyticsMetrics.recentViews = parseInt(viewCountResult.rows[0].total);

      // Popular cuisines
      const cuisineResult = await client.query(
        'SELECT cuisine, COUNT(*) as count FROM restaurants WHERE is_active = true GROUP BY cuisine ORDER BY count DESC LIMIT 5'
      );
      analyticsMetrics.popularCuisines = cuisineResult.rows;

      // Recent activity
      const activityResult = await client.query(
        'SELECT event_type, COUNT(*) as count, DATE(created_at) as date FROM analytics_events WHERE created_at >= $1 GROUP BY event_type, DATE(created_at) ORDER BY date DESC LIMIT 10',
        [startDate]
      );
      analyticsMetrics.recentActivity = activityResult.rows;

      // Track dashboard view
      await trackEvent({
        userId: req.headers['x-user-id'] || null,
        eventType: 'dashboard_viewed',
        eventData: {
          timeframe,
          metricsRequested: metrics,
          hasFilters: !!(userId || restaurantId)
        },
        sessionId: req.headers['x-session-id'] || null,
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      res.status(200).json({
        success: true,
        data: {
          metrics: analyticsMetrics,
          timeframe,
          filters: {
            userId,
            restaurantId
          },
          meta: {
            timestamp: new Date().toISOString(),
            via: 'database',
            dataPoints: Object.keys(analyticsMetrics).length
          }
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}