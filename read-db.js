const fs = require('fs');
const path = require('path');

// 简单的SQLite数据库读取器
function readSQLiteDB(dbPath) {
  try {
    const buffer = fs.readFileSync(dbPath);
    console.log(`Database file size: ${buffer.length} bytes`);
    
    // 查找产品表的数据
    // 这是一个简化的方法，实际应该用proper SQLite parser
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 50000));
    
    // 查找可能的产品数据
    const lines = content.split('\n');
    const productLines = lines.filter(line => 
      line.includes('HB-') || 
      line.includes('TB-') || 
      line.includes('SB-') ||
      line.includes('Handbag') ||
      line.includes('Tote') ||
      line.includes('Shoulder')
    );
    
    console.log('Found potential product data:');
    productLines.slice(0, 10).forEach((line, i) => {
      console.log(`${i + 1}: ${line.substring(0, 100)}...`);
    });
    
  } catch (error) {
    console.error('Error reading database:', error.message);
  }
}

const dbPath = 'E:/Projects/foreign-trade-platform/database/foreign_trade.db';
readSQLiteDB(dbPath);