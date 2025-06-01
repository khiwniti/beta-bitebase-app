/**
 * Start Strapi with React Router DOM Compatibility Layer
 *
 * This script starts Strapi with a compatibility layer for React Router DOM v5.
 */

// Import required modules
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Define the paths
const strapiPath = path.resolve(__dirname, '../../node_modules/@strapi/strapi/bin/strapi');
const nodeModulesPath = path.resolve(__dirname, '../../node_modules');
const strapiGeodataPath = path.resolve(nodeModulesPath, 'strapi-geodata');
const pluginsConfigPath = path.resolve(__dirname, 'config/plugins.js');
const dbPath = path.resolve(__dirname, '.tmp/data.db');

// Create a backup of the plugins.js file
const pluginsConfigBackupPath = path.resolve(__dirname, 'config/plugins.js.backup');
if (fs.existsSync(pluginsConfigPath) && !fs.existsSync(pluginsConfigBackupPath)) {
  fs.copyFileSync(pluginsConfigPath, pluginsConfigBackupPath);
  console.log(`Created backup of plugins.js file: ${pluginsConfigBackupPath}`);
}

// Update the plugins.js file to disable the strapi-geodata plugin
const pluginsConfig = `/**
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
};`;

fs.writeFileSync(pluginsConfigPath, pluginsConfig);
console.log(`Updated plugins.js file to disable the strapi-geodata plugin: ${pluginsConfigPath}`);

// Reset the database
if (fs.existsSync(dbPath)) {
  console.log(`Backing up database: ${dbPath}`);

  // Create a backup of the database
  const dbBackupPath = path.resolve(__dirname, '.tmp/data.db.backup');
  if (!fs.existsSync(dbBackupPath)) {
    fs.copyFileSync(dbPath, dbBackupPath);
    console.log(`Created backup of database: ${dbBackupPath}`);
  }

  // Remove the database
  fs.unlinkSync(dbPath);
  console.log(`Removed database: ${dbPath}`);
}

// Patch the core files
const strapiCorePluginsLoaderPath = path.resolve(nodeModulesPath, '@strapi/strapi/dist/core/loaders/plugins/index.js');
if (fs.existsSync(strapiCorePluginsLoaderPath)) {
  console.log(`Patching Strapi core plugins loader: ${strapiCorePluginsLoaderPath}`);

  // Create a backup of the original file
  const strapiCorePluginsLoaderBackupPath = path.resolve(nodeModulesPath, '@strapi/strapi/dist/core/loaders/plugins/index.js.backup');
  if (!fs.existsSync(strapiCorePluginsLoaderBackupPath)) {
    fs.copyFileSync(strapiCorePluginsLoaderPath, strapiCorePluginsLoaderBackupPath);
    console.log(`Created backup of Strapi core plugins loader: ${strapiCorePluginsLoaderBackupPath}`);
  }

  // Read the original file
  let strapiCorePluginsLoader = fs.readFileSync(strapiCorePluginsLoaderPath, 'utf8');

  // Patch the file to ignore the geodata plugin
  strapiCorePluginsLoader = strapiCorePluginsLoader.replace(
    /async function loadPlugins\(strapi2\) {/,
    `async function loadPlugins(strapi2) {
  // Skip the geodata plugin
  const skipPlugins = ['geodata', 'strapi-geodata'];
  `
  );

  strapiCorePluginsLoader = strapiCorePluginsLoader.replace(
    /for \(const pluginName of Object\.keys\(enabledPlugins\)\) {/,
    `for (const pluginName of Object.keys(enabledPlugins)) {
    // Skip the geodata plugin
    if (skipPlugins.includes(pluginName)) {
      console.log(\`Skipping plugin: \${pluginName}\`);
      continue;
    }`
  );

  // Write the patched file
  fs.writeFileSync(strapiCorePluginsLoaderPath, strapiCorePluginsLoader);
  console.log(`Patched Strapi core plugins loader: ${strapiCorePluginsLoaderPath}`);
}

// Get the command line arguments
const args = process.argv.slice(2);

// Run Strapi
try {
  console.log(`Starting Strapi with arguments: ${args.join(' ')}`);

  // Set environment variables
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  // Run Strapi
  execSync(`node ${strapiPath} ${args.join(' ')}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
    },
  });
} catch (error) {
  console.error('Failed to start Strapi:', error);
  process.exit(1);
} finally {
  // Restore the plugins.js file
  if (fs.existsSync(pluginsConfigBackupPath)) {
    console.log('Restoring plugins.js file...');

    // Copy the backup file back
    fs.copyFileSync(pluginsConfigBackupPath, pluginsConfigPath);
    console.log(`Restored plugins.js file from backup: ${pluginsConfigBackupPath}`);
  }

  // Restore the patched core files
  const strapiCorePluginsLoaderBackupPath = path.resolve(nodeModulesPath, '@strapi/strapi/dist/core/loaders/plugins/index.js.backup');
  if (fs.existsSync(strapiCorePluginsLoaderBackupPath)) {
    console.log('Restoring Strapi core plugins loader...');

    // Copy the backup file back
    fs.copyFileSync(strapiCorePluginsLoaderBackupPath, path.resolve(nodeModulesPath, '@strapi/strapi/dist/core/loaders/plugins/index.js'));
    console.log(`Restored Strapi core plugins loader from backup: ${strapiCorePluginsLoaderBackupPath}`);
  }

  // Restore the database
  const dbBackupPath = path.resolve(__dirname, '.tmp/data.db.backup');
  if (fs.existsSync(dbBackupPath) && !fs.existsSync(dbPath)) {
    console.log('Restoring database...');

    // Copy the backup file back
    fs.copyFileSync(dbBackupPath, dbPath);
    console.log(`Restored database from backup: ${dbBackupPath}`);
  }
}
