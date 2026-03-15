const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../utils/logger');

// 从环境变量解析 SQLite 路径
const dbPath = process.env.DATABASE_URL.replace('sqlite:', '');
const fullPath = path.resolve(__dirname, '../../../', dbPath);

const db = new Database(fullPath, { verbose: console.log });

logger.info(`Database connected: ${fullPath}`);

// 兼容 PostgreSQL 的 query 接口
const query = (text, params = []) => {
  try {
    // 转换 PostgreSQL 的 $1, $2 为 SQLite 的 ?
    const sqliteQuery = text.replace(/\$(\d+)/g, '?');
    
    if (text.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db.prepare(sqliteQuery);
      const rows = stmt.all(...params);
      return { rows };
    } else {
      const stmt = db.prepare(sqliteQuery);
      const info = stmt.run(...params);
      return { rows: [], rowCount: info.changes };
    }
  } catch (err) {
    logger.error('Database query error', err);
    throw err;
  }
};

module.exports = {
  query,
  db
};
