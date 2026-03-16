const Database = require('better-sqlite3');
const path = require('path');

// 创建数据库连接
const dbPath = path.join(__dirname, '../../../database/foreign_trade.db');
const db = new Database(dbPath);

// 创建访客会话表
const createVisitorSessionsTable = `
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    page TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// 创建访客统计表（每日汇总）
const createVisitorStatsTable = `
CREATE TABLE IF NOT EXISTS visitor_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// 创建索引
const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);',
    'CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_activity ON visitor_sessions(last_activity);',
    'CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON visitor_sessions(created_at);',
    'CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(date);'
];

try {
    console.log('Creating visitor tracking tables...');
    
    // 创建表
    db.exec(createVisitorSessionsTable);
    db.exec(createVisitorStatsTable);
    
    // 创建索引
    createIndexes.forEach(indexSQL => {
        db.exec(indexSQL);
    });
    
    console.log('✅ Visitor tracking tables created successfully!');
    
    // 插入一些测试数据
    const insertTestData = db.prepare(`
        INSERT OR IGNORE INTO visitor_sessions (session_id, page, user_agent, ip_address, created_at, last_activity)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const now = new Date().toISOString();
    const testSessions = [
        ['session_1', '/', 'Mozilla/5.0 Chrome/91.0', '192.168.1.1', now, now],
        ['session_2', '/products', 'Mozilla/5.0 Firefox/89.0', '192.168.1.2', now, now],
        ['session_3', '/about', 'Mozilla/5.0 Safari/14.0', '192.168.1.3', now, now],
    ];
    
    testSessions.forEach(session => {
        insertTestData.run(...session);
    });
    
    console.log('✅ Test data inserted!');
    
} catch (error) {
    console.error('❌ Error creating visitor tracking tables:', error);
} finally {
    db.close();
}