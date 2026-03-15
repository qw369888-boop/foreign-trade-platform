#!/bin/bash

# 外贸平台启动脚本
# 确保前端和后端服务正常运行

echo "=========================================="
echo "🚀 启动外贸平台服务"
echo "=========================================="
echo ""

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目路径
PROJECT_DIR="/mnt/e/Projects/foreign-trade-platform"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

# 日志文件
FRONTEND_LOG="/tmp/frontend-$(date +%Y%m%d-%H%M%S).log"
BACKEND_LOG="/tmp/backend-$(date +%Y%m%d-%H%M%S).log"

# 检查并启动后端
echo -e "${BLUE}[1/3]${NC} 检查后端服务..."
if lsof -ti:4000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 后端已运行 (端口4000)${NC}"
else
    echo -e "${YELLOW}启动后端...${NC}"
    cd "$BACKEND_DIR"
    nohup npm start > "$BACKEND_LOG" 2>&1 &
    sleep 8
    
    if lsof -ti:4000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 后端启动成功 (端口4000)${NC}"
        echo -e "  日志: $BACKEND_LOG"
    else
        echo -e "${RED}✗ 后端启动失败${NC}"
        echo -e "  查看日志: cat $BACKEND_LOG"
        exit 1
    fi
fi

# 检查并启动前端
echo -e "${BLUE}[2/3]${NC} 检查前端服务..."
FRONTEND_PORT=$(lsof -ti:3000,3001,3002,3003 | head -1)
if [ ! -z "$FRONTEND_PORT" ]; then
    ACTUAL_PORT=$(lsof -i -P -n | grep "$FRONTEND_PORT" | grep LISTEN | awk '{print $9}' | cut -d: -f2 | head -1)
    echo -e "${GREEN}✓ 前端已运行 (端口$ACTUAL_PORT)${NC}"
else
    echo -e "${YELLOW}启动前端...${NC}"
    cd "$FRONTEND_DIR"
    nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
    sleep 20
    
    FRONTEND_PORT=$(lsof -ti:3000,3001,3002,3003 | head -1)
    if [ ! -z "$FRONTEND_PORT" ]; then
        ACTUAL_PORT=$(lsof -i -P -n | grep "$FRONTEND_PORT" | grep LISTEN | awk '{print $9}' | cut -d: -f2 | head -1)
        echo -e "${GREEN}✓ 前端启动成功 (端口$ACTUAL_PORT)${NC}"
        echo -e "  日志: $FRONTEND_LOG"
    else
        echo -e "${RED}✗ 前端启动失败${NC}"
        echo -e "  查看日志: cat $FRONTEND_LOG"
        exit 1
    fi
fi

# 运行测试
echo -e "${BLUE}[3/3]${NC} 运行功能测试..."
sleep 3
node "$PROJECT_DIR/final-test.js"

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo -e "${GREEN}✅ 所有服务已启动并测试通过！${NC}"
    echo "=========================================="
    echo ""
    echo "访问地址:"
    FRONTEND_PORT=$(lsof -i -P -n | grep node | grep LISTEN | grep -v 4000 | awk '{print $9}' | cut -d: -f2 | head -1)
    echo -e "  ${BLUE}中文版:${NC} http://localhost:${FRONTEND_PORT}/zh"
    echo -e "  ${BLUE}英文版:${NC} http://localhost:${FRONTEND_PORT}"
    echo -e "  ${BLUE}测试页:${NC} http://localhost:${FRONTEND_PORT}/test-complete.html"
    echo ""
    echo "日志文件:"
    echo "  前端: $FRONTEND_LOG"
    echo "  后端: $BACKEND_LOG"
    echo ""
else
    echo ""
    echo "=========================================="
    echo -e "${RED}⚠️  测试未完全通过，请检查日志${NC}"
    echo "=========================================="
    exit 1
fi
