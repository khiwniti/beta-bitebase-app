'use strict';

module.exports = {
  default: () => ({
    defaultAgentUrl: 'http://localhost:3001',
    logActivities: true,
    enableCache: true,
    cacheDuration: 3600 // 1 hour
  }),
  validator: (config) => {
    if (typeof config.defaultAgentUrl !== 'string') {
      throw new Error('defaultAgentUrl must be a string');
    }
  }
}; 