require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const logger = require('./utils/logger');

// 导入模块
const linkedinBot = require('./bots/linkedin');
const facebookBot = require('./bots/facebook');
const instagramBot = require('./bots/instagram');
const whatsappBot = require('./bots/whatsapp');
const emailBot = require('./bots/email');
const crmService = require('./services/crm');
const analyticsService = require('./services/analytics');

const app = express();
const PORT = process.env.BOT_PORT || 5000;

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      linkedin: linkedinBot.isRunning(),
      facebook: facebookBot.isRunning(),
      instagram: instagramBot.isRunning(),
      whatsapp: whatsappBot.isRunning(),
      email: emailBot.isRunning()
    }
  });
});

// API 路由
app.get('/api/dashboard', async (req, res) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    logger.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// 启动自动拓客
app.post('/api/outreach/start', async (req, res) => {
  const { platform, targetAudience } = req.body;

  try {
    let result;
    switch (platform) {
      case 'linkedin':
        result = await linkedinBot.startOutreach(targetAudience);
        break;
      case 'facebook':
        result = await facebookBot.startOutreach(targetAudience);
        break;
      case 'instagram':
        result = await instagramBot.startOutreach(targetAudience);
        break;
      default:
        return res.status(400).json({ error: 'Invalid platform' });
    }

    res.json({ message: 'Outreach started', result });
  } catch (error) {
    logger.error('Start outreach error:', error);
    res.status(500).json({ error: 'Failed to start outreach' });
  }
});

// 停止自动拓客
app.post('/api/outreach/stop', async (req, res) => {
  const { platform } = req.body;

  try {
    switch (platform) {
      case 'linkedin':
        linkedinBot.stopOutreach();
        break;
      case 'facebook':
        facebookBot.stopOutreach();
        break;
      case 'instagram':
        instagramBot.stopOutreach();
        break;
    }

    res.json({ message: 'Outreach stopped' });
  } catch (error) {
    logger.error('Stop outreach error:', error);
    res.status(500).json({ error: 'Failed to stop outreach' });
  }
});

// 发送营销邮件
app.post('/api/email/send', async (req, res) => {
  const { campaignId } = req.body;

  try {
    const result = await emailBot.sendCampaign(campaignId);
    res.json({ message: 'Campaign sent', result });
  } catch (error) {
    logger.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send campaign' });
  }
});

// 获取分析数据
app.get('/api/analytics', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const data = await analyticsService.getAnalytics(startDate, endDate);
    res.json(data);
  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// 定时任务
if (process.env.AUTO_OUTREACH_ENABLED === 'true') {
  // 每天早上9点执行自动拓客
  cron.schedule('0 9 * * *', async () => {
    logger.info('Starting daily outreach...');
    try {
      await linkedinBot.dailyOutreach();
      await facebookBot.dailyOutreach();
      await instagramBot.dailyOutreach();
    } catch (error) {
      logger.error('Daily outreach error:', error);
    }
  });
}

// 每小时检查需要跟进的客户
cron.schedule('0 * * * *', async () => {
  logger.info('Checking follow-ups...');
  try {
    await crmService.checkFollowUps();
  } catch (error) {
    logger.error('Follow-up check error:', error);
  }
});

// 每天晚上生成分析报告
cron.schedule('0 22 * * *', async () => {
  logger.info('Generating daily report...');
  try {
    await analyticsService.generateDailyReport();
  } catch (error) {
    logger.error('Report generation error:', error);
  }
});

// 启动服务
app.listen(PORT, async () => {
  logger.info(`🤖 Bot system running on port ${PORT}`);
  
  // 初始化机器人
  try {
    if (process.env.WHATSAPP_ENABLED === 'true') {
      await whatsappBot.initialize();
      logger.info('WhatsApp bot initialized');
    }
  } catch (error) {
    logger.error('Bot initialization error:', error);
  }
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing bot system');
  whatsappBot.destroy();
  process.exit(0);
});
