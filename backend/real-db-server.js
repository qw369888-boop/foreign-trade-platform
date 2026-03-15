const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// 数据库连接
const dbPath = path.join(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

console.log('🚀 启动外贸平台后端服务器\n');

// CORS 配置
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 产品 API
app.get('/api/products', (req, res) => {
  try {
    const { lang = 'en', category, limit, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM products';
    let params = [];
    
    // 分类筛选
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    // 分页
    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
    }
    
    const products = db.prepare(query).all(...params);
    
    // 处理图片JSON
    const processedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));
    
    console.log(`[API] GET /api/products - lang: ${lang}, category: ${category}, limit: ${limit}, returned: ${processedProducts.length} products`);
    
    res.json({
      success: true,
      data: processedProducts,
      total: processedProducts.length
    });
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 单个产品
app.get('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // 处理图片JSON
    const processedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    };
    
    console.log(`[API] GET /api/products/${id} - found product: ${product.name}`);
    
    res.json({
      success: true,
      data: processedProduct
    });
  } catch (error) {
    console.error('Product detail API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 分类列表
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY category
    `).all();
    
    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat.category,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 购物车 API (简单实现)
app.post('/api/cart/add', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(productId));
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    console.log(`[API] POST /api/cart/add - product: ${product.name}, quantity: ${quantity}`);
    
    res.json({
      success: true,
      message: 'Product added to cart',
      data: { product, quantity }
    });
  } catch (error) {
    console.error('Add to cart API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 税收 API
const taxRoutes = require('./src/routes/tax');
app.use('/api/tax', taxRoutes);

// 订单 API (简单实现)
app.post('/api/orders', (req, res) => {
  try {
    const { items, customer, shipping } = req.body;
    
    console.log(`[API] POST /api/orders - items: ${items?.length || 0}, customer: ${customer?.email || 'unknown'}`);
    
    res.json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: 'ORD-' + Date.now(),
        status: 'pending',
        total: items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
      }
    });
  } catch (error) {
    console.error('Create order API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// 错误处理
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  // 检查数据库中的产品数量
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Database loaded with ${productCount.count} products`);
  console.log(`🌐 CORS enabled for localhost ports`);
  console.log(`⚡ Ready to serve API requests`);
  
  // 显示产品分类统计
  const categories = db.prepare(`
    SELECT category, COUNT(*) as count 
    FROM products 
    GROUP BY category 
    ORDER BY category
  `).all();
  
  console.log('\n📦 产品分类统计:');
  categories.forEach(cat => {
    console.log(`   ${cat.category}: ${cat.count} 个产品`);
  });
  console.log('');
});

module.exports = app;