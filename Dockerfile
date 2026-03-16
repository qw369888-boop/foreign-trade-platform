# 多阶段构建 - 前端
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# 多阶段构建 - 后端
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

# 生产环境
FROM node:18-alpine AS production
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache sqlite

# 复制构建好的前端
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/next.config.js ./frontend/

# 复制后端
COPY --from=backend-builder /app/backend ./backend

# 安装运行时依赖
WORKDIR /app/frontend
RUN npm ci --only=production

WORKDIR /app/backend
RUN npm ci --only=production

# 创建数据库目录
RUN mkdir -p /app/database

# 初始化数据库
RUN node src/database/init-enhanced-tracking.js

# 暴露端口
EXPOSE 3000 4000

# 创建启动脚本
WORKDIR /app
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

# 启动服务
CMD ["./docker-start.sh"]