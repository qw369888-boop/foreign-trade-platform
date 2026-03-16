import React, { useState, useEffect } from 'react';
import { MapPin, Calculator, Info } from 'lucide-react';
import { useRouter } from 'next/router';

const AddressForm = ({ 
  onAddressChange = () => {},
  onTaxCalculated = () => {},
  subtotal = 0,
  className = ""
}) => {
  const router = useRouter();
  const isZh = router.asPath.startsWith('/zh');
  
  // 静态文本
  const text = {
    country: isZh ? '国家' : 'Country',
    state: isZh ? '州/省' : 'State/Province', 
    city: isZh ? '城市' : 'City',
    zipCode: isZh ? '邮政编码' : 'Postal Code',
    street: isZh ? '详细地址' : 'Street Address',
    customerType: isZh ? '客户类型' : 'Customer Type',
    individual: isZh ? '个人客户' : 'Individual Customer',
    business: isZh ? '企业客户' : 'Business Customer',
    taxId: isZh ? '税号' : 'Tax ID',
    calculating: isZh ? '计算中...' : 'Calculating...',
    selectCountry: isZh ? '请选择国家' : 'Select Country',
    enterState: isZh ? '输入州/省' : 'Enter State/Province',
    enterCity: isZh ? '输入城市' : 'Enter City',
    enterZipCode: isZh ? '输入邮政编码' : 'Enter Postal Code',
    enterStreet: isZh ? '输入详细地址' : 'Enter Street Address',
    enterTaxId: isZh ? '输入税号（企业客户必填）' : 'Enter Tax ID (Required for Business)'
  };
  const [address, setAddress] = useState({
    country: '',
    state: '',
    city: '',
    zipCode: '',
    street: '',
    customerType: 'individual',
    taxId: ''
  });

  const [taxResult, setTaxResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 当地址改变时自动计算税费
  useEffect(() => {
    if (address.country && subtotal > 0) {
      calculateTax();
    }
  }, [address.country, address.state, address.customerType, address.taxId, subtotal]);

  const calculateTax = async () => {
    if (!address.country || subtotal <= 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: address.country,
          state: address.state,
          subtotal,
          customerType: address.customerType,
          taxId: address.taxId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTaxResult(data.data);
        onTaxCalculated(data.data);
      }
    } catch (error) {
      console.error('税费计算失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    onAddressChange(newAddress);
  };

  const getTaxStatusDisplay = () => {
    if (!taxResult) return null;

    if (taxResult.status === 'tax_free') {
      return (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <Info className="w-4 h-4" />
            <span className="font-medium">{t('address.tax_free_region') || 'Tax-free region'}</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            {t('address.no_sales_tax') || 'Your order is not subject to sales tax'}
          </p>
        </div>
      );
    }

    if (taxResult.status === 'tax_exempt') {
      return (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Info className="w-4 h-4" />
            <span className="font-medium">{t('address.business_tax_exempt') || 'Business tax exempt'}</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            {t('address.tax_exempt_benefit') || 'Your business tax ID qualifies for tax exemption'}
          </p>
        </div>
      );
    }

    if (taxResult.taxable) {
      return (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800 mb-2">
            <Calculator className="w-4 h-4" />
            <span className="font-medium">税费信息</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-orange-700">税率:</span>
              <span className="font-medium text-orange-900">{taxResult.taxRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-700">税费:</span>
              <span className="font-medium text-orange-900">${taxResult.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-orange-200">
              <span className="text-orange-700 font-medium">含税总计:</span>
              <span className="font-semibold text-orange-900">${taxResult.total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">
            {taxResult.note}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <div className="space-y-4">
        {/* 国家选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            {t('address.country') || 'Country/Region'} *
          </label>
          <select
            value={address.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">{t('address.select_country') || 'Please select country/region'}</option>
            <option value="US">{t('address.country_us') || 'United States'}</option>
            <option value="AU">{t('address.country_au') || 'Australia'}</option>
            <option value="TH">{t('address.country_th') || 'Thailand'}</option>
            <option value="SG">{t('address.country_sg') || 'Singapore'}</option>
            <option value="MY">{t('address.country_my') || 'Malaysia'}</option>
            <option value="ID">{t('address.country_id') || 'Indonesia'}</option>
            <option value="GB">{t('address.country_gb') || 'United Kingdom'}</option>
            <option value="CA">{t('address.country_ca') || 'Canada'}</option>
            <option value="JP">{t('address.country_jp') || 'Japan'}</option>
            <option value="DE">{t('address.country_de') || 'Germany'}</option>
            <option value="FR">{t('address.country_fr') || 'France'}</option>
          </select>
        </div>

        {/* 美国州选择 */}
        {address.country === 'US' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('address.state') || 'State'} *
            </label>
            <select
              value={address.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t('address.select_state') || 'Please select state'}</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska ({t('address.tax_free_state') || 'Tax-free state'})</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware ({t('address.tax_free_state') || 'Tax-free state'})</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana (免税州)</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire (免税州)</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon (免税州)</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
              <option value="DC">Washington D.C.</option>
            </select>
          </div>
        )}

        {/* 城市和邮编 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('address.city') || 'City'} *
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('address.enter_city') || 'Enter city name'}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('address.zip_code') || 'Zip Code'} *
            </label>
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('address.enter_zip') || 'Enter postal code'}
              required
            />
          </div>
        </div>

        {/* 详细地址 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('address.street_address') || 'Street Address'} *
          </label>
          <textarea
            value={address.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('address.enter_address') || 'Street address, apartment, suite, etc.'}
            required
          />
        </div>

        {/* 客户类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('address.customer_type') || 'Customer Type'}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="individual"
                checked={address.customerType === 'individual'}
                onChange={(e) => handleInputChange('customerType', e.target.value)}
                className="mr-2"
              />
              {t('address.individual_customer') || 'Individual Customer'}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="business"
                checked={address.customerType === 'business'}
                onChange={(e) => handleInputChange('customerType', e.target.value)}
                className="mr-2"
              />
              {t('address.business_customer') || 'Business Customer'}
            </label>
          </div>
        </div>

        {/* 企业税号 */}
        {address.customerType === 'business' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('address.tax_id') || 'Business Tax ID'} ({t('address.optional') || 'Optional'})
            </label>
            <input
              type="text"
              value={address.taxId}
              onChange={(e) => handleInputChange('taxId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('address.enter_tax_id') || 'Enter business tax ID for tax exemption'}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('address.tax_id_help') || 'Provide valid business tax ID to qualify for tax exemption'}
            </p>
          </div>
        )}

        {/* 税费显示 */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">正在计算税费...</span>
          </div>
        )}

        {getTaxStatusDisplay()}
      </div>
    </div>
  );
};

export default AddressForm;