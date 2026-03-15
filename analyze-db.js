const fs = require('fs');

// 更精确地从SQLite数据库提取产品数据
function extractRealProductData(dbPath) {
  try {
    const buffer = fs.readFileSync(dbPath);
    console.log(`Reading database: ${buffer.length} bytes`);
    
    // 将buffer转换为字符串，尝试不同的编码
    const content = buffer.toString('utf8');
    
    // 查找产品表结构和数据
    console.log('\n=== Searching for product table structure ===');
    
    // 查找CREATE TABLE语句
    const createTableMatch = content.match(/CREATE TABLE[^;]*products[^;]*;/gi);
    if (createTableMatch) {
      console.log('Found table structure:');
      createTableMatch.forEach(table => console.log(table));
    }
    
    // 查找INSERT语句
    console.log('\n=== Searching for INSERT statements ===');
    const insertMatches = content.match(/INSERT INTO[^;]*products[^;]*;/gi);
    if (insertMatches) {
      console.log(`Found ${insertMatches.length} INSERT statements`);
      insertMatches.slice(0, 5).forEach((insert, i) => {
        console.log(`\nINSERT ${i + 1}:`);
        console.log(insert.substring(0, 200) + '...');
      });
    }
    
    // 查找具体的产品数据模式
    console.log('\n=== Searching for product data patterns ===');
    
    // 查找价格模式
    const priceMatches = content.match(/\d+\.\d{2}/g);
    if (priceMatches) {
      console.log('Found prices:', priceMatches.slice(0, 10));
    }
    
    // 查找SKU模式
    const skuMatches = content.match(/[A-Z]{2,3}-\d{3,4}/g);
    if (skuMatches) {
      console.log('Found SKUs:', skuMatches.slice(0, 10));
    }
    
    // 查找MOQ模式
    const moqMatches = content.match(/MOQ[:\s]*\d+/gi);
    if (moqMatches) {
      console.log('Found MOQs:', moqMatches.slice(0, 10));
    }
    
    // 查找图片URL
    const imageMatches = content.match(/https?:\/\/[^\s"']+\.jpg/g);
    if (imageMatches) {
      console.log('Found image URLs:', imageMatches.slice(0, 5));
    }
    
    // 尝试查找完整的产品记录
    console.log('\n=== Searching for complete product records ===');
    
    // 查找可能的产品ID
    const idMatches = content.match(/\b5[2-4]\d\b/g);
    if (idMatches) {
      console.log('Found potential product IDs:', [...new Set(idMatches)].slice(0, 10));
    }
    
  } catch (error) {
    console.error('Error reading database:', error.message);
  }
}

const dbPath = 'E:/Projects/foreign-trade-platform/database/foreign_trade.db';
extractRealProductData(dbPath);