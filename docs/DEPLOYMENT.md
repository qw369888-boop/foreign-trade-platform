# 部署指南

本文档详细说明如何将外贸独立站系统部署到生产环境。

## 目录
- [系统要求](#系统要求)
- [Docker 部署（推荐）](#docker-部署推荐)
- [手动部署](#手动部署)
- [环境变量配置](#环境变量配置)
- [数据库设置](#数据库设置)
- [域名和 SSL 配置](#域名和-ssl-配置)
- [性能优化](#性能优化)
- [监控和日志](#监控和日志)

## 系统要求

### 最低配置
- CPU: 2 核
- 内存: 4GB RAM
- 存储: 20GB SSD
- 操作系统: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### 推荐配置
- CPU: 4 核
- 内存: 8GB RAM
- 存储: 50GB SSD
- 操作系统: Ubuntu 22.04 LTS

### 软件依赖
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (手动部署)
- PostgreSQL 14+ (手动部署)
- Nginx (可选，用于反向代理)

## Docker 部署（推荐）

### 1. 安装 Docker 和 Docker Compose

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin

# 验证安装
docker --version
docker compose version
```

### 2. 克隆项目

```bash
cd /opt
git clone <your-repo-url> foreign-trade-platform
cd foreign-trade-platform
```

### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

**必须修改的配置：**
- `JWT_SECRET` - 设置强密码
- `DATABASE_URL` - 修改数据库密码
- 支付网关 API 密钥
- SMTP 邮件配置
- 社交媒体 API 密钥

### 4. 启动服务

```bash
# 构建并启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f

# 检查服务状态
docker compose ps
```

### 5. 初始化数据库

```bash
# 运行数据库迁移
docker compose exec backend npm run db:migrate

# 导入初始数据
docker compose exec backend npm run db:seed
```

### 6. 验证部署

访问以下地址验证服务：
- 前端: http://your-server-ip:3000
- 后端 API: http://your-server-ip:4000/health
- 机器人系统: http://your-server-ip:5000/health

## 手动部署

### 1. 安装 Node.js

```bash
# 使用 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装 PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE foreign_trade_db;
CREATE USER ftuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE foreign_trade_db TO ftuser;
\q
```

### 3. 部署后端

```bash
cd backend
npm install --production
cp ../.env.example ../.env
# 编辑 .env 文件

# 初始化数据库
npm run db:migrate
npm run db:seed

# 使用 PM2 运行
npm install -g pm2
pm2 start src/server.js --name backend
pm2 save
pm2 startup
```

### 4. 部署前端

```bash
cd frontend
npm install
npm run build

# 使用 PM2 运行
pm2 start npm --name frontend -- start
pm2 save
```

### 5. 部署机器人系统

```bash
cd bot-system
npm install --production

# 使用 PM2 运行
pm2 start src/index.js --name bot-system
pm2 save
```

## 环境变量配置

### 生产环境必须修改的配置

```bash
# 安全配置
NODE_ENV=production
JWT_SECRET=<生成强随机密钥>

# 数据库
DATABASE_URL=postgresql://ftuser:<strong_password>@localhost:5432/foreign_trade_db

# 前端 URL（用于 CORS）
FRONTEND_URL=https://yourdomain.com

# 支付网关（切换到生产模式）
PAYPAL_MODE=production
PAYPAL_CLIENT_ID=<生产环境 ID>
PAYPAL_CLIENT_SECRET=<生产环境密钥>

STRIPE_PUBLIC_KEY=pk_live_<your_key>
STRIPE_SECRET_KEY=sk_live_<your_key>
```

### 生成强密钥

```bash
# 生成 JWT 密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 域名和 SSL 配置

### 使用 Nginx 作为反向代理

```bash
# 安装 Nginx
sudo apt-get install nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/foreign-trade
```

**Nginx 配置示例：**

```nginx
# 前端
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/foreign-trade /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 安装 SSL 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

## 性能优化

### 1. 启用 Redis 缓存

```bash
# 安装 Redis
sudo apt-get install redis-server

# 启动服务
sudo systemctl start redis
sudo systemctl enable redis

# 在 .env 中配置
REDIS_URL=redis://localhost:6379
```

### 2. 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_customers_email ON customers(email);

-- 配置 PostgreSQL
-- 编辑 /etc/postgresql/14/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
```

### 3. 前端优化

```bash
# 启用 Gzip 压缩（Nginx）
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# 设置缓存头
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 监控和日志

### 使用 PM2 监控

```bash
# 查看所有进程
pm2 list

# 查看日志
pm2 logs

# 监控仪表板
pm2 monit

# 查看特定进程日志
pm2 logs backend
```

### 日志管理

```bash
# 日志位置
backend/logs/
bot-system/logs/

# 使用 logrotate 管理日志
sudo nano /etc/logrotate.d/foreign-trade
```

**logrotate 配置：**

```
/opt/foreign-trade-platform/*/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 健康检查

```bash
# 创建健康检查脚本
nano /opt/scripts/health-check.sh
```

```bash
#!/bin/bash
curl -f http://localhost:4000/health || exit 1
curl -f http://localhost:5000/health || exit 1
```

```bash
chmod +x /opt/scripts/health-check.sh

# 添加到 crontab
crontab -e
*/5 * * * * /opt/scripts/health-check.sh
```

## 备份策略

### 数据库备份

```bash
# 创建备份脚本
nano /opt/scripts/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PGPASSWORD=your_password pg_dump -h localhost -U ftuser foreign_trade_db > $BACKUP_DIR/db_$DATE.sql
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
```

```bash
chmod +x /opt/scripts/backup-db.sh

# 每天凌晨 2 点备份
crontab -e
0 2 * * * /opt/scripts/backup-db.sh
```

## 故障排查

### 常见问题

**1. 数据库连接失败**
```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 检查连接
psql -h localhost -U ftuser -d foreign_trade_db
```

**2. 端口被占用**
```bash
# 查看端口占用
sudo netstat -tulpn | grep :3000
sudo lsof -i :3000
```

**3. 内存不足**
```bash
# 查看内存使用
free -h
pm2 list

# 重启服务
pm2 restart all
```

## 安全建议

1. **防火墙配置**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **定期更新**
```bash
sudo apt-get update
sudo apt-get upgrade
```

3. **限制数据库访问**
```bash
# 编辑 pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
# 只允许本地连接
```

4. **使用环境变量**
- 不要将 .env 文件提交到 Git
- 使用密钥管理服务（如 AWS Secrets Manager）

## 扩展部署

### 负载均衡

使用 Nginx 配置多个后端实例：

```nginx
upstream backend {
    server localhost:4000;
    server localhost:4001;
    server localhost:4002;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

### 使用 Docker Swarm 或 Kubernetes

参考 Docker 官方文档进行集群部署。

## 支持

如有问题，请查看：
- [配置说明](CONFIGURATION.md)
- [API 文档](API.md)
- [常见问题](FAQ.md)
