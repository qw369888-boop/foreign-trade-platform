const http = require('http');

// 测试配置
const FRONTEND_PORT = 3002;
const BACKEND_PORT = 4000;

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// HTTP请求函数
function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        });
        req.on('error', reject);
        req.end();
    });
}

// 测试函数
async function testAPI(name, path, expectedStatus = 200) {
    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: BACKEND_PORT,
            path: path,
            method: 'GET',
            headers: { 'Origin': `http://localhost:${FRONTEND_PORT}` }
        });
        
        if (result.status === expectedStatus) {
            log(`✓ ${name}`, 'green');
            return true;
        } else {
            log(`✗ ${name} - 状态码: ${result.status}`, 'red');
            return false;
        }
    } catch (error) {
        log(`✗ ${name} - 错误: ${error.message}`, 'red');
        return false;
    }
}

async function testPage(name, path, expectedStatus = 200) {
    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: FRONTEND_PORT,
            path: path,
            method: 'GET'
        });
        
        if (result.status === expectedStatus) {
            log(`✓ ${name}`, 'green');
            return true;
        } else {
            log(`✗ ${name} - 状态码: ${result.status}`, 'red');
            return false;
        }
    } catch (error) {
        log(`✗ ${name} - 错误: ${error.message}`, 'red');
        return false;
    }
}

async function runTests() {
    log('\n==========================================', 'blue');
    log('🧪 外贸平台最终测试', 'blue');
    log('==========================================\n', 'blue');
    
    let passed = 0;
    let failed = 0;
    
    // 后端API测试
    log('1️⃣ 后端API测试', 'yellow');
    log('----------------------------------------');
    
    const apiTests = [
        ['产品列表API', '/api/products?lang=zh&limit=3'],
        ['单个产品API', '/api/products/529'],
        ['分类筛选API', '/api/products?category=Handbags'],
        ['英文产品API', '/api/products?lang=en&limit=3']
    ];
    
    for (const [name, path] of apiTests) {
        if (await testAPI(name, path)) passed++; else failed++;
    }
    
    // CORS测试
    log('\n2️⃣ CORS配置测试', 'yellow');
    log('----------------------------------------');
    
    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: BACKEND_PORT,
            path: '/api/products',
            method: 'GET',
            headers: { 'Origin': `http://localhost:${FRONTEND_PORT}` }
        });
        
        if (result.headers['access-control-allow-origin']) {
            log(`✓ CORS配置正确: ${result.headers['access-control-allow-origin']}`, 'green');
            passed++;
        } else {
            log('✗ CORS配置错误', 'red');
            failed++;
        }
    } catch (error) {
        log(`✗ CORS测试失败: ${error.message}`, 'red');
        failed++;
    }
    
    // 前端页面测试
    log('\n3️⃣ 前端页面测试', 'yellow');
    log('----------------------------------------');
    
    const pageTests = [
        ['首页 (中文)', '/zh'],
        ['首页 (英文)', '/'],
        ['产品页', '/zh/products'],
        ['购物车页', '/zh/cart'],
        ['支付页', '/zh/checkout'],
        ['关于页', '/zh/about'],
        ['联系页', '/zh/contact']
    ];
    
    for (const [name, path] of pageTests) {
        if (await testPage(name, path)) passed++; else failed++;
    }
    
    // 产品数据测试
    log('\n4️⃣ 产品数据测试', 'yellow');
    log('----------------------------------------');
    
    try {
        const result = await makeRequest({
            hostname: 'localhost',
            port: BACKEND_PORT,
            path: '/api/products?lang=zh&limit=100',
            method: 'GET'
        });
        
        const data = JSON.parse(result.data);
        if (data.success && data.data && data.data.length > 0) {
            log(`✓ 产品数据正常 - 共 ${data.data.length} 个产品`, 'green');
            log(`  第一个产品: ${data.data[0].name_zh || data.data[0].name}`, 'blue');
            passed++;
        } else {
            log('✗ 产品数据异常', 'red');
            failed++;
        }
    } catch (error) {
        log(`✗ 产品数据测试失败: ${error.message}`, 'red');
        failed++;
    }
    
    // 测试总结
    log('\n==========================================', 'blue');
    log('📊 测试总结', 'blue');
    log('==========================================', 'blue');
    log(`总测试数: ${passed + failed}`);
    log(`通过: ${passed}`, 'green');
    log(`失败: ${failed}`, failed > 0 ? 'red' : 'green');
    log(`成功率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, failed > 0 ? 'yellow' : 'green');
    
    log('\n==========================================', 'blue');
    log('🌐 服务信息', 'blue');
    log('==========================================', 'blue');
    log(`前端: http://localhost:${FRONTEND_PORT}`, 'blue');
    log(`后端: http://localhost:${BACKEND_PORT}`, 'blue');
    log(`测试页面: http://localhost:${FRONTEND_PORT}/test-complete.html`, 'blue');
    
    log('\n==========================================', 'blue');
    log('✅ 用户测试步骤', 'blue');
    log('==========================================', 'blue');
    log('1. 访问: http://localhost:3002/zh');
    log('2. 鼠标悬停在产品卡片上');
    log('3. 查看是否显示两个按钮:');
    log('   - "添加购物车" (蓝紫渐变)');
    log('   - "立即购买" (白色)');
    log('4. 点击"添加购物车"查看Toast提示');
    log('5. 查看导航栏购物车图标数字');
    log('6. 点击"立即购买"测试跳转');
    log('\n如果浏览器显示旧版本，请:');
    log('- 按 Ctrl + Shift + Delete 清除缓存');
    log('- 按 Ctrl + Shift + R 硬刷新');
    log('- 或使用无痕模式 (Ctrl + Shift + N)\n');
    
    if (failed === 0) {
        log('🎉 所有测试通过！系统已准备就绪！', 'green');
        process.exit(0);
    } else {
        log(`⚠️  有 ${failed} 个测试失败，请检查日志`, 'yellow');
        process.exit(1);
    }
}

// 运行测试
runTests().catch(error => {
    log(`\n❌ 测试运行失败: ${error.message}`, 'red');
    process.exit(1);
});
