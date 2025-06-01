module.exports = [
  {
    method: 'POST',
    path: '/research',
    handler: 'agent-controller.research',
    config: {
      policies: [],
      description: 'Forward research request to the agent system',
      tag: {
        plugin: 'agent-integration',
        name: 'Research'
      }
    }
  },
  {
    method: 'GET',
    path: '/restaurants',
    handler: 'agent-controller.getRestaurants',
    config: {
      policies: [],
      description: 'Get restaurant data from agent system',
      tag: {
        plugin: 'agent-integration',
        name: 'Restaurants'
      }
    }
  },
  {
    method: 'GET',
    path: '/analyze',
    handler: 'agent-controller.analyze',
    config: {
      policies: [],
      description: 'Get market analysis from agent system',
      tag: {
        plugin: 'agent-integration',
        name: 'Analysis'
      }
    }
  },
  {
    method: 'GET',
    path: '/geocode',
    handler: 'agent-controller.geocode',
    config: {
      policies: [],
      description: 'Geocode address using agent system',
      tag: {
        plugin: 'agent-integration',
        name: 'Geocode'
      }
    }
  },
  {
    method: 'GET',
    path: '/health',
    handler: 'agent-controller.health',
    config: {
      policies: [],
      description: 'Check agent system health',
      tag: {
        plugin: 'agent-integration',
        name: 'Health'
      }
    }
  }
]; 