/**
 * Example Client for BiteBase Agent Adapter
 * 
 * This script demonstrates how to interact with the agent adapter endpoints.
 */

const axios = require('axios');

// Agent adapter URL
const ADAPTER_URL = process.env.ADAPTER_URL || 'http://localhost:3002';

/**
 * Check agent health
 */
async function checkHealth() {
  try {
    console.log('Checking agent health...');
    const response = await axios.get(`${ADAPTER_URL}/health`);
    console.log('Health status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return null;
  }
}

/**
 * Research restaurant information
 */
async function researchRestaurant(query) {
  try {
    console.log(`Researching restaurant: ${query}`);
    const response = await axios.post(`${ADAPTER_URL}/api/research`, {
      query,
      type: 'restaurant'
    });
    console.log('Research results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Research failed:', error.message);
    return null;
  }
}

/**
 * Get restaurants near a location
 */
async function getNearbyRestaurants(latitude, longitude, radius = 5, platforms = 'all') {
  try {
    console.log(`Getting restaurants near [${latitude}, ${longitude}] within ${radius}km`);
    const response = await axios.get(`${ADAPTER_URL}/api/restaurants`, {
      params: { latitude, longitude, radius, platforms }
    });
    console.log(`Found ${response.data.length} restaurants`);
    return response.data;
  } catch (error) {
    console.error('Restaurant search failed:', error.message);
    return null;
  }
}

/**
 * Analyze the market for a location
 */
async function analyzeMarket(latitude, longitude, radius = 5, analysis_type = 'comprehensive') {
  try {
    console.log(`Analyzing market at [${latitude}, ${longitude}] within ${radius}km`);
    const response = await axios.get(`${ADAPTER_URL}/api/analyze`, {
      params: { latitude, longitude, radius, analysis_type }
    });
    console.log('Market analysis:', response.data);
    return response.data;
  } catch (error) {
    console.error('Market analysis failed:', error.message);
    return null;
  }
}

/**
 * Geocode an address
 */
async function geocodeAddress(address) {
  try {
    console.log(`Geocoding address: ${address}`);
    const response = await axios.get(`${ADAPTER_URL}/api/geocode`, {
      params: { address }
    });
    console.log('Geocoding results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Geocoding failed:', error.message);
    return null;
  }
}

/**
 * Run example tests
 */
async function runExamples() {
  // Check health first
  const health = await checkHealth();
  
  if (!health || (!health.fastapi.status === 'healthy' && !health.gateway.status === 'healthy')) {
    console.warn('⚠️ Agent services appear to be offline. Examples may fail.');
  }
  
  // Example 1: Research a restaurant
  await researchRestaurant('Thai restaurant business model');
  
  // Example 2: Get nearby restaurants
  await getNearbyRestaurants(40.7128, -74.0060, 2); // New York City
  
  // Example 3: Market analysis
  await analyzeMarket(40.7128, -74.0060, 2, 'competition');
  
  // Example 4: Geocode an address
  await geocodeAddress('350 5th Ave, New York, NY 10118');
}

// If this script is run directly, execute the examples
if (require.main === module) {
  console.log('Running BiteBase Agent Adapter examples...');
  runExamples().catch(error => {
    console.error('Example run failed:', error);
  });
}

// Export functions for use in other modules
module.exports = {
  checkHealth,
  researchRestaurant,
  getNearbyRestaurants,
  analyzeMarket,
  geocodeAddress
}; 