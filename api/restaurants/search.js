/**
 * Restaurant Search API using Database
 */

const { getRestaurants, trackEvent } = require('../lib/database.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      location,
      cuisine,
      priceRange,
      rating,
      features,
      limit = 20,
      offset = 0
    } = req.query;

    // Build search filters
    const filters = {};
    if (cuisine) filters.cuisine = cuisine;
    if (location) filters.location = location;
    if (priceRange) filters.priceRange = priceRange;
    if (rating) filters.minRating = parseFloat(rating);
    if (limit) filters.limit = parseInt(limit);

    // Search restaurants in database
    const restaurants = await getRestaurants(filters);

    // Track search event
    await trackEvent({
      userId: req.headers['x-user-id'] || null,
      eventType: 'restaurant_search',
      eventData: {
        location,
        cuisine,
        priceRange,
        rating,
        resultsCount: restaurants.length
      },
      sessionId: req.headers['x-session-id'] || null,
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      data: {
        restaurants: restaurants,
        total: restaurants.length,
        filters: {
          cuisine,
          priceRange,
          rating,
          features,
          location
        },
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      },
      meta: {
        searchVia: 'database',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Restaurant search error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}