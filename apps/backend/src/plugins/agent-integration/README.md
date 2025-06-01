# Bitebase Agent Integration Plugin for Strapi

This plugin integrates the Bitebase agent system with Strapi, providing a seamless way to access agent functionality from within the Strapi admin panel and API.

## Features

- Direct integration with Bitebase agent APIs
- Agent health monitoring and status checks
- Activity logging for agent interactions
- Admin panel interface for monitoring agent status
- REST API endpoints for agent functionality

## API Endpoints

The plugin exposes the following API endpoints:

- `POST /api/agent-integration/research` - Forward research requests to the agent system
- `GET /api/agent-integration/restaurants` - Get restaurant data from the agent system
- `GET /api/agent-integration/analyze` - Get market analysis from the agent system
- `GET /api/agent-integration/geocode` - Geocode addresses using the agent system
- `GET /api/agent-integration/health` - Check agent system health

## Configuration

The plugin can be configured in your Strapi configuration files:

```js
// config/plugins.js
module.exports = ({ env }) => ({
  'agent-integration': {
    enabled: true,
    config: {
      defaultAgentUrl: env('AGENT_FASTAPI_URL', 'http://localhost:3001'),
      logActivities: true,
      enableCache: true,
      cacheDuration: 3600 // 1 hour
    }
  }
});
```

## Environment Variables

The plugin uses the following environment variables:

- `AGENT_FASTAPI_URL` - URL for the FastAPI agent service
- `AGENT_GATEWAY_URL` - URL for the agent gateway service

## Usage from Strapi Controllers

You can use the agent service in your custom controllers:

```js
// Example: Using the agent service in a custom controller
module.exports = {
  async customEndpoint(ctx) {
    const agentService = strapi.plugin('agent-integration').service('agent-service');
    const availability = await agentService.checkAvailability();
    
    if (!availability.available) {
      return ctx.badRequest('Agent services are not available');
    }
    
    // Log the activity
    agentService.logActivity('customEndpoint', { query: ctx.query }, { result: 'success' });
    
    // Return the result
    return { status: 'success' };
  }
};
```

## Admin Panel

The plugin adds an "Agent Integration" section to the Strapi admin panel where you can:

- View agent system health status
- Monitor recent agent activities
- Check connection status to agent services 