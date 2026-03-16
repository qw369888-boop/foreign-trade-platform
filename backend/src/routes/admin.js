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
    // 实时在线用户数（基于最近5分钟的活动）
    const onlineUsersResult = await db.query(`
      SELECT COUNT(DISTINCT session_id) as count 
      FROM visitor_sessions 
      WHERE last_activity > datetime('now', '-5 minutes')
    `);
    const onlineUsers = parseInt(onlineUsersResult.rows[0]?.count || 0);

    // 今日访客数
    const todayVisitorsResult = await db.query(`
      SELECT COUNT(DISTINCT session_id) as count 
      FROM visitor_sessions 
      WHERE DATE(created_at) = DATE('now')
    `);
    const todayVisitors = parseInt(todayVisitorsResult.rows[0]?.count || 0);

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

    res.json({
      onlineUsers,
      todayVisitors,
      totalOrders,
      totalRevenue,
      pendingOrders,
      refunds
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 获取在线用户详情（包含IP地址）
router.get('/online-users', authenticate, requireAdmin, async (req, res) => {
  try {
    const onlineUsersResult = await db.query(`
      SELECT 
        vs.session_id,
        vs.ip_address,
        vs.page,
        vs.user_agent,
        vs.last_activity,
        vs.country,
        vs.city,
        vs.browser,
        vs.os,
        vl.country as location_country,
        vl.city as location_city
      FROM visitor_sessions vs
      LEFT JOIN visitor_locations vl ON vs.ip_address = vl.ip_address
      WHERE vs.last_activity > datetime('now', '-5 minutes')
      ORDER BY vs.last_activity DESC
    `);

    res.json({
      success: true,
      data: onlineUsersResult.rows || []
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ error: 'Failed to fetch online users' });
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
    const { date, start_date, end_date } = req.query;
    
    let whereClause = '';
    let params = [];
    
    if (date) {
      whereClause = 'WHERE DATE(o.created_at) = ?';
      params.push(date);
    } else if (start_date && end_date) {
      whereClause = 'WHERE DATE(o.created_at) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }
    
    const result = await db.query(`
      SELECT o.*, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT 100
    `, params);

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

// 获取访客历史统计（增强版）
router.get('/visitor-history', authenticate, requireAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    // 获取最近N天的访客统计
    const historyResult = await db.query(`
      SELECT 
        DATE(vs.created_at) as date,
        COUNT(DISTINCT vs.session_id) as visitors,
        COUNT(pv.id) as page_views,
        COUNT(DISTINCT CASE WHEN pv.product_id IS NOT NULL THEN pv.product_id END) as products_viewed
      FROM visitor_sessions vs
      LEFT JOIN page_views pv ON vs.session_id = pv.session_id
      WHERE vs.created_at >= datetime('now', '-${parseInt(days)} days')
      GROUP BY DATE(vs.created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: historyResult.rows || []
    });
  } catch (error) {
    console.error('Get visitor history error:', error);
    res.status(500).json({ error: 'Failed to fetch visitor history' });
  }
});

// 获取访客详细记录（包含产品访问）
router.get('/visitor-details/:date', authenticate, requireAdmin, async (req, res) => {
  try {
    const { date } = req.params;
    
    // 获取指定日期的访客详情
    const visitorsResult = await db.query(`
      SELECT 
        vs.session_id,
        vs.ip_address,
        vs.created_at,
        vs.last_activity,
        vl.country,
        vl.city,
        vs.browser,
        vs.os,
        GROUP_CONCAT(DISTINCT pv.page_url) as pages_visited,
        GROUP_CONCAT(DISTINCT pv.product_name) as products_viewed,
        COUNT(pv.id) as total_page_views
      FROM visitor_sessions vs
      LEFT JOIN visitor_locations vl ON vs.ip_address = vl.ip_address
      LEFT JOIN page_views pv ON vs.session_id = pv.session_id
      WHERE DATE(vs.created_at) = ?
      GROUP BY vs.session_id
      ORDER BY vs.created_at DESC
    `, [date]);

    res.json({
      success: true,
      data: visitorsResult.rows || []
    });
  } catch (error) {
    console.error('Get visitor details error:', error);
    res.status(500).json({ error: 'Failed to fetch visitor details' });
  }
});

// 获取热门产品访问统计
router.get('/popular-products', authenticate, requireAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const popularProductsResult = await db.query(`
      SELECT 
        pv.product_id,
        pv.product_name,
        COUNT(*) as view_count,
        COUNT(DISTINCT pv.session_id) as unique_visitors,
        DATE(pv.created_at) as view_date
      FROM page_views pv
      WHERE pv.product_id IS NOT NULL 
        AND pv.created_at >= datetime('now', '-${parseInt(days)} days')
      GROUP BY pv.product_id, DATE(pv.created_at)
      ORDER BY view_count DESC, view_date DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      data: popularProductsResult.rows || []
    });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({ error: 'Failed to fetch popular products' });
  }
});

// 记录访客活动
router.post('/track-visitor', async (req, res) => {
  try {
    const { sessionId, page, userAgent, ip } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    // 更新或插入访客会话
    await db.query(`
      INSERT INTO visitor_sessions (session_id, page, user_agent, ip_address, created_at, last_activity)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(session_id) DO UPDATE SET
        last_activity = datetime('now'),
        page = ?,
        user_agent = ?,
        ip_address = ?
    `, [sessionId, page, userAgent, ip, page, userAgent, ip]);

    res.json({ success: true });
  } catch (error) {
    console.error('Track visitor error:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
});

// 获取指定日期的订单详情
router.get('/orders-by-date/:date', authenticate, requireAdmin, async (req, res) => {
  try {
    const { date } = req.params;
    
    const ordersResult = await db.query(`
      SELECT 
        o.*,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE DATE(o.created_at) = ?
      ORDER BY o.created_at DESC
    `, [date]);

    res.json({
      success: true,
      data: ordersResult.rows || []
    });
  } catch (error) {
    console.error('Get orders by date error:', error);
    res.status(500).json({ error: 'Failed to fetch orders by date' });
  }
});

// 获取指定日期的收入详情
router.get('/revenue-by-date/:date', authenticate, requireAdmin, async (req, res) => {
  try {
    const { date } = req.params;
    
    const revenueResult = await db.query(`
      SELECT 
        o.order_number,
        o.total as amount,
        o.payment_method,
        o.currency,
        o.paid_at,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE DATE(o.paid_at) = ? AND o.payment_status = 'paid'
      ORDER BY o.paid_at DESC
    `, [date]);

    res.json({
      success: true,
      data: revenueResult.rows || []
    });
  } catch (error) {
    console.error('Get revenue by date error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue by date' });
  }
});

// 获取指定日期的退款详情
router.get('/refunds-by-date/:date', authenticate, requireAdmin, async (req, res) => {
  try {
    const { date } = req.params;
    
    const refundsResult = await db.query(`
      SELECT 
        o.order_number,
        o.total as amount,
        o.refund_reason as reason,
        o.status,
        o.updated_at as refunded_at,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE DATE(o.updated_at) = ? AND o.status = 'refunded'
      ORDER BY o.updated_at DESC
    `, [date]);

    res.json({
      success: true,
      data: refundsResult.rows || []
    });
  } catch (error) {
    console.error('Get refunds by date error:', error);
    res.status(500).json({ error: 'Failed to fetch refunds by date' });
  }
});

module.exports = router;
