/**
 * restaurant controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::restaurant.restaurant', ({ strapi }) => ({
  // Custom method to find restaurants by location
  async findByLocation(ctx) {
    const { latitude, longitude, radius = 5 } = ctx.query;

    if (!latitude || !longitude) {
      return ctx.badRequest('Latitude and longitude are required');
    }

    try {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const rad = parseFloat(radius as string);

      if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
        return ctx.badRequest('Invalid numeric parameters');
      }

      const restaurants = await strapi.entityService.findMany('api::restaurant.restaurant', {
        filters: {
          // This would need a proper geospatial query in production
          latitude: {
            $gte: lat - rad * 0.01,
            $lte: lat + rad * 0.01,
          },
          longitude: {
            $gte: lng - rad * 0.01,
            $lte: lng + rad * 0.01,
          },
        },
        populate: ['images'],
      });

      return restaurants;
    } catch (error) {
      ctx.throw(500, 'Error fetching restaurants by location');
    }
  },

  // Custom method to get restaurant analytics
  async getAnalytics(ctx) {
    const { id } = ctx.params;

    try {
      const restaurant = await strapi.entityService.findOne('api::restaurant.restaurant', id, {
        populate: ['images'],
      });

      if (!restaurant) {
        return ctx.notFound('Restaurant not found');
      }

      // Mock analytics data - in production this would come from real analytics
      const analytics = {
        restaurant,
        competitorCount: Math.floor(Math.random() * 20) + 5,
        marketShare: (Math.random() * 15 + 5).toFixed(1),
        footTraffic: Math.floor(Math.random() * 1000) + 500,
        demographicMatch: (Math.random() * 30 + 70).toFixed(1),
        revenueEstimate: Math.floor(Math.random() * 500000) + 100000,
      };

      return analytics;
    } catch (error) {
      ctx.throw(500, 'Error fetching restaurant analytics');
    }
  },

  // Custom method to get cuisine distribution
  async getCuisineDistribution(ctx) {
    try {
      const restaurants = await strapi.entityService.findMany('api::restaurant.restaurant', {
        fields: ['cuisine'],
      });

      const cuisineCount = restaurants.reduce((acc: Record<string, number>, restaurant) => {
        const cuisine = restaurant.cuisine;
        if (cuisine) {
          acc[cuisine] = (acc[cuisine] || 0) + 1;
        }
        return acc;
      }, {});

      const distribution = Object.entries(cuisineCount).map(([cuisine, count]) => ({
        cuisine,
        count: count as number,
        percentage: ((count as number / restaurants.length) * 100).toFixed(1),
      }));

      return distribution.sort((a, b) => (b.count as number) - (a.count as number));
    } catch (error) {
      ctx.throw(500, 'Error fetching cuisine distribution');
    }
  },
}));
