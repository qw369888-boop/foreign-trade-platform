import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart, CreditCard, Truck, User } from 'lucide-react';
import AddressForm from '../components/AddressForm';
import TaxDisplay from '../components/TaxDisplay';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CheckoutPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { cartItems, addToCart, isLoaded } = useCart();
  const [loading, setLoading] = useState(true);

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
      
      // 等待购物车数据加载完成
      if (!isLoaded) return;
      
      if (productId && cartItems.length === 0) {
        try {
          console.log('🛒 Direct purchase - fetching product:', productId);
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
          const response = await fetch(`${baseUrl}/api/products/${productId}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            const product = data.data;
            // 解析 MOQ
            let quantity = 1;
            if (product.moq) {
              if (typeof product.moq === 'string') {
                const match = product.moq.match(/\d+/);
                quantity = match ? parseInt(match[0]) : 1;
              } else if (typeof product.moq === 'number') {
                quantity = product.moq;
              }
            }
            
            console.log('🛒 Direct purchase - adding to cart:', { product, quantity });
            addToCart(product, quantity);
          }
        } catch (error) {
          console.error('Failed to fetch product for direct purchase:', error);
        }
      }
      setLoading(false);
    };

    // 只有当路由准备好且购物车数据加载完成时才执行
    if (router.isReady && isLoaded) {
      handleDirectPurchase();
    }
  }, [router.isReady, router.query, cartItems.length, addToCart, isLoaded]);

  // 计算小计
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.99;

  const handleAddressChange = (address) => {
    setShippingAddress(address);
  };

  const handleTaxCalculated = (tax) => {
    setTaxData(tax);
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const total = subtotal + shipping + (taxData?.taxAmount || 0);

  const isFormValid = () => {
    return (
      cartItems.length > 0 &&
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.email &&
      shippingAddress.country &&
      shippingAddress.city &&
      shippingAddress.zipCode &&
      shippingAddress.street &&
      (shippingAddress.country !== 'US' || shippingAddress.state)
    );
  };

  // 如果还在加载中或购物车数据未加载完成，显示加载状态
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('checkout.loading') || 'Loading...'}</h1>
            <p className="text-gray-600">{t('checkout.preparing_order') || 'Preparing your order'}</p>
          </div>
        </div>
      </div>
    );
  }

  // 如果购物车为空，显示提示
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('checkout.empty_cart') || 'Cart is empty'}</h1>
            <p className="text-gray-600 mb-6">{t('checkout.add_products_first') || 'Please add products to cart before checkout'}</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('checkout.continue_shopping') || 'Continue Shopping'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('checkout.title') || 'Checkout'}</h1>
          <p className="text-gray-600 mt-2">{t('checkout.subtitle') || 'Complete your order information'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧 - 客户信息和配送地址 */}
          <div className="space-y-6">
            {/* 客户信息 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">{t('checkout.customer_info') || 'Customer Information'}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.first_name') || 'First Name'} *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('checkout.enter_first_name') || 'Enter first name'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.last_name') || 'Last Name'} *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('checkout.enter_last_name') || 'Enter last name'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.email') || 'Email'} *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('checkout.enter_email') || 'Enter email address'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.phone') || 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('checkout.enter_phone') || 'Enter phone number'}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 配送地址 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">{t('checkout.shipping_address') || 'Shipping Address'}</h2>
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
                <h2 className="text-xl font-bold text-gray-900">{t('checkout.order_summary') || 'Order Summary'}</h2>
              </div>

              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : "/api/placeholder/100/100"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/100/100";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{t('checkout.quantity') || 'Quantity'}: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} {t('checkout.per_item') || 'per item'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 费用明细 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('checkout.cost_breakdown') || 'Cost Breakdown'}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('checkout.subtotal') || 'Subtotal'}:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('checkout.shipping') || 'Shipping'}:</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>

                {/* 税费显示 */}
                {shippingAddress.country && (
                  <TaxDisplay
                    subtotal={subtotal}
                    country={shippingAddress.country}
                    state={shippingAddress.state}
                    customerType={shippingAddress.customerType}
                    taxId={shippingAddress.taxId}
                    onTaxChange={handleTaxCalculated}
                    compact={true}
                  />
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('checkout.total') || 'Total'}:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* 税费说明 */}
                {taxData && (
                  <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                    <p>{taxData.message}</p>
                    {taxData.note && (
                      <p className="mt-1">{taxData.note}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 支付按钮 */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                disabled={!isFormValid()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                {t('checkout.pay_now') || 'Pay Now'} ${total.toFixed(2)}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                {t('checkout.terms_agreement') || 'By clicking pay, you agree to our terms of service and privacy policy'}
              </p>

              {/* 表单验证提示 */}
              {!isFormValid() && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  {t('checkout.complete_required_fields') || 'Please complete all required fields before payment'}
                </div>
              )}
            </div>

            {/* 安全提示 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">{t('checkout.secure_payment') || 'Secure Payment'}</span>
              </div>
              <p className="text-xs text-green-700">
                {t('checkout.security_message') || 'We use SSL encryption to protect your payment information and support multiple secure payment methods'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}