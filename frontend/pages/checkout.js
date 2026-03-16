import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart, CreditCard, Truck, User } from 'lucide-react';
import AddressForm from '../components/AddressForm';
import TaxDisplay from '../components/TaxDisplay';
import { useCart } from '../contexts/CartContext';

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, addToCart, isLoaded } = useCart();
  const [loading, setLoading] = useState(true);

  // 静态文本
  const text = {
    title: '结账',
    subtitle: '完成您的订单信息',
    customer_info: '客户信息',
    shipping_address: '配送地址',
    order_summary: '订单摘要',
    first_name: '名字',
    last_name: '姓氏',
    email: '邮箱',
    phone: '电话',
    individual_customer: '个人客户',
    business_customer: '企业客户',
    customer_type: '客户类型',
    pay_now: '立即支付',
    secure_payment: '安全支付保障',
    loading: '加载中...',
    empty_cart: '购物车为空',
    continue_shopping: '继续购物'
  };

  const [shippingAddress, setShippingAddress] = useState({});
  const [taxData, setTaxData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // 处理URL参数中的产品（立即购买功能）
  useEffect(() => {
    const handleDirectPurchase = async () => {
      const { product: productId } = router.query;
      
      if (!isLoaded) return;
      
      if (productId && cartItems.length === 0) {
        try {
          const response = await fetch('/data/products.json');
          const allProducts = await response.json();
          const product = allProducts.find(p => p.id.toString() === productId.toString());
          
          if (product) {
            let quantity = 1;
            if (product.moq) {
              if (typeof product.moq === 'string') {
                const match = product.moq.match(/\d+/);
                quantity = match ? parseInt(match[0]) : 1;
              } else if (typeof product.moq === 'number') {
                quantity = product.moq;
              }
            }
            addToCart(product, quantity);
          }
        } catch (error) {
          console.error('Failed to fetch product:', error);
        }
      }
      
      setLoading(false);
    };

    handleDirectPurchase();
  }, [router.query, isLoaded, cartItems.length, addToCart]);

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (address) => {
    setShippingAddress(address);
  };

  const handleTaxCalculated = (tax) => {
    setTaxData(tax);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15.99;
  const tax = taxData ? taxData.amount : subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const isFormValid = () => {
    return customerInfo.firstName && 
           customerInfo.lastName && 
           customerInfo.email && 
           customerInfo.phone &&
           shippingAddress.country &&
           shippingAddress.city &&
           shippingAddress.postalCode &&
           shippingAddress.address;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{text.loading}</h1>
          <p className="text-gray-600">正在准备您的订单</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{text.empty_cart}</h1>
          <p className="text-gray-600 mb-6">请先添加商品到购物车再进行结账</p>
          <button 
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {text.continue_shopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
          <p className="text-gray-600 mt-2">{text.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧 - 表单 */}
          <div className="space-y-6">
            {/* 客户信息 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">{text.customer_info}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.first_name} *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入名字"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.last_name} *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入姓氏"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.email} *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入邮箱地址"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.phone} *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入电话号码"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 配送地址 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">{text.shipping_address}</h2>
              </div>

              <AddressForm
                onAddressChange={handleAddressChange}
                onTaxCalculated={handleTaxCalculated}
                subtotal={subtotal}
              />
            </div>
          </div>

          {/* 右侧 - 订单摘要 */}
          <div className="space-y-6">
            {/* 购物车商品 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">{text.order_summary}</h2>
              </div>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={item.images?.[0] || '/placeholder.jpg'} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} 每件</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 费用明细 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">费用明细</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品小计:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">运费:</span>
                  <span className="font-medium">{shipping === 0 ? '免运费' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <TaxDisplay taxData={taxData} />
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>总计:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                disabled={!isFormValid()}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {text.pay_now} ${total.toFixed(2)}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                点击支付即表示您同意我们的服务条款和隐私政策
              </p>
              
              {!isFormValid() && (
                <p className="text-xs text-red-500 text-center mt-2">
                  请完善所有必填信息后再进行支付
                </p>
              )}
            </div>

            {/* 安全保障 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">{text.secure_payment}</span>
              </div>
              <p className="text-xs text-green-700">
                我们使用SSL加密技术保护您的支付信息，支持多种安全支付方式
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;