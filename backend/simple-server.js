require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// 模拟产品数据
const mockProducts = [
  {
    id: 529,
    sku: "HB-001",
    name: "Premium Leather Handbag",
    name_zh: "高级皮革手提包",
    description: "Elegant leather handbag perfect for business and casual occasions",
    description_zh: "优雅的皮革手提包，适合商务和休闲场合",
    price: 89.99,
    compare_price: 129.99,
    stock: 50,
    category: "Handbags",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
    moq: 10
  },
  {
    id: 530,
    sku: "TB-002", 
    name: "Canvas Tote Bag",
    name_zh: "帆布托特包",
    description: "Durable canvas tote bag for everyday use",
    description_zh: "耐用的帆布托特包，适合日常使用",
    price: 29.99,
    compare_price: 39.99,
    stock: 100,
    category: "Tote Bags",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
    moq: 20
  },
  {
    id: 531,
    sku: "SB-003",
    name: "Crossbody Shoulder Bag", 
    name_zh: "斜挎单肩包",
    description: "Stylish crossbody bag with adjustable strap",
    description_zh: "时尚的斜挎包，可调节肩带",
    price: 45.99,
    compare_price: 65.99,
    stock: 75,
    category: "Shoulder Bags",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"],
    moq: 15
  },
  {
    id: 532,
    sku: "BB-004",
    name: "Business Briefcase",
    name_zh: "商务公文包",
    description: "Professional leather briefcase for business use",
    description_zh: "专业皮革公文包，适合商务使用",
    price: 129.99,
    compare_price: 179.99,
    stock: 30,
    category: "Briefcases",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
    moq: 5
  },
  {
    id: 533,
    sku: "WB-005",
    name: "Women's Wallet",
    name_zh: "女士钱包",
    description: "Compact leather wallet with multiple card slots",
    description_zh: "紧凑型皮革钱包，多个卡槽",
    price: 35.99,
    compare_price: 49.99,
    stock: 80,
    category: "Wallets",
    images: ["/images/wallet-1.jpg", "/images/wallet-2.jpg"],
    moq: 25
  },
  {
    id: 534,
    sku: "BP-006",
    name: "Travel Backpack",
    name_zh: "旅行背包",
    description: "Large capacity backpack perfect for travel",
    description_zh: "大容量背包，完美适合旅行",
    price: 79.99,
    compare_price: 99.99,
    stock: 40,
    category: "Backpacks",
    images: ["/images/backpack-1.jpg", "/images/backpack-2.jpg"],
    moq: 12
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
    
    let products = [...mockProducts];
    
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
      total: mockProducts.length,
      page: Math.floor(offsetNum / limitNum) + 1,
      totalPages: Math.ceil(mockProducts.length / limitNum)
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
    const product = mockProducts.find(p => p.id === id);
    
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
    const categories = [...new Set(mockProducts.map(p => p.category))];
    
    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat,
        count: mockProducts.filter(p => p.category === cat).length
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
    const product = mockProducts.find(p => p.id === parseInt(productId));
    
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
  console.log(`📊 Mock database loaded with ${mockProducts.length} products`);
  console.log(`🌐 CORS enabled for localhost ports`);
  console.log(`⚡ Ready to serve API requests`);
});

module.exports = app;