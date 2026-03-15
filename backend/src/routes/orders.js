const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');

// 生成订单号
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// 创建订单（无需认证 - 用于访客结账）
router.post('/create', async (req, res) => {
  const {
    items,
    shippingAddress,
    email,
    subtotal,
    shipping,
    tax,
    total
  } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    const orderNumber = generateOrderNumber();

    // 创建订单
    const orderResult = await db.query(`
      INSERT INTO orders (
        order_number, subtotal, shipping_cost, tax, total, currency,
        shipping_name, shipping_email, shipping_phone,
        shipping_address_line1, shipping_city, shipping_postal_code, shipping_country,
        status, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, order_number
    `, [
      orderNumber, subtotal, shipping, tax, total, 'USD',
      `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      email,
      shippingAddress.phone,
      shippingAddress.address,
      shippingAddress.city,
      shippingAddress.zipCode,
      shippingAddress.country,
      'pending', 'pending'
    ]);

    const orderId = orderResult.rows[0].id;

    // 创建订单商品
    for (const item of items) {
      await db.query(`
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, price, total
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        orderId, item.productId, `Product ${item.productId}`, 
        item.quantity, item.price, item.price * item.quantity
      ]);
    }

    res.status(201).json({
      success: true,
      orderId,
      orderNumber: orderResult.rows[0].order_number,
      total,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 创建订单（需要认证）
router.post('/', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const {
    shippingName, shippingEmail, shippingPhone,
    shippingAddressLine1, shippingAddressLine2,
    shippingCity, shippingState, shippingPostalCode, shippingCountry,
    customerNote
  } = req.body;

  try {
    // 获取购物车
    const cart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cart.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartId = cart.rows[0].id;

    // 获取购物车商品
    const items = await db.query(`
      SELECT ci.*, p.name_en, p.currency, p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    if (items.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 检查库存
    for (const item of items.rows) {
      if (item.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.name_en}` 
        });
      }
    }

    // 计算总额
    const subtotal = items.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = 10.00; // 简化处理
    const tax = subtotal * 0.1; // 10% 税
    const total = subtotal + shippingCost + tax;

    const orderNumber = generateOrderNumber();
    const currency = items.rows[0].currency;

    // 创建订单
    const orderResult = await db.query(`
      INSERT INTO orders (
        order_number, user_id, subtotal, shipping_cost, tax, total, currency,
        shipping_name, shipping_email, shipping_phone,
        shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_postal_code, shipping_country,
        customer_note, status, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING id, order_number
    `, [
      orderNumber, userId, subtotal, shippingCost, tax, total, currency,
      shippingName, shippingEmail, shippingPhone,
      shippingAddressLine1, shippingAddressLine2,
      shippingCity, shippingState, shippingPostalCode, shippingCountry,
      customerNote, 'pending', 'pending'
    ]);

    const orderId = orderResult.rows[0].id;

    // 创建订单商品
    for (const item of items.rows) {
      await db.query(`
        INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, sku, quantity, price, total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        orderId, item.product_id, item.variant_id, item.name_en, 
        item.sku, item.quantity, item.price, item.price * item.quantity
      ]);

      // 减少库存
      await db.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // 清空购物车
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      orderNumber: orderResult.rows[0].order_number,
      total,
      currency
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 获取用户订单列表
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;

    const result = await db.query(`
      SELECT 
        id, order_number, total, currency, status, payment_status,
        created_at, shipped_at, delivered_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    const countResult = await db.query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [userId]
    );

    res.json({
      orders: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 获取订单详情
router.get('/:orderNumber', authenticate, async (req, res) => {
  const { orderNumber } = req.params;
  const userId = req.user.userId;

  try {
    const orderResult = await db.query(`
      SELECT * FROM orders WHERE order_number = $1 AND user_id = $2
    `, [orderNumber, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(`
      SELECT * FROM order_items WHERE order_id = $1
    `, [order.id]);

    res.json({
      ...order,
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// 更新订单状态（管理员）
router.patch('/:orderId/status', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { orderId } = req.params;
  const { status, trackingNumber } = req.body;

  try {
    const updates = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
    const params = [status, orderId];
    let paramCount = 2;

    if (status === 'shipped' && trackingNumber) {
      updates.push(`tracking_number = $${++paramCount}`);
      updates.push(`shipped_at = CURRENT_TIMESTAMP`);
      params.splice(2, 0, trackingNumber);
    }

    if (status === 'delivered') {
      updates.push('delivered_at = CURRENT_TIMESTAMP');
    }

    await db.query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramCount + 1}`,
      [...params.slice(0, -1), params[params.length - 1]]
    );

    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
