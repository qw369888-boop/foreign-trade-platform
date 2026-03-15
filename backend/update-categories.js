const Database = require('better-sqlite3');
const path = require('path');

// 数据库路径
const dbPath = path.resolve(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

// 更新产品分类为女士包分类
const categories = [
  { name: 'Handbags', nameCN: '手提包' },
  { name: 'Shoulder Bags', nameCN: '单肩包' },
  { name: 'Crossbody Bags', nameCN: '斜挎包' },
  { name: 'Tote Bags', nameCN: '托特包' },
  { name: 'Purses & Wallets', nameCN: '钱包' },
];

console.log('🔄 Updating product categories...\n');

// 更新现有产品的分类
const updateStmt = db.prepare(`
  UPDATE products 
  SET category = ? 
  WHERE id = ?
`);

// 获取所有产品
const products = db.prepare('SELECT id, name FROM products').all();

products.forEach((product, index) => {
  // 根据产品名称智能分配分类
  let category = 'Handbags'; // 默认分类
  
  const name = product.name.toLowerCase();
  
  if (name.includes('laptop') || name.includes('computer') || name.includes('tote')) {
    category = 'Tote Bags';
  } else if (name.includes('shoulder') || name.includes('crossbody')) {
    category = 'Crossbody Bags';
  } else if (name.includes('purse') || name.includes('wallet')) {
    category = 'Purses & Wallets';
  } else if (name.includes('handbag') || name.includes('hand bag')) {
    category = 'Handbags';
  }
  
  updateStmt.run(category, product.id);
  console.log(`✓ Updated product ${product.id}: ${product.name} → ${category}`);
});

console.log(`\n✅ Successfully updated ${products.length} products!`);
console.log('\nCategory distribution:');

// 统计每个分类的产品数量
categories.forEach(cat => {
  const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE category = ?').get(cat.name);
  console.log(`  ${cat.name} (${cat.nameCN}): ${count.count} products`);
});

db.close();
