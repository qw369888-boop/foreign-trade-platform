#!/bin/bash
# GitHub Pages 部署脚本 (Linux/macOS 版本)
# 用于将 Next.js 静态导出部署到 GitHub Pages

COMMIT_MESSAGE=${1:-"Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M')"}

echo "🚀 开始部署到 GitHub Pages..."

# 检查 out 目录是否存在
if [ ! -d "./out" ]; then
    echo "❌ 错误: out 目录不存在，请先运行 npm run build"
    exit 1
fi

# 检查是否在正确的目录
if [ ! -f "./package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Git 状态
echo "📋 检查 Git 状态..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  工作目录有未提交的更改，建议先提交:"
    git status --short
    read -p "是否继续部署? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

# 切换到 out 目录
echo "📁 进入 out 目录..."
cd ./out

# 初始化 Git 仓库（如果不存在）
if [ ! -d "./.git" ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git branch -M gh-pages
fi

# 添加所有文件
echo "📦 添加文件到 Git..."
git add .

# 检查是否有更改需要提交
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "ℹ️  没有新的更改需要部署"
    cd ..
    exit 0
fi

# 提交更改
echo "💾 提交更改..."
git commit -m "$COMMIT_MESSAGE"

# 检查远程仓库
if ! git remote | grep -q "origin"; then
    echo "⚠️  未配置远程仓库，请手动添加:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "然后重新运行此脚本"
    cd ..
    exit 1
fi

# 推送到 GitHub Pages
echo "🌐 推送到 GitHub Pages..."
if git push origin gh-pages --force; then
    echo "✅ 部署成功！"
    echo "🔗 你的网站将在几分钟后可用"
else
    echo "❌ 推送失败"
    cd ..
    exit 1
fi

# 返回项目根目录
cd ..

echo "🎉 部署完成！检查你的 GitHub Pages 设置确保使用 gh-pages 分支"