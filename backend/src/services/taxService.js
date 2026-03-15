const { US_SALES_TAX_DATA, INTERNATIONAL_TAX_DATA, TAX_THRESHOLDS } = require('../data/taxData');

class TaxCalculationService {
  
  /**
   * 计算订单税费
   * @param {Object} orderData - 订单数据
   * @param {string} orderData.country - 国家代码 (US, CA, GB等)
   * @param {string} orderData.state - 州/省代码 (仅美国需要)
   * @param {string} orderData.city - 城市 (可选，用于精确地方税)
   * @param {number} orderData.subtotal - 订单小计
   * @param {Array} orderData.items - 商品列表
   * @param {string} orderData.customerType - 客户类型 (individual/business)
   * @param {string} orderData.taxId - 税号 (可选)
   * @returns {Object} 税费计算结果
   */
  calculateTax(orderData) {
    const { country, state, city, subtotal, items, customerType = 'individual', taxId } = orderData;
    
    // 验证输入
    if (!country || !subtotal || subtotal <= 0) {
      throw new Error('Invalid order data: country and subtotal are required');
    }
    
    // 美国税收计算
    if (country === 'US') {
      return this.calculateUSTax(state, city, subtotal, items, customerType, taxId);
    }
    
    // 国际税收计算
    return this.calculateInternationalTax(country, subtotal, items, customerType, taxId);
  }
  
  /**
   * 计算美国销售税
   */
  calculateUSTax(state, city, subtotal, items, customerType, taxId) {
    if (!state) {
      throw new Error('State is required for US tax calculation');
    }
    
    const stateCode = state.toUpperCase();
    const taxData = US_SALES_TAX_DATA[stateCode];
    
    if (!taxData) {
      throw new Error(`Invalid US state code: ${stateCode}`);
    }
    
    // 免税州
    if (taxData.status === 'tax_free') {
      return {
        taxable: false,
        taxRate: 0,
        taxAmount: 0,
        total: subtotal,
        breakdown: {
          stateTax: 0,
          localTax: 0,
          totalTax: 0
        },
        status: 'tax_free',
        message: `${taxData.state}是免税州`,
        note: taxData.note
      };
    }
    
    // 检查是否有税号豁免 (企业客户)
    if (customerType === 'business' && taxId) {
      return {
        taxable: false,
        taxRate: 0,
        taxAmount: 0,
        total: subtotal,
        breakdown: {
          stateTax: 0,
          localTax: 0,
          totalTax: 0
        },
        status: 'tax_exempt',
        message: '企业客户税号豁免',
        note: `税号: ${taxId}`
      };
    }
    
    // 计算州税
    const stateTaxRate = taxData.rate;
    const stateTaxAmount = (subtotal * stateTaxRate) / 100;
    
    // 计算地方税 (简化处理，使用平均值)
    const localTaxRate = taxData.localMax ? taxData.localMax / 2 : 0;
    const localTaxAmount = (subtotal * localTaxRate) / 100;
    
    const totalTaxRate = stateTaxRate + localTaxRate;
    const totalTaxAmount = stateTaxAmount + localTaxAmount;
    const total = subtotal + totalTaxAmount;
    
    return {
      taxable: true,
      taxRate: parseFloat(totalTaxRate.toFixed(2)),
      taxAmount: parseFloat(totalTaxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      breakdown: {
        stateTax: parseFloat(stateTaxAmount.toFixed(2)),
        localTax: parseFloat(localTaxAmount.toFixed(2)),
        totalTax: parseFloat(totalTaxAmount.toFixed(2))
      },
      status: 'taxable',
      message: `${taxData.state}需要缴纳销售税`,
      note: taxData.note
    };
  }
  
  /**
   * 计算国际税收 (VAT/GST)
   */
  calculateInternationalTax(country, subtotal, items, customerType, taxId) {
    const countryCode = country.toUpperCase();
    const taxData = INTERNATIONAL_TAX_DATA[countryCode];
    
    if (!taxData) {
      // 未知国家，默认免税
      return {
        taxable: false,
        taxRate: 0,
        taxAmount: 0,
        total: subtotal,
        breakdown: {
          vat: 0,
          totalTax: 0
        },
        status: 'unknown_country',
        message: '未知国家，暂不收取税费',
        note: '请联系客服确认税收政策'
      };
    }
    
    // 企业客户VAT豁免 (欧盟等)
    if (customerType === 'business' && taxId && ['GB', 'DE', 'FR', 'IT', 'ES', 'NL'].includes(countryCode)) {
      return {
        taxable: false,
        taxRate: 0,
        taxAmount: 0,
        total: subtotal,
        breakdown: {
          vat: 0,
          totalTax: 0
        },
        status: 'vat_exempt',
        message: '企业客户VAT豁免',
        note: `VAT号: ${taxId}`
      };
    }
    
    // 计算VAT/GST
    const taxRate = taxData.rate;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    
    return {
      taxable: true,
      taxRate: parseFloat(taxRate.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      breakdown: {
        vat: parseFloat(taxAmount.toFixed(2)),
        totalTax: parseFloat(taxAmount.toFixed(2))
      },
      status: 'taxable',
      message: `${taxData.country}需要缴纳${taxData.note}`,
      note: taxData.note
    };
  }
  
  /**
   * 获取地区税收信息
   */
  getTaxInfo(country, state = null) {
    if (country === 'US' && state) {
      const stateCode = state.toUpperCase();
      const taxData = US_SALES_TAX_DATA[stateCode];
      
      if (!taxData) {
        return { error: `Invalid US state code: ${stateCode}` };
      }
      
      return {
        country: 'United States',
        state: taxData.state,
        taxable: taxData.status !== 'tax_free',
        rate: taxData.rate,
        localMaxRate: taxData.localMax || 0,
        totalMaxRate: taxData.rate + (taxData.localMax || 0),
        status: taxData.status,
        note: taxData.note
      };
    }
    
    const countryCode = country.toUpperCase();
    const taxData = INTERNATIONAL_TAX_DATA[countryCode];
    
    if (!taxData) {
      return {
        country: country,
        taxable: false,
        rate: 0,
        status: 'unknown',
        note: '未知国家税收政策'
      };
    }
    
    return {
      country: taxData.country,
      taxable: true,
      rate: taxData.rate,
      status: taxData.status,
      note: taxData.note
    };
  }
  
  /**
   * 验证税号格式
   */
  validateTaxId(taxId, country) {
    if (!taxId) return false;
    
    const patterns = {
      'US': /^\d{2}-\d{7}$/, // EIN格式
      'GB': /^GB\d{9}$/, // UK VAT
      'DE': /^DE\d{9}$/, // German VAT
      'FR': /^FR[A-Z]{2}\d{9}$/, // French VAT
      'CA': /^\d{9}RT\d{4}$/ // Canadian GST
    };
    
    const pattern = patterns[country.toUpperCase()];
    return pattern ? pattern.test(taxId) : true; // 未知格式默认通过
  }
  
  /**
   * 获取所有支持的地区列表
   */
  getSupportedRegions() {
    const usStates = Object.entries(US_SALES_TAX_DATA).map(([code, data]) => ({
      country: 'US',
      code: code,
      name: data.state,
      taxable: data.status !== 'tax_free',
      rate: data.rate,
      region: 'North America'
    }));
    
    const countries = Object.entries(INTERNATIONAL_TAX_DATA).map(([code, data]) => ({
      country: code,
      code: code,
      name: data.country,
      taxable: data.status !== 'tax_free',
      rate: data.rate,
      region: data.region
    }));
    
    return {
      usStates,
      countries
    };
  }

  /**
   * 按地区分组获取国家列表 (按优先级排序)
   */
  getRegionGroups() {
    const countries = Object.entries(INTERNATIONAL_TAX_DATA).map(([code, data]) => ({
      country: code,
      code: code,
      name: data.country,
      taxable: data.status !== 'tax_free',
      rate: data.rate,
      region: data.region,
      priority: data.priority || 'low',
      note: data.note
    }));

    // 按地区分组
    const regionGroups = countries.reduce((groups, country) => {
      const region = country.region;
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(country);
      return groups;
    }, {});

    // 排序每个地区内的国家 (优先级 + 字母顺序)
    Object.keys(regionGroups).forEach(region => {
      regionGroups[region].sort((a, b) => {
        // 优先级排序: high > medium > low
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        const priorityDiff = (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
        
        if (priorityDiff !== 0) {
          return priorityDiff;
        }
        
        // 相同优先级按字母顺序
        return a.name.localeCompare(b.name);
      });
    });

    return regionGroups;
  }

  /**
   * 获取主要目标市场
   */
  getPrimaryMarkets() {
    const allCountries = Object.entries(INTERNATIONAL_TAX_DATA).map(([code, data]) => ({
      country: code,
      code: code,
      name: data.country,
      taxable: data.status !== 'tax_free',
      rate: data.rate,
      region: data.region,
      priority: data.priority || 'low',
      note: data.note
    }));

    // 筛选高优先级市场
    const primaryMarkets = allCountries.filter(country => country.priority === 'high');
    
    // 添加美国免税州
    const usTaxFreeStates = Object.entries(US_SALES_TAX_DATA)
      .filter(([code, data]) => data.status === 'tax_free')
      .map(([code, data]) => ({
        country: 'US',
        state: code,
        code: code,
        name: `美国${data.state}`,
        taxable: false,
        rate: 0,
        region: 'North America',
        priority: 'high',
        note: data.note,
        type: 'state'
      }));

    return {
      countries: primaryMarkets.sort((a, b) => a.name.localeCompare(b.name)),
      usTaxFreeStates: usTaxFreeStates,
      total: primaryMarkets.length + usTaxFreeStates.length
    };
  }

  /**
   * 获取免税地区列表
   */
  getTaxFreeRegions() {
    // 美国免税州
    const taxFreeStates = Object.entries(US_SALES_TAX_DATA)
      .filter(([code, data]) => data.status === 'tax_free')
      .map(([code, data]) => ({
        country: 'US',
        code: code,
        name: data.state,
        type: 'state',
        note: data.note
      }));

    // 免税国家
    const taxFreeCountries = Object.entries(INTERNATIONAL_TAX_DATA)
      .filter(([code, data]) => data.status === 'tax_free')
      .map(([code, data]) => ({
        country: code,
        code: code,
        name: data.country,
        type: 'country',
        region: data.region,
        note: data.note
      }));

    return {
      states: taxFreeStates,
      countries: taxFreeCountries,
      total: taxFreeStates.length + taxFreeCountries.length
    };
  }
}

module.exports = new TaxCalculationService();