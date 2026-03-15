const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');

// 获取购物车
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // 获取或创建购物车
    let cart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cart.rows.length === 0) {
      cart = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
    }

    const cartId = cart.rows[0].id;

    // 获取购物车商品
    const items = await db.query(`
      SELECT 
        ci.id, ci.quantity, ci.price,
        p.id as product_id, p.name_en as product_name, p.slug, p.currency,
        pv.id as variant_id, pv.name as variant_name,
        (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) as image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    const total = items.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      cartId,
      items: items.rows,
      total,
      currency: items.rows[0]?.currency || 'USD'
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// 添加商品到购物车
router.post('/items', authenticate, async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
  const userId = req.user.userId;

  try {
    // 获取或创建购物车
    let cart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cart.rows.length === 0) {
      cart = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
    }

    const cartId = cart.rows[0].id;

    // 获取产品价格
    let price;
    if (variantId) {
      const variant = await db.query('SELECT price FROM product_variants WHERE id = $1', [variantId]);
      price = variant.rows[0]?.price;
    }
    
    if (!price) {
      const product = await db.query('SELECT price FROM products WHERE id = $1', [productId]);
      price = product.rows[0]?.price;
    }

    if (!price) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 检查商品是否已在购物车
    const existing = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND ($3::integer IS NULL OR variant_id = $3)',
      [cartId, productId, variantId]
    );

    if (existing.rows.length > 0) {
      // 更新数量
      await db.query(
        'UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [quantity, existing.rows[0].id]
      );
    } else {
      // 添加新商品
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
        [cartId, productId, variantId, quantity, price]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// 更新购物车商品数量
router.put('/items/:itemId', authenticate, async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    await db.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantity, itemId]
    );

    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// 删除购物车商品
router.delete('/items/:itemId', authenticate, async (req, res) => {
  const { itemId } = req.params;

  try {
    await db.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// 清空购物车
router.delete('/', authenticate, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cart.rows.length > 0) {
      await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.rows[0].id]);
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
