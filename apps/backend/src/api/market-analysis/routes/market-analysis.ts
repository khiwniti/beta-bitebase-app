/**
 * market-analysis router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::market-analysis.market-analysis', {
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
      method: 'POST',
      path: '/market-analyses/run',
      handler: 'market-analysis.createAndRun',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/market-analyses/:id/results',
      handler: 'market-analysis.getResults',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/market-analyses/summary',
      handler: 'market-analysis.getSummary',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
