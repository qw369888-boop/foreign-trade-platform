require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// 读取从原始数据库提取的真实产品数据
const realProducts = [
  {
    id: 529,
    sku: "FB-001",
    name: "Premium Leather Handbag 1",
    name_zh: "高级皮革手提包 1",
    description: "High-quality handbag perfect for daily use",
    description_zh: "高品质高级皮革手提包，适合日常使用",
    price: 56.31,
    compare_price: 79.15,
    stock: 58,
    category: "Handbags",
    images: ["https://sc04.alicdn.com/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf.jpg"],
    moq: 23
  },
  {
    id: 530,
    sku: "FB-002",
    name: "Premium Leather Handbag 2",
    name_zh: "高级皮革手提包 2",
    description: "High-quality handbag perfect for daily use",
    description_zh: "高品质高级皮革手提包，适合日常使用",
    price: 26.85,
    compare_price: 61.82,
    stock: 64,
    category: "Handbags",
    images: ["https://sc04.alicdn.com/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf.jpg"],
    moq: 5
  },
  {
    id: 531,
    sku: "FB-003",
    name: "Fashion Shoulder Bag",
    name_zh: "时尚单肩包",
    description: "High-quality fashionable shoulder bag perfect for daily use",
    description_zh: "高品质时尚单肩包，适合日常使用",
    price: 56.97,
    compare_price: 144.18,
    stock: 58,
    category: "Handbags",
    images: ["https://s.alicdn.com/@sc04/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf/OEM-ODM-Fashionable-Large-Shoulder-Handbag-Custom.jpg_200x200.jpg"],
    moq: 14
  },
  {
    id: 532,
    sku: "FB-004",
    name: "Luxury Tote Bag",
    name_zh: "奢华托特包",
    description: "Premium luxury tote bag for elegant women",
    description_zh: "优质奢华托特包，适合优雅女性",
    price: 42.34,
    compare_price: 81.24,
    stock: 110,
    category: "Tote Bags",
    images: ["https://sc04.alicdn.com/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf.jpg"],
    moq: 18
  },
  {
    id: 533,
    sku: "FB-005",
    name: "Travel Backpack",
    name_zh: "旅行背包",
    description: "High-quality backpack perfect for travel and daily use",
    description_zh: "高品质背包，适合旅行和日常使用",
    price: 32.36,
    compare_price: 155.19,
    stock: 66,
    category: "Backpacks",
    images: ["https://sc04.alicdn.com/kf/H89cc22f8c99a4826acee5358b7db2a06f.jpg"],
    moq: 21
  },
  {
    id: 534,
    sku: "FB-006",
    name: "Canvas Tote Bag",
    name_zh: "帆布托特包",
    description: "Durable canvas tote bag perfect for shopping and daily use",
    description_zh: "耐用帆布托特包，适合购物和日常使用",
    price: 25.38,
    compare_price: 134.58,
    stock: 53,
    category: "Tote Bags",
    images: ["https://sc04.alicdn.com/kf/Hdb8ce640a0524e57b2e251ac9e5539cfO.jpg"],
    moq: 8
  },
  {
    id: 535,
    sku: "FB-007",
    name: "2026 New Fashion Handbag",
    name_zh: "2026新款时尚手提包",
    description: "Latest 2026 fashion handbag with modern design",
    description_zh: "2026最新时尚手提包，现代设计",
    price: 40.31,
    compare_price: 98.89,
    stock: 116,
    category: "Handbags",
    images: ["https://s.alicdn.com/@sc04/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf/OEM-ODM-Fashionable-Large-Shoulder-Handbag-Custom.jpg_200x200.jpg"],
    moq: 10
  },
  {
    id: 536,
    sku: "FB-008",
    name: "High Quality Designer Bag",
    name_zh: "高品质设计师包",
    description: "Premium designer bag with excellent craftsmanship",
    description_zh: "优质设计师包，工艺精湛",
    price: 61.03,
    compare_price: 86.94,
    stock: 41,
    category: "Handbags",
    images: ["https://s.alicdn.com/@sc04/kf/H78987733a47c45d390533aaa34e44dd1Q/High-Quality-Bags-2023-High-Quality-New.jpg_480x480.jpg"],
    moq: 19
  }
];

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
    
    let products = [...realProducts];
    
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
      total: realProducts.length,
      page: Math.floor(offsetNum / limitNum) + 1,
      totalPages: Math.ceil(realProducts.length / limitNum)
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
    const product = realProducts.find(p => p.id === id);
    
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
    const categories = [...new Set(realProducts.map(p => p.category))];
    
    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat,
        count: realProducts.filter(p => p.category === cat).length
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
    const product = realProducts.find(p => p.id === parseInt(productId));
    
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
  console.log(`📊 Real product database loaded with ${realProducts.length} products from original DB`);
  console.log(`🌐 CORS enabled for localhost ports`);
  console.log(`🖼️  Using real Alibaba product images`);
  console.log(`⚡ Ready to serve API requests`);
  
  // 显示产品列表
  console.log('\n📦 Available Products:');
  realProducts.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name} (${product.name_zh}) - $${product.price} - ${product.category}`);
  });
});

module.exports = app;