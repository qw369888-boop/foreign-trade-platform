#!/bin/bash

# 外贸独立站一键部署脚本
# 支持多种部署方式

set -e

echo "🚀 外贸独立站一键部署工具"
echo "================================"

# 检查系统环境
check_requirements() {
    echo "🔍 检查系统环境..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ 未找到Node.js，请先安装Node.js 18+"
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        echo "❌ 未找到npm"
        exit 1
    fi
    
    echo "✅ 系统环境检查通过"
}

# 选择部署方式
select_deployment() {
    echo ""
    echo "请选择部署方式："
    echo "1) 本地开发环境"
    echo "2) 生产环境（VPS服务器）"
    echo "3) Docker容器部署"
    echo "4) Vercel云部署"
    
    read -p "请输入选项 (1-4): " choice
    
    case $choice in
        1) deploy_local ;;
        2) deploy_production ;;
        3) deploy_docker ;;
        4) deploy_vercel ;;
        *) echo "❌ 无效选项"; exit 1 ;;
    esac
}

# 本地开发环境
deploy_local() {
    echo "🔧 部署本地开发环境..."
    
    # 安装依赖
    echo "📦 安装前端依赖..."
    cd frontend && npm install
    
    echo "📦 安装后端依赖..."
    cd ../backend && npm install
    
    # 初始化数据库
    echo "🗄️ 初始化数据库..."
    node src/database/init-enhanced-tracking.js
    
    echo "✅ 本地环境部署完成！"
    echo "🌐 前端开发服务器: npm run dev (frontend目录)"
    echo "🔧 后端开发服务器: npm run dev (backend目录)"
    echo "👨‍💼 管理后台: http://localhost:3000/admin"
    echo "📧 管理员: admin@example.com / admin123"
}

# 生产环境部署
deploy_production() {
    echo "🏭 部署生产环境..."
    
    # 安装依赖
    echo "📦 安装依赖..."
    cd frontend && npm ci --only=production
    cd ../backend && npm ci --only=production
    
    # 构建前端
    echo "🔨 构建前端..."
    cd ../frontend && npm run build
    
    # 初始化数据库
    echo "🗄️ 初始化数据库..."
    cd ../backend && node src/database/init-enhanced-tracking.js
    
    # 安装PM2
    if ! command -v pm2 &> /dev/null; then
        echo "📦 安装PM2..."
        npm install -g pm2
    fi
    
    # 启动服务
    echo "🚀 启动生产服务..."
    cd ../backend && pm2 start src/server.js --name "foreign-trade-backend"
    cd ../frontend && pm2 start npm --name "foreign-trade-frontend" -- start
    
    # 设置开机自启
    pm2 startup
    pm2 save
    
    echo "✅ 生产环境部署完成！"
    echo "🌐 网站地址: http://your-server-ip:3000"
    echo "🔧 API地址: http://your-server-ip:4000"
    echo "📊 PM2监控: pm2 monit"
}

# Docker部署
deploy_docker() {
    echo "🐳 Docker容器部署..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ 未找到Docker，请先安装Docker"
        exit 1
    fi
    
    # 构建镜像
    echo "🔨 构建Docker镜像..."
    docker build -t foreign-trade-platform .
    
    # 启动容器
    echo "🚀 启动Docker容器..."
    docker-compose up -d
    
    echo "✅ Docker部署完成！"
    echo "🌐 网站地址: http://localhost:3000"
    echo "🔧 API地址: http://localhost:4000"
    echo "📊 容器状态: docker-compose ps"
}

# Vercel部署
deploy_vercel() {
    echo "☁️ Vercel云部署..."
    
    # 检查Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo "📦 安装Vercel CLI..."
        npm install -g vercel
    fi
    
    # 登录Vercel
    echo "🔐 请登录Vercel账户..."
    vercel login
    
    # 部署前端
    echo "🚀 部署前端到Vercel..."
    cd frontend && vercel --prod
    
    # 部署后端
    echo "🚀 部署后端到Vercel..."
    cd ../backend && vercel --prod
    
    echo "✅ Vercel部署完成！"
    echo "🌐 请在Vercel控制台查看部署地址"
    echo "⚙️ 记得在Vercel中配置环境变量"
}

# 主函数
main() {
    check_requirements
    select_deployment
}

# 运行脚本
main