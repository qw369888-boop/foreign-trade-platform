// 美国各州销售税数据 (2026年最新)
const US_SALES_TAX_DATA = {
  // 免税州 (No Sales Tax)
  'AK': { state: 'Alaska', rate: 0, status: 'tax_free', note: '免税州' },
  'DE': { state: 'Delaware', rate: 0, status: 'tax_free', note: '免税州' },
  'MT': { state: 'Montana', rate: 0, status: 'tax_free', note: '免税州' },
  'NH': { state: 'New Hampshire', rate: 0, status: 'tax_free', note: '免税州' },
  'OR': { state: 'Oregon', rate: 0, status: 'tax_free', note: '免税州' },
  
  // 有销售税的州
  'AL': { state: 'Alabama', rate: 4.0, localMax: 7.0, status: 'taxable', note: '州税4%，地方税最高7%' },
  'AZ': { state: 'Arizona', rate: 5.6, localMax: 5.3, status: 'taxable', note: '州税5.6%，地方税最高5.3%' },
  'AR': { state: 'Arkansas', rate: 6.5, localMax: 5.125, status: 'taxable', note: '州税6.5%，地方税最高5.125%' },
  'CA': { state: 'California', rate: 7.25, localMax: 3.0, status: 'taxable', note: '州税7.25%，地方税最高3%' },
  'CO': { state: 'Colorado', rate: 2.9, localMax: 8.3, status: 'taxable', note: '州税2.9%，地方税最高8.3%' },
  'CT': { state: 'Connecticut', rate: 6.35, localMax: 0, status: 'taxable', note: '州税6.35%，无地方税' },
  'FL': { state: 'Florida', rate: 6.0, localMax: 2.5, status: 'taxable', note: '州税6%，地方税最高2.5%' },
  'GA': { state: 'Georgia', rate: 4.0, localMax: 4.9, status: 'taxable', note: '州税4%，地方税最高4.9%' },
  'HI': { state: 'Hawaii', rate: 4.0, localMax: 0.5, status: 'taxable', note: '州税4%，地方税最高0.5%' },
  'ID': { state: 'Idaho', rate: 6.0, localMax: 3.0, status: 'taxable', note: '州税6%，地方税最高3%' },
  'IL': { state: 'Illinois', rate: 6.25, localMax: 4.75, status: 'taxable', note: '州税6.25%，地方税最高4.75%' },
  'IN': { state: 'Indiana', rate: 7.0, localMax: 0, status: 'taxable', note: '州税7%，无地方税' },
  'IA': { state: 'Iowa', rate: 6.0, localMax: 1.0, status: 'taxable', note: '州税6%，地方税最高1%' },
  'KS': { state: 'Kansas', rate: 6.5, localMax: 4.0, status: 'taxable', note: '州税6.5%，地方税最高4%' },
  'KY': { state: 'Kentucky', rate: 6.0, localMax: 0, status: 'taxable', note: '州税6%，无地方税' },
  'LA': { state: 'Louisiana', rate: 4.45, localMax: 7.0, status: 'taxable', note: '州税4.45%，地方税最高7%' },
  'ME': { state: 'Maine', rate: 5.5, localMax: 0, status: 'taxable', note: '州税5.5%，无地方税' },
  'MD': { state: 'Maryland', rate: 6.0, localMax: 0, status: 'taxable', note: '州税6%，无地方税' },
  'MA': { state: 'Massachusetts', rate: 6.25, localMax: 0, status: 'taxable', note: '州税6.25%，无地方税' },
  'MI': { state: 'Michigan', rate: 6.0, localMax: 0, status: 'taxable', note: '州税6%，无地方税' },
  'MN': { state: 'Minnesota', rate: 6.875, localMax: 2.0, status: 'taxable', note: '州税6.875%，地方税最高2%' },
  'MS': { state: 'Mississippi', rate: 7.0, localMax: 1.0, status: 'taxable', note: '州税7%，地方税最高1%' },
  'MO': { state: 'Missouri', rate: 4.225, localMax: 5.763, status: 'taxable', note: '州税4.225%，地方税最高5.763%' },
  'NE': { state: 'Nebraska', rate: 5.5, localMax: 2.0, status: 'taxable', note: '州税5.5%，地方税最高2%' },
  'NV': { state: 'Nevada', rate: 6.85, localMax: 1.53, status: 'taxable', note: '州税6.85%，地方税最高1.53%' },
  'NJ': { state: 'New Jersey', rate: 6.625, localMax: 0, status: 'taxable', note: '州税6.625%，无地方税' },
  'NM': { state: 'New Mexico', rate: 5.125, localMax: 4.0, status: 'taxable', note: '州税5.125%，地方税最高4%' },
  'NY': { state: 'New York', rate: 4.0, localMax: 4.875, status: 'taxable', note: '州税4%，地方税最高4.875%' },
  'NC': { state: 'North Carolina', rate: 4.75, localMax: 2.75, status: 'taxable', note: '州税4.75%，地方税最高2.75%' },
  'ND': { state: 'North Dakota', rate: 5.0, localMax: 3.5, status: 'taxable', note: '州税5%，地方税最高3.5%' },
  'OH': { state: 'Ohio', rate: 5.75, localMax: 2.25, status: 'taxable', note: '州税5.75%，地方税最高2.25%' },
  'OK': { state: 'Oklahoma', rate: 4.5, localMax: 7.0, status: 'taxable', note: '州税4.5%，地方税最高7%' },
  'PA': { state: 'Pennsylvania', rate: 6.0, localMax: 2.0, status: 'taxable', note: '州税6%，地方税最高2%' },
  'RI': { state: 'Rhode Island', rate: 7.0, localMax: 0, status: 'taxable', note: '州税7%，无地方税' },
  'SC': { state: 'South Carolina', rate: 6.0, localMax: 2.0, status: 'taxable', note: '州税6%，地方税最高2%' },
  'SD': { state: 'South Dakota', rate: 4.2, localMax: 6.0, status: 'taxable', note: '州税4.2%，地方税最高6%' },
  'TN': { state: 'Tennessee', rate: 7.0, localMax: 2.75, status: 'taxable', note: '州税7%，地方税最高2.75%' },
  'TX': { state: 'Texas', rate: 6.25, localMax: 2.0, status: 'taxable', note: '州税6.25%，地方税最高2%' },
  'UT': { state: 'Utah', rate: 6.1, localMax: 4.35, status: 'taxable', note: '州税6.1%，地方税最高4.35%' },
  'VT': { state: 'Vermont', rate: 6.0, localMax: 1.0, status: 'taxable', note: '州税6%，地方税最高1%' },
  'VA': { state: 'Virginia', rate: 5.3, localMax: 0.7, status: 'taxable', note: '州税5.3%，地方税最高0.7%' },
  'WA': { state: 'Washington', rate: 6.5, localMax: 4.0, status: 'taxable', note: '州税6.5%，地方税最高4%' },
  'WV': { state: 'West Virginia', rate: 6.0, localMax: 1.0, status: 'taxable', note: '州税6%，地方税最高1%' },
  'WI': { state: 'Wisconsin', rate: 5.0, localMax: 1.75, status: 'taxable', note: '州税5%，地方税最高1.75%' },
  'WY': { state: 'Wyoming', rate: 4.0, localMax: 2.0, status: 'taxable', note: '州税4%，地方税最高2%' },
  'DC': { state: 'District of Columbia', rate: 6.0, localMax: 0, status: 'taxable', note: '华盛顿特区税6%' }
};

