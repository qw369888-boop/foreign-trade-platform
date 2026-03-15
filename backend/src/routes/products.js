const express = require('express');
const router = express.Router();
const { db } = require('../database/db');

// 获取产品列表
router.get('/', (req, res) => {
  try {
    const { category, limit = 20, page = 1, lang = 'en' } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const products = db.prepare(query).all(...params);
    
    // 解析 images JSON 并应用语言翻译
    const productsWithImages = products.map(product => {
      const nameField = `name_${lang}`;
      const descField = `description_${lang}`;
      
      return {
        ...product,
        images: JSON.parse(product.images || '[]'),
        // 如果有对应语言的翻译，使用翻译；否则使用原始英文
        name: product[nameField] || product.name,
        description: product[descField] || product.description
      };
    });
    
    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    const { total } = db.prepare(countQuery).get(...countParams);
    
    res.json({
      success: true,
      data: productsWithImages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

// 获取单个产品
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { lang = 'en' } = req.query;
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    // 解析 images JSON 并应用语言翻译
    const nameField = `name_${lang}`;
    const descField = `description_${lang}`;
    
    product.images = JSON.parse(product.images || '[]');
    product.name = product[nameField] || product.name;
    product.description = product[descField] || product.description;
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch product',
      message: error.message 
    });
  }
});

// 获取产品分类
router.get('/categories/list', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY count DESC
    `).all();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch categories',
      message: error.message 
    });
  }
});

module.exports = router;
