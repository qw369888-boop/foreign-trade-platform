const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

console.log('🗑️  Clearing all existing products from database...\n');

try {
  const result = db.prepare('DELETE FROM products').run();
  console.log(`✅ Successfully deleted ${result.changes} products`);
  
  // Verify deletion
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
  console.log(`✅ Current product count: ${count.count}`);
  
  if (count.count === 0) {
    console.log('\n✅ Database is now clean and ready for fresh import!');
  } else {
    console.log('\n⚠️  Warning: Some products may still remain');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
