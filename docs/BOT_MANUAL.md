# 机器人系统使用手册

本文档详细说明如何配置和使用外贸运营机器人系统。

## 目录
- [系统概述](#系统概述)
- [快速开始](#快速开始)
- [自动拓客](#自动拓客)
- [CRM 客户管理](#crm-客户管理)
- [自动跟进系统](#自动跟进系统)
- [WhatsApp 自动回复](#whatsapp-自动回复)
- [邮件营销](#邮件营销)
- [社交媒体管理](#社交媒体管理)
- [数据分析](#数据分析)
- [最佳实践](#最佳实践)

## 系统概述

运营机器人系统提供以下核心功能：

1. **自动拓客** - LinkedIn/Facebook/Instagram 自动化获客
2. **CRM 管理** - 客户信息管理和跟进
3. **自动跟进** - 智能客户跟进系统
4. **WhatsApp 自动回复** - 24/7 自动客服
5. **邮件营销** - 批量邮件发送和跟踪
6. **社交媒体管理** - 定时发布和互动
7. **数据分析** - 实时数据仪表板

## 快速开始

### 1. 启动机器人系统

```bash
# Docker 方式
docker-compose up -d bot-system

# 手动方式
cd bot-system
npm install
npm start
```

### 2. 访问管理界面

访问 `http://localhost:5000/health` 检查服务状态。

### 3. 配置 API 密钥

编辑 `.env` 文件，配置社交媒体 API 密钥：

```bash
LINKEDIN_CLIENT_ID=your-id
LINKEDIN_CLIENT_SECRET=your-secret
FACEBOOK_APP_ID=your-id
FACEBOOK_APP_SECRET=your-secret
WHATSAPP_ACCESS_TOKEN=your-token
```

## 自动拓客

### LinkedIn 自动拓客

#### 配置目标受众

```javascript
// 通过 API 配置
POST /api/outreach/start
{
  "platform": "linkedin",
  "targetAudience": {
    "keywords": "import export manager",
    "messageTemplate": "Hi {name}, I noticed your experience in {title}. I'd love to connect and discuss potential business opportunities."
  }
}
```

#### 工作流程

1. **搜索潜在客户** - 根据关键词搜索
2. **发送连接请求** - 自动发送个性化消息
3. **保存到 CRM** - 自动创建客户记录
4. **记录日志** - 跟踪所有操作

#### 限制和建议

- **每日限制**: 50 个连接请求（可配置）
- **间隔时间**: 30-60 秒随机延迟
- **消息个性化**: 使用 {name}、{title} 等占位符
- **合规性**: 遵守 LinkedIn 服务条款

**注意**: LinkedIn 对自动化工具有严格限制，建议使用官方 API 或手动操作。

### Facebook 自动拓客

```javascript
POST /api/outreach/start
{
  "platform": "facebook",
  "targetAudience": {
    "interests": ["import", "export", "wholesale"],
    "location": "United States"
  }
}
```

### Instagram 自动拓客

```javascript
POST /api/outreach/start
{
  "platform": "instagram",
  "targetAudience": {
    "hashtags": ["importexport", "wholesale", "b2b"],
    "action": "like_and_comment"
  }
}
```

### 停止自动拓客

```javascript
POST /api/outreach/stop
{
  "platform": "linkedin"
}
```

## CRM 客户管理

### 客户生命周期

```
Lead（潜在客户）→ Prospect（意向客户）→ Customer（成交客户）→ Inactive（流失客户）
```

### 添加客户

```javascript
POST /api/customers
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "company": "ABC Trading Co.",
  "position": "Purchasing Manager",
  "linkedinUrl": "https://linkedin.com/in/johnsmith",
  "source": "linkedin",
  "status": "lead",
  "tags": ["electronics", "high-value"],
  "notes": "Interested in bulk orders"
}
```

### 更新客户状态

```javascript
PUT /api/customers/123
{
  "status": "prospect",
  "nextFollowUpDate": "2024-01-15"
}
```

### 查看客户详情

```javascript
GET /api/customers/123

// 返回
{
  "id": 123,
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "status": "prospect",
  "totalOrders": 2,
  "totalSpent": 5000,
  "recentInteractions": [...],
  "recentOrders": [...]
}
```

## 自动跟进系统

### 配置跟进规则

在 `.env` 中配置：

```bash
CRM_AUTO_FOLLOW_UP=true
FOLLOW_UP_DAYS=3,7,14
```

### 跟进流程

1. **第 3 天**: 首次跟进邮件
2. **第 7 天**: 第二次跟进（如果未回复）
3. **第 14 天**: 最后跟进

### 手动触发跟进

```javascript
POST /api/customers/123/interactions
{
  "type": "email",
  "channel": "email",
  "subject": "Following up on our conversation",
  "content": "Hi John, just wanted to check if you had any questions...",
  "direction": "outbound",
  "status": "completed"
}
```

### 查看待跟进客户

```javascript
GET /api/customers/follow-up/pending

// 返回需要跟进的客户列表
[
  {
    "id": 123,
    "name": "John Smith",
    "nextFollowUpDate": "2024-01-10",
    "lastContactDate": "2024-01-03"
  }
]
```

## WhatsApp 自动回复

### 初始化 WhatsApp Bot

首次启动时，需要扫描二维码：

```bash
cd bot-system
npm start

# 使用 WhatsApp 扫描终端显示的二维码
```

### 配置自动回复规则

编辑 `bot-system/src/bots/whatsapp.js`：

```javascript
const keywords = {
  'hello': 'Hello! How can I help you today?',
  'price': 'Please visit our website for pricing: https://yourstore.com',
  'order': 'To check your order, please provide your order number.',
  'shipping': 'We offer worldwide shipping (5-15 business days).',
  'payment': 'We accept PayPal, credit cards, and Alipay.'
};
```

### 发送单条消息

```javascript
// 通过 API
POST /api/whatsapp/send
{
  "phoneNumber": "+1234567890",
  "message": "Hello! Your order has been shipped."
}
```

### 批量发送消息

```javascript
POST /api/whatsapp/bulk-send
{
  "recipients": [
    { "phoneNumber": "+1234567890" },
    { "phoneNumber": "+0987654321" }
  ],
  "message": "Special offer: 20% off all products this week!"
}
```

### 启用/禁用自动回复

```javascript
POST /api/whatsapp/auto-reply
{
  "enabled": true
}
```

### 最佳实践

- **响应时间**: 尽快回复（建议 5 分钟内）
- **个性化**: 使用客户名字
- **避免垃圾信息**: 不要频繁发送营销消息
- **遵守规定**: 遵守 WhatsApp 商业政策

## 邮件营销

### 创建营销活动

```javascript
POST /api/campaigns
{
  "name": "New Year Promotion",
  "type": "email",
  "targetAudience": {
    "status": ["lead", "prospect"],
    "source": ["linkedin", "facebook"]
  },
  "subject": "Special New Year Offer - 20% Off!",
  "content": "<html>...</html>",
  "scheduledAt": "2024-01-01T09:00:00Z"
}
```

### 启动营销活动

```javascript
POST /api/campaigns/123/start

// 系统会自动：
// 1. 筛选目标客户
// 2. 发送个性化邮件
// 3. 跟踪打开和点击
// 4. 更新统计数据
```

### 查看活动统计

```javascript
GET /api/campaigns/123/stats

// 返回
{
  "total": 1000,
  "sent": 950,
  "delivered": 920,
  "opened": 350,
  "clicked": 120,
  "failed": 50,
  "openRate": 38.04,
  "clickRate": 34.29
}
```

### 邮件模板变量

在邮件内容中使用：

- `{firstName}` - 客户名字
- `{lastName}` - 客户姓氏
- `{fullName}` - 全名
- `{company}` - 公司名称

示例：

```html
<h1>Hi {firstName},</h1>
<p>We noticed you're from {company}...</p>
```

### 邮件最佳实践

1. **主题行**
   - 简短有力（50 字符以内）
   - 避免垃圾词汇（FREE、!!!）
   - 个性化

2. **内容**
   - 移动端友好
   - 清晰的 CTA（行动号召）
   - 包含退订链接

3. **发送时间**
   - 工作日上午 10-11 点
   - 避免周末和节假日

4. **频率**
   - 每周不超过 2 次
   - 根据用户行为调整

## 社交媒体管理

### 发布帖子

```javascript
POST /api/social/post
{
  "platform": "linkedin",
  "content": "Excited to announce our new product line! #B2B #Trade",
  "mediaUrls": ["https://example.com/image.jpg"],
  "scheduledAt": "2024-01-10T14:00:00Z"
}
```

### 支持的平台

- **LinkedIn**: 文字、图片、视频
- **Facebook**: 文字、图片、视频、链接
- **Instagram**: 图片、视频（需要商业账户）
- **Twitter**: 文字、图片、视频（280 字符限制）

### 定时发布

```javascript
// 每天下午 2 点发布
POST /api/social/schedule
{
  "platform": "linkedin",
  "content": "Daily tip: ...",
  "schedule": "0 14 * * *"  // Cron 表达式
}
```

### 查看帖子表现

```javascript
GET /api/social/posts/123

// 返回
{
  "id": 123,
  "platform": "linkedin",
  "content": "...",
  "publishedAt": "2024-01-10T14:00:00Z",
  "likes": 45,
  "comments": 12,
  "shares": 8
}
```

## 数据分析

### 访问仪表板

```javascript
GET /api/dashboard

// 返回
{
  "customers": {
    "total": 1500,
    "leads": 800,
    "prospects": 400,
    "customers": 300
  },
  "orders": {
    "totalOrders": 250,
    "totalRevenue": 125000,
    "averageOrderValue": 500
  },
  "outreach": [
    { "platform": "linkedin", "total": 150, "successful": 120 }
  ],
  "campaigns": {
    "totalCampaigns": 5,
    "totalEmailsSent": 5000,
    "totalOpened": 1900,
    "totalClicked": 650
  }
}
```

### 获取详细分析

```javascript
GET /api/analytics?startDate=2024-01-01&endDate=2024-01-31

// 返回
{
  "orderTrend": [
    { "date": "2024-01-01", "orders": 10, "revenue": 5000 }
  ],
  "customerSources": [
    { "source": "linkedin", "count": 150 },
    { "source": "facebook", "count": 80 }
  ],
  "topProducts": [
    { "productName": "Product A", "totalSold": 100, "totalRevenue": 10000 }
  ],
  "conversionRate": 15.5
}
```

### 客户生命周期价值

```javascript
GET /api/analytics/customer-lifetime-value

// 返回前 100 名高价值客户
[
  {
    "id": 123,
    "email": "john@example.com",
    "totalOrders": 15,
    "lifetimeValue": 25000,
    "averageOrderValue": 1666.67
  }
]
```

## 最佳实践

### 1. 自动化与人工结合

- **自动化**: 初步筛选、定时跟进、数据收集
- **人工**: 重要客户沟通、复杂问题处理、关系维护

### 2. 数据驱动决策

- 定期查看分析报告
- 根据转化率优化策略
- A/B 测试邮件主题和内容

### 3. 合规性

- 遵守 GDPR、CAN-SPAM 等法规
- 提供退订选项
- 保护客户隐私

### 4. 持续优化

- 监控机器人表现
- 收集客户反馈
- 定期更新话术和模板

### 5. 安全措施

- 定期更换 API 密钥
- 限制访问权限
- 备份客户数据

## 故障排查

### WhatsApp 连接失败

```bash
# 删除会话数据重新登录
rm -rf .wwebjs_auth
npm start
# 重新扫描二维码
```

### LinkedIn 拓客失败

- 检查 API 密钥是否有效
- 确认未超过每日限制
- 查看日志文件：`logs/bot-combined.log`

### 邮件发送失败

```bash
# 测试 SMTP 连接
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

### 查看日志

```bash
# 实时日志
pm2 logs bot-system

# 错误日志
tail -f bot-system/logs/bot-error.log
```

## 定时任务

系统自动执行以下任务：

- **每天 9:00**: 自动拓客
- **每小时**: 检查待跟进客户
- **每天 22:00**: 生成日报

### 自定义定时任务

编辑 `bot-system/src/index.js`：

```javascript
const cron = require('node-cron');

// 每周一上午 10 点发送周报
cron.schedule('0 10 * * 1', async () => {
  await analyticsService.generateWeeklyReport();
});
```

## API 参考

完整 API 文档请参考 [API.md](API.md)。

## 支持

如有问题：
- 查看日志文件
- 参考 [配置说明](CONFIGURATION.md)
- 参考 [部署指南](DEPLOYMENT.md)
