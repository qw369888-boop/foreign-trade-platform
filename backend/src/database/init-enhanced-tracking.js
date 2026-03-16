const Database = require('better-sqlite3');
const path = require('path');

// 创建数据库连接
const dbPath = path.join(__dirname, '../../../database/foreign_trade.db');
const db = new Database(dbPath);

// 创建页面访问记录表
const createPageViewsTable = `
CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    page_title TEXT,
    product_id INTEGER,
    product_name TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    visit_duration INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id)
);
`;

// 修改访客会话表，添加更多字段
const alterVisitorSessionsTable = `
ALTER TABLE visitor_sessions ADD COLUMN country TEXT;
ALTER TABLE visitor_sessions ADD COLUMN city TEXT;
ALTER TABLE visitor_sessions ADD COLUMN device_type TEXT;
ALTER TABLE visitor_sessions ADD COLUMN browser TEXT;
ALTER TABLE visitor_sessions ADD COLUMN os TEXT;
`;

// 创建访客地理位置表
const createVisitorLocationsTable = `
CREATE TABLE IF NOT EXISTS visitor_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT UNIQUE NOT NULL,
    country TEXT,
    country_code TEXT,
    region TEXT,
    city TEXT,
    latitude REAL,
    longitude REAL,
    timezone TEXT,
    isp TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// 创建产品访问统计表
const createProductViewsTable = `
CREATE TABLE IF NOT EXISTS product_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    product_name TEXT,
    session_id TEXT,
    ip_address TEXT,
    view_count INTEGER DEFAULT 1,
    last_viewed DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// 创建索引
const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);',
    'CREATE INDEX IF NOT EXISTS idx_page_views_product_id ON page_views(product_id);',
    'CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);',
    'CREATE INDEX IF NOT EXISTS idx_visitor_locations_ip ON visitor_locations(ip_address);',
    'CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);',
    'CREATE INDEX IF NOT EXISTS idx_product_views_session_id ON product_views(session_id);'
];

try {
    console.log('Creating enhanced visitor tracking tables...');
    
    // 创建新表
    db.exec(createPageViewsTable);
    db.exec(createVisitorLocationsTable);
    db.exec(createProductViewsTable);
    
    // 尝试添加新列（如果已存在会忽略错误）
    try {
        db.exec('ALTER TABLE visitor_sessions ADD COLUMN country TEXT;');
    } catch (e) { /* 列可能已存在 */ }
    
    try {
        db.exec('ALTER TABLE visitor_sessions ADD COLUMN city TEXT;');
    } catch (e) { /* 列可能已存在 */ }
    
    try {
        db.exec('ALTER TABLE visitor_sessions ADD COLUMN device_type TEXT;');
    } catch (e) { /* 列可能已存在 */ }
    
    try {
        db.exec('ALTER TABLE visitor_sessions ADD COLUMN browser TEXT;');
    } catch (e) { /* 列可能已存在 */ }
    
    try {
        db.exec('ALTER TABLE visitor_sessions ADD COLUMN os TEXT;');
    } catch (e) { /* 列可能已存在 */ }
    
    // 创建索引
    createIndexes.forEach(indexSQL => {
        try {
            db.exec(indexSQL);
        } catch (e) { /* 索引可能已存在 */ }
    });
    
    console.log('✅ Enhanced visitor tracking tables created successfully!');
    
    // 插入一些测试数据
    const insertTestPageViews = db.prepare(`
        INSERT OR IGNORE INTO page_views (session_id, page_url, page_title, product_id, product_name, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertTestLocations = db.prepare(`
        INSERT OR IGNORE INTO visitor_locations (ip_address, country, country_code, city, created_at)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    const now = new Date().toISOString();
    
    // 测试页面访问记录
    const testPageViews = [
        ['session_1', '/', '首页', null, null, '192.168.1.1', 'Mozilla/5.0 Chrome/91.0', now],
        ['session_1', '/products/529', '产品详情', 529, 'Premium Women Wallet 168', '192.168.1.1', 'Mozilla/5.0 Chrome/91.0', now],
        ['session_2', '/products', '产品列表', null, null, '192.168.1.2', 'Mozilla/5.0 Firefox/89.0', now],
        ['session_2', '/products/530', '产品详情', 530, 'Premium Women Wallet 167', '192.168.1.2', 'Mozilla/5.0 Firefox/89.0', now],
        ['session_3', '/about', '关于我们', null, null, '192.168.1.3', 'Mozilla/5.0 Safari/14.0', now],
    ];
    
    // 测试地理位置数据
    const testLocations = [
        ['192.168.1.1', '中国', 'CN', '北京', now],
        ['192.168.1.2', '美国', 'US', '纽约', now],
        ['192.168.1.3', '日本', 'JP', '东京', now],
    ];
    
    testPageViews.forEach(view => {
        insertTestPageViews.run(...view);
    });
    
    testLocations.forEach(location => {
        insertTestLocations.run(...location);
    });
    
    console.log('✅ Enhanced test data inserted!');
    
} catch (error) {
    console.error('❌ Error creating enhanced visitor tracking tables:', error);
} finally {
    db.close();
}