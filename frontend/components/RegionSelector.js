import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Search, Star } from 'lucide-react';

const RegionSelector = ({ 
  onRegionChange = () => {},
  selectedCountry = '',
  selectedState = '',
  showTaxInfo = true,
  className = ""
}) => {
  const [regions, setRegions] = useState({ usStates: [], countries: [] });
  const [regionGroups, setRegionGroups] = useState({});
  const [taxFreeRegions, setTaxFreeRegions] = useState({ states: [], countries: [], total: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [taxInfo, setTaxInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('popular'); // popular, regions, tax-free

  // 热门地区 (重点市场优先)
  const popularRegions = [
    // 美国免税州 - 最优选择
    { country: 'US', state: 'OR', name: '美国俄勒冈州 (免税)', taxFree: true, priority: 'top' },
    { country: 'US', state: 'DE', name: '美国特拉华州 (免税)', taxFree: true, priority: 'top' },
    { country: 'US', state: 'NH', name: '美国新罕布什尔州 (免税)', taxFree: true, priority: 'top' },
    
    // 主要目标市场
    { country: 'AU', name: '澳大利亚 (GST 10%)', taxFree: false, priority: 'high' },
    { country: 'TH', name: '泰国 (VAT 7%)', taxFree: false, priority: 'high' },
    { country: 'SG', name: '新加坡 (GST 8%)', taxFree: false, priority: 'high' },
    { country: 'MY', name: '马来西亚 (SST 6%)', taxFree: false, priority: 'high' },
    { country: 'ID', name: '印度尼西亚 (PPN 11%)', taxFree: false, priority: 'high' },
    
    // 其他重要市场
    { country: 'GB', name: '英国 (VAT 20%)', taxFree: false, priority: 'medium' },
    { country: 'CA', name: '加拿大 (GST 5%+)', taxFree: false, priority: 'medium' },
    { country: 'JP', name: '日本 (消费税 10%)', taxFree: false, priority: 'medium' },
    { country: 'DE', name: '德国 (VAT 19%)', taxFree: false, priority: 'medium' }
  ];

  useEffect(() => {
    fetchRegions();
    fetchRegionGroups();
    fetchTaxFreeRegions();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchTaxInfo();
    }
  }, [selectedCountry, selectedState]);

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

  const fetchRegionGroups = async () => {
    try {
      const response = await fetch('/api/tax/regions/grouped');
      const data = await response.json();
      if (data.success) {
        setRegionGroups(data.data);
      }
    } catch (error) {
      console.error('获取地区分组失败:', error);
    }
  };

  const fetchTaxFreeRegions = async () => {
    try {
      const response = await fetch('/api/tax/regions/tax-free');
      const data = await response.json();
      if (data.success) {
        setTaxFreeRegions(data.data);
      }
    } catch (error) {
      console.error('获取免税地区失败:', error);
    }
  };

  const fetchTaxInfo = async () => {
    if (!selectedCountry) return;
    
    try {
      const params = new URLSearchParams({ country: selectedCountry });
      if (selectedState) params.append('state', selectedState);
      
      const response = await fetch(`/api/tax/info?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTaxInfo(data.data);
      }
    } catch (error) {
      console.error('获取税收信息失败:', error);
    }
  };

  const handleRegionSelect = (country, state = '') => {
    onRegionChange({ country, state });
    setIsOpen(false);
  };

  const getDisplayName = () => {
    if (!selectedCountry) return '选择配送地区';
    
    if (selectedCountry === 'US' && selectedState) {
      const stateData = regions.usStates.find(s => s.code === selectedState);
      return stateData ? `美国 - ${stateData.name}` : `美国 - ${selectedState}`;
    }
    
    const countryData = regions.countries.find(c => c.code === selectedCountry);
    return countryData ? countryData.name : selectedCountry;
  };

  const filteredStates = regions.usStates.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCountries = regions.countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      {/* 选择器按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-gray-900">{getDisplayName()}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* 搜索框 */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索国家或地区..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* 标签页 */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab('popular')}
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  activeTab === 'popular' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                热门地区
              </button>
              <button
                onClick={() => setActiveTab('regions')}
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  activeTab === 'regions' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                按地区
              </button>
              <button
                onClick={() => setActiveTab('tax-free')}
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  activeTab === 'tax-free' 
                    ? 'text-green-600 border-b-2 border-green-600 bg-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                免税地区 ({taxFreeRegions.total})
              </button>
            </div>

            {/* 热门地区标签页 */}
            {activeTab === 'popular' && (
              <div className="p-3">
                <div className="space-y-1">
                  {popularRegions
                    .filter(region => !searchTerm || region.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((region, index) => (
                    <button
                      key={index}
                      onClick={() => handleRegionSelect(region.country, region.state)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center justify-between group"
                    >
                      <span className="text-sm text-gray-900">{region.name}</span>
                      {region.taxFree && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          免税
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* 美国各州快速选择 */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">美国各州</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {filteredStates.slice(0, 10).map(state => (
                      <button
                        key={state.code}
                        onClick={() => handleRegionSelect('US', state.code)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-900">{state.name}</span>
                        {!state.taxable && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                            免税
                          </span>
                        )}
                      </button>
                    ))}
                    {filteredStates.length > 10 && (
                      <p className="text-xs text-gray-500 px-3 py-1">
                        还有 {filteredStates.length - 10} 个州...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 按地区分组标签页 */}
            {activeTab === 'regions' && (
              <div className="p-3">
                {Object.entries(regionGroups)
                  .filter(([regionName, countries]) => 
                    !searchTerm || 
                    regionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    countries.some(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(([regionName, countries]) => (
                  <div key={regionName} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span>{regionName}</span>
                      <span className="text-xs text-gray-500">({countries.length})</span>
                    </h4>
                    <div className="space-y-1 pl-2">
                      {countries
                        .filter(country => !searchTerm || country.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(country => (
                        <button
                          key={country.code}
                          onClick={() => handleRegionSelect(country.code)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-900">{country.name}</span>
                          <div className="flex items-center gap-2">
                            {!country.taxable ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                免税
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">
                                {country.rate}%
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 免税地区标签页 */}
            {activeTab === 'tax-free' && (
              <div className="p-3">
                {/* 免税州 */}
                {taxFreeRegions.states.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                      <span>美国免税州</span>
                      <span className="text-xs text-green-600">({taxFreeRegions.states.length})</span>
                    </h4>
                    <div className="space-y-1">
                      {taxFreeRegions.states
                        .filter(state => !searchTerm || state.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(state => (
                        <button
                          key={state.code}
                          onClick={() => handleRegionSelect(state.country, state.code)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-green-50 flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-900">{state.name}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            免税州
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 免税国家 */}
                {taxFreeRegions.countries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                      <span>免税国家</span>
                      <span className="text-xs text-green-600">({taxFreeRegions.countries.length})</span>
                    </h4>
                    <div className="space-y-1">
                      {taxFreeRegions.countries
                        .filter(country => !searchTerm || country.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(country => (
                        <button
                          key={country.code}
                          onClick={() => handleRegionSelect(country.code)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-green-50 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-sm text-gray-900">{country.name}</span>
                            <p className="text-xs text-gray-600">{country.region}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            免税
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {taxFreeRegions.total === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">暂无免税地区数据</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 税收信息显示 */}
      {showTaxInfo && taxInfo && selectedCountry && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                {taxInfo.country} {taxInfo.state && `- ${taxInfo.state}`}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {taxInfo.taxable ? (
                  <>
                    税率: {taxInfo.rate}%
                    {taxInfo.totalMaxRate && taxInfo.totalMaxRate > taxInfo.rate && 
                      ` (最高 ${taxInfo.totalMaxRate}%)`
                    }
                  </>
                ) : (
                  '免税地区'
                )}
              </p>
              <p className="text-xs text-blue-600 mt-1">{taxInfo.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RegionSelector;