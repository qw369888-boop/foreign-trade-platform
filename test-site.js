#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testing Foreign Trade Platform...\n');

// Test 1: Backend API
function testBackend() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣ Testing Backend API (http://localhost:4000/api/products)...');
    
    http.get('http://localhost:4000/api/products?limit=2', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          
          if (json.success && json.data && json.data.length > 0) {
            const product = json.data[0];
            console.log('   ✅ Backend API working');
            console.log(`   ✅ Found ${json.data.length} products`);
            console.log(`   ✅ Product: ${product.name.substring(0, 50)}...`);
            console.log(`   ✅ Price: $${product.price}`);
            console.log(`   ✅ Images: ${Array.isArray(product.images) ? 'Array ✓' : 'NOT ARRAY ✗'}`);
            
            if (Array.isArray(product.images)) {
              console.log(`   ✅ Image count: ${product.images.length}`);
              console.log(`   ✅ First image: ${product.images[0]?.substring(0, 60)}...`);
              resolve(true);
            } else {
              console.log('   ❌ ERROR: Images is not an array!');
              resolve(false);
            }
          } else {
            console.log('   ❌ ERROR: Invalid response format');
            resolve(false);
          }
        } catch (error) {
          console.log('   ❌ ERROR: Failed to parse JSON');
          console.log('   Error:', error.message);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('   ❌ ERROR: Cannot connect to backend');
      console.log('   Error:', error.message);
      resolve(false);
    });
  });
}

// Test 2: Frontend
function testFrontend() {
  return new Promise((resolve, reject) => {
    console.log('\n2️⃣ Testing Frontend (http://localhost:3001)...');
    
    http.get('http://localhost:3001/', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Frontend responding (200 OK)');
          
          // Check for key content
          const checks = [
            { name: 'Title tag', pattern: /<title>.*<\/title>/ },
            { name: 'React root', pattern: /<div id="__next">/ },
            { name: 'Next.js scripts', pattern: /_next\/static/ },
          ];
          
          checks.forEach(check => {
            if (check.pattern.test(data)) {
              console.log(`   ✅ ${check.name} found`);
            } else {
              console.log(`   ⚠️  ${check.name} not found`);
            }
          });
          
          resolve(true);
        } else {
          console.log(`   ❌ ERROR: Status code ${res.statusCode}`);
          resolve(false);
        }
      });
    }).on('error', (error) => {
      console.log('   ❌ ERROR: Cannot connect to frontend');
      console.log('   Error:', error.message);
      resolve(false);
    });
  });
}

// Run tests
async function runTests() {
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log('='.repeat(60));
  console.log(`Backend API:  ${backendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend:     ${frontendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(60));
  
  if (backendOk && frontendOk) {
    console.log('\n🎉 All tests passed! Site is ready.');
    console.log('\n🌐 Access your site at: http://localhost:3001');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

runTests();
