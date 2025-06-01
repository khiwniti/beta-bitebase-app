'use strict';

const axios = require('axios');

/**
 * Agent service for common agent operations
 */
module.exports = ({ strapi }) => ({
  /**
   * Get configuration for agent services
   */
  getConfig() {
    return {
      fastApiUrl: process.env.AGENT_FASTAPI_URL || 'http://localhost:3001',
      gatewayUrl: process.env.AGENT_GATEWAY_URL || 'http://localhost:3001',
    };
  },

  /**
   * Check if agent services are available
   */
  async checkAvailability() {
    const { fastApiUrl, gatewayUrl } = this.getConfig();
    
    try {
      const [fastApiResponse, gatewayResponse] = await Promise.allSettled([
        axios.get(`${fastApiUrl}/health`, { timeout: 5000 }),
        axios.get(`${gatewayUrl}/api/health`, { timeout: 5000 })
      ]);
      
      return {
        fastApi: fastApiResponse.status === 'fulfilled',
        gateway: gatewayResponse.status === 'fulfilled',
        available: fastApiResponse.status === 'fulfilled' || gatewayResponse.status === 'fulfilled'
      };
    } catch (error) {
      strapi.log.error(`Error checking agent availability: ${error.message}`);
      return {
        fastApi: false,
        gateway: false,
        available: false
      };
    }
  },

  /**
   * Log agent activity to the database
   */
  async logActivity(action, data, result, success = true) {
    try {
      // Check if the activity logger collection exists
      const activityModel = strapi.query('plugin::agent-integration.agent-activity');
      
      if (activityModel) {
        await activityModel.create({
          data: {
            action,
            data: JSON.stringify(data),
            result: JSON.stringify(result),
            success,
            timestamp: new Date()
          }
        });
      }
    } catch (error) {
      strapi.log.error(`Error logging agent activity: ${error.message}`);
      // Don't throw, just log the error
    }
  }
}); 