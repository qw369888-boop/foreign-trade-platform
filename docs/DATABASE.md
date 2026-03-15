# 数据库设计文档

本文档详细说明外贸独立站系统的数据库结构。

## 数据库概览

- **数据库类型**: PostgreSQL 14+
- **字符集**: UTF-8
- **时区**: UTC
- **总表数**: 15 个核心表

## 表结构

### 1. users - 用户表

存储系统用户信息（客户、管理员、机器人账户）。

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer',  -- customer, admin, bot
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

**索引**:
- `idx_users_email` ON email
- `idx_users_role` ON role

### 2. categories - 产品分类表

支持多语言的产品分类。

```sql
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
```

**特点**:
- 支持多级分类（parent_id）
- 多语言支持（6 种语言）

### 3. products - 产品表

存储产品信息，支持多语言。

```sql
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
    status VARCHAR(20) DEFAULT 'active',  -- active, draft, archived
    featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**索引**:
- `idx_products_sku` ON sku
- `idx_products_category` ON category_id
- `idx_products_status` ON status

### 4. product_images - 产品图片表

```sql
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. product_variants - 产品变体表

用于存储产品的不同规格（如颜色、尺寸）。

```sql
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    attributes JSONB,  -- {color: "red", size: "L"}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**JSONB 示例**:
```json
{
  "color": "Red",
  "size": "Large",
  "material": "Cotton"
}
```

### 6. carts - 购物车表

```sql
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),  -- 用于未登录用户
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. cart_items - 购物车商品表

```sql
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    variant_id INTEGER REFERENCES product_variants(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. orders - 订单表

```sql
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
    payment_method VARCHAR(50),  -- paypal, stripe, alipay
    payment_status VARCHAR(20) DEFAULT 'pending',
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
    status VARCHAR(20) DEFAULT 'pending',
    tracking_number VARCHAR(255),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- 备注
    customer_note TEXT,
    admin_note TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**索引**:
- `idx_orders_user` ON user_id
- `idx_orders_status` ON status
- `idx_orders_payment_status` ON payment_status

**订单状态流程**:
```
pending → processing → shipped → delivered
                    ↓
                cancelled
```

### 9. order_items - 订单商品表

```sql
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
```

### 10. customers - CRM 客户表

```sql
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
    source VARCHAR(50),  -- linkedin, facebook, instagram, website, referral
    status VARCHAR(20) DEFAULT 'lead',  -- lead, prospect, customer, inactive
    tags TEXT[],  -- 标签数组
    
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
```

**索引**:
- `idx_customers_email` ON email
- `idx_customers_status` ON status
- `idx_customers_source` ON source

**客户生命周期**:
```
lead → prospect → customer → inactive
```

### 11. interactions - 客户互动记录表

```sql
CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    
    type VARCHAR(50) NOT NULL,  -- email, call, meeting, whatsapp, social_media
    channel VARCHAR(50),  -- linkedin, facebook, instagram, whatsapp, email
    subject VARCHAR(255),
    content TEXT,
    
    direction VARCHAR(20),  -- inbound, outbound
    status VARCHAR(20),  -- scheduled, completed, cancelled
    
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**索引**:
- `idx_interactions_customer` ON customer_id
- `idx_interactions_type` ON type

### 12. campaigns - 营销活动表

```sql
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- email, social_media, whatsapp
    status VARCHAR(20) DEFAULT 'draft',
    
    -- 目标受众
    target_audience JSONB,
    
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
```

### 13. campaign_messages - 营销消息表

```sql
CREATE TABLE campaign_messages (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id),
    
    status VARCHAR(20) DEFAULT 'pending',
    
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 14. social_posts - 社交媒体帖子表

```sql
CREATE TABLE social_posts (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    
    content TEXT NOT NULL,
    media_urls TEXT[],
    
    status VARCHAR(20) DEFAULT 'draft',
    
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    
    post_id VARCHAR(255),
    post_url TEXT,
    
    -- 统计
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 15. outreach_logs - 自动拓客日志表

```sql
CREATE TABLE outreach_logs (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    
    platform VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending',
    
    message_template TEXT,
    response TEXT,
    
    executed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 16. settings - 系统设置表

```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 关系图

```
users ──┬─→ orders
        ├─→ customers (assigned_to)
        ├─→ interactions
        ├─→ campaigns (created_by)
        └─→ social_posts (created_by)

categories ─→ products ──┬─→ product_images
                         ├─→ product_variants
                         ├─→ cart_items
                         └─→ order_items

customers ──┬─→ interactions
            ├─→ campaign_messages
            └─→ outreach_logs

campaigns ─→ campaign_messages

carts ─→ cart_items

orders ─→ order_items
```

## 数据类型说明

### DECIMAL(10, 2)
用于货币金额，精确到小数点后两位。

### JSONB
PostgreSQL 的二进制 JSON 类型，支持索引和高效查询。

### TEXT[]
PostgreSQL 数组类型，用于存储标签等列表数据。

### TIMESTAMP
存储日期和时间，默认使用 UTC 时区。

## 查询示例

### 1. 获取客户的订单历史

```sql
SELECT 
    o.order_number,
    o.total,
    o.status,
    o.created_at,
    json_agg(
        json_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price
        )
    ) as items
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 123
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### 2. 获取高价值客户

