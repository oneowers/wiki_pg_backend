// Test script to check search API
const fetch = require('node-fetch');

async function testSearchAPI() {
  const baseURL = 'http://localhost:3001'; // or your server URL

  try {
    console.log('Testing search API...');

    // Test search endpoint
    const searchResponse = await fetch(`${baseURL}/api/search?query=test`);
    const searchData = await searchResponse.json();
    console.log('Search response:', searchData);

    // Test suggest endpoint
    const suggestResponse = await fetch(`${baseURL}/api/search/suggest?q=test`);
    const suggestData = await suggestResponse.json();
    console.log('Suggest response:', suggestData);

  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testSearchAPI();