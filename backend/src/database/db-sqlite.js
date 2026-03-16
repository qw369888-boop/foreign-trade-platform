const Database = require('better-sqlite3');
const path = require('path');

// 创建数据库连接
const dbPath = path.join(__dirname, '../../../database/foreign_trade.db');
const db = new Database(dbPath);

console.log(`Database connected: ${dbPath}`);

// 包装查询方法以兼容PostgreSQL风格的API
const query = (text, params = []) => {
  try {
    // 转换PostgreSQL风格的参数占位符 ($1, $2) 为SQLite风格 (?, ?)
    let sqliteQuery = text.replace(/\$(\d+)/g, '?');
    
    console.log('SQLite Query:', sqliteQuery, params);
    
    if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db.prepare(sqliteQuery);
      const rows = stmt.all(...params);
      return { rows, rowCount: rows.length };
    } else if (sqliteQuery.trim().toUpperCase().startsWith('INSERT') || 
               sqliteQuery.trim().toUpperCase().startsWith('UPDATE') || 
               sqliteQuery.trim().toUpperCase().startsWith('DELETE')) {
      const stmt = db.prepare(sqliteQuery);
      const result = stmt.run(...params);
      return { 
        rows: [{ id: result.lastInsertRowid }], 
        rowCount: result.changes 
      };
    } else {
      // 对于其他类型的查询（如CREATE TABLE等）
      db.exec(sqliteQuery);
      return { rows: [], rowCount: 0 };
    }
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
};

// 关闭数据库连接
const close = () => {
  db.close();
};

module.exports = {
  query,
  close,
  db
};