```sql
SELECT 
    c.id,
    c.email,
    c.company,
    COUNT(o.id) as total_orders,
    SUM(o.total) as lifetime_value
FROM customers c
LEFT JOIN orders o ON c.user_id = o.user_id
WHERE c.status = 'customer'
GROUP BY c.id
HAVING SUM(o.total) > 10000
ORDER BY lifetime_value DESC;
```

### 3. 营销活动效果分析

```sql
SELECT 
    c.name,
    c.total_sent,
    c.total_opened,
    c.total_clicked,
    ROUND(c.total_opened * 100.0 / NULLIF(c.total_sent, 0), 2) as open_rate,
    ROUND(c.total_clicked * 100.0 / NULLIF(c.total_opened, 0), 2) as click_rate
FROM campaigns c
WHERE c.status = 'completed'
ORDER BY open_rate DESC;
```

### 4. 产品销售排行

```sql
SELECT 
    p.name_en,
    SUM(oi.quantity) as total_sold,
    SUM(oi.total) as total_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10;
```

## 性能优化

### 1. 索引策略

```sql
-- 复合索引
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_products_category_status ON products(category_id, status);

-- 部分索引
CREATE INDEX idx_orders_pending ON orders(created_at) WHERE status = 'pending';

-- JSONB 索引
CREATE INDEX idx_product_variants_attributes ON product_variants USING GIN (attributes);
```

### 2. 分区表（大数据量时）

```sql
-- 按月分区订单表
CREATE TABLE orders_2024_01 PARTITION OF orders
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 3. 物化视图（复杂查询）

```sql
CREATE MATERIALIZED VIEW customer_stats AS
SELECT 
    c.id,
    c.email,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_spent,
    COALESCE(AVG(o.total), 0) as average_order_value
FROM customers c
LEFT JOIN orders o ON c.user_id = o.user_id
GROUP BY c.id;

-- 定期刷新
REFRESH MATERIALIZED VIEW customer_stats;
```

## 备份和恢复

### 备份

```bash
# 完整备份
pg_dump -h localhost -U ftuser foreign_trade_db > backup.sql

# 仅数据
pg_dump -h localhost -U ftuser --data-only foreign_trade_db > data.sql

# 仅结构
pg_dump -h localhost -U ftuser --schema-only foreign_trade_db > schema.sql
```

### 恢复

```bash
# 恢复完整备份
psql -h localhost -U ftuser foreign_trade_db < backup.sql

# 恢复到新数据库
createdb new_db
psql -h localhost -U ftuser new_db < backup.sql
```

## 数据迁移

### 从 MySQL 迁移

使用 `pgloader`:

```bash
pgloader mysql://user:pass@localhost/old_db postgresql://ftuser:pass@localhost/foreign_trade_db
```

## 维护任务

### 1. 清理旧数据

```sql
-- 删除 90 天前的购物车
DELETE FROM carts WHERE updated_at < CURRENT_DATE - INTERVAL '90 days';

-- 归档旧订单
INSERT INTO orders_archive SELECT * FROM orders WHERE created_at < CURRENT_DATE - INTERVAL '1 year';
DELETE FROM orders WHERE created_at < CURRENT_DATE - INTERVAL '1 year';
```

### 2. 更新统计信息

```sql
-- 更新客户统计
UPDATE customers c
SET 
    total_orders = (SELECT COUNT(*) FROM orders WHERE user_id = c.user_id),
    total_spent = (SELECT COALESCE(SUM(total), 0) FROM orders WHERE user_id = c.user_id),
    average_order_value = (SELECT COALESCE(AVG(total), 0) FROM orders WHERE user_id = c.user_id);
```

### 3. 数据库维护

```sql
-- 分析表
ANALYZE products;
ANALYZE orders;

-- 清理死元组
VACUUM FULL;

-- 重建索引
REINDEX TABLE products;
```

## 安全建议

1. **使用强密码** - 数据库用户密码至少 16 字符
2. **限制访问** - 只允许应用服务器连接
3. **加密连接** - 使用 SSL/TLS
4. **定期备份** - 每天自动备份
5. **审计日志** - 启用 PostgreSQL 审计

## 支持

如有问题，请参考：
- [部署指南](DEPLOYMENT.md)
- [配置说明](CONFIGURATION.md)
