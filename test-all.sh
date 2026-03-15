#!/bin/bash

# 外贸平台完整测试脚本
# 测试时间: 2026-03-13 01:40 GMT+8

echo "=========================================="
echo "外贸平台完整功能测试"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数
PASS=0
FAIL=0

# 测试函数
test_api() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "测试: $name ... "
    result=$(curl -s "$url")
    
    if echo "$result" | grep -q "$expected"; then
        echo -e "${GREEN}✓ 通过${NC}"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "  预期: $expected"
        echo "  实际: $(echo $result | head -c 100)"
        ((FAIL++))
        return 1
    fi
}

echo "1. 后端服务测试"
echo "----------------------------------------"

# 测试后端是否运行
if lsof -ti:4000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 后端服务运行中 (端口4000)${NC}"
    ((PASS++))
else
    echo -e "${RED}✗ 后端服务未运行${NC}"
    ((FAIL++))
fi

# 测试产品API
test_api "产品列表API" "http://localhost:4000/api/products?lang=zh&limit=3" '"success":true'

# 测试单个产品API
test_api "单个产品API" "http://localhost:4000/api/products/529" '"success":true'

# 测试分类筛选
test_api "分类筛选API" "http://localhost:4000/api/products?category=Handbags&limit=3" '"success":true'

echo ""
echo "2. 前端服务测试"
echo "----------------------------------------"

# 测试前端是否运行
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 前端服务运行中 (端口3000)${NC}"
    ((PASS++))
else
    echo -e "${RED}✗ 前端服务未运行${NC}"
    ((FAIL++))
fi

# 测试首页
test_api "首页加载" "http://localhost:3000/zh" "Dayi Leather"

# 测试产品页
test_api "产品页加载" "http://localhost:3000/zh/products" "products"

# 测试购物车页
test_api "购物车页加载" "http://localhost:3000/zh/cart" "cart"

# 测试关于页
test_api "关于页加载" "http://localhost:3000/zh/about" "about"

# 测试联系页
test_api "联系页加载" "http://localhost:3000/zh/contact" "contact"

echo ""
echo "3. CORS配置测试"
echo "----------------------------------------"

# 测试CORS头
cors_result=$(curl -s -H "Origin: http://localhost:3000" -I "http://localhost:4000/api/products" | grep -i "access-control-allow-origin")
if [ ! -z "$cors_result" ]; then
    echo -e "${GREEN}✓ CORS配置正确${NC}"
    echo "  $cors_result"
    ((PASS++))
else
    echo -e "${RED}✗ CORS配置错误${NC}"
    ((FAIL++))
fi

echo ""
echo "4. 数据库测试"
echo "----------------------------------------"

# 检查数据库文件
if [ -f "/mnt/e/Projects/foreign-trade-platform/database/foreign_trade.db" ]; then
    echo -e "${GREEN}✓ 数据库文件存在${NC}"
    ((PASS++))
    
    # 检查产品数量
    product_count=$(curl -s "http://localhost:4000/api/products?limit=100" | grep -o '"id":[0-9]*' | wc -l)
    echo -e "${GREEN}✓ 数据库产品数量: $product_count${NC}"
    ((PASS++))
else
    echo -e "${RED}✗ 数据库文件不存在${NC}"
    ((FAIL++))
fi

echo ""
echo "=========================================="
echo "测试总结"
echo "=========================================="
echo -e "通过: ${GREEN}$PASS${NC}"
echo -e "失败: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $FAIL 个测试失败${NC}"
    exit 1
fi
