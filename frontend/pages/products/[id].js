import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import ProductCard from '../../components/ProductCard'
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useCart } from '../../contexts/CartContext'
import Toast from '../../components/Toast'

const relatedProducts = [
  {
    id: 2,
    name: 'Smart Watch Pro',
    description: 'Track your fitness and stay connected',
    price: 299.99,
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Wireless Earbuds',
    description: 'Compact and powerful sound',
    price: 79.99,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'USB-C Cable Premium',
    description: 'Fast charging and data transfer',
    price: 19.99,
    rating: 4.6,
    reviews: 423,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Phone Stand Aluminum',
    description: 'Adjustable and stable',
    price: 24.99,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
  },
]

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()
  const [showToast, setShowToast] = useState(false)

  // 获取产品数据
  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetch(`${baseUrl}/api/products/${id}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setProductData(data.data)
          setError(null)
        } else {
          setError('产品未找到')
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('加载产品信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!productData) return
    addToCart(productData, quantity)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleBuyNow = () => {
    if (!productData) return
    addToCart(productData, quantity)
    setTimeout(() => {
      router.push('/checkout')
    }, 100)
  }

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1)
  }

  // 加载状态
  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">加载产品信息中...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // 错误状态
  if (error || !productData) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">产品未找到</h1>
            <p className="text-gray-600 mb-6">{error || '请求的产品不存在'}</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回产品列表
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // 处理图片数组
  const images = Array.isArray(productData.images) ? productData.images : []
  const hasImages = images.length > 0
  const displayImages = hasImages ? images : ['/placeholder.jpg']

  return (
    <Layout>
      <Toast 
        show={showToast} 
        message="已添加到购物车！" 
        type="success"
        onClose={() => setShowToast(false)}
      />
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-secondary-600 mb-8">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-primary-600">Products</a>
          <span>/</span>
          <span className="text-secondary-900">{productData.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-secondary-100 rounded-2xl overflow-hidden mb-4 aspect-square"
            >
              <img
                src={displayImages[selectedImage]}
                alt={productData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg'
                }}
              />
            </motion.div>
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-secondary-100 rounded-lg overflow-hidden aspect-square ${
                      selectedImage === index ? 'ring-2 ring-primary-600' : ''
                    }`}
                  >
                    <img 
                      src={image} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-secondary-900 mb-2">
                  {productData.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(productData.rating || 4.5) ? 'text-yellow-400' : 'text-secondary-300'}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-secondary-600 ml-2">
                      {productData.rating || 4.5} ({productData.reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center hover:bg-primary-50 hover:text-primary-600">
                  <FiHeart />
                </button>
                <button className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center hover:bg-primary-50 hover:text-primary-600">
                  <FiShare2 />
                </button>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-primary-600">${productData.price}</span>
              {productData.compare_price && (
                <span className="text-2xl text-secondary-400 line-through">
                  ${productData.compare_price}
                </span>
              )}
              {productData.compare_price && (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                  Save {Math.round((1 - productData.price / productData.compare_price) * 100)}%
                </span>
              )}
            </div>

            <p className="text-secondary-700 text-lg mb-6">{productData.description || '暂无产品描述'}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-3 h-3 rounded-full ${productData.inStock !== false ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-semibold">
                {productData.inStock !== false ? 'In Stock' : 'Out of Stock'}
              </span>
              {productData.sku && (
                <span className="text-secondary-600">SKU: {productData.sku}</span>
              )}
            </div>

            {/* MOQ Info */}
            {productData.moq && (
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>MOQ (最小订单量):</strong> {productData.moq}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-secondary-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-secondary-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={handleQuantityIncrease}
                    className="px-4 py-2 hover:bg-secondary-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <FiShoppingCart />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="px-8 py-3 bg-secondary-900 text-white rounded-lg font-semibold hover:bg-secondary-800 transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-secondary-50 rounded-xl">
              <div className="flex flex-col items-center text-center">
                <FiTruck className="w-8 h-8 text-primary-600 mb-2" />
                <span className="text-sm font-semibold">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiShield className="w-8 h-8 text-primary-600 mb-2" />
                <span className="text-sm font-semibold">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiRefreshCw className="w-8 h-8 text-primary-600 mb-2" />
                <span className="text-sm font-semibold">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="border-b border-secondary-200 mb-8">
            <div className="flex gap-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'description' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Product Description</h3>
              <p className="text-secondary-700 mb-6">{productData.description || '暂无产品描述'}</p>
              {productData.features && productData.features.length > 0 && (
                <>
                  <h4 className="font-bold text-lg mb-3">Key Features:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {productData.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-primary-600">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {productData.category && (
                <div className="mt-6">
                  <h4 className="font-bold text-lg mb-2">Category:</h4>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    {productData.category}
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Product Specifications</h3>
              {productData.specifications && Object.keys(productData.specifications).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-4 bg-secondary-50 rounded-lg">
                      <span className="font-semibold">{key}</span>
                      <span className="text-secondary-700">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between p-4 bg-secondary-50 rounded-lg">
                    <span className="font-semibold">Price</span>
                    <span className="text-secondary-700">${productData.price}</span>
                  </div>
                  {productData.moq && (
                    <div className="flex justify-between p-4 bg-secondary-50 rounded-lg">
                      <span className="font-semibold">MOQ</span>
                      <span className="text-secondary-700">{productData.moq}</span>
                    </div>
                  )}
                  {productData.category && (
                    <div className="flex justify-between p-4 bg-secondary-50 rounded-lg">
                      <span className="font-semibold">Category</span>
                      <span className="text-secondary-700">{productData.category}</span>
                    </div>
                  )}
                  {productData.sku && (
                    <div className="flex justify-between p-4 bg-secondary-50 rounded-lg">
                      <span className="font-semibold">SKU</span>
                      <span className="text-secondary-700">{productData.sku}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
              <p className="text-secondary-600">Reviews coming soon...</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }],
    fallback: true,
  }
}

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
