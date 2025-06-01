#!/usr/bin/env node

/**
 * BiteBase Cloudflare Workers Integration Test
 * Tests the complete system integration between frontend and backend
 */

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  backend: {
    url: process.env.BACKEND_URL || 'https://bitebase-backend-staging.your-subdomain.workers.dev',
    timeout: 10000
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'https://bitebase-frontend.vercel.app',
    timeout: 10000
  },
  testUser: {
    email: 'test@bitebase.app',
    password: 'TestPassword123!',
    name: 'Test User'
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`✅ ${testName}`, 'green');
  } else {
    testResults.failed++;
    log(`❌ ${testName}`, 'red');
    if (details) log(`   ${details}`, 'yellow');
  }
  testResults.details.push({ testName, passed, details });
}

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BiteBase-Integration-Test/1.0',
        ...options.headers
      },
      timeout: options.timeout || 10000
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData,
            rawData: data
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: null,
            rawData: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test functions
async function testBackendHealth() {
  log('\n🔍 Testing Backend Health...', 'blue');
  
  try {
    const response = await makeRequest(`${CONFIG.backend.url}/health`);
    
    const healthOk = response.statusCode === 200;
    const hasCorrectData = response.data && 
                          response.data.status === 'healthy' && 
                          response.data.service === 'bitebase-backend-api';
    
    logTest('Backend Health Check', healthOk && hasCorrectData, 
           !healthOk ? `Status: ${response.statusCode}` : 
           !hasCorrectData ? 'Invalid health response format' : '');
    
    if (response.data) {
      log(`   Service: ${response.data.service}`, 'cyan');
      log(`   Version: ${response.data.version}`, 'cyan');
      log(`   Region: ${response.data.region || 'unknown'}`, 'cyan');
    }
    
    return healthOk && hasCorrectData;
  } catch (error) {
    logTest('Backend Health Check', false, error.message);
    return false;
  }
}

