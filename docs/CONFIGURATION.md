# 配置说明

本文档详细说明所有环境变量和配置选项。

## 环境变量配置

### 数据库配置

```bash
# PostgreSQL 连接字符串
DATABASE_URL="postgresql://用户名:密码@主机:端口/数据库名"

# 示例
DATABASE_URL="postgresql://postgres:password@localhost:5432/foreign_trade_db"
```

### 后端服务配置

```bash
# 运行环境：development | production
NODE_ENV=production

# 后端服务端口
PORT=4000

# JWT 密钥（必须修改为强密码）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT 过期时间
JWT_EXPIRES_IN=7d

# 前端 URL（用于 CORS 和回调）
FRONTEND_URL=http://localhost:3000
```

### 支付网关配置

#### PayPal

```bash
# 模式：sandbox（测试） | production（生产）
PAYPAL_MODE=sandbox

# PayPal 客户端 ID
PAYPAL_CLIENT_ID=your-paypal-client-id

# PayPal 客户端密钥
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

**获取 PayPal 密钥：**
1. 访问 https://developer.paypal.com/
2. 登录并创建应用
3. 获取 Client ID 和 Secret
4. 生产环境需要通过审核

#### Stripe

```bash
# Stripe 公钥（前端使用）
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key

# Stripe 密钥（后端使用）
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# Webhook 密钥
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

**获取 Stripe 密钥：**
1. 访问 https://dashboard.stripe.com/
2. 注册账户
3. 在 Developers > API keys 获取密钥
4. 在 Developers > Webhooks 配置 webhook

**Stripe Webhook 配置：**
- URL: `https://yourdomain.com/api/payment/stripe/webhook`
- 事件: `payment_intent.succeeded`

#### 支付宝国际版

```bash
# 支付宝应用 ID
ALIPAY_APP_ID=your-alipay-app-id

# 支付宝私钥
ALIPAY_PRIVATE_KEY=your-alipay-private-key

# 支付宝公钥
ALIPAY_PUBLIC_KEY=your-alipay-public-key
```

**获取支付宝密钥：**
1. 访问 https://open.alipay.com/
2. 创建应用
3. 配置密钥（RSA2）

### 邮件服务配置

```bash
# SMTP 服务器
SMTP_HOST=smtp.gmail.com

# SMTP 端口
SMTP_PORT=587

# 是否使用 SSL
SMTP_SECURE=false

# SMTP 用户名
SMTP_USER=your-email@gmail.com

# SMTP 密码（Gmail 使用应用专用密码）
SMTP_PASSWORD=your-app-password

# 发件人地址
EMAIL_FROM=noreply@yourcompany.com
```

**Gmail 配置：**
1. 启用两步验证
2. 生成应用专用密码：https://myaccount.google.com/apppasswords
3. 使用应用专用密码作为 SMTP_PASSWORD

**其他邮件服务：**
- **SendGrid**: SMTP_HOST=smtp.sendgrid.net, PORT=587
- **Mailgun**: SMTP_HOST=smtp.mailgun.org, PORT=587
- **AWS SES**: SMTP_HOST=email-smtp.region.amazonaws.com, PORT=587

### 社交媒体 API 配置

#### LinkedIn

```bash
# LinkedIn 客户端 ID
LINKEDIN_CLIENT_ID=your-linkedin-client-id

# LinkedIn 客户端密钥
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# LinkedIn 访问令牌
LINKEDIN_ACCESS_TOKEN=your-linkedin-access-token
```

**获取 LinkedIn API：**
1. 访问 https://www.linkedin.com/developers/
2. 创建应用
3. 申请 Marketing Developer Platform 权限
4. 获取访问令牌

**注意：** LinkedIn API 有严格的使用限制，建议使用官方 API 而非自动化工具。

#### Facebook

```bash
# Facebook 应用 ID
FACEBOOK_APP_ID=your-facebook-app-id

# Facebook 应用密钥
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Facebook 页面访问令牌
FACEBOOK_PAGE_ACCESS_TOKEN=your-page-access-token
```

**获取 Facebook API：**
1. 访问 https://developers.facebook.com/
2. 创建应用
3. 添加 Facebook Login 和 Pages API
4. 获取页面访问令牌

#### Instagram

```bash
# Instagram 商业账户 ID
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-business-id
```

**配置 Instagram：**
1. 将 Instagram 账户转换为商业账户
2. 连接到 Facebook 页面
3. 使用 Facebook Graph API 访问

#### WhatsApp Business API

