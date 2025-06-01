'use strict';

const axios = require('axios');

/**
 * Agent controller for handling agent API interactions
 */
module.exports = ({ strapi }) => ({
  /**
   * Forward research request to the agent system
   */
  async research(ctx) {
    try {
      const { body } = ctx.request;
      const agentUrl = process.env.AGENT_FASTAPI_URL || 'http://localhost:3001';
      
      strapi.log.info(`Agent research request: ${JSON.stringify(body)}`);
      
      const response = await axios.post(`${agentUrl}/research`, body, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // 30 second timeout
      });
      
      return response.data;
    } catch (error) {
      strapi.log.error(`Agent research error: ${error.message}`);
      
      ctx.throw(
        error.response?.status || 500,
        error.response?.data || { error: 'Agent service unavailable', details: error.message }
      );
    }
  },

  /**
   * Get restaurant data from agent system
   */
  async getRestaurants(ctx) {
    try {
      const { latitude, longitude, radius, platforms } = ctx.query;
      
      if (!latitude || !longitude || !radius) {
        return ctx.badRequest('Missing required parameters: latitude, longitude, radius');
      }
      
      const agentUrl = process.env.AGENT_GATEWAY_URL || 'http://localhost:3001';
      
      strapi.log.info(`Agent restaurant data request: ${JSON.stringify(ctx.query)}`);
      
      const response = await axios.get(`${agentUrl}/api/restaurants`, {
        params: { latitude, longitude, radius, platforms },
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      strapi.log.error(`Agent restaurant data error: ${error.message}`);
      
      ctx.throw(
        error.response?.status || 500,
        error.response?.data || { error: 'Agent service unavailable', details: error.message }
      );
    }
  },

  /**
   * Get market analysis from agent system
   */
  async analyze(ctx) {
    try {
      const { latitude, longitude, radius, platforms, analysis_type } = ctx.query;
      
      if (!latitude || !longitude || !radius) {
        return ctx.badRequest('Missing required parameters: latitude, longitude, radius');
      }
      
      const agentUrl = process.env.AGENT_GATEWAY_URL || 'http://localhost:3001';
      
      strapi.log.info(`Agent analysis request: ${JSON.stringify(ctx.query)}`);
      
      const response = await axios.get(`${agentUrl}/api/analyze`, {
        params: { latitude, longitude, radius, platforms, analysis_type },
        timeout: 45000 // Longer timeout for analysis
      });
      
      return response.data;
    } catch (error) {
      strapi.log.error(`Agent analysis error: ${error.message}`);
      
      ctx.throw(
        error.response?.status || 500,
        error.response?.data || { error: 'Agent service unavailable', details: error.message }
      );
    }
  },

  /**
   * Geocode address using agent system
   */
  async geocode(ctx) {
    try {
      const { address } = ctx.query;
      
      if (!address) {
        return ctx.badRequest('Missing required parameter: address');
      }
      
      const agentUrl = process.env.AGENT_GATEWAY_URL || 'http://localhost:3001';
      
      strapi.log.info(`Agent geocoding request: ${JSON.stringify(ctx.query)}`);
      
      const response = await axios.get(`${agentUrl}/api/geocode`, {
        params: { address },
        timeout: 15000
      });
      
      return response.data;
    } catch (error) {
      strapi.log.error(`Agent geocoding error: ${error.message}`);
      
      ctx.throw(
        error.response?.status || 500,
        error.response?.data || { error: 'Agent service unavailable', details: error.message }
      );
    }
  },

  /**
   * Check agent system health
   */
  async health(ctx) {
    try {
      const agentFastApiUrl = process.env.AGENT_FASTAPI_URL || 'http://localhost:3001';
      const agentGatewayUrl = process.env.AGENT_GATEWAY_URL || 'http://localhost:3001';
      
      const [fastApiHealth, gatewayHealth] = await Promise.allSettled([
        axios.get(`${agentFastApiUrl}/health`, { timeout: 5000 }),
        axios.get(`${agentGatewayUrl}/api/geocode?address=test`, { timeout: 5000 })
      ]);
      
      return {
        fastapi: {
          status: fastApiHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
          url: agentFastApiUrl,
          error: fastApiHealth.status === 'rejected' ? fastApiHealth.reason.message : null
        },
        gateway: {
          status: gatewayHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
          url: agentGatewayUrl,
          error: gatewayHealth.status === 'rejected' ? gatewayHealth.reason.message : null
        }
      };
    } catch (error) {
      strapi.log.error(`Agent health check error: ${error.message}`);
      
      ctx.throw(500, { error: 'Health check failed', details: error.message });
    }
  }
}); 