async function testBackendCORS() {
  log('\n🌐 Testing CORS Configuration...', 'blue');
  
  try {
    const response = await makeRequest(`${CONFIG.backend.url}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://bitebase.app',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    const corsOk = response.statusCode === 200 || response.statusCode === 204;
    const hasAccessControl = response.headers['access-control-allow-origin'];
    
    logTest('CORS Preflight', corsOk && hasAccessControl,
           !corsOk ? `Status: ${response.statusCode}` :
           !hasAccessControl ? 'Missing CORS headers' : '');
    
    return corsOk && hasAccessControl;
  } catch (error) {
    logTest('CORS Preflight', false, error.message);
    return false;
  }
}

async function testUserRegistration() {
  log('\n👤 Testing User Registration...', 'blue');
  
  try {
    const response = await makeRequest(`${CONFIG.backend.url}/api/auth/register`, {
      method: 'POST',
      body: {
        email: CONFIG.testUser.email,
        password: CONFIG.testUser.password,
        name: CONFIG.testUser.name
      }
    });
    
    const registrationOk = response.statusCode === 200 || response.statusCode === 201;
    const hasToken = response.data && response.data.token;
    const hasUser = response.data && response.data.user;
    
    logTest('User Registration', registrationOk && hasToken && hasUser,
           !registrationOk ? `Status: ${response.statusCode}` :
           !hasToken ? 'Missing JWT token' :
           !hasUser ? 'Missing user data' : '');
    
    return { success: registrationOk && hasToken && hasUser, token: response.data?.token };
  } catch (error) {
    logTest('User Registration', false, error.message);
    return { success: false, token: null };
  }
}

async function testUserLogin() {
  log('\n🔐 Testing User Login...', 'blue');
  
  try {
    const response = await makeRequest(`${CONFIG.backend.url}/api/auth/login`, {
      method: 'POST',
      body: {
        email: CONFIG.testUser.email,
        password: CONFIG.testUser.password
      }
    });
    
    const loginOk = response.statusCode === 200;
    const hasToken = response.data && response.data.token;
    const hasUser = response.data && response.data.user;
    
    logTest('User Login', loginOk && hasToken && hasUser,
           !loginOk ? `Status: ${response.statusCode}` :
           !hasToken ? 'Missing JWT token' :
           !hasUser ? 'Missing user data' : '');
    
    return { success: loginOk && hasToken && hasUser, token: response.data?.token };
  } catch (error) {
    logTest('User Login', false, error.message);
    return { success: false, token: null };
  }
}

async function testProtectedRoute(token) {
  log('\n🔒 Testing Protected Routes...', 'blue');
  
  if (!token) {
    logTest('Protected Route Access', false, 'No authentication token available');
    return false;
  }
  
  try {
    const response = await makeRequest(`${CONFIG.backend.url}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const profileOk = response.statusCode === 200;
    const hasProfile = response.data && response.data.id;
    
    logTest('Protected Route Access', profileOk && hasProfile,
           !profileOk ? `Status: ${response.statusCode}` :
           !hasProfile ? 'Invalid profile response' : '');
    
    return profileOk && hasProfile;
  } catch (error) {
    logTest('Protected Route Access', false, error.message);
    return false;
  }
}

async function testRestaurantSearch() {
  log('\n🍽️ Testing Restaurant Search...', 'blue');
  
  try {
    // Test search in Bangkok area
    const response = await makeRequest(`${CONFIG.backend.url}/api/restaurants?latitude=13.7563&longitude=100.5018&radius=5000`);
    
    const searchOk = response.statusCode === 200;
    const hasResults = response.data && Array.isArray(response.data.results || response.data);
    
    logTest('Restaurant Search', searchOk && hasResults,
           !searchOk ? `Status: ${response.statusCode}` :
           !hasResults ? 'Invalid search response format' : '');
    
    if (hasResults) {
      const results = response.data.results || response.data;
      log(`   Found ${results.length} restaurants`, 'cyan');
    }
    
    return searchOk && hasResults;
  } catch (error) {
    logTest('Restaurant Search', false, error.message);
    return false;
  }
}

async function testAIChat() {
  log('\n🤖 Testing AI Chat...', 'blue');
  
  try {
    const response = await makeRequest(`${CONFIG.backend.url}/api/ai/chat`, {
      method: 'POST',
      body: {
        message: 'Recommend a good Thai restaurant in Bangkok',
        context: { location: 'Bangkok, Thailand' }
      }
    });
    
    const chatOk = response.statusCode === 200;
    const hasResponse = response.data && response.data.response;
    
    logTest('AI Chat', chatOk && hasResponse,
           !chatOk ? `Status: ${response.statusCode}` :
           !hasResponse ? 'Missing AI response' : '');
    
    return chatOk && hasResponse;
  } catch (error) {
    logTest('AI Chat', false, error.message);
    return false;
  }
}

async function testFrontendHealth() {
  log('\n🎨 Testing Frontend Health...', 'blue');
  
  try {
    const response = await makeRequest(CONFIG.frontend.url, {
      timeout: 15000
    });
    
    const frontendOk = response.statusCode === 200;
    const hasContent = response.rawData && response.rawData.includes('BiteBase');
    
    logTest('Frontend Health', frontendOk && hasContent,
           !frontendOk ? `Status: ${response.statusCode}` :
           !hasContent ? 'Missing expected content' : '');
    
    return frontendOk && hasContent;
  } catch (error) {
    logTest('Frontend Health', false, error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  log('\n🗄️ Testing Database Connection...', 'blue');
  
  try {
    // Test by trying to access a protected route that requires DB
    const response = await makeRequest(`${CONFIG.backend.url}/api/restaurants?latitude=0&longitude=0&radius=1000`);
    
    const dbOk = response.statusCode === 200 || response.statusCode === 400; // 400 is ok for invalid coords
    
    logTest('Database Connection', dbOk,
           !dbOk ? `Status: ${response.statusCode}` : '');
    
    return dbOk;
  } catch (error) {
    logTest('Database Connection', false, error.message);
    return false;
  }
}

async function testRateLimiting() {
  log('\n⏱️ Testing Rate Limiting...', 'blue');
  
  try {
    // Make multiple rapid requests
    const requests = Array(10).fill().map(() => 
      makeRequest(`${CONFIG.backend.url}/health`)
    );
    
    const responses = await Promise.all(requests);
    const allSuccessful = responses.every(r => r.statusCode === 200);
    
    logTest('Rate Limiting (Basic)', allSuccessful,
           !allSuccessful ? 'Some requests failed unexpectedly' : '');
    
    return allSuccessful;
  } catch (error) {
    logTest('Rate Limiting (Basic)', false, error.message);
    return false;
  }
}

// Main test runner
async function runIntegrationTests() {
  log('🚀 BiteBase Cloudflare Workers Integration Test Suite', 'magenta');
  log('=' .repeat(60), 'magenta');
  
  log(`\n📋 Configuration:`, 'blue');
  log(`   Backend URL: ${CONFIG.backend.url}`, 'cyan');
  log(`   Frontend URL: ${CONFIG.frontend.url}`, 'cyan');
  log(`   Test User: ${CONFIG.testUser.email}`, 'cyan');
  
  // Run tests in sequence
  const backendHealthy = await testBackendHealth();
  
  if (backendHealthy) {
    await testBackendCORS();
    await testDatabaseConnection();
    await testRateLimiting();
    
    // Authentication tests
    const registration = await testUserRegistration();
    const login = await testUserLogin();
    
    // Use token from login or registration
    const token = login.token || registration.token;
    await testProtectedRoute(token);
    
    // Feature tests
    await testRestaurantSearch();
    await testAIChat();
  } else {
    log('\n⚠️ Skipping additional backend tests due to health check failure', 'yellow');
  }
  
  // Frontend test
  await testFrontendHealth();
  
  // Print summary
  log('\n📊 Test Results Summary', 'magenta');
  log('=' .repeat(40), 'magenta');
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 
      testResults.failed === 0 ? 'green' : 'yellow');
  
  if (testResults.failed > 0) {
    log('\n❌ Failed Tests:', 'red');
    testResults.details
      .filter(test => !test.passed)
      .forEach(test => {
        log(`   • ${test.testName}`, 'red');
        if (test.details) log(`     ${test.details}`, 'yellow');
      });
  }
  
  log('\n🎯 Recommendations:', 'blue');
  
  if (testResults.failed === 0) {
    log('✅ All tests passed! Your BiteBase system is working correctly.', 'green');
    log('🚀 Ready for production deployment!', 'green');
  } else {
    log('⚠️ Some tests failed. Please check the following:', 'yellow');
    log('   1. Ensure all Cloudflare Workers resources are properly configured', 'yellow');
    log('   2. Verify all environment variables and secrets are set', 'yellow');
    log('   3. Check that the database schema has been applied', 'yellow');
    log('   4. Confirm CORS settings allow your frontend domain', 'yellow');
  }
  
  log('\n📚 Next Steps:', 'blue');
  log('   1. Configure custom domains for production', 'cyan');
  log('   2. Set up monitoring and alerting', 'cyan');
  log('   3. Configure backup and disaster recovery', 'cyan');
  log('   4. Implement additional security measures', 'cyan');
  
  // Exit with appropriate code
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
BiteBase Cloudflare Workers Integration Test

Usage: node test-cloudflare-integration.js [options]

Options:
  --backend-url URL    Backend URL to test (default: staging worker)
  --frontend-url URL   Frontend URL to test (default: vercel app)
  --help, -h          Show this help message

Environment Variables:
  BACKEND_URL         Override default backend URL
  FRONTEND_URL        Override default frontend URL

Examples:
  node test-cloudflare-integration.js
  node test-cloudflare-integration.js --backend-url https://api.yourdomain.com
  BACKEND_URL=https://api.yourdomain.com node test-cloudflare-integration.js
`);
  process.exit(0);
}

// Parse command line arguments
const backendUrlIndex = process.argv.indexOf('--backend-url');
if (backendUrlIndex !== -1 && process.argv[backendUrlIndex + 1]) {
  CONFIG.backend.url = process.argv[backendUrlIndex + 1];
}

const frontendUrlIndex = process.argv.indexOf('--frontend-url');
if (frontendUrlIndex !== -1 && process.argv[frontendUrlIndex + 1]) {
  CONFIG.frontend.url = process.argv[frontendUrlIndex + 1];
}

// Run the tests
runIntegrationTests().catch(error => {
  log(`\n💥 Test suite crashed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});