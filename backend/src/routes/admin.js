const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');

// 检查管理员权限
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

// 获取统计数据
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    // 在线用户（简化版，实际需要 WebSocket 或 Redis）
    const onlineUsers = Math.floor(Math.random() * 50) + 10;

    // 总订单数
    const ordersResult = await db.query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0]?.count || 0);

    // 总收入
    const revenueResult = await db.query(
      "SELECT SUM(total) as revenue FROM orders WHERE payment_status = 'paid'"
    );
    const totalRevenue = parseFloat(revenueResult.rows[0]?.revenue || 0);

    // 待处理订单
    const pendingResult = await db.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
    );
    const pendingOrders = parseInt(pendingResult.rows[0]?.count || 0);

    // 退款数
    const refundsResult = await db.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'refunded'"
    );
    const refunds = parseInt(refundsResult.rows[0]?.count || 0);

    // 访客数（简化版）
    const visitors = Math.floor(Math.random() * 500) + 100;

    res.json({
      onlineUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      refunds,
      visitors
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 获取所有用户
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, email, first_name, last_name, role, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 更新用户角色
router.patch('/users/:userId/role', authenticate, requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// 删除用户
router.delete('/users/:userId', authenticate, requireAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// 获取所有订单（管理员）
router.get('/orders', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `);

    res.json({ success: true, orders: result.rows });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 更新订单状态
router.patch('/orders/:orderId/status', authenticate, requireAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await db.query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, orderId]);
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// 添加产品
router.post('/products', authenticate, requireAdmin, async (req, res) => {
  const { name, name_zh, price, category, moq, description, images } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO products (name_en, name_zh, price, category, moq, description_en, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [name, name_zh, price, category, moq, description, JSON.stringify(images || [])]);

    res.json({ success: true, productId: result.rows[0].id });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// 更新产品
router.put('/products/:productId', authenticate, requireAdmin, async (req, res) => {
  const { productId } = req.params;
  const { name, name_zh, price, category, moq, description, images } = req.body;

  try {
    await db.query(`
      UPDATE products
      SET name_en = $1, name_zh = $2, price = $3, category = $4, moq = $5, description_en = $6, images = $7
      WHERE id = $8
    `, [name, name_zh, price, category, moq, description, JSON.stringify(images || []), productId]);

    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// 删除产品
router.delete('/products/:productId', authenticate, requireAdmin, async (req, res) => {
  const { productId } = req.params;

  try {
    await db.query('DELETE FROM products WHERE id = $1', [productId]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 获取页面内容
router.get('/page-content/:page', authenticate, requireAdmin, async (req, res) => {
  const { page } = req.params;

  try {
    const result = await db.query(
      'SELECT content FROM page_content WHERE page_name = $1',
      [page]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, content: result.rows[0].content });
    } else {
      res.json({ success: true, content: null });
    }
  } catch (error) {
    console.error('Get page content error:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// 保存页面内容
router.post('/page-content', authenticate, requireAdmin, async (req, res) => {
  const { page, content } = req.body;

  try {
    await db.query(`
      INSERT INTO page_content (page_name, content, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (page_name)
      DO UPDATE SET content = $2, updated_at = CURRENT_TIMESTAMP
    `, [page, JSON.stringify(content)]);

    res.json({ success: true, message: 'Page content saved' });
  } catch (error) {
    console.error('Save page content error:', error);
    res.status(500).json({ error: 'Failed to save page content' });
  }
});

module.exports = router;
