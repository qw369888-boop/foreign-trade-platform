const logger = require('../utils/logger');
const db = require('../database/db');
const emailBot = require('../bots/email');

class CRMService {
  async checkFollowUps() {
    try {
      // 获取需要跟进的客户
      const customers = await db.query(`
        SELECT * FROM customers 
        WHERE next_follow_up_date <= CURRENT_DATE 
          AND status IN ('lead', 'prospect')
        ORDER BY next_follow_up_date ASC
        LIMIT 20
      `);

      logger.info(`Found ${customers.rows.length} customers needing follow-up`);

      for (const customer of customers.rows) {
        // 发送跟进邮件
        await emailBot.sendFollowUpEmail(customer.id);

        // 更新下次跟进时间（3天后）
        await db.query(`
          UPDATE customers 
          SET next_follow_up_date = CURRENT_DATE + INTERVAL '3 days',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `, [customer.id]);

        logger.info(`Follow-up sent to customer ${customer.id}`);
      }

      return { success: true, count: customers.rows.length };
    } catch (error) {
      logger.error('Check follow-ups error:', error);
      throw error;
    }
  }

  async updateCustomerStatus(customerId, newStatus) {
    try {
      await db.query(
        'UPDATE customers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newStatus, customerId]
      );

      logger.info(`Customer ${customerId} status updated to ${newStatus}`);
      return { success: true };
    } catch (error) {
      logger.error('Update customer status error:', error);
      throw error;
    }
  }

  async getCustomerInsights(customerId) {
    try {
      // 获取客户详情
      const customer = await db.query('SELECT * FROM customers WHERE id = $1', [customerId]);

      if (customer.rows.length === 0) {
        return null;
      }

      // 获取互动历史
      const interactions = await db.query(
        'SELECT * FROM interactions WHERE customer_id = $1 ORDER BY created_at DESC',
        [customerId]
      );

      // 获取订单历史
      const orders = await db.query(
        'SELECT * FROM orders WHERE user_id = (SELECT user_id FROM customers WHERE id = $1) ORDER BY created_at DESC',
        [customerId]
      );

      return {
        customer: customer.rows[0],
        interactions: interactions.rows,
        orders: orders.rows,
        totalInteractions: interactions.rows.length,
        totalOrders: orders.rows.length,
        totalSpent: orders.rows.reduce((sum, order) => sum + parseFloat(order.total), 0)
      };
    } catch (error) {
      logger.error('Get customer insights error:', error);
      throw error;
    }
  }

  async scoreLeads() {
    try {
      // 简单的潜在客户评分系统
      const customers = await db.query(`
        SELECT 
          c.*,
          COUNT(i.id) as interaction_count,
          COUNT(o.id) as order_count,
          COALESCE(SUM(o.total), 0) as total_spent
        FROM customers c
        LEFT JOIN interactions i ON c.id = i.customer_id
        LEFT JOIN orders o ON c.user_id = o.user_id
        WHERE c.status IN ('lead', 'prospect')
        GROUP BY c.id
      `);

      for (const customer of customers.rows) {
        let score = 0;

        // 互动次数加分
        score += customer.interaction_count * 5;

        // 订单数量加分
        score += customer.order_count * 20;

        // 消费金额加分
        score += Math.floor(customer.total_spent / 10);

        // 社交媒体信息加分
        if (customer.linkedin_url) score += 10;
        if (customer.facebook_url) score += 5;
        if (customer.instagram_url) score += 5;

        // 公司信息加分
        if (customer.company) score += 15;

        // 更新评分（可以添加 score 字段到数据库）
        logger.info(`Customer ${customer.id} score: ${score}`);
      }

      return { success: true, scored: customers.rows.length };
    } catch (error) {
      logger.error('Score leads error:', error);
      throw error;
    }
  }
}

module.exports = new CRMService();