```bash
# WhatsApp 电话号码 ID
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id

# WhatsApp 访问令牌
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token

# WhatsApp 验证令牌（自定义）
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

**获取 WhatsApp API：**
1. 访问 https://business.facebook.com/
2. 创建 WhatsApp Business 账户
3. 在 Meta for Developers 配置 API
4. 获取访问令牌

### 机器人系统配置

```bash
# 机器人系统端口
BOT_PORT=5000

# 启用自动拓客
AUTO_OUTREACH_ENABLED=true

# 每日拓客上限
OUTREACH_DAILY_LIMIT=50

# 拓客间隔（分钟）
OUTREACH_INTERVAL_MINUTES=30

# 启用 CRM 自动跟进
CRM_AUTO_FOLLOW_UP=true

# 跟进间隔（天）
FOLLOW_UP_DAYS=3,7,14

# 启用数据分析
ANALYTICS_ENABLED=true
```

### 文件存储配置

#### 本地存储

```bash
# 上传目录
UPLOAD_DIR=./uploads
```

#### AWS S3（可选）

```bash
# AWS 访问密钥
AWS_ACCESS_KEY_ID=your-aws-access-key

# AWS 密钥
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# AWS 区域
AWS_REGION=us-east-1

# S3 存储桶名称
AWS_S3_BUCKET=your-bucket-name
```

### Redis 配置

```bash
# Redis 连接 URL
REDIS_URL=redis://localhost:6379

# Redis 密码（如果需要）
REDIS_PASSWORD=your-redis-password
```

### 其他配置

```bash
# 日志级别：error | warn | info | debug
LOG_LEVEL=info

# 汇率 API 密钥（用于货币转换）
EXCHANGE_RATE_API_KEY=your-exchange-rate-api-key
```

**推荐汇率 API：**
- https://exchangeratesapi.io/
- https://openexchangerates.org/

```bash
# Google Analytics 跟踪 ID
GA_TRACKING_ID=UA-XXXXXXXXX-X

# reCAPTCHA（防止机器人）
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

## 前端配置

### Next.js 环境变量

创建 `frontend/.env.local`：

```bash
# 后端 API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Stripe 公钥
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your-key

# Google Analytics
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X

# reCAPTCHA 站点密钥
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
```

## 数据库配置

### PostgreSQL 优化

编辑 `/etc/postgresql/14/main/postgresql.conf`：

```conf
# 内存配置
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# 连接配置
max_connections = 100

# 日志配置
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
```

### 连接池配置

在代码中配置连接池：

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // 最大连接数
  idleTimeoutMillis: 30000,   // 空闲超时
  connectionTimeoutMillis: 2000, // 连接超时
});
```

## Nginx 配置

### 完整配置示例

```nginx
# 限流配置
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# 前端
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 后端 API
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Docker Compose 配置

### 生产环境配置

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    restart: always
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal

  redis:
    image: redis:7-alpine
    restart: always
    networks:
      - internal

  backend:
    build: ./backend
    restart: always
    environment:
      NODE_ENV: production
    depends_on:
      - postgres
      - redis
    networks:
      - internal
      - external

  frontend:
    build: ./frontend
    restart: always
    depends_on:
      - backend
    networks:
      - external

networks:
  internal:
    driver: bridge
  external:
    driver: bridge

volumes:
  postgres_data:
```

## 安全最佳实践

1. **使用强密码**
   - JWT_SECRET: 至少 64 字符
   - 数据库密码: 至少 16 字符，包含大小写字母、数字、特殊字符

2. **限制 API 访问**
   - 使用速率限制
   - 实施 IP 白名单（如果适用）

3. **定期更新密钥**
   - 每 90 天轮换 JWT 密钥
   - 定期更新 API 密钥

4. **监控异常活动**
   - 设置日志告警
   - 监控失败的登录尝试

## 故障排查

### 检查配置

```bash
# 验证环境变量
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"

# 测试数据库连接
psql $DATABASE_URL

# 测试 SMTP
node -e "const nodemailer = require('nodemailer'); /* 测试代码 */"
```

### 常见错误

**数据库连接失败**
- 检查 DATABASE_URL 格式
- 确认 PostgreSQL 正在运行
- 验证用户权限

**支付失败**
- 确认 API 密钥正确
- 检查 webhook 配置
- 查看支付网关日志

**邮件发送失败**
- 验证 SMTP 凭据
- 检查防火墙规则
- 确认端口未被阻止

## 支持

如需帮助，请参考：
- [部署指南](DEPLOYMENT.md)
- [API 文档](API.md)
