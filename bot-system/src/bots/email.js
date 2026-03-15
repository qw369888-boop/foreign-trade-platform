const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const db = require('../database/db');

class EmailBot {
  constructor() {
    this.transporter = null;
    this.isActive = false;
  }

  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      logger.info('Email bot initialized');
    } catch (error) {
      logger.error('Email bot initialization error:', error);
      throw error;
    }
  }

  async sendEmail(to, subject, html, text) {
    if (!this.transporter) {
      this.initialize();
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html
      });

      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Send email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendCampaign(campaignId) {
    this.isActive = true;

    try {
      // 获取活动信息
      const campaign = await db.query(
        'SELECT * FROM campaigns WHERE id = $1',
        [campaignId]
      );

      if (campaign.rows.length === 0) {
        throw new Error('Campaign not found');
      }

      const { subject, content } = campaign.rows[0];

      // 获取待发送的消息
      const messages = await db.query(`
        SELECT cm.id, cm.customer_id, c.email, c.first_name, c.last_name
        FROM campaign_messages cm
        JOIN customers c ON cm.customer_id = c.id
        WHERE cm.campaign_id = $1 AND cm.status = 'pending'
      `, [campaignId]);

      let sentCount = 0;
      let failedCount = 0;

      for (const message of messages.rows) {
        try {
          // 个性化内容
          const personalizedContent = this.personalizeContent(content, {
            firstName: message.first_name,
            lastName: message.last_name
          });

          // 发送邮件
          const result = await this.sendEmail(
            message.email,
            subject,
            personalizedContent,
            personalizedContent.replace(/<[^>]*>/g, '') // 移除 HTML 标签作为纯文本
          );

          if (result.success) {
            // 更新消息状态
            await db.query(`
              UPDATE campaign_messages 
              SET status = 'sent', sent_at = CURRENT_TIMESTAMP
              WHERE id = $1
            `, [message.id]);

            sentCount++;
          } else {
            await db.query(`
              UPDATE campaign_messages 
              SET status = 'failed', error_message = $1
              WHERE id = $2
            `, [result.error, message.id]);

            failedCount++;
          }

          // 延迟避免被标记为垃圾邮件
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          logger.error(`Failed to send email to ${message.email}:`, error);
          failedCount++;
        }
      }

      // 更新活动统计
      await db.query(`
        UPDATE campaigns 
        SET total_sent = total_sent + $1
        WHERE id = $2
      `, [sentCount, campaignId]);

      logger.info(`Campaign ${campaignId} completed: ${sentCount} sent, ${failedCount} failed`);

      return { sentCount, failedCount };
    } catch (error) {
      logger.error('Send campaign error:', error);
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  personalizeContent(content, data) {
    let personalized = content;

    // 替换占位符
    personalized = personalized.replace(/\{firstName\}/g, data.firstName || '');
    personalized = personalized.replace(/\{lastName\}/g, data.lastName || '');
    personalized = personalized.replace(/\{fullName\}/g, `${data.firstName || ''} ${data.lastName || ''}`.trim());

    return personalized;
  }

  async sendWelcomeEmail(email, firstName) {
    const subject = 'Welcome to Our Store!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome, ${firstName}!</h1>
        <p>Thank you for joining our store. We're excited to have you as part of our community.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Browse our latest products</li>
          <li>Get exclusive member discounts</li>
          <li>Track your orders easily</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/products" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Start Shopping
        </a>
        <p style="margin-top: 30px; color: #666;">
          If you have any questions, feel free to contact us at ${process.env.EMAIL_FROM}
        </p>
      </div>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendOrderConfirmation(email, orderData) {
    const subject = `Order Confirmation - ${orderData.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Order Confirmed!</h1>
        <p>Thank you for your order. We've received your payment and are preparing your items for shipment.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Total:</strong> $${orderData.total}</p>
          <p><strong>Estimated Delivery:</strong> ${orderData.estimatedDelivery}</p>
        </div>

        <a href="${process.env.FRONTEND_URL}/orders/${orderData.orderNumber}" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Track Your Order
        </a>
      </div>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendFollowUpEmail(customerId) {
    try {
      const customer = await db.query(
        'SELECT * FROM customers WHERE id = $1',
        [customerId]
      );

      if (customer.rows.length === 0) {
        return { success: false, error: 'Customer not found' };
      }

      const { email, first_name } = customer.rows[0];

      const subject = 'Following up on our conversation';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Hi ${first_name},</h1>
          <p>I wanted to follow up on our recent conversation.</p>
          <p>Do you have any questions about our products or services? I'm here to help!</p>
          <p>Feel free to reply to this email or schedule a call at your convenience.</p>
          <p>Best regards,<br>Your Sales Team</p>
        </div>
      `;

      const result = await this.sendEmail(email, subject, html);

      if (result.success) {
        // 记录互动
        await db.query(`
          INSERT INTO interactions (customer_id, type, channel, subject, content, direction, status, completed_at)
          VALUES ($1, 'email', 'email', $2, $3, 'outbound', 'completed', CURRENT_TIMESTAMP)
        `, [customerId, subject, html]);
      }

      return result;
    } catch (error) {
      logger.error('Send follow-up email error:', error);
      return { success: false, error: error.message };
    }
  }

  isRunning() {
    return this.isActive;
  }
}

module.exports = new EmailBot();
