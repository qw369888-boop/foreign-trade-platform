const fs = require('fs');

// 更深入地分析数据库文件，寻找完整的产品数据
function deepAnalyzeDatabase(dbPath) {
  try {
    const buffer = fs.readFileSync(dbPath);
    console.log(`Database size: ${buffer.length} bytes`);
    
    // 尝试以十六进制方式查看数据
    console.log('\n=== Hex dump of first 1000 bytes ===');
    const hexDump = buffer.toString('hex', 0, 1000);
    for (let i = 0; i < hexDump.length; i += 32) {
      const chunk = hexDump.substr(i, 32);
      const offset = (i / 2).toString(16).padStart(4, '0');
      console.log(`${offset}: ${chunk}`);
    }
    
    // 查找数字模式（可能是价格）
    console.log('\n=== Looking for price patterns ===');
    const content = buffer.toString('utf8', 0, buffer.length);
    
    // 查找所有数字模式
    const numberPatterns = content.match(/\d+\.\d{2}/g);
    if (numberPatterns) {
      const uniqueNumbers = [...new Set(numberPatterns)];
      console.log('Found potential prices:', uniqueNumbers.slice(0, 20));
    }
    
    // 查找产品ID范围
    console.log('\n=== Looking for product IDs ===');
    const idMatches = content.match(/\b\d{3,4}\b/g);
    if (idMatches) {
      const uniqueIds = [...new Set(idMatches)].filter(id => parseInt(id) > 500 && parseInt(id) < 600);
      console.log('Found potential product IDs:', uniqueIds.slice(0, 20));
    }
    
    // 查找完整的产品记录模式
    console.log('\n=== Looking for complete product records ===');
    
    // 尝试查找SQLite记录分隔符
    const records = [];
    let currentPos = 0;
    
    // 查找包含产品信息的文本块
    const productBlocks = content.split(/DY-[A-Z]+-\d+/);
    console.log(`Found ${productBlocks.length} potential product blocks`);
    
    productBlocks.slice(1, 6).forEach((block, i) => {
      console.log(`\nBlock ${i + 1} (first 200 chars):`);
      console.log(block.substring(0, 200).replace(/[^\x20-\x7E]/g, '·'));
    });
    
    // 查找JSON格式的数据
    console.log('\n=== Looking for JSON data ===');
    const jsonMatches = content.match(/\{[^}]*"[^"]*"[^}]*\}/g);
    if (jsonMatches) {
      console.log('Found potential JSON objects:', jsonMatches.slice(0, 3));
    }
    
    // 查找数组格式的图片数据
    console.log('\n=== Looking for image arrays ===');
    const imageArrays = content.match(/\["[^"]*\.jpg"[^\]]*\]/g);
    if (imageArrays) {
      console.log('Found image arrays:', imageArrays.slice(0, 5));
    }
    
  } catch (error) {
    console.error('Error analyzing database:', error.message);
  }
}

const dbPath = 'E:/Projects/foreign-trade-platform/database/foreign_trade.db';
deepAnalyzeDatabase(dbPath);