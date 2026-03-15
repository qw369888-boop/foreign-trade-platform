const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticate, authorize } = require('../middleware/auth');

// 获取营销活动列表
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const { page = 1, limit = 20, type, status } = req.query;

  try {
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM campaigns WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (type) {
      query += ` AND type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      campaigns: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// 创建营销活动
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const {
    name, type, targetAudience, subject, content, scheduledAt
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO campaigns (
        name, type, target_audience, subject, content, scheduled_at, created_by, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, type, targetAudience, subject, content, scheduledAt, req.user.userId, 'draft']);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// 启动营销活动
router.post('/:id/start', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    // 获取活动信息
    const campaign = await db.query('SELECT * FROM campaigns WHERE id = $1', [id]);
    
    if (campaign.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const { target_audience, type } = campaign.rows[0];

    // 根据目标受众筛选客户
    let customerQuery = 'SELECT id, email FROM customers WHERE 1=1';
    const params = [];

    if (target_audience) {
      const audience = typeof target_audience === 'string' 
        ? JSON.parse(target_audience) 
        : target_audience;

      if (audience.status) {
        customerQuery += ` AND status = ANY($${params.length + 1})`;
        params.push(audience.status);
      }

      if (audience.source) {
        customerQuery += ` AND source = ANY($${params.length + 1})`;
        params.push(audience.source);
      }
    }

    const customers = await db.query(customerQuery, params);

    // 为每个客户创建消息记录
    for (const customer of customers.rows) {
      await db.query(`
        INSERT INTO campaign_messages (campaign_id, customer_id, status)
        VALUES ($1, $2, 'pending')
      `, [id, customer.id]);
    }

    // 更新活动状态
    await db.query(`
      UPDATE campaigns 
      SET status = 'active', 
          started_at = CURRENT_TIMESTAMP,
          total_sent = $1
      WHERE id = $2
    `, [customers.rows.length, id]);

    res.json({
      message: 'Campaign started',
      totalRecipients: customers.rows.length
    });
  } catch (error) {
    console.error('Start campaign error:', error);
    res.status(500).json({ error: 'Failed to start campaign' });
  }
});

// 获取活动统计
router.get('/:id/stats', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
        COUNT(CASE WHEN status = 'opened' THEN 1 END) as opened,
        COUNT(CASE WHEN status = 'clicked' THEN 1 END) as clicked,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
      FROM campaign_messages
      WHERE campaign_id = $1
    `, [id]);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get campaign stats error:', error);
    res.status(500).json({ error: 'Failed to fetch campaign stats' });
  }
});

module.exports = router;
