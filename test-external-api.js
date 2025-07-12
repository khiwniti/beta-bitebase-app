#!/usr/bin/env node

/**
 * Test script for external API integration
 * Tests the api.bitebase.app endpoints to ensure they work correctly
 */

const API_BASE_URL = 'https://api.bitebase.app';

async function testAPI() {
  console.log('🧪 Testing BiteBase External API Integration\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.status);
    console.log('   Service:', data.service);
    console.log('   Database:', data.database?.connected ? '✅ Connected' : '❌ Disconnected');
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  console.log('\n');

  // Test 2: Restaurant Search
  console.log('2️⃣ Testing Restaurant Search...');
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/search?limit=5`);
    const data = await response.json();
    
    if (data.success && data.data?.restaurants) {
      console.log('✅ Restaurant Search Success');
      console.log(`   Found ${data.data.restaurants.length} restaurants`);
      console.log(`   Total available: ${data.data.total || 'Unknown'}`);
      
      // Show first restaurant
      if (data.data.restaurants.length > 0) {
        const restaurant = data.data.restaurants[0];
        console.log(`   Sample: ${restaurant.name} (${restaurant.cuisine_type})`);
        console.log(`   Rating: ${restaurant.rating} (${restaurant.review_count} reviews)`);
        console.log(`   Location: ${restaurant.city}, ${restaurant.state}`);
      }
    } else {
      console.log('❌ Restaurant Search: Invalid response format');
    }
  } catch (error) {
    console.log('❌ Restaurant Search Failed:', error.message);
  }

  console.log('\n');

  // Test 3: Search with Filters
  console.log('3️⃣ Testing Filtered Search...');
  try {
    const params = new URLSearchParams({
      cuisine: 'Italian',
      rating: '4.0',
      limit: '3'
    });
    
    const response = await fetch(`${API_BASE_URL}/restaurants/search?${params}`);
    const data = await response.json();
    
    if (data.success && data.data?.restaurants) {
      console.log('✅ Filtered Search Success');
      console.log(`   Found ${data.data.restaurants.length} Italian restaurants with rating ≥ 4.0`);
      
      data.data.restaurants.forEach((restaurant, index) => {
        console.log(`   ${index + 1}. ${restaurant.name} - ${restaurant.rating}⭐`);
      });
    } else {
      console.log('❌ Filtered Search: No results or invalid format');
    }
  } catch (error) {
    console.log('❌ Filtered Search Failed:', error.message);
  }

  console.log('\n');

  // Test 4: API Response Time
  console.log('4️⃣ Testing API Performance...');
  try {
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}/health`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      console.log(`✅ API Response Time: ${responseTime}ms`);
      if (responseTime < 500) {
        console.log('   🚀 Excellent performance');
      } else if (responseTime < 1000) {
        console.log('   ⚡ Good performance');
      } else {
        console.log('   🐌 Slow performance');
      }
    }
  } catch (error) {
    console.log('❌ Performance Test Failed:', error.message);
  }

  console.log('\n');

  // Test 5: Error Handling
  console.log('5️⃣ Testing Error Handling...');
  try {
    const response = await fetch(`${API_BASE_URL}/nonexistent-endpoint`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      console.log('✅ Error Handling: Proper 404 response');
    } else {
      console.log('⚠️  Error Handling: Unexpected status code');
    }
  } catch (error) {
    console.log('❌ Error Handling Test Failed:', error.message);
  }

  console.log('\n🎉 API Integration Test Complete!\n');
}

// Run the test
testAPI().catch(console.error);