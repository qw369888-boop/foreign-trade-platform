# 快速启动指南

## 🚀 5 分钟快速启动

### 前提条件
- 已安装 Docker 和 Docker Compose
- 已安装 Node.js 18+（手动启动时需要）

### 使用 Docker（推荐）

```bash
# 1. 进入项目目录
cd foreign-trade-platform

# 2. 复制环境变量文件
cp .env.example .env

# 3. 编辑 .env 文件（至少修改数据库密码和 JWT_SECRET）
nano .env

# 4. 启动所有服务
docker-compose up -d

# 5. 初始化数据库
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# 6. 访问系统
# 前端: http://localhost:3000
# 后端: http://localhost:4000
# 机器人: http://localhost:5000
```

### 手动启动

```bash
# 1. 安装依赖
cd backend && npm install
cd ../frontend && npm install
cd ../bot-system && npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 启动 PostgreSQL（如果未安装）
# Ubuntu: sudo apt-get install postgresql
# macOS: brew install postgresql

# 4. 初始化数据库
cd backend
npm run db:migrate
npm run db:seed

# 5. 启动服务（分别在不同终端）
cd backend && npm run dev      # 端口 4000
cd frontend && npm run dev     # 端口 3000
cd bot-system && npm run dev   # 端口 5000
```

## 📝 必须配置的环境变量

打开 `.env` 文件，至少修改以下配置：

```bash
# 1. 数据库密码（必须修改）
DATABASE_URL="postgresql://postgres:YOUR_STRONG_PASSWORD@localhost:5432/foreign_trade_db"

# 2. JWT 密钥（必须修改）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 3. 支付网关（如果需要支付功能）
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# 4. 邮件服务（如果需要发送邮件）
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🧪 测试系统

### 1. 检查服务状态

```bash
# 检查后端
curl http://localhost:4000/health

# 检查机器人系统
curl http://localhost:5000/health
```

### 2. 访问前端

打开浏览器访问 http://localhost:3000

### 3. 登录管理后台

默认管理员账户：
- 邮箱: `admin@example.com`
- 密码: `admin123`

**重要**: 生产环境请立即修改默认密码！

## 📚 下一步

- 阅读 [部署指南](docs/DEPLOYMENT.md) 了解生产环境部署
- 阅读 [配置说明](docs/CONFIGURATION.md) 了解详细配置
- 阅读 [机器人使用手册](docs/BOT_MANUAL.md) 了解运营机器人
- 阅读 [数据库设计](docs/DATABASE.md) 了解数据结构

## ❓ 常见问题

### 端口被占用

```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :4000

# 修改端口（在 .env 中）
PORT=4001
```

### 数据库连接失败

```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 启动 PostgreSQL
sudo systemctl start postgresql

# 测试连接
psql -h localhost -U postgres -d foreign_trade_db
```

### Docker 启动失败

```bash
# 查看日志
docker-compose logs

# 重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🆘 获取帮助

如遇到问题：
1. 查看日志文件：`logs/` 目录
2. 查看详细文档：`docs/` 目录
3. 检查环境变量配置

## 🔒 安全提醒

生产环境部署前必须：
1. 修改所有默认密码
2. 使用强 JWT 密钥
3. 启用 HTTPS
4. 配置防火墙
5. 定期备份数据库

## 📦 项目结构

```
foreign-trade-platform/
├── frontend/           # Next.js 前端
├── backend/            # Node.js 后端 API
├── bot-system/         # 运营机器人系统
├── database/           # 数据库脚本
├── docs/               # 详细文档
├── docker-compose.yml  # Docker 配置
├── .env.example        # 环境变量模板
└── README.md           # 本文件
```

## 🎯 核心功能

✅ 多语言外贸网站（中英日韩德法）  
✅ 在线支付（PayPal、Stripe、支付宝）  
✅ 产品展示和购物车  
✅ 订单管理系统  
✅ 响应式设计 + SEO 优化  
✅ LinkedIn/Facebook/Instagram 自动拓客  
✅ CRM 客户管理  
✅ 自动跟进系统  
✅ WhatsApp 自动回复  
✅ 邮件营销  
✅ 数据分析仪表板  

## 📄 许可证

MIT License

---

**祝您使用愉快！** 🎉
