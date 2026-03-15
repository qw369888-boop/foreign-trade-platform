const express = require('express');
const router = express.Router();
const taxService = require('../services/taxService');
const { body, query, validationResult } = require('express-validator');

/**
 * 计算订单税费
 * POST /api/tax/calculate
 */
router.post('/calculate', [
  body('country').notEmpty().withMessage('国家代码不能为空'),
  body('subtotal').isFloat({ min: 0.01 }).withMessage('订单金额必须大于0'),
  body('state').optional().isString(),
  body('city').optional().isString(),
  body('customerType').optional().isIn(['individual', 'business']),
  body('taxId').optional().isString(),
  body('items').optional().isArray()
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入参数错误',
        errors: errors.array()
      });
    }

    const orderData = req.body;
    
    // 验证美国订单必须提供州代码
    if (orderData.country === 'US' && !orderData.state) {
      return res.status(400).json({
        success: false,
        message: '美国订单必须提供州代码'
      });
    }

    // 计算税费
    const taxResult = taxService.calculateTax(orderData);

    res.json({
      success: true,
      data: {
        ...taxResult,
        calculation: {
          subtotal: orderData.subtotal,
          taxRate: taxResult.taxRate,
          taxAmount: taxResult.taxAmount,
          total: taxResult.total
        }
      }
    });

  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || '税费计算失败'
    });
  }
});

/**
 * 获取地区税收信息
 * GET /api/tax/info?country=US&state=CA
 */
router.get('/info', [
  query('country').notEmpty().withMessage('国家代码不能为空'),
  query('state').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入参数错误',
        errors: errors.array()
      });
    }

    const { country, state } = req.query;
    const taxInfo = taxService.getTaxInfo(country, state);

    if (taxInfo.error) {
      return res.status(400).json({
        success: false,
        message: taxInfo.error
      });
    }

    res.json({
      success: true,
      data: taxInfo
    });

  } catch (error) {
    console.error('Tax info error:', error);
    res.status(500).json({
      success: false,
      message: '获取税收信息失败'
    });
  }
});

/**
 * 验证税号
 * POST /api/tax/validate-tax-id
 */
router.post('/validate-tax-id', [
  body('taxId').notEmpty().withMessage('税号不能为空'),
  body('country').notEmpty().withMessage('国家代码不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入参数错误',
        errors: errors.array()
      });
    }

    const { taxId, country } = req.body;
    const isValid = taxService.validateTaxId(taxId, country);

    res.json({
      success: true,
      data: {
        valid: isValid,
        taxId: taxId,
        country: country,
        message: isValid ? '税号格式正确' : '税号格式不正确'
      }
    });

  } catch (error) {
    console.error('Tax ID validation error:', error);
    res.status(500).json({
      success: false,
      message: '税号验证失败'
    });
  }
});

/**
 * 获取支持的地区列表
 * GET /api/tax/regions
 */
router.get('/regions', async (req, res) => {
  try {
    const regions = taxService.getSupportedRegions();

    res.json({
      success: true,
      data: regions
    });

  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({
      success: false,
      message: '获取地区列表失败'
    });
  }
});

/**
 * 按地区分组获取国家列表
 * GET /api/tax/regions/grouped
 */
router.get('/regions/grouped', async (req, res) => {
  try {
    const regionGroups = taxService.getRegionGroups();

    res.json({
      success: true,
      data: regionGroups
    });

  } catch (error) {
    console.error('Get region groups error:', error);
    res.status(500).json({
      success: false,
      message: '获取地区分组失败'
    });
  }
});

/**
 * 获取主要目标市场
 * GET /api/tax/regions/primary
 */
router.get('/regions/primary', async (req, res) => {
  try {
    const primaryMarkets = taxService.getPrimaryMarkets();

    res.json({
      success: true,
      data: primaryMarkets
    });

  } catch (error) {
    console.error('Get primary markets error:', error);
    res.status(500).json({
      success: false,
      message: '获取主要市场失败'
    });
  }
});

/**
 * 获取免税地区列表
 * GET /api/tax/regions/tax-free
 */
router.get('/regions/tax-free', async (req, res) => {
  try {
    const taxFreeRegions = taxService.getTaxFreeRegions();

    res.json({
      success: true,
      data: taxFreeRegions
    });

  } catch (error) {
    console.error('Get tax-free regions error:', error);
    res.status(500).json({
      success: false,
      message: '获取免税地区失败'
    });
  }
});

/**
 * 批量计算多个地区的税费 (用于比较)
 * POST /api/tax/batch-calculate
 */
router.post('/batch-calculate', [
  body('subtotal').isFloat({ min: 0.01 }).withMessage('订单金额必须大于0'),
  body('regions').isArray().withMessage('地区列表必须是数组'),
  body('regions.*.country').notEmpty().withMessage('国家代码不能为空'),
  body('customerType').optional().isIn(['individual', 'business']),
  body('taxId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入参数错误',
        errors: errors.array()
      });
    }

    const { subtotal, regions, customerType, taxId, items } = req.body;
    const results = [];

    for (const region of regions) {
      try {
        const orderData = {
          country: region.country,
          state: region.state,
          city: region.city,
          subtotal,
          customerType,
          taxId,
          items
        };

        const taxResult = taxService.calculateTax(orderData);
        
        results.push({
          region: region,
          tax: taxResult,
          savings: subtotal - taxResult.total // 相对于含税价格的节省
        });
      } catch (error) {
        results.push({
          region: region,
          error: error.message
        });
      }
    }

    // 按总价排序
    results.sort((a, b) => {
      if (a.error || b.error) return 0;
      return a.tax.total - b.tax.total;
    });

    res.json({
      success: true,
      data: {
        subtotal,
        results,
        bestOption: results.find(r => !r.error) || null
      }
    });

  } catch (error) {
    console.error('Batch calculation error:', error);
    res.status(500).json({
      success: false,
      message: '批量计算失败'
    });
  }
});

module.exports = router;