-- 外贸独立站数据库初始化脚本
-- PostgreSQL 14+

-- ==========================================
-- 用户和认证表
-- ==========================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer', -- customer, admin, bot
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==========================================
-- 产品管理
-- ==========================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255),
    name_ja VARCHAR(255),
    name_ko VARCHAR(255),
    name_de VARCHAR(255),
    name_fr VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    
    -- 多语言产品信息
    name_en VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255),
    name_ja VARCHAR(255),
    name_ko VARCHAR(255),
    name_de VARCHAR(255),
    name_fr VARCHAR(255),
    
    description_en TEXT,
    description_zh TEXT,
    description_ja TEXT,
    description_ko TEXT,
    description_de TEXT,
    description_fr TEXT,
    
    -- 价格和库存
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    stock_quantity INTEGER DEFAULT 0,
    
    -- 产品属性
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    
    -- SEO
    slug VARCHAR(255) UNIQUE NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active', -- active, draft, archived
    featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    attributes JSONB, -- {color: "red", size: "L"}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 购物车
-- ==========================================

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    variant_id INTEGER REFERENCES product_variants(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 订单管理
-- ==========================================

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- 订单金额
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- 支付信息
    payment_method VARCHAR(50), -- paypal, stripe, alipay
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_id VARCHAR(255),
    paid_at TIMESTAMP,
    
    -- 配送信息
    shipping_name VARCHAR(255),
    shipping_email VARCHAR(255),
    shipping_phone VARCHAR(50),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(2),
    
    -- 订单状态
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    tracking_number VARCHAR(255),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- 备注
    customer_note TEXT,
    admin_note TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    variant_id INTEGER REFERENCES product_variants(id),
    
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- CRM 客户管理
-- ==========================================

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    
    -- 基本信息
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    position VARCHAR(100),
    
    -- 社交媒体
    linkedin_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    whatsapp_number VARCHAR(50),
    
    -- 客户分类
    source VARCHAR(50), -- linkedin, facebook, instagram, website, referral
    status VARCHAR(20) DEFAULT 'lead', -- lead, prospect, customer, inactive
    tags TEXT[], -- 标签数组
    
    -- 客户价值
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    average_order_value DECIMAL(10, 2) DEFAULT 0,
    
    -- 跟进信息
    last_contact_date TIMESTAMP,
    next_follow_up_date TIMESTAMP,
    assigned_to INTEGER REFERENCES users(id),
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_source ON customers(source);

-- ==========================================
-- 客户互动记录
-- ==========================================

CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id), -- 操作人员
    
    type VARCHAR(50) NOT NULL, -- email, call, meeting, whatsapp, social_media
    channel VARCHAR(50), -- linkedin, facebook, instagram, whatsapp, email
    subject VARCHAR(255),
    content TEXT,
    
    direction VARCHAR(20), -- inbound, outbound
    status VARCHAR(20), -- scheduled, completed, cancelled
    
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interactions_customer ON interactions(customer_id);
CREATE INDEX idx_interactions_type ON interactions(type);

-- ==========================================
-- 自动化营销
-- ==========================================

CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- email, social_media, whatsapp
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, paused, completed
    
    -- 目标受众
    target_audience JSONB, -- 筛选条件
    
    -- 内容
    subject VARCHAR(255),
    content TEXT,
    
    -- 调度
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- 统计
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_converted INTEGER DEFAULT 0,
    
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campaign_messages (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id),
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, failed
    
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 社交媒体管理
-- ==========================================

CREATE TABLE social_posts (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL, -- linkedin, facebook, instagram, twitter
    
    content TEXT NOT NULL,
    media_urls TEXT[],
    
    status VARCHAR(20) DEFAULT 'draft', -- draft, scheduled, published, failed
    
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    
    post_id VARCHAR(255), -- 平台返回的帖子ID
    post_url TEXT,
    
    -- 统计
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 自动拓客记录
-- ==========================================

CREATE TABLE outreach_logs (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    
    platform VARCHAR(50) NOT NULL, -- linkedin, facebook, instagram
    action VARCHAR(50) NOT NULL, -- view_profile, send_connection, send_message, like_post
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed
    
    message_template TEXT,
    response TEXT,
    
    executed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 系统配置
-- ==========================================

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 初始数据
-- ==========================================

-- 创建管理员账户 (密码: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@example.com', '$2b$10$rKvVLZ8Z8Z8Z8Z8Z8Z8Z8OqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'Admin', 'User', 'admin');

-- 创建示例分类
INSERT INTO categories (name_en, name_zh, name_ja, name_ko, name_de, name_fr, slug) VALUES
('Electronics', '电子产品', '電子製品', '전자제품', 'Elektronik', 'Électronique', 'electronics'),
('Clothing', '服装', '衣類', '의류', 'Kleidung', 'Vêtements', 'clothing'),
('Home & Garden', '家居园艺', 'ホーム＆ガーデン', '홈 & 가든', 'Haus & Garten', 'Maison & Jardin', 'home-garden');

-- 系统设置
INSERT INTO settings (key, value, type, description) VALUES
('site_name', 'Foreign Trade Platform', 'string', '网站名称'),
('default_currency', 'USD', 'string', '默认货币'),
('default_language', 'en', 'string', '默认语言'),
('auto_outreach_enabled', 'true', 'boolean', '启用自动拓客'),
('outreach_daily_limit', '50', 'number', '每日拓客上限');
