#!/usr/bin/env node

const http = require('http');

console.log('🎯 Features 板块翻译 - 最终测试报告\n');
console.log('='.repeat(60));

async function testLanguage(locale, expectedTexts) {
  return new Promise((resolve) => {
    const path = locale === 'en' ? '/' : `/${locale}`;
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const results = expectedTexts.map(text => ({
          text,
          found: data.includes(text)
        }));
        resolve(results);
      });
    }).on('error', () => resolve([]));
  });
}

async function runFinalTest() {
  // 测试英文
  console.log('\n📝 英文版本 (http://localhost:3000)');
  console.log('-'.repeat(60));
  const enResults = await testLanguage('en', [
    'Why Choose Us',
    'Professional handbag manufacturer, trusted partner',
    'Custom Service',
    'Quality Assurance',
    'Fast Delivery',
    'Global Export',
    'Factory Direct',
    'Professional Team'
  ]);
  
  enResults.forEach(r => {
    console.log(`${r.found ? '✅' : '❌'} ${r.text}`);
  });
  
  // 测试中文
  console.log('\n📝 中文版本 (http://localhost:3000/zh)');
  console.log('-'.repeat(60));
  const zhResults = await testLanguage('zh', [
    '为什么选择我们',
    '专业的女士包袋制造商，值得信赖的合作伙伴',
    '定制服务',
    '品质保证',
    '快速交付',
    '全球出口',
    '工厂直供',
    '专业团队'
  ]);
  
  zhResults.forEach(r => {
    console.log(`${r.found ? '✅' : '❌'} ${r.text}`);
  });
  
  // 总结
  const enPassed = enResults.every(r => r.found);
  const zhPassed = zhResults.every(r => r.found);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试总结');
  console.log('='.repeat(60));
  console.log(`英文版本: ${enPassed ? '✅ 通过' : '❌ 失败'}`);
  console.log(`中文版本: ${zhPassed ? '✅ 通过' : '❌ 失败'}`);
  
  if (enPassed && zhPassed) {
    console.log('\n🎉 所有测试通过！Features 板块已成功实现中英文翻译');
    console.log('\n✨ 修改内容:');
    console.log('   1. 添加 features 翻译键到 zh/common.json');
    console.log('   2. 添加 features 翻译键到 en/common.json');
    console.log('   3. 更新 Features.js 组件使用翻译函数');
    console.log('   4. 清除 .next 缓存并重启前端');
    console.log('\n🌐 访问地址:');
    console.log('   英文: http://localhost:3000');
    console.log('   中文: http://localhost:3000/zh');
  } else {
    console.log('\n⚠️  部分测试失败，请检查配置');
  }
  console.log('='.repeat(60));
}

runFinalTest();
