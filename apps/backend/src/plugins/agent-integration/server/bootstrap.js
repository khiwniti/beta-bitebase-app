'use strict';

module.exports = ({ strapi }) => {
  // Bootstrap logic (runs at startup)
  strapi.log.info('Agent Integration plugin is bootstrapping...');
  
  // Check if agent services are available
  strapi.plugin('agent-integration').service('agent-service').checkAvailability()
    .then(availability => {
      if (availability.available) {
        strapi.log.info('Successfully connected to agent services');
      } else {
        strapi.log.warn('Agent services are not available. Some features may be limited.');
      }
    })
    .catch(error => {
      strapi.log.error(`Error checking agent availability: ${error.message}`);
    });
}; 