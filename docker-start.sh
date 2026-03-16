#!/bin/sh

echo "🚀 启动外贸独立站生产环境..."

# 启动后端服务
echo "🔧 启动后端API服务..."
cd /app/backend
npm start &

# 等待后端启动
sleep 5

# 启动前端服务
echo "🌐 启动前端服务..."
cd /app/frontend
npm start &

# 保持容器运行
wait