'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Toast from '../components/Toast'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiShoppingCart, FiCheck } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'

// 分类映射函数
const getCategoryKey = (category) => {
  const categoryMap = {
    '手提包': 'handbags',
    '托特包': 'tote_bags', 
    '单肩包': 'shoulder_bags',
    '斜挎包': 'crossbody_bags',
    '背包': 'backpacks',
    '钱包': 'wallets',
    '手提袋': 'tote_bags',
    '肩包': 'shoulder_bags'
  }
  return categoryMap[category] || 'handbags'
}

export default function ProductsPage() {
  const router = useRouter()
  const { category } = router.query
  const isZh = router.asPath.startsWith('/zh')
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedProducts, setAddedProducts] = useState(new Set())
  const [showToast, setShowToast] = useState(false)

  const text = {
    all_products: isZh ? '所有产品' : 'All Products',
    products_available: isZh ? '个产品可选' : 'products available',
    loading: isZh ? '加载产品中...' : 'Loading products...',
    load_error: isZh ? '加载产品出错' : 'Error loading products',
    no_products: isZh ? '未找到产品' : 'No products found',
    add_to_cart: isZh ? '添加到购物车' : 'Add to Cart',
    added: isZh ? '已添加!' : 'Added!',
    buy_now: isZh ? '立即购买' : 'Buy Now',
    toast_message: isZh ? '已添加到购物车！' : 'Added to cart!'
  }

  useEffect(() => {
    loadProducts()
  }, [category])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // 使用静态数据文件
      const response = await fetch('/data/products.json')
      const allProducts = await response.json()
      
      let filteredProducts = allProducts
      
      // 根据分类过滤
      if (category) {
        // 处理分类映射
        const categoryMap = {
          'electronics': 'Handbags',
          'fashion': 'Tote Bags', 
          'industrial': 'Shoulder Bags',
          'home': 'Crossbody Bags'
        }
        const actualCategory = categoryMap[category] || category
        filteredProducts = allProducts.filter(product => 
          product.category === actualCategory
        )
      }
      
      // 限制数量
      filteredProducts = filteredProducts.slice(0, 50)
      
      setProducts(filteredProducts)
    } catch (err) {
      console.error('Load products error:', err)
      setError(text.load_error + ': ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    // 解析 MOQ：如果是字符串"100 Pieces"，提取数字；如果是数字，直接使用
    let quantity = 1
    if (product.moq) {
      if (typeof product.moq === 'string') {
        // 从字符串中提取数字，例如 "100 Pieces" -> 100
        const match = product.moq.match(/\d+/)
        quantity = match ? parseInt(match[0]) : 1
      } else if (typeof product.moq === 'number') {
        quantity = product.moq
      }
    }
    console.log('🛒 Adding to cart:', product, 'Quantity:', quantity, 'MOQ:', product.moq)
    addToCart(product, quantity)
    console.log('✅ Cart updated')
    setAddedProducts(prev => new Set(prev).add(product.id))
    setShowToast(true)
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
      setShowToast(false)
    }, 2000)
  }

  return (
    <Layout>
      <Toast 
        show={showToast} 
        message={text.toast_message} 
        type="success"
        onClose={() => setShowToast(false)}
      />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">
                {category || text.all_products}
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              {products.length} {text.products_available}
            </p>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">{text.loading}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  isZh={isZh}
                  text={text}
                  addedProducts={addedProducts}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">{text.no_products}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function ProductCard({ product, index, isZh, text, addedProducts, handleAddToCart }) {
  const images = Array.isArray(product.images) ? product.images : []
  const mainImage = images[0] || '/placeholder.jpg'

  const categoryText = {
    'Handbags': isZh ? '手提包' : 'Handbags',
    'Tote Bags': isZh ? '托特包' : 'Tote Bags',
    'Shoulder Bags': isZh ? '单肩包' : 'Shoulder Bags',
    'Crossbody Bags': isZh ? '斜挎包' : 'Crossbody Bags',
    'Backpacks': isZh ? '背包' : 'Backpacks',
    'Wallets': isZh ? '钱包' : 'Wallets'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
      }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -10 }}
        className="glass-strong rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 relative h-full flex flex-col"
      >
        {/* Product Image - Clickable */}
        <Link href={`${isZh ? '/zh' : ''}/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-white cursor-pointer">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            
            {/* Hover Overlay with Two Buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 gap-3">
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddToCart(e, product)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-4/5 px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-xl transition-all ${
                  addedProducts.has(product.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                }`}
              >
                {addedProducts.has(product.id) ? (
                  <>
                    <FiCheck className="w-5 h-5" />
                    {text.added}
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="w-5 h-5" />
                    {text.add_to_cart}
                  </>
                )}
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.location.href = `${isZh ? '/zh' : ''}/checkout?product=${product.id}`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-4/5 px-6 py-3 rounded-full bg-white text-dark-900 font-semibold shadow-xl transition-all"
              >
                {text.buy_now}
              </motion.button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-6 flex-1 flex flex-col">
          <Link href={`${isZh ? '/zh' : ''}/products/${product.id}`}>
            <h3 className="text-lg font-bold mb-2 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-neon-blue hover:to-neon-purple transition-all duration-300 line-clamp-2 flex-1 cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Category */}
          <p className="text-sm text-gray-500 mb-3">
            {categoryText[product.category] || product.category}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-2xl font-bold gradient-text">${product.price}</span>
              {product.compare_price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.compare_price}
                </span>
              )}
            </div>
          </div>

          {/* MOQ */}
          {product.moq && (
            <p className="text-xs text-gray-500 mt-2">MOQ: {product.moq}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}