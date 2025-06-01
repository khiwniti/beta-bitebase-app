/**
 * Plugins configuration
 */

module.exports = ({ env }) => {
  return {
    // Disable the geodata plugin
    'geodata': {
      enabled: false,
    },
    'strapi-geodata': {
      enabled: false,
    },
    // Enable agent integration plugin
    'agent-integration': {
      enabled: true,
      resolve: './src/plugins/agent-integration'
    },
    // Enable all other plugins
    'users-permissions': {
      enabled: true,
    },
    'cloud': {
      enabled: true,
    },
    'content-type-builder': {
      enabled: true,
    },
    'email': {
      enabled: true,
    },
    'upload': {
      enabled: true,
    },
    'i18n': {
      enabled: true,
    },
  };
}; 