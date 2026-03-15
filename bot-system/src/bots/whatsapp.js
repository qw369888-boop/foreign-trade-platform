const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../utils/logger');
const db = require('../database/db');

class WhatsAppBot {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.autoReplyEnabled = true;
  }

  async initialize() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      // 显示二维码
      this.client.on('qr', (qr) => {
        logger.info('WhatsApp QR Code received');
        qrcode.generate(qr, { small: true });
        console.log('Scan the QR code above with WhatsApp');
      });

      // 连接成功
      this.client.on('ready', () => {
        logger.info('WhatsApp bot is ready');
        this.isReady = true;
      });

      // 接收消息
      this.client.on('message', async (message) => {
        await this.handleMessage(message);
      });

      // 连接断开
      this.client.on('disconnected', (reason) => {
        logger.warn('WhatsApp disconnected:', reason);
        this.isReady = false;
      });

      await this.client.initialize();
    } catch (error) {
      logger.error('WhatsApp initialization error:', error);
      throw error;
    }
  }

  async handleMessage(message) {
    try {
      const contact = await message.getContact();
      const chatId = message.from;
      const messageBody = message.body.toLowerCase();

      logger.info(`Received message from ${contact.name || contact.number}: ${message.body}`);

      // 保存消息到数据库
      await this.saveMessage(chatId, contact, message.body, 'inbound');

      // 自动回复
      if (this.autoReplyEnabled) {
        const reply = await this.generateAutoReply(messageBody);
        
        if (reply) {
          await message.reply(reply);
          await this.saveMessage(chatId, contact, reply, 'outbound');
        }
      }

      // 检查是否是客户
      const customer = await db.query(
        'SELECT id FROM customers WHERE whatsapp_number = $1',
        [contact.number]
      );

      if (customer.rows.length > 0) {
        // 更新最后联系时间
        await db.query(
          'UPDATE customers SET last_contact_date = CURRENT_TIMESTAMP WHERE id = $1',
          [customer.rows[0].id]
        );

        // 记录互动
        await db.query(`
          INSERT INTO interactions (customer_id, type, channel, content, direction, status, completed_at)
          VALUES ($1, 'whatsapp', 'whatsapp', $2, 'inbound', 'completed', CURRENT_TIMESTAMP)
        `, [customer.rows[0].id, message.body]);
      }
    } catch (error) {
      logger.error('Handle WhatsApp message error:', error);
    }
  }

  async generateAutoReply(messageBody) {
    // 简单的关键词匹配自动回复
    const keywords = {
      'hello': 'Hello! How can I help you today?',
      'hi': 'Hi there! Welcome to our store. How may I assist you?',
      'price': 'Please visit our website for current pricing: https://yourstore.com/products',
      'order': 'To check your order status, please provide your order number.',
      'shipping': 'We offer worldwide shipping. Delivery time varies by location (5-15 business days).',
      'payment': 'We accept PayPal, credit cards, and Alipay.',
      'help': 'I\'m here to help! You can ask about products, orders, shipping, or payments.',
      'product': 'You can browse our products at: https://yourstore.com/products',
      'catalog': 'Please visit our catalog: https://yourstore.com/products',
      'contact': 'You can reach us via email at support@yourstore.com or call +1-234-567-8900'
    };

    for (const [keyword, reply] of Object.entries(keywords)) {
      if (messageBody.includes(keyword)) {
        return reply;
      }
    }

    // 默认回复
    return 'Thank you for your message! Our team will get back to you shortly. For immediate assistance, please visit our website or call our support line.';
  }

  async saveMessage(chatId, contact, content, direction) {
    try {
      // 这里可以保存到数据库或日志
      logger.info(`WhatsApp message saved: ${direction} - ${content}`);
    } catch (error) {
      logger.error('Save WhatsApp message error:', error);
    }
  }

  async sendMessage(phoneNumber, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp bot is not ready');
    }

    try {
      const chatId = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
      await this.client.sendMessage(chatId, message);
      
      logger.info(`Message sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      logger.error('Send WhatsApp message error:', error);
      return false;
    }
  }

  async sendBulkMessages(recipients, message) {
    const results = [];

    for (const recipient of recipients) {
      try {
        const success = await this.sendMessage(recipient.phoneNumber, message);
        results.push({ phoneNumber: recipient.phoneNumber, success });

        // 延迟避免被限制
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        results.push({ phoneNumber: recipient.phoneNumber, success: false, error: error.message });
      }
    }

    return results;
  }

  setAutoReply(enabled) {
    this.autoReplyEnabled = enabled;
    logger.info(`WhatsApp auto-reply ${enabled ? 'enabled' : 'disabled'}`);
  }

  isRunning() {
    return this.isReady;
  }

  async destroy() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
      logger.info('WhatsApp bot destroyed');
    }
  }
}

module.exports = new WhatsAppBot();
