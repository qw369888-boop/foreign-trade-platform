const fs = require('fs');

// 尝试从数据库文件中提取产品数据
function extractProductData(dbPath) {
  try {
    const buffer = fs.readFileSync(dbPath);
    const content = buffer.toString('utf8', 0, buffer.length);
    
    // 查找产品数据模式
    const products = [];
    
    // 从数据库内容中提取产品信息
    // 基于观察到的模式：=qd[category]["image_url"]...
    const productPattern = /=qd([^"]*)"?\[?"?([^"]*)"?\]?"?\[?"?(https?:\/\/[^"]*)"?\]/g;
    let match;
    let id = 529;
    
    while ((match = productPattern.exec(content)) !== null && products.length < 20) {
      const category = match[1] || 'Handbags';
      const name = match[2] || '';
      const imageUrl = match[3] || '';
      
      if (imageUrl && imageUrl.includes('http')) {
        // 生成产品名称
        let productName = '';
        let productNameZh = '';
        
        if (category.includes('Handbag') || category === 'Handbags') {
          productName = `Premium Leather Handbag ${products.length + 1}`;
          productNameZh = `高级皮革手提包 ${products.length + 1}`;
        } else if (category.includes('Shoulder')) {
          productName = `Shoulder Bag ${products.length + 1}`;
          productNameZh = `单肩包 ${products.length + 1}`;
        } else if (category.includes('Crossbody')) {
          productName = `Crossbody Bag ${products.length + 1}`;
          productNameZh = `斜挎包 ${products.length + 1}`;
        } else if (category.includes('Tote')) {
          productName = `Tote Bag ${products.length + 1}`;
          productNameZh = `托特包 ${products.length + 1}`;
        } else {
          productName = `Fashion Bag ${products.length + 1}`;
          productNameZh = `时尚包包 ${products.length + 1}`;
        }
        
        products.push({
          id: id++,
          sku: `FB-${String(products.length + 1).padStart(3, '0')}`,
          name: productName,
          name_zh: productNameZh,
          description: `High-quality ${category.toLowerCase()} perfect for daily use`,
          description_zh: `高品质${productNameZh}，适合日常使用`,
          price: Math.round((Math.random() * 80 + 20) * 100) / 100,
          compare_price: Math.round((Math.random() * 120 + 60) * 100) / 100,
          stock: Math.floor(Math.random() * 100 + 20),
          category: category.replace(/[^a-zA-Z\s]/g, '').trim() || 'Handbags',
          images: [imageUrl],
          moq: Math.floor(Math.random() * 20 + 5)
        });
      }
    }
    
    console.log(`Extracted ${products.length} products from database:`);
    products.forEach((product, i) => {
      console.log(`${i + 1}. ${product.name} (${product.name_zh}) - $${product.price} - ${product.category}`);
      console.log(`   Image: ${product.images[0].substring(0, 80)}...`);
    });
    
    // 保存到JSON文件
    fs.writeFileSync('extracted-products.json', JSON.stringify(products, null, 2));
    console.log('\nProducts saved to extracted-products.json');
    
    return products;
    
  } catch (error) {
    console.error('Error extracting products:', error.message);
    return [];
  }
}

const dbPath = 'E:/Projects/foreign-trade-platform/database/foreign_trade.db';
const products = extractProductData(dbPath);