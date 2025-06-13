/**
 * Restaurant Details API using Database
 */

const { pool, trackEvent } = require('../lib/database.js');

module.exports = async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Restaurant ID is required' });
  }

  try {
    const client = await pool.connect();

    switch (req.method) {
      case 'GET':
        try {
          // Get restaurant details from database
          const restaurantResult = await client.query(
            'SELECT * FROM restaurants WHERE id = $1 AND is_active = true',
            [id]
          );

          if (restaurantResult.rows.length === 0) {
            return res.status(404).json({
              error: 'Restaurant not found'
            });
          }

          const restaurant = restaurantResult.rows[0];

          // Get similar restaurants (same cuisine, different restaurant)
          const similarResult = await client.query(
            'SELECT * FROM restaurants WHERE cuisine = $1 AND id != $2 AND is_active = true ORDER BY rating DESC LIMIT 5',
            [restaurant.cuisine, id]
          );

          // Track view event
          await trackEvent({
            userId: req.headers['x-user-id'] || null,
            eventType: 'restaurant_view',
            eventData: {
              restaurantId: id,
              restaurantName: restaurant.name,
              cuisine: restaurant.cuisine
            },
            sessionId: req.headers['x-session-id'] || null,
            ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
          });

          res.status(200).json({
            success: true,
            data: {
              restaurant: restaurant,
              similar: similarResult.rows,
              meta: {
                viewedAt: new Date().toISOString(),
                via: 'database'
              }
            }
          });
        } finally {
          client.release();
        }
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