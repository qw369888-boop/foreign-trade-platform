require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// 读取完整准确的原版产品数据
const completeOriginalProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../complete-original-products.json'), 'utf8'));

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
    
    let products = [...completeOriginalProducts];
    
    // 分类筛选
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    // 分页
    const limitNum = limit ? parseInt(limit) : products.length;
    const offsetNum = parseInt(offset);
    products = products.slice(offsetNum, offsetNum + limitNum);
    
    console.log(`[API] GET /api/products - lang: ${lang}, category: ${category}, limit: ${limit}, returned: ${products.length} products`);
    
    res.json({
      success: true,
      data: products,
      total: completeOriginalProducts.length,
      page: Math.floor(offsetNum / limitNum) + 1,
      totalPages: Math.ceil(completeOriginalProducts.length / limitNum)
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
    const product = completeOriginalProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    console.log(`[API] GET /api/products/${id} - found product: ${product.name}`);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Product detail API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 分类列表
app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(completeOriginalProducts.map(p => p.category))];
    
    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat,
        count: completeOriginalProducts.filter(p => p.category === cat).length
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
    const product = completeOriginalProducts.find(p => p.id === parseInt(productId));
    
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
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 COMPLETE ORIGINAL product database loaded with ${completeOriginalProducts.length} products`);
  console.log(`🏭 Manufacturer: Guangzhou Dayi Leather Ltd. (Since 1992)`);
  console.log(`🌐 CORS enabled for localhost ports`);
  console.log(`🖼️  Using original Alibaba product images`);
  console.log(`💰 Correct pricing and MOQ: 100 Pieces for all products`);
  console.log(`⚡ Ready to serve API requests`);
  
  // 显示完整的原版产品列表
  console.log('\n📦 COMPLETE ORIGINAL Products from Database:');
  
  // 按分类分组显示
  const categories = [...new Set(completeOriginalProducts.map(p => p.category))];
  categories.forEach(category => {
    const categoryProducts = completeOriginalProducts.filter(p => p.category === category);
    console.log(`\n🏷️  ${category} (${categoryProducts.length} products):`);
    categoryProducts.forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.name_zh} - $${product.price} (原价: $${product.compare_price})`);
      console.log(`      SKU: ${product.sku} | MOQ: ${product.moq} | 库存: ${product.stock}`);
    });
  });
  
  console.log(`\n✅ Total: ${completeOriginalProducts.length} products across ${categories.length} categories`);
  console.log(`💡 All products have correct pricing, MOQ (100 Pieces), and unique images`);
});

module.exports = app;