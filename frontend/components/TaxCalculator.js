import React, { useState, useEffect } from 'react';
import { Calculator, MapPin, AlertCircle, CheckCircle, Info } from 'lucide-react';

const TaxCalculator = ({ 
  subtotal = 0, 
  items = [], 
  onTaxCalculated = () => {},
  className = "" 
}) => {
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    customerType: 'individual',
    taxId: ''
  });
  
  const [taxResult, setTaxResult] = useState(null);
  const [taxInfo, setTaxInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regions, setRegions] = useState({ usStates: [], countries: [] });

  // 获取支持的地区列表
  useEffect(() => {
    fetchRegions();
  }, []);

  // 当地区改变时获取税收信息
  useEffect(() => {
    if (formData.country) {
      fetchTaxInfo();
    }
  }, [formData.country, formData.state]);

  // 当表单数据或小计改变时自动计算税费
  useEffect(() => {
    if (formData.country && subtotal > 0) {
      calculateTax();
    }
  }, [formData, subtotal]);

  const fetchRegions = async () => {
    try {
      const response = await fetch('/api/tax/regions');
      const data = await response.json();
      if (data.success) {
        setRegions(data.data);
      }
    } catch (error) {
      console.error('获取地区列表失败:', error);
    }
  };

  const fetchTaxInfo = async () => {
    if (!formData.country) return;
    
    try {
      const params = new URLSearchParams({ country: formData.country });
      if (formData.state) params.append('state', formData.state);
      
      const response = await fetch(`/api/tax/info?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTaxInfo(data.data);
      }
    } catch (error) {
      console.error('获取税收信息失败:', error);
    }
  };

  const calculateTax = async () => {
    if (!formData.country || subtotal <= 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          subtotal,
          items
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTaxResult(data.data);
        onTaxCalculated(data.data);
      } else {
        setError(data.message || '计算失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
      console.error('税费计算失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateTaxId = async () => {
    if (!formData.taxId || !formData.country) return;
    
    try {
      const response = await fetch('/api/tax/validate-tax-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taxId: formData.taxId,
          country: formData.country
        })
      });
      
      const data = await response.json();
      return data.success ? data.data.valid : false;
    } catch (error) {
      console.error('税号验证失败:', error);
      return false;
    }
  };

  const getTaxStatusIcon = () => {
    if (!taxResult) return null;
    
    switch (taxResult.status) {
      case 'tax_free':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'tax_exempt':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'taxable':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTaxStatusColor = () => {
    if (!taxResult) return 'bg-gray-50';
    
    switch (taxResult.status) {
      case 'tax_free':
        return 'bg-green-50 border-green-200';
      case 'tax_exempt':
        return 'bg-blue-50 border-blue-200';
      case 'taxable':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">税费计算器</h3>
      </div>

      {/* 地区选择 */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            配送国家/地区
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择国家/地区</option>
            <option value="US">美国 (United States)</option>
            {regions.countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* 美国州选择 */}
        {formData.country === 'US' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              州 (State)
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择州</option>
              {regions.usStates.map(state => (
                <option key={state.code} value={state.code}>
                  {state.name} {!state.taxable && '(免税州)'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 客户类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            客户类型
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="individual"
                checked={formData.customerType === 'individual'}
                onChange={(e) => handleInputChange('customerType', e.target.value)}
                className="mr-2"
              />
              个人客户
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="business"
                checked={formData.customerType === 'business'}
                onChange={(e) => handleInputChange('customerType', e.target.value)}
                className="mr-2"
              />
              企业客户
            </label>
          </div>
        </div>

        {/* 税号输入 (企业客户) */}
        {formData.customerType === 'business' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              税号 (Tax ID / VAT Number)
            </label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => handleInputChange('taxId', e.target.value)}
              placeholder="输入企业税号以申请免税"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              企业客户提供有效税号可能享受免税优惠
            </p>
          </div>
        )}
      </div>

      {/* 税收信息显示 */}
      {taxInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">地区税收政策</h4>
          <div className="text-sm text-blue-800">
            <p><strong>地区:</strong> {taxInfo.country} {taxInfo.state && `- ${taxInfo.state}`}</p>
            <p><strong>税率:</strong> {taxInfo.taxable ? `${taxInfo.rate}%` : '免税'}</p>
            {taxInfo.totalMaxRate && taxInfo.totalMaxRate > taxInfo.rate && (
              <p><strong>最高税率:</strong> {taxInfo.totalMaxRate}% (含地方税)</p>
            )}
            <p><strong>说明:</strong> {taxInfo.note}</p>
          </div>
        </div>
      )}

      {/* 计算结果 */}
      {taxResult && (
        <div className={`p-4 border rounded-lg ${getTaxStatusColor()}`}>
          <div className="flex items-center gap-2 mb-3">
            {getTaxStatusIcon()}
            <h4 className="font-medium text-gray-900">税费计算结果</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>商品小计:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {taxResult.taxable && (
              <>
                <div className="flex justify-between">
                  <span>税率:</span>
                  <span>{taxResult.taxRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>税费:</span>
                  <span>${taxResult.taxAmount.toFixed(2)}</span>
                </div>
                
                {/* 税费明细 */}
                {taxResult.breakdown && (
                  <div className="pl-4 border-l-2 border-gray-200 mt-2">
                    {taxResult.breakdown.stateTax > 0 && (
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>州税:</span>
                        <span>${taxResult.breakdown.stateTax.toFixed(2)}</span>
                      </div>
                    )}
                    {taxResult.breakdown.localTax > 0 && (
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>地方税:</span>
                        <span>${taxResult.breakdown.localTax.toFixed(2)}</span>
                      </div>
                    )}
                    {taxResult.breakdown.vat > 0 && (
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>VAT:</span>
                        <span>${taxResult.breakdown.vat.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>总计:</span>
                <span>${taxResult.total.toFixed(2)}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mt-2">
              {taxResult.message}
            </p>
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="mt-4 flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">计算中...</span>
        </div>
      )}

      {/* 免税州提示 */}
      {formData.country === 'US' && taxResult?.status === 'tax_free' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">
              恭喜！{taxInfo?.state}是美国免税州，您无需支付销售税！
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculator;