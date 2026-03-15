const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

console.log('🔍 检查数据库中的重复产品...\n');

// 查找重复的产品名称
const duplicates = db.prepare(`
  SELECT name, COUNT(*) as count 
  FROM products 
  GROUP BY name 
  HAVING COUNT(*) > 1
  ORDER BY count DESC
`).all();

console.log(`发现 ${duplicates.length} 个重复的产品名称:`);
duplicates.forEach(d => {
  console.log(`- "${d.name}" 重复 ${d.count} 次`);
});

if (duplicates.length > 0) {
  console.log('\n🧹 开始清理重复数据...');
  
  let removedCount = 0;
  
  duplicates.forEach(duplicate => {
    // 保留第一个，删除其他重复的
    const allRecords = db.prepare(`
      SELECT id FROM products 
      WHERE name = ? 
      ORDER BY id
    `).all(duplicate.name);
    
    // 删除除第一个之外的所有记录
    for (let i = 1; i < allRecords.length; i++) {
      db.prepare('DELETE FROM products WHERE id = ?').run(allRecords[i].id);
      removedCount++;
    }
    
    console.log(`✓ 清理 "${duplicate.name}" - 删除了 ${allRecords.length - 1} 个重复项`);
  });
  
  console.log(`\n✅ 清理完成！删除了 ${removedCount} 个重复产品`);
} else {
  console.log('\n✅ 没有发现重复产品');
}

// 显示最终统计
const totalCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
console.log(`\n📊 当前数据库中共有 ${totalCount.count} 个产品`);

const categoryCounts = db.prepare(`
  SELECT category, COUNT(*) as count 
  FROM products 
  GROUP BY category 
  ORDER BY category
`).all();

console.log('\n分类统计:');
categoryCounts.forEach(row => {
  console.log(`- ${row.category}: ${row.count} 个产品`);
});

db.close();
console.log('\n🎉 数据检查和清理完成！');