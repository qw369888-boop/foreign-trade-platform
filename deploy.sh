#!/bin/bash

echo "🚀 开始部署外贸独立站..."

# 1. 安装依赖
echo "📦 安装前端依赖..."
cd frontend
npm install

echo "📦 安装后端依赖..."
cd ../backend
npm install

# 2. 构建前端
echo "🔨 构建前端项目..."
cd ../frontend
npm run build

# 3. 数据库迁移
echo "🗄️ 准备数据库..."
cd ../backend
node src/database/init-enhanced-tracking.js

# 4. 启动生产服务器
echo "🌟 启动生产服务器..."
cd ../frontend
npm start &

cd ../backend
npm start &

echo "✅ 部署完成！"
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:4000"
echo "👨‍💼 管理后台: http://localhost:3000/admin"
echo "📧 管理员账号: admin@example.com"
echo "🔑 管理员密码: admin123"