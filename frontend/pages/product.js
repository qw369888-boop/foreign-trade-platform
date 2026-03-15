import React, { useState } from 'react';
import { ShoppingCart, MapPin, Calculator, Info } from 'lucide-react';

const ProductPage = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [taxPreview, setTaxPreview] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 示例产品数据
  const product = {
    id: 1,
    name: "时尚真皮手提包",
    price: 89.99,
    images: ["/api/placeholder/400/400"],
    description: "优质真皮制作，精工细作，适合商务和休闲使用。"
  };

  const calculateTaxPreview = async () => {
    if (!selectedCountry || !product.price) return;

    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          state: selectedState,
          subtotal: product.price * quantity,
          customerType: 'individual'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTaxPreview(data.data);
      }
    } catch (error) {
      console.error('税费预览计算失败:', error);
    }
  };

  React.useEffect(() => {
    if (selectedCountry) {
      calculateTaxPreview();
    }
  }, [selectedCountry, selectedState, quantity]);

  const getTaxPreviewDisplay = () => {
    if (!taxPreview) return null;

    const subtotal = product.price * quantity;

    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-sm">价格预览</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">商品价格:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {taxPreview.taxable && taxPreview.taxAmount > 0 ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">税费 ({taxPreview.taxRate}%):</span>
                <span>${taxPreview.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>含税价格:</span>
                <span>${taxPreview.total.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between font-semibold border-t pt-2 text-green-600">
              <span>总价 (免税):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
            {taxPreview.status === 'tax_free' && (
              <div className="flex items-center gap-1 text-green-600">
                <Info className="w-3 h-3" />
                <span>该地区享受免税优惠</span>
              </div>
            )}
            {taxPreview.status === 'taxable' && (
              <span>{taxPreview.note}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 产品图片 */}
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* 产品信息 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-blue-600 mt-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>

          {/* 数量选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              数量
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* 配送地区选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              查看配送地区价格
            </label>
            
            <div className="space-y-3">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState(''); // 重置州选择
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择国家/地区查看含税价格</option>
                <option value="US">美国 (United States)</option>
                <option value="AU">澳大利亚 (Australia)</option>
                <option value="TH">泰国 (Thailand)</option>
                <option value="SG">新加坡 (Singapore)</option>
                <option value="MY">马来西亚 (Malaysia)</option>
                <option value="ID">印度尼西亚 (Indonesia)</option>
                <option value="GB">英国 (United Kingdom)</option>
                <option value="CA">加拿大 (Canada)</option>
                <option value="JP">日本 (Japan)</option>
              </select>

              {/* 美国州选择 */}
              {selectedCountry === 'US' && (
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">选择州</option>
                  <option value="OR">Oregon (免税州)</option>
                  <option value="DE">Delaware (免税州)</option>
                  <option value="NH">New Hampshire (免税州)</option>
                  <option value="MT">Montana (免税州)</option>
                  <option value="AK">Alaska (免税州)</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="WA">Washington</option>
                </select>
              )}
            </div>

            {/* 税费预览 */}
            {getTaxPreviewDisplay()}
          </div>

          {/* 购买按钮 */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              加入购物车
            </button>
            
            <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              立即购买
            </button>
          </div>

          {/* 配送说明 */}
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">配送说明</h4>
            <ul className="space-y-1">
              <li>• 全球免费配送，订单满$50</li>
              <li>• 标准配送时间：5-10个工作日</li>
              <li>• 税费根据配送地址实时计算</li>
              <li>• 支持30天无理由退换货</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;