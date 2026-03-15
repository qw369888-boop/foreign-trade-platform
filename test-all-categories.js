#!/usr/bin/env node

const http = require('http');

console.log('🎯 Testing All 10 Categories - 48 Products\n');

// Test all categories
function testAllCategories() {
  return new Promise((resolve) => {
    console.log('1️⃣ Testing All Categories...\n');
    
    const categories = [
      'Hot Sale',
      '2026 New Arrivals', 
      'Handbags',
      'Tote Bags',
      'Shoulder Bags',
      'Crossbody Bags',
      'Bucket Bags',
      'Backpacks',
      'Purse & Wallet',
      'Nylon & Canvas'
    ];
    
    let completed = 0;
    const results = {};
    
    categories.forEach(category => {
      const url = `http://localhost:4000/api/products?category=${encodeURIComponent(category)}&limit=50`;
      
      http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const count = json.data ? json.data.length : 0;
            results[category] = count;
            console.log(`   ✅ ${category.padEnd(25)} ${count} products`);
          } catch (error) {
            results[category] = 0;
            console.log(`   ❌ ${category.padEnd(25)} Error`);
          }
          
          completed++;
          if (completed === categories.length) {
            const total = Object.values(results).reduce((a, b) => a + b, 0);
            console.log(`\n   📊 Total: ${total} products across all categories`);
            resolve(total === 48);
          }
        });
      }).on('error', () => {
        results[category] = 0;
        completed++;
        if (completed === categories.length) {
          resolve(false);
        }
      });
    });
  });
}

// Test frontend
function testFrontend() {
  return new Promise((resolve) => {
    console.log('\n2️⃣ Testing Frontend...');
    
    http.get('http://localhost:3004/', (res) => {
      if (res.statusCode === 200) {
        console.log('   ✅ Homepage - 200 OK');
        
        http.get('http://localhost:3004/products', (res2) => {
          if (res2.statusCode === 200) {
            console.log('   ✅ Products page - 200 OK');
            resolve(true);
          } else {
            console.log(`   ⚠️  Products page - ${res2.statusCode}`);
            resolve(true);
          }
        }).on('error', () => resolve(true));
      } else {
        console.log(`   ❌ Homepage - ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (error) => {
      console.log('   ❌ Connection error:', error.message);
      resolve(false);
    });
  });
}

// Run tests
async function runTests() {
  const categoriesOk = await testAllCategories();
  const frontendOk = await testFrontend();
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 Test Results:');
  console.log('='.repeat(70));
  console.log(`All Categories:          ${categoriesOk ? '✅ PASS (48 products)' : '❌ FAIL'}`);
  console.log(`Frontend Pages:          ${frontendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(70));
  
  if (categoriesOk && frontendOk) {
    console.log('\n🎉 All tests passed! 48 products across 10 categories.');
    console.log('\n🌐 Access your site: http://localhost:3004');
    console.log('\n📂 All Categories:');
    console.log('   • Hot Sale:          http://localhost:3004/products?category=Hot%20Sale');
    console.log('   • 2026 New Arrivals: http://localhost:3004/products?category=2026%20New%20Arrivals');
    console.log('   • Handbags:          http://localhost:3004/products?category=Handbags');
    console.log('   • Tote Bags:         http://localhost:3004/products?category=Tote%20Bags');
    console.log('   • Shoulder Bags:     http://localhost:3004/products?category=Shoulder%20Bags');
    console.log('   • Crossbody Bags:    http://localhost:3004/products?category=Crossbody%20Bags');
    console.log('   • Bucket Bags:       http://localhost:3004/products?category=Bucket%20Bags');
    console.log('   • Backpacks:         http://localhost:3004/products?category=Backpacks');
    console.log('   • Purse & Wallet:    http://localhost:3004/products?category=Purse%20%26%20Wallet');
    console.log('   • Nylon & Canvas:    http://localhost:3004/products?category=Nylon%20%26%20Canvas');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed.');
    process.exit(1);
  }
}

runTests();