// 其他国家的VAT/GST税率 (重点市场)
const INTERNATIONAL_TAX_DATA = {
  // 北美洲 - 主要市场
  'CA': { country: 'Canada', rate: 5.0, provincialTax: true, status: 'taxable', note: 'GST 5% + 省税', region: 'North America', priority: 'high' },
  'MX': { country: 'Mexico', rate: 16.0, status: 'taxable', note: 'IVA 16%', region: 'North America', priority: 'medium' },

  // 欧洲 - 主要市场
  'GB': { country: 'United Kingdom', rate: 20.0, status: 'taxable', note: 'VAT 20%', region: 'Europe', priority: 'high' },
  'DE': { country: 'Germany', rate: 19.0, status: 'taxable', note: 'VAT 19%', region: 'Europe', priority: 'high' },
  'FR': { country: 'France', rate: 20.0, status: 'taxable', note: 'VAT 20%', region: 'Europe', priority: 'high' },
  'IT': { country: 'Italy', rate: 22.0, status: 'taxable', note: 'VAT 22%', region: 'Europe', priority: 'medium' },
  'ES': { country: 'Spain', rate: 21.0, status: 'taxable', note: 'VAT 21%', region: 'Europe', priority: 'medium' },
  'NL': { country: 'Netherlands', rate: 21.0, status: 'taxable', note: 'VAT 21%', region: 'Europe', priority: 'medium' },

  // 亚太地区 - 重点市场
  'AU': { country: 'Australia', rate: 10.0, status: 'taxable', note: 'GST 10%', region: 'Asia Pacific', priority: 'high' },
  'NZ': { country: 'New Zealand', rate: 15.0, status: 'taxable', note: 'GST 15%', region: 'Asia Pacific', priority: 'high' },
  'JP': { country: 'Japan', rate: 10.0, status: 'taxable', note: '消费税 10%', region: 'Asia Pacific', priority: 'high' },
  'KR': { country: 'South Korea', rate: 10.0, status: 'taxable', note: 'VAT 10%', region: 'Asia Pacific', priority: 'medium' },

  // 东南亚 - 重点市场
  'SG': { country: 'Singapore', rate: 8.0, status: 'taxable', note: 'GST 8%', region: 'Southeast Asia', priority: 'high' },
  'TH': { country: 'Thailand', rate: 7.0, status: 'taxable', note: 'VAT 7%', region: 'Southeast Asia', priority: 'high' },
  'MY': { country: 'Malaysia', rate: 6.0, status: 'taxable', note: 'SST 6%', region: 'Southeast Asia', priority: 'high' },
  'ID': { country: 'Indonesia', rate: 11.0, status: 'taxable', note: 'PPN 11%', region: 'Southeast Asia', priority: 'high' },
  'PH': { country: 'Philippines', rate: 12.0, status: 'taxable', note: 'VAT 12%', region: 'Southeast Asia', priority: 'medium' },
  'VN': { country: 'Vietnam', rate: 10.0, status: 'taxable', note: 'VAT 10%', region: 'Southeast Asia', priority: 'medium' },

  // 中东 - 重要市场
  'AE': { country: 'UAE', rate: 5.0, status: 'taxable', note: 'VAT 5%', region: 'Middle East', priority: 'high' },
  'SA': { country: 'Saudi Arabia', rate: 15.0, status: 'taxable', note: 'VAT 15%', region: 'Middle East', priority: 'medium' },

  // 其他重要市场
  'IN': { country: 'India', rate: 18.0, status: 'taxable', note: 'GST 18%', region: 'Asia Pacific', priority: 'medium' },
  'BR': { country: 'Brazil', rate: 17.0, status: 'taxable', note: 'ICMS ~17%', region: 'South America', priority: 'medium' },
  'ZA': { country: 'South Africa', rate: 15.0, status: 'taxable', note: 'VAT 15%', region: 'Africa', priority: 'medium' }
};

// 免税门槛 (美国各州)
const TAX_THRESHOLDS = {
  'CA': 500000, // 加州50万美元
  'NY': 500000, // 纽约50万美元
  'TX': 500000, // 德州50万美元
  'FL': 100000, // 佛州10万美元
  'WA': 100000, // 华盛顿州10万美元
  // 其他州默认门槛
  'default': 100000
};

module.exports = {
  US_SALES_TAX_DATA,
  INTERNATIONAL_TAX_DATA,
  TAX_THRESHOLDS
};