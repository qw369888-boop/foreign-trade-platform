import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AddressForm = ({ onAddressChange, onTaxCalculated, subtotal }) => {
  const router = useRouter();
  const isZh = router.asPath.startsWith('/zh');

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    country: '',
    state: '',
    postalCode: '',
    phone: ''
  });

  const [customerType, setCustomerType] = useState('individual');

  const countries = [
    { code: 'US', name: isZh ? '美国' : 'United States' },
    { code: 'CN', name: isZh ? '中国' : 'China' },
    { code: 'GB', name: isZh ? '英国' : 'United Kingdom' },
    { code: 'DE', name: isZh ? '德国' : 'Germany' },
    { code: 'FR', name: isZh ? '法国' : 'France' },
    { code: 'JP', name: isZh ? '日本' : 'Japan' },
    { code: 'KR', name: isZh ? '韩国' : 'South Korea' },
    { code: 'AU', name: isZh ? '澳大利亚' : 'Australia' }
  ];

  const handleInputChange = (field, value) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    onAddressChange && onAddressChange(newAddress);
  };

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
  };

  // 模拟税费计算
  useEffect(() => {
    if (address.country && subtotal) {
      const taxRates = {
        'US': 0.08,
        'CN': 0.13,
        'GB': 0.20,
        'DE': 0.19,
        'FR': 0.20,
        'JP': 0.10,
        'KR': 0.10,
        'AU': 0.10
      };
      
      const rate = taxRates[address.country] || 0.1;
      const taxAmount = subtotal * rate;
      
      onTaxCalculated && onTaxCalculated({
        rate: rate,
        amount: taxAmount,
        country: address.country
      });
    }
  }, [address.country, subtotal, onTaxCalculated]);

  const text = {
    customer_type: isZh ? '客户类型' : 'Customer Type',
    individual: isZh ? '个人客户' : 'Individual Customer',
    business: isZh ? '企业客户' : 'Business Customer',
    first_name: isZh ? '名字' : 'First Name',
    last_name: isZh ? '姓氏' : 'Last Name',
    company: isZh ? '公司名称' : 'Company Name',
    address: isZh ? '地址' : 'Address',
    apartment: isZh ? '公寓/单元号' : 'Apartment/Unit',
    city: isZh ? '城市' : 'City',
    country: isZh ? '国家' : 'Country',
    state: isZh ? '州/省' : 'State/Province',
    postal_code: isZh ? '邮政编码' : 'Postal Code',
    phone: isZh ? '电话' : 'Phone',
    select_country: isZh ? '选择国家' : 'Select Country'
  };

  return (
    <div className="space-y-6">
      {/* 客户类型选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {text.customer_type}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="customerType"
              value="individual"
              checked={customerType === 'individual'}
              onChange={(e) => handleCustomerTypeChange(e.target.value)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">{text.individual}</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="customerType"
              value="business"
              checked={customerType === 'business'}
              onChange={(e) => handleCustomerTypeChange(e.target.value)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">{text.business}</span>
          </label>
        </div>
      </div>

      {/* 姓名 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.first_name} *
          </label>
          <input
            type="text"
            value={address.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.last_name} *
          </label>
          <input
            type="text"
            value={address.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* 公司名称（企业客户） */}
      {customerType === 'business' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.company} *
          </label>
          <input
            type="text"
            value={address.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={customerType === 'business'}
          />
        </div>
      )}

      {/* 地址 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {text.address} *
        </label>
        <input
          type="text"
          value={address.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* 公寓/单元号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {text.apartment}
        </label>
        <input
          type="text"
          value={address.apartment}
          onChange={(e) => handleInputChange('apartment', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 城市、国家、州/省、邮编 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.city} *
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.country} *
          </label>
          <select
            value={address.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">{text.select_country}</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.state}
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.postal_code} *
          </label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* 电话 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {text.phone}
        </label>
        <input
          type="tel"
          value={address.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default AddressForm;