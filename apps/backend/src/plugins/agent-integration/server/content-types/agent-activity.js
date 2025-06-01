'use strict';

module.exports = {
  kind: 'collectionType',
  collectionName: 'agent_activities',
  info: {
    singularName: 'agent-activity',
    pluralName: 'agent-activities',
    displayName: 'Agent Activity',
    description: 'Log of agent integration activities and results'
  },
  options: {
    draftAndPublish: false,
    comment: ''
  },
  attributes: {
    action: {
      type: 'string',
      required: true,
      description: 'The action performed (e.g. research, getRestaurants)'
    },
    data: {
      type: 'text',
      required: true,
      description: 'Input data for the agent action (JSON string)'
    },
    result: {
      type: 'text',
      description: 'Result of the agent action (JSON string)'
    },
    success: {
      type: 'boolean',
      default: true,
      description: 'Whether the action was successful'
    },
    timestamp: {
      type: 'datetime',
      required: true,
      description: 'When the action occurred'
    }
  }
}; 