@echo off
echo 🚀 开始部署 Dayi Leather 独立站...
echo.

echo 📦 检查 Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI 未安装，正在安装...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ 安装失败，请手动安装: npm install -g vercel
        pause
        exit /b 1
    )
)
echo ✅ Vercel CLI 已就绪

echo.
echo 🔧 部署后端 API...
cd /d "E:\Projects\foreign-trade-platform\backend"
echo 当前目录: %cd%
vercel --prod --yes --name dayileather-api
if %errorlevel% neq 0 (
    echo ❌ 后端部署失败
    pause
    exit /b 1
)
echo ✅ 后端 API 部署成功

echo.
echo 🌐 部署前端网站...
cd /d "E:\Projects\foreign-trade-platform\frontend"
echo 当前目录: %cd%
vercel --prod --yes --name dayileather
if %errorlevel% neq 0 (
    echo ❌ 前端部署失败
    pause
    exit /b 1
)
echo ✅ 前端网站部署成功

echo.
echo 🎉 部署完成！
echo.
echo 📍 访问地址：
echo    网站: https://dayileather.vercel.app
echo    API:  https://dayileather-api.vercel.app
echo.
echo 🔗 下一步：
echo    1. 访问网站测试功能
echo    2. 配置自定义域名（可选）
echo    3. 设置 Google Analytics
echo    4. 开始营销推广
echo.
pause