const logger = require('../utils/logger');
const db = require('../database/db');

class AnalyticsService {
  async getDashboardStats() {
    try {
      // 客户统计
      const customerStats = await db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'lead' THEN 1 END) as leads,
          COUNT(CASE WHEN status = 'prospect' THEN 1 END) as prospects,
          COUNT(CASE WHEN status = 'customer' THEN 1 END) as customers
        FROM customers
      `);

      // 订单统计
      const orderStats = await db.query(`
        SELECT 
          COUNT(*) as total_orders,
          SUM(total) as total_revenue,
          AVG(total) as average_order_value,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
          COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders
        FROM orders
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `);

      // 拓客统计
      const outreachStats = await db.query(`
        SELECT 
          platform,
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'success' THEN 1 END) as successful
        FROM outreach_logs
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY platform
      `);

      // 营销活动统计
      const campaignStats = await db.query(`
        SELECT 
          COUNT(*) as total_campaigns,
          SUM(total_sent) as total_emails_sent,
          SUM(total_opened) as total_opened,
          SUM(total_clicked) as total_clicked
        FROM campaigns
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `);

      // 互动统计
      const interactionStats = await db.query(`
        SELECT 
          type,
          COUNT(*) as count
        FROM interactions
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY type
      `);

      return {
        customers: customerStats.rows[0],
        orders: orderStats.rows[0],
        outreach: outreachStats.rows,
        campaigns: campaignStats.rows[0],
        interactions: interactionStats.rows,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  async getAnalytics(startDate, endDate) {
    try {
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const end = endDate || new Date().toISOString();

      // 每日订单趋势
      const orderTrend = await db.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as orders,
          SUM(total) as revenue
        FROM orders
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY DATE(created_at)
        ORDER BY date
      `, [start, end]);

      // 客户获取渠道
      const customerSources = await db.query(`
        SELECT 
          source,
          COUNT(*) as count
        FROM customers
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY source
      `, [start, end]);

      // 产品销售排行
      const topProducts = await db.query(`
        SELECT 
          oi.product_name,
          SUM(oi.quantity) as total_sold,
          SUM(oi.total) as total_revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at BETWEEN $1 AND $2
        GROUP BY oi.product_name
        ORDER BY total_sold DESC
        LIMIT 10
      `, [start, end]);

      // 转化率
      const conversionRate = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM customers WHERE status = 'customer' AND created_at BETWEEN $1 AND $2) * 100.0 /
          NULLIF((SELECT COUNT(*) FROM customers WHERE created_at BETWEEN $1 AND $2), 0) as conversion_rate
      `, [start, end]);

      return {
        orderTrend: orderTrend.rows,
        customerSources: customerSources.rows,
        topProducts: topProducts.rows,
        conversionRate: conversionRate.rows[0]?.conversion_rate || 0,
        period: { start, end }
      };
    } catch (error) {
      logger.error('Get analytics error:', error);
      throw error;
    }
  }

  async generateDailyReport() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // 今日统计
      const todayStats = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM customers WHERE DATE(created_at) = $1) as new_customers,
          (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = $1) as new_orders,
          (SELECT COALESCE(SUM(total), 0) FROM orders WHERE DATE(created_at) = $1) as revenue,
          (SELECT COUNT(*) FROM outreach_logs WHERE DATE(created_at) = $1 AND status = 'success') as successful_outreach
      `, [today]);

      const report = {
        date: today,
        stats: todayStats.rows[0],
        generatedAt: new Date().toISOString()
      };

      logger.info('Daily report generated:', report);

      // 可以发送报告邮件给管理员
      // await emailBot.sendEmail(adminEmail, 'Daily Report', reportHtml);

      return report;
    } catch (error) {
      logger.error('Generate daily report error:', error);
      throw error;
    }
  }

  async getCustomerLifetimeValue() {
    try {
      const clv = await db.query(`
        SELECT 
          c.id,
          c.email,
          c.first_name,
          c.last_name,
          COUNT(o.id) as total_orders,
          COALESCE(SUM(o.total), 0) as lifetime_value,
          COALESCE(AVG(o.total), 0) as average_order_value
        FROM customers c
        LEFT JOIN orders o ON c.user_id = o.user_id
        WHERE c.status = 'customer'
        GROUP BY c.id
        ORDER BY lifetime_value DESC
        LIMIT 100
      `);

      return clv.rows;
    } catch (error) {
      logger.error('Get customer lifetime value error:', error);
      throw error;
    }
  }

  async getCampaignPerformance(campaignId) {
    try {
      const performance = await db.query(`
        SELECT 
          c.name,
          c.type,
          c.total_sent,
          c.total_opened,
          c.total_clicked,
          c.total_converted,
          CASE WHEN c.total_sent > 0 
            THEN (c.total_opened * 100.0 / c.total_sent) 
            ELSE 0 
          END as open_rate,
          CASE WHEN c.total_opened > 0 
            THEN (c.total_clicked * 100.0 / c.total_opened) 
            ELSE 0 
          END as click_rate,
          CASE WHEN c.total_sent > 0 
            THEN (c.total_converted * 100.0 / c.total_sent) 
            ELSE 0 
          END as conversion_rate
        FROM campaigns c
        WHERE c.id = $1
      `, [campaignId]);

      return performance.rows[0];
    } catch (error) {
      logger.error('Get campaign performance error:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
