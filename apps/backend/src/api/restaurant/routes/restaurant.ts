/**
 * restaurant router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::restaurant.restaurant', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
    create: {
      middlewares: [],
    },
    update: {
      middlewares: [],
    },
    delete: {
      middlewares: [],
    },
  },
});

// Custom routes
export const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/restaurants/by-location',
      handler: 'restaurant.findByLocation',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/restaurants/:id/analytics',
      handler: 'restaurant.getAnalytics',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/restaurants/cuisine-distribution',
      handler: 'restaurant.getCuisineDistribution',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
