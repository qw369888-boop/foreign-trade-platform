const taxService = require('./src/services/taxService');

console.log('🧪 税收计算服务测试 (扩展版)\n');

// 测试用例
const testCases = [
  {
    name: '美国免税州 - 俄勒冈州',
    data: {
      country: 'US',
      state: 'OR',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '美国有税州 - 加利福尼亚州',
    data: {
      country: 'US',
      state: 'CA',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  // 东南亚国家测试
  {
    name: '新加坡个人客户',
    data: {
      country: 'SG',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '马来西亚个人客户',
    data: {
      country: 'MY',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '泰国个人客户',
    data: {
      country: 'TH',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '印度尼西亚个人客户',
    data: {
      country: 'ID',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '菲律宾个人客户',
    data: {
      country: 'PH',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '越南个人客户',
    data: {
      country: 'VN',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '文莱 (免税国家)',
    data: {
      country: 'BN',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  // 澳洲和新西兰
  {
    name: '澳大利亚个人客户',
    data: {
      country: 'AU',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '新西兰个人客户',
    data: {
      country: 'NZ',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  // 中东地区
  {
    name: '阿联酋个人客户',
    data: {
      country: 'AE',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '沙特阿拉伯个人客户',
    data: {
      country: 'SA',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '卡塔尔 (免税国家)',
    data: {
      country: 'QA',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  // 香港特别行政区
  {
    name: '香港 (免税地区)',
    data: {
      country: 'HK',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  // 欧洲高税率国家
  {
    name: '匈牙利 (最高VAT)',
    data: {
      country: 'HU',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  {
    name: '瑞典个人客户',
    data: {
      country: 'SE',
      subtotal: 100.00,
      customerType: 'individual'
    }
  },
  // 企业客户免税测试
  {
    name: '德国企业客户 (有VAT号)',
    data: {
      country: 'DE',
      subtotal: 100.00,
      customerType: 'business',
      taxId: 'DE123456789'
    }
  }
];

// 运行测试
testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`);
  console.log('   输入:', JSON.stringify(testCase.data, null, 2));
  
  try {
    const result = taxService.calculateTax(testCase.data);
    console.log('   结果:');
    console.log(`   - 应税: ${result.taxable ? '是' : '否'}`);
    console.log(`   - 税率: ${result.taxRate}%`);
    console.log(`   - 税费: $${result.taxAmount}`);
    console.log(`   - 总计: $${result.total}`);
    console.log(`   - 状态: ${result.status}`);
    console.log(`   - 说明: ${result.message}`);
    
    if (result.breakdown) {
      console.log('   - 明细:');
      Object.entries(result.breakdown).forEach(([key, value]) => {
        if (value > 0) {
          console.log(`     ${key}: $${value}`);
        }
      });
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error.message}`);
  }
  
  console.log('');
});

// 测试地区分组功能
console.log('🌍 地区分组测试\n');
const regionGroups = taxService.getRegionGroups();
Object.entries(regionGroups).forEach(([region, countries]) => {
  console.log(`${region} (${countries.length} 个国家):`);
  countries.slice(0, 5).forEach(country => {
    console.log(`  - ${country.name}: ${country.taxable ? country.rate + '%' : '免税'}`);
  });
  if (countries.length > 5) {
    console.log(`  ... 还有 ${countries.length - 5} 个国家`);
  }
  console.log('');
});

// 测试免税地区
console.log('🆓 免税地区测试\n');
const taxFreeRegions = taxService.getTaxFreeRegions();
console.log(`总共 ${taxFreeRegions.total} 个免税地区:`);

console.log(`\n免税州 (${taxFreeRegions.states.length} 个):`);
taxFreeRegions.states.forEach(state => {
  console.log(`- ${state.name} (${state.code})`);
});

console.log(`\n免税国家 (${taxFreeRegions.countries.length} 个):`);
taxFreeRegions.countries.forEach(country => {
  console.log(`- ${country.name} (${country.region})`);
});

// 显示各地区税率统计
console.log('\n📊 各地区税率统计\n');
const allCountries = Object.values(regionGroups).flat();
const taxRateStats = {
  '免税 (0%)': allCountries.filter(c => !c.taxable).length,
  '低税率 (1-10%)': allCountries.filter(c => c.taxable && c.rate <= 10).length,
  '中等税率 (11-20%)': allCountries.filter(c => c.taxable && c.rate > 10 && c.rate <= 20).length,
  '高税率 (21%+)': allCountries.filter(c => c.taxable && c.rate > 20).length
};

Object.entries(taxRateStats).forEach(([range, count]) => {
  console.log(`${range}: ${count} 个国家`);
});

console.log('\n✅ 扩展测试完成！');