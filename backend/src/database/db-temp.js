const fs = require('fs');
const path = require('path');

// 临时的内存数据库，用于演示
const mockProducts = [
  {
    id: 529,
    sku: "HB-001",
    name: "Premium Leather Handbag",
    name_zh: "高级皮革手提包",
    description: "Elegant leather handbag perfect for business and casual occasions",
    description_zh: "优雅的皮革手提包，适合商务和休闲场合",
    price: 89.99,
    compare_price: 129.99,
    stock: 50,
    category: "Handbags",
    images: JSON.stringify(["/images/handbag-1.jpg", "/images/handbag-2.jpg"]),
    moq: 10
  },
  {
    id: 530,
    sku: "TB-002", 
    name: "Canvas Tote Bag",
    name_zh: "帆布托特包",
    description: "Durable canvas tote bag for everyday use",
    description_zh: "耐用的帆布托特包，适合日常使用",
    price: 29.99,
    compare_price: 39.99,
    stock: 100,
    category: "Tote Bags",
    images: JSON.stringify(["/images/tote-1.jpg", "/images/tote-2.jpg"]),
    moq: 20
  },
  {
    id: 531,
    sku: "SB-003",
    name: "Crossbody Shoulder Bag", 
    name_zh: "斜挎单肩包",
    description: "Stylish crossbody bag with adjustable strap",
    description_zh: "时尚的斜挎包，可调节肩带",
    price: 45.99,
    compare_price: 65.99,
    stock: 75,
    category: "Shoulder Bags",
    images: JSON.stringify(["/images/shoulder-1.jpg", "/images/shoulder-2.jpg"]),
    moq: 15
  }
];

// 模拟数据库查询接口
const query = (text, params = []) => {
  console.log('Mock DB Query:', text, params);
  
  try {
    if (text.includes('SELECT') && text.includes('products')) {
      let results = [...mockProducts];
      
      // 处理分类筛选
      if (text.includes('category') && params.length > 0) {
        const category = params.find(p => typeof p === 'string' && p !== 'zh' && p !== 'en');
        if (category) {
          results = results.filter(p => p.category === category);
        }
      }
      
      // 处理语言参数
      const hasLang = params.includes('zh') || params.includes('en');
      
      // 处理 LIMIT
      if (text.includes('LIMIT') && params.length > 0) {
        const limitIndex = params.findIndex(p => typeof p === 'number');
        if (limitIndex !== -1) {
          const limit = params[limitIndex];
          results = results.slice(0, limit);
        }
      }
      
      // 处理单个产品查询
      if (text.includes('WHERE id')) {
        const id = params.find(p => typeof p === 'number');
        if (id) {
          results = results.filter(p => p.id === id);
        }
      }
      
      return { rows: results };
    }
    
    return { rows: [], rowCount: 0 };
  } catch (err) {
    console.error('Mock DB Error:', err);
    throw err;
  }
};

module.exports = {
  query,
  db: { close: () => {} }
};