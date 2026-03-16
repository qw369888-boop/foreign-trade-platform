# 外贸独立站部署指南

## 🚀 快速部署

### 方案一：Vercel 部署（推荐）

1. **准备工作**
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel
   
   # 登录 Vercel
   vercel login
   ```

2. **部署前端**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **部署后端**
   ```bash
   cd backend
   vercel --prod
   ```

### 方案二：VPS 服务器部署

1. **服务器要求**
   - Ubuntu 20.04+ / CentOS 7+
   - Node.js 18+
   - 2GB+ RAM
   - 20GB+ 存储

2. **部署步骤**
   ```bash
   # 克隆项目
   git clone <your-repo-url>
   cd foreign-trade-platform
   
   # 运行部署脚本
   chmod +x deploy.sh
   ./deploy.sh
   ```

## 🔧 环境配置

### 必需的环境变量

```env
# API地址
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_URL=https://your-site-domain.com

# 数据库
DATABASE_URL=mysql://user:pass@host:port/db

# 支付配置
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=your_paypal_id

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 📊 功能清单

### ✅ 已完成功能

- **前端展示**
  - 🏠 首页展示（Hero、产品、公司介绍）
  - 🛍️ 产品页面（168个产品，分类筛选）
  - 🛒 购物车功能
  - 🌐 中英文双语
  - 📱 响应式设计

- **管理后台**
  - 📊 实时数据统计
  - 🌍 在线用户IP监控
  - 📅 日期筛选查询
  - 👥 访客行为分析
  - 🛒 订单管理
  - 💰 收入统计
  - 🔄 退款管理

- **后端API**
  - 🔐 用户认证系统
  - 📦 产品管理API
  - 🛒 订单处理API
  - 📊 统计分析API
  - 🗄️ SQLite数据库

### 🔐 管理员账号

- **邮箱**: admin@example.com
- **密码**: admin123
- **后台**: https://your-domain.com/admin

## 🌐 域名配置

### DNS 设置
```
A记录: @ -> Vercel IP
CNAME: www -> your-app.vercel.app
```

### SSL证书
Vercel自动提供免费SSL证书

## 📈 SEO优化

### 已配置项目
- Meta标签优化
- 多语言支持
- 响应式设计
- 快速加载优化

### 建议添加
- Google Analytics
- Google Search Console
- 网站地图
- 结构化数据

## 🔧 维护指南

### 日常维护
- 定期备份数据库
- 监控服务器性能
- 更新依赖包
- 查看访客统计

### 故障排查
- 检查服务器日志
- 验证API连接
- 测试支付功能
- 确认邮件发送

## 📞 技术支持

如需技术支持，请联系开发团队。

---
*部署时间: 2026-03-16*
*版本: v1.0.0*