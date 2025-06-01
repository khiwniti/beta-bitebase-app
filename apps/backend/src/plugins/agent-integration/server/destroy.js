'use strict';

module.exports = ({ strapi }) => {
  // Cleanup logic when Strapi is shutting down
  strapi.log.info('Agent Integration plugin is shutting down...');
};