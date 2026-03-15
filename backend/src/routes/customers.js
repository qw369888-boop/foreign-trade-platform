const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticate, authorize } = require('../middleware/auth');

// 获取客户列表（管理员）
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const { page = 1, limit = 20, status, source, search } = req.query;

  try {
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (source) {
      query += ` AND source = $${paramCount}`;
      params.push(source);
      paramCount++;
    }

    if (search) {
      query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR company ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    const countQuery = query.split('ORDER BY')[0].replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await db.query(countQuery, params.slice(0, -2));

    res.json({
      customers: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// 获取单个客户详情
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await db.query('SELECT * FROM customers WHERE id = $1', [id]);

    if (customer.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // 获取互动记录
    const interactions = await db.query(
      'SELECT * FROM interactions WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 10',
      [id]
    );

    // 获取订单
    const orders = await db.query(
      'SELECT id, order_number, total, currency, status, created_at FROM orders WHERE user_id = (SELECT user_id FROM customers WHERE id = $1) ORDER BY created_at DESC LIMIT 5',
      [id]
    );

    res.json({
      ...customer.rows[0],
      recentInteractions: interactions.rows,
      recentOrders: orders.rows
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// 创建客户
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const {
    firstName, lastName, email, phone, company, position,
    linkedinUrl, facebookUrl, instagramUrl, whatsappNumber,
    source, status, tags, notes
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO customers (
        first_name, last_name, email, phone, company, position,
        linkedin_url, facebook_url, instagram_url, whatsapp_number,
        source, status, tags, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      firstName, lastName, email, phone, company, position,
      linkedinUrl, facebookUrl, instagramUrl, whatsappNumber,
      source, status || 'lead', tags, notes
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// 更新客户
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;
  const {
    firstName, lastName, email, phone, company, position,
    linkedinUrl, facebookUrl, instagramUrl, whatsappNumber,
    source, status, tags, notes, nextFollowUpDate
  } = req.body;

  try {
    const result = await db.query(`
      UPDATE customers SET
        first_name = $1, last_name = $2, email = $3, phone = $4,
        company = $5, position = $6,
        linkedin_url = $7, facebook_url = $8, instagram_url = $9, whatsapp_number = $10,
        source = $11, status = $12, tags = $13, notes = $14,
        next_follow_up_date = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *
    `, [
      firstName, lastName, email, phone, company, position,
      linkedinUrl, facebookUrl, instagramUrl, whatsappNumber,
      source, status, tags, notes, nextFollowUpDate, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// 添加互动记录
router.post('/:id/interactions', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;
  const { type, channel, subject, content, direction, status, scheduledAt } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO interactions (
        customer_id, user_id, type, channel, subject, content, direction, status, scheduled_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [id, req.user.userId, type, channel, subject, content, direction, status, scheduledAt]);

    // 更新客户最后联系时间
    await db.query(
      'UPDATE customers SET last_contact_date = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create interaction error:', error);
    res.status(500).json({ error: 'Failed to create interaction' });
  }
});

// 获取需要跟进的客户
router.get('/follow-up/pending', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM customers 
      WHERE next_follow_up_date <= CURRENT_DATE 
        AND status IN ('lead', 'prospect')
      ORDER BY next_follow_up_date ASC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get follow-up customers error:', error);
    res.status(500).json({ error: 'Failed to fetch follow-up customers' });
  }
});

module.exports = router;
