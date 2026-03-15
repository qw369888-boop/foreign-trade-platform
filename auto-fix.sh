#!/bin/bash

# 外贸平台自动修复和测试脚本
# 2026-03-13 01:40 GMT+8

echo "=========================================="
echo "🔧 外贸平台自动修复和测试"
echo "=========================================="
echo ""

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 1. 检查并启动后端
log_info "检查后端服务..."
if ! lsof -ti:4000 > /dev/null 2>&1; then
    log_warning "后端未运行，正在启动..."
    cd /mnt/e/Projects/foreign-trade-platform/backend
    npm start > /tmp/backend.log 2>&1 &
    sleep 8
    if lsof -ti:4000 > /dev/null 2>&1; then
        log_success "后端已启动 (端口4000)"
    else
        log_error "后端启动失败"
        exit 1
    fi
else
    log_success "后端已运行 (端口4000)"
fi

# 2. 检查并启动前端
log_info "检查前端服务..."
if ! lsof -ti:3000 > /dev/null 2>&1; then
    log_warning "前端未运行，正在启动..."
    cd /mnt/e/Projects/foreign-trade-platform/frontend
    npm run dev > /tmp/frontend.log 2>&1 &
    sleep 20
    if lsof -ti:3000 > /dev/null 2>&1; then
        log_success "前端已启动 (端口3000)"
    else
        log_error "前端启动失败"
        exit 1
    fi
else
    log_success "前端已运行 (端口3000)"
fi

# 3. 测试API
log_info "测试后端API..."
api_result=$(curl -s "http://localhost:4000/api/products?lang=zh&limit=1")
if echo "$api_result" | grep -q '"success":true'; then
    log_success "API测试通过"
else
    log_error "API测试失败"
fi

# 4. 测试CORS
log_info "测试CORS配置..."
cors_result=$(curl -s -H "Origin: http://localhost:3000" -I "http://localhost:4000/api/products" | grep -i "access-control-allow-origin")
if [ ! -z "$cors_result" ]; then
    log_success "CORS配置正确"
else
    log_error "CORS配置错误"
fi

# 5. 测试前端页面
log_info "测试前端页面..."
pages=("/" "/zh" "/zh/products" "/zh/cart" "/zh/about" "/zh/contact" "/zh/checkout")
for page in "${pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$page")
    if [ "$status" = "200" ]; then
        log_success "页面 $page - OK"
    else
        log_warning "页面 $page - 状态码: $status"
    fi
done

# 6. 检查数据库
log_info "检查数据库..."
if [ -f "/mnt/e/Projects/foreign-trade-platform/database/foreign_trade.db" ]; then
    log_success "数据库文件存在"
    product_count=$(curl -s "http://localhost:4000/api/products?limit=100" | grep -o '"id":[0-9]*' | wc -l)
    log_success "数据库产品数量: $product_count"
else
    log_error "数据库文件不存在"
fi

echo ""
echo "=========================================="
echo "✅ 自动修复和测试完成"
echo "=========================================="
echo ""
echo "服务状态:"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:4000"
echo "  测试页面: http://localhost:3000/test-complete.html"
echo ""
echo "日志文件:"
echo "  前端: /tmp/frontend.log"
echo "  后端: /tmp/backend.log"
echo ""
