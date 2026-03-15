const taxService = require('./src/services/taxService');

console.log('🎯 主要目标市场税收测试\n');

// 重点市场测试用例
const primaryMarketTests = [
  // 美国免税州 - 最优选择
  {
    name: '🇺🇸 美国俄勒冈州 (免税州)',
    data: { country: 'US', state: 'OR', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇺🇸 美国特拉华州 (免税州)',
    data: { country: 'US', state: 'DE', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇺🇸 美国加利福尼亚州 (有税)',
    data: { country: 'US', state: 'CA', subtotal: 100.00, customerType: 'individual' }
  },
  
  // 亚太重点市场
  {
    name: '🇦🇺 澳大利亚',
    data: { country: 'AU', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇹🇭 泰国',
    data: { country: 'TH', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇸🇬 新加坡',
    data: { country: 'SG', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇲🇾 马来西亚',
    data: { country: 'MY', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇮🇩 印度尼西亚',
    data: { country: 'ID', subtotal: 100.00, customerType: 'individual' }
  },
  
  // 其他重要市场
  {
    name: '🇬🇧 英国',
    data: { country: 'GB', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇨🇦 加拿大',
    data: { country: 'CA', subtotal: 100.00, customerType: 'individual' }
  },
  {
    name: '🇯🇵 日本',
    data: { country: 'JP', subtotal: 100.00, customerType: 'individual' }
  }
];

// 运行测试
console.log('💰 税费计算结果 (订单金额: $100.00)\n');
console.log('地区'.padEnd(25) + '税率'.padEnd(10) + '税费'.padEnd(10) + '总计'.padEnd(10) + '状态');
console.log('='.repeat(65));

primaryMarketTests.forEach((test) => {
  try {
    const result = taxService.calculateTax(test.data);
    const status = result.taxable ? (result.taxAmount === 0 ? '免税' : '征税') : '免税';
    
    console.log(
      test.name.padEnd(25) + 
      `${result.taxRate}%`.padEnd(10) + 
      `$${result.taxAmount.toFixed(2)}`.padEnd(10) + 
      `$${result.total.toFixed(2)}`.padEnd(10) + 
      status
    );
  } catch (error) {
    console.log(`${test.name.padEnd(25)} ❌ 错误: ${error.message}`);
  }
});

// 显示主要市场统计
console.log('\n📊 主要市场分析\n');
const primaryMarkets = taxService.getPrimaryMarkets();
console.log(`重点国家市场: ${primaryMarkets.countries.length} 个`);
console.log(`美国免税州: ${primaryMarkets.usTaxFreeStates.length} 个`);
console.log(`总计主要市场: ${primaryMarkets.total} 个\n`);

console.log('🎯 重点国家市场:');
primaryMarkets.countries.forEach(country => {
  console.log(`- ${country.name}: ${country.rate}% (${country.note})`);
});

console.log('\n🆓 美国免税州 (推荐):');
primaryMarkets.usTaxFreeStates.forEach(state => {
  console.log(`- ${state.name}: 0% (${state.note})`);
});

// 税费节省分析
console.log('\n💡 税费节省分析 (基于$100订单)\n');
const savings = [];

primaryMarketTests.forEach(test => {
  try {
    const result = taxService.calculateTax(test.data);
    if (result.taxAmount === 0) {
      // 计算相比平均税率的节省
      const avgTaxRate = 10; // 假设平均税率10%
      const savedAmount = (test.data.subtotal * avgTaxRate) / 100;
      savings.push({
        region: test.name,
        saved: savedAmount
      });
    }
  } catch (error) {
    // 忽略错误
  }
});

if (savings.length > 0) {
  console.log('选择免税地区可节省的税费:');
  savings.forEach(item => {
    console.log(`${item.region}: 节省 $${item.saved.toFixed(2)}`);
  });
} else {
  console.log('当前测试中无免税地区');
}

console.log('\n✅ 主要市场测试完成！');
console.log('\n💼 建议: 优先推广美国免税州，为客户节省税费成本！');