/**
 * BiteBase Agent Adapter Test Script
 * 
 * This script tests the agent adapter endpoints to ensure they are working correctly.
 * It will run a series of tests against each endpoint and report the results.
 * 
 * Usage: node test-adapter.js
 */

const axios = require('axios');
const { SERVER } = require('./config');

// Test configuration
const ADAPTER_URL = process.env.ADAPTER_URL || `http://localhost:${SERVER.PORT}`;
const TESTS = {
  health: true,
  research: true,
  restaurants: true,
  analyze: true,
  geocode: true
};

// Test data
const TEST_DATA = {
  research: {
    query: 'Thai restaurant business model',
    type: 'restaurant'
  },
  restaurants: {
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 2
  },
  analyze: {
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 2,
    analysis_type: 'competition'
  },
  geocode: {
    address: '350 5th Ave, New York, NY 10118'
  }
};

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

/**
 * Run a test against an endpoint
 */
async function runTest(name, testFn) {
  console.log(`${COLORS.bright}${COLORS.blue}Testing ${name}...${COLORS.reset}`);
  
  try {
    const startTime = Date.now();
    const result = await testFn();
    const duration = Date.now() - startTime;
    
    console.log(`${COLORS.green}✓ ${name} test passed in ${duration}ms${COLORS.reset}`);
    console.log(`  Response: ${JSON.stringify(result).substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.log(`${COLORS.red}✗ ${name} test failed: ${error.message}${COLORS.reset}`);
    if (error.response) {
      console.log(`  Status: ${error.response.status}`);
      console.log(`  Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(`${COLORS.bright}${COLORS.magenta}BiteBase Agent Adapter Test${COLORS.reset}`);
  console.log(`Testing against ${ADAPTER_URL}\n`);
  
  const results = {};
  
  // Health test
  if (TESTS.health) {
    results.health = await runTest('health', async () => {
      const response = await axios.get(`${ADAPTER_URL}/health`);
      return response.data;
    });
  }
  
  // Research test
  if (TESTS.research) {
    results.research = await runTest('research', async () => {
      const response = await axios.post(`${ADAPTER_URL}/api/research`, TEST_DATA.research);
      return response.data;
    });
  }
  
  // Restaurants test
  if (TESTS.restaurants) {
    results.restaurants = await runTest('restaurants', async () => {
      const response = await axios.get(`${ADAPTER_URL}/api/restaurants`, {
        params: TEST_DATA.restaurants
      });
      return response.data;
    });
  }
  
  // Analyze test
  if (TESTS.analyze) {
    results.analyze = await runTest('analyze', async () => {
      const response = await axios.get(`${ADAPTER_URL}/api/analyze`, {
        params: TEST_DATA.analyze
      });
      return response.data;
    });
  }
  
  // Geocode test
  if (TESTS.geocode) {
    results.geocode = await runTest('geocode', async () => {
      const response = await axios.get(`${ADAPTER_URL}/api/geocode`, {
        params: TEST_DATA.geocode
      });
      return response.data;
    });
  }
  
  // Print summary
  console.log(`\n${COLORS.bright}${COLORS.magenta}Test Summary${COLORS.reset}`);
  
  let passedCount = 0;
  const totalTests = Object.keys(results).length;
  
  for (const [test, passed] of Object.entries(results)) {
    if (passed) {
      console.log(`${COLORS.green}✓ ${test}${COLORS.reset}`);
      passedCount++;
    } else {
      console.log(`${COLORS.red}✗ ${test}${COLORS.reset}`);
    }
  }
  
  const percentage = Math.round((passedCount / totalTests) * 100);
  
  console.log(`\n${COLORS.bright}${passedCount} of ${totalTests} tests passed (${percentage}%)${COLORS.reset}`);
  
  if (passedCount === totalTests) {
    console.log(`${COLORS.green}All tests passed!${COLORS.reset}`);
    return true;
  } else {
    console.log(`${COLORS.yellow}Some tests failed. Check the output above for details.${COLORS.reset}`);
    return false;
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error(`${COLORS.red}Error running tests: ${error.message}${COLORS.reset}`);
      process.exit(1);
    });
}

module.exports = { runAllTests }; 