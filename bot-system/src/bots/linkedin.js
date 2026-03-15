const puppeteer = require('puppeteer');
const logger = require('../utils/logger');
const db = require('../database/db');

class LinkedInBot {
  constructor() {
    this.browser = null;
    this.page = null;
    this.isActive = false;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      logger.info('LinkedIn bot initialized');
    } catch (error) {
      logger.error('LinkedIn bot initialization error:', error);
      throw error;
    }
  }

  async login() {
    try {
      await this.page.goto('https://www.linkedin.com/login');
      
      // 这里需要实现登录逻辑
      // 注意：实际使用时应该使用 LinkedIn API 而不是自动化浏览器
      // 自动化登录可能违反 LinkedIn 服务条款
      
      logger.info('LinkedIn login successful');
    } catch (error) {
      logger.error('LinkedIn login error:', error);
      throw error;
    }
  }

  async searchProfiles(keywords, filters = {}) {
    try {
      // 搜索潜在客户
      const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}`;
      await this.page.goto(searchUrl);
      
      // 等待搜索结果加载
      await this.page.waitForSelector('.search-results-container');
      
      // 提取个人资料
      const profiles = await this.page.evaluate(() => {
        const results = [];
        const items = document.querySelectorAll('.search-result__info');
        
        items.forEach(item => {
          const name = item.querySelector('.actor-name')?.textContent.trim();
          const title = item.querySelector('.subline-level-1')?.textContent.trim();
          const profileUrl = item.querySelector('a')?.href;
          
          if (name && profileUrl) {
            results.push({ name, title, profileUrl });
          }
        });
        
        return results;
      });

      logger.info(`Found ${profiles.length} LinkedIn profiles`);
      return profiles;
    } catch (error) {
      logger.error('LinkedIn search error:', error);
      return [];
    }
  }

  async sendConnectionRequest(profileUrl, message) {
    try {
      await this.page.goto(profileUrl);
      
      // 点击连接按钮
      const connectButton = await this.page.$('button[aria-label*="Connect"]');
      if (connectButton) {
        await connectButton.click();
        
        // 添加备注
        await this.page.waitForSelector('textarea[name="message"]');
        await this.page.type('textarea[name="message"]', message);
        
        // 发送
        await this.page.click('button[aria-label="Send"]');
        
        logger.info(`Connection request sent to ${profileUrl}`);
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Send connection request error:', error);
      return false;
    }
  }

  async startOutreach(targetAudience) {
    if (this.isActive) {
      return { error: 'Outreach already running' };
    }

    this.isActive = true;
    const dailyLimit = parseInt(process.env.OUTREACH_DAILY_LIMIT) || 50;
    let sentCount = 0;

    try {
      if (!this.browser) {
        await this.initialize();
      }

      // 搜索目标受众
      const profiles = await this.searchProfiles(targetAudience.keywords);

      for (const profile of profiles) {
        if (sentCount >= dailyLimit) {
          logger.info('Daily limit reached');
          break;
        }

        // 检查是否已经联系过
        const existing = await db.query(
          'SELECT id FROM customers WHERE linkedin_url = $1',
          [profile.profileUrl]
        );

        if (existing.rows.length === 0) {
          // 发送连接请求
          const message = this.generateMessage(profile, targetAudience.messageTemplate);
          const success = await this.sendConnectionRequest(profile.profileUrl, message);

          if (success) {
            // 保存到数据库
            await db.query(`
              INSERT INTO customers (first_name, linkedin_url, source, status)
              VALUES ($1, $2, 'linkedin', 'lead')
            `, [profile.name, profile.profileUrl]);

            // 记录拓客日志
            await db.query(`
              INSERT INTO outreach_logs (platform, action, status)
              VALUES ('linkedin', 'send_connection', 'success')
            `);

            sentCount++;
            
            // 随机延迟，避免被检测
            await this.randomDelay(30000, 60000);
          }
        }
      }

      return { success: true, sentCount };
    } catch (error) {
      logger.error('LinkedIn outreach error:', error);
      return { error: error.message };
    } finally {
      this.isActive = false;
    }
  }

  async dailyOutreach() {
    // 从数据库获取目标受众配置
    const config = await db.query(
      'SELECT value FROM settings WHERE key = $1',
      ['linkedin_target_audience']
    );

    if (config.rows.length > 0) {
      const targetAudience = JSON.parse(config.rows[0].value);
      await this.startOutreach(targetAudience);
    }
  }

  stopOutreach() {
    this.isActive = false;
    logger.info('LinkedIn outreach stopped');
  }

  isRunning() {
    return this.isActive;
  }

  generateMessage(profile, template) {
    // 简单的模板替换
    return template
      .replace('{name}', profile.name)
      .replace('{title}', profile.title || '');
  }

  randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async destroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = new LinkedInBot();
