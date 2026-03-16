# GitHub Pages 部署脚本
# 用于将 Next.js 静态导出部署到 GitHub Pages

param(
    [string]$CommitMessage = "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host "🚀 开始部署到 GitHub Pages..." -ForegroundColor Green

# 检查 out 目录是否存在
if (-not (Test-Path ".\out")) {
    Write-Host "❌ 错误: out 目录不存在，请先运行 npm run build" -ForegroundColor Red
    exit 1
}

# 检查是否在正确的目录
if (-not (Test-Path ".\package.json")) {
    Write-Host "❌ 错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 检查 Git 状态
Write-Host "📋 检查 Git 状态..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  工作目录有未提交的更改，建议先提交:" -ForegroundColor Yellow
    git status --short
    $continue = Read-Host "是否继续部署? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "❌ 部署已取消" -ForegroundColor Red
        exit 1
    }
}

# 切换到 out 目录
Write-Host "📁 进入 out 目录..." -ForegroundColor Yellow
Set-Location .\out

# 初始化 Git 仓库（如果不存在）
if (-not (Test-Path ".\.git")) {
    Write-Host "🔧 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    git branch -M gh-pages
}

# 添加所有文件
Write-Host "📦 添加文件到 Git..." -ForegroundColor Yellow
git add .

# 检查是否有更改需要提交
$changes = git diff --cached --name-only
if (-not $changes) {
    Write-Host "ℹ️  没有新的更改需要部署" -ForegroundColor Blue
    Set-Location ..
    exit 0
}

# 提交更改
Write-Host "💾 提交更改..." -ForegroundColor Yellow
git commit -m $CommitMessage

# 检查远程仓库
$remotes = git remote
if (-not ($remotes -contains "origin")) {
    Write-Host "⚠️  未配置远程仓库，请手动添加:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Cyan
    Write-Host "然后重新运行此脚本" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# 推送到 GitHub Pages
Write-Host "🌐 推送到 GitHub Pages..." -ForegroundColor Yellow
try {
    git push origin gh-pages --force
    Write-Host "✅ 部署成功！" -ForegroundColor Green
    Write-Host "🔗 你的网站将在几分钟后可用" -ForegroundColor Green
} catch {
    Write-Host "❌ 推送失败: $($_.Exception.Message)" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# 返回项目根目录
Set-Location ..

Write-Host "🎉 部署完成！检查你的 GitHub Pages 设置确保使用 gh-pages 分支" -ForegroundColor Green