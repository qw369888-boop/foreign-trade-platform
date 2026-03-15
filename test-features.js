#!/usr/bin/env node

const http = require('http');

console.log('🧪 测试 Features 板块翻译...\n');

// 测试英文版本
function testEnglish() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasEnglishTitle = data.includes('Why Choose Us');
        const hasEnglishSubtitle = data.includes('Professional handbag manufacturer, trusted partner');
        const hasCustomService = data.includes('Custom Service');
        const hasQualityAssurance = data.includes('Quality Assurance');
        const hasFastDelivery = data.includes('Fast Delivery');
        const hasGlobalExport = data.includes('Global Export');
        const hasFactoryDirect = data.includes('Factory Direct');
        const hasProfessionalTeam = data.includes('Professional Team');
        
        console.log('✅ 英文版本测试:');
        console.log(`   标题: ${hasEnglishTitle ? '✓' : '✗'} Why Choose Us`);
        console.log(`   副标题: ${hasEnglishSubtitle ? '✓' : '✗'} Professional handbag manufacturer...`);
        console.log(`   特性1: ${hasCustomService ? '✓' : '✗'} Custom Service`);
        console.log(`   特性2: ${hasQualityAssurance ? '✓' : '✗'} Quality Assurance`);
        console.log(`   特性3: ${hasFastDelivery ? '✓' : '✗'} Fast Delivery`);
        console.log(`   特性4: ${hasGlobalExport ? '✓' : '✗'} Global Export`);
        console.log(`   特性5: ${hasFactoryDirect ? '✓' : '✗'} Factory Direct`);
        console.log(`   特性6: ${hasProfessionalTeam ? '✓' : '✗'} Professional Team`);
        
        const allPassed = hasEnglishTitle && hasEnglishSubtitle && hasCustomService && 
                         hasQualityAssurance && hasFastDelivery && hasGlobalExport && 
                         hasFactoryDirect && hasProfessionalTeam;
        
        resolve(allPassed);
      });
    }).on('error', (err) => {
      console.error('❌ 请求失败:', err.message);
      resolve(false);
    });
  });
}

// 测试中文版本
function testChinese() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      headers: {
        'Accept-Language': 'zh'
      }
    };
    
    http.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasChineseTitle = data.includes('为什么选择我们');
        const hasChineseSubtitle = data.includes('专业的女士包袋制造商');
        const hasCustomService = data.includes('定制服务');
        const hasQualityAssurance = data.includes('品质保证');
        const hasFastDelivery = data.includes('快速交付');
        const hasGlobalExport = data.includes('全球出口');
        const hasFactoryDirect = data.includes('工厂直供');
        const hasProfessionalTeam = data.includes('专业团队');
        
        console.log('\n✅ 中文版本测试:');
        console.log(`   标题: ${hasChineseTitle ? '✓' : '✗'} 为什么选择我们`);
        console.log(`   副标题: ${hasChineseSubtitle ? '✓' : '✗'} 专业的女士包袋制造商...`);
        console.log(`   特性1: ${hasCustomService ? '✓' : '✗'} 定制服务`);
        console.log(`   特性2: ${hasQualityAssurance ? '✓' : '✗'} 品质保证`);
        console.log(`   特性3: ${hasFastDelivery ? '✓' : '✗'} 快速交付`);
        console.log(`   特性4: ${hasGlobalExport ? '✓' : '✗'} 全球出口`);
        console.log(`   特性5: ${hasFactoryDirect ? '✓' : '✗'} 工厂直供`);
        console.log(`   特性6: ${hasProfessionalTeam ? '✓' : '✗'} 专业团队`);
        
        const allPassed = hasChineseTitle && hasChineseSubtitle && hasCustomService && 
                         hasQualityAssurance && hasFastDelivery && hasGlobalExport && 
                         hasFactoryDirect && hasProfessionalTeam;
        
        resolve(allPassed);
      });
    }).on('error', (err) => {
      console.error('❌ 请求失败:', err.message);
      resolve(false);
    });
  });
}

async function runTests() {
  const englishPassed = await testEnglish();
  const chinesePassed = await testChinese();
  
  console.log('\n' + '='.repeat(50));
  if (englishPassed && chinesePassed) {
    console.log('✅ 所有测试通过！Features 板块翻译正常工作');
  } else {
    console.log('❌ 部分测试失败');
    if (!englishPassed) console.log('   - 英文版本有问题');
    if (!chinesePassed) console.log('   - 中文版本有问题');
  }
  console.log('='.repeat(50));
}

runTests();
