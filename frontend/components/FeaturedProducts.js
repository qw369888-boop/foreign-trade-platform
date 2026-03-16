'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCart } from '../contexts/CartContext'
import Toast from './Toast'

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

export default function FeaturedProducts() {
  const { t, i18n } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = [
    { name: 'All', nameCN: '全部', nameDB: '', key: 'categories.all' },
    { name: 'Hot Sale', nameCN: '热卖', nameDB: '热卖', key: 'categories.hot_sale' },
    { name: '2026 New Arrivals', nameCN: '2026新品', nameDB: '2026新来者', key: 'categories.new_arrivals' },
    { name: 'Handbags', nameCN: '手提包', nameDB: '手提包', key: 'categories.handbags' },
    { name: 'Tote Bags', nameCN: '托特包', nameDB: '手提袋', key: 'categories.tote_bags' },
    { name: 'Shoulder Bags', nameCN: '单肩包', nameDB: '肩包', key: 'categories.shoulder_bags' },
    { name: 'Crossbody Bags', nameCN: '斜挎包', nameDB: '斜挎包', key: 'categories.crossbody_bags' },
  ]

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // 使用静态数据文件
        const response = await fetch('/data/products.json')
        const allProducts = await response.json()
        
        let filteredProducts = allProducts
        
        // 根据选中的分类过滤产品
        if (selectedCategory !== 'All') {
          const category = categories.find(c => c.name === selectedCategory)
          if (category) {
            // 根据不同的分类名称进行匹配
            filteredProducts = allProducts.filter(product => {
              // 处理特殊分类
              if (selectedCategory === 'Hot Sale') {
                // 热卖产品：价格较低或有折扣的产品
                return product.compare_price && product.price < product.compare_price
              } else if (selectedCategory === '2026 New Arrivals') {
                // 2026新品：产品名称包含2026或Fashion的
                return product.name.includes('2026') || product.name.includes('Fashion')
              } else {
                // 其他分类：根据产品分类或名称匹配
                const categoryNames = [category.name, category.nameDB, category.nameCN]
                return categoryNames.some(catName => 
                  product.category === catName || 
                  product.name.toLowerCase().includes(catName.toLowerCase()) ||
                  (catName === 'Handbags' && (product.category === 'Handbags' || product.name.includes('Bag'))) ||
                  (catName === 'Tote Bags' && product.name.includes('Tote')) ||
                  (catName === 'Shoulder Bags' && product.name.includes('Shoulder')) ||
                  (catName === 'Crossbody Bags' && product.name.includes('Crossbody')) ||
                  (catName === 'Backpacks' && product.name.includes('Backpack')) ||
                  (catName === 'Wallets' && product.name.includes('Wallet'))
                )
              }
            })
          }
        }
        
        // 限制显示数量为8个
        setProducts(filteredProducts.slice(0, 8))
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategory, i18n.language])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-900 to-dark-800" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <motion.div
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="gradient-text">{t('products.title') || 'Featured Products'}</span>
          </motion.h2>
        </motion.div>

        {/* Clean Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {categories.map((category, index) => {
              const isActive = selectedCategory === category.name
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className="relative group"
                >
                  <div className={`
                    px-8 py-4 rounded-xl font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-white text-dark-900 shadow-2xl shadow-white/20' 
                      : 'bg-dark-800/60 text-gray-400 hover:bg-dark-700/80 hover:text-gray-200 border border-white/5'
                    }
                  `}>
                    <span className="block text-base font-semibold">
                      {t(category.key) || (i18n.language === 'zh' ? category.nameCN : category.name)}
                    </span>
                  </div>

                  {/* Active glow effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white blur-xl opacity-30 rounded-xl -z-10"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-12 h-12 border-4 border-neon-blue/30 border-t-neon-blue rounded-full"
            />
            <p className="mt-4">{t('products.loading') || '加载中...'}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">{t('products.no_products') || '该分类暂无产品'}</p>
          </div>
        ) : (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.slice(0, 8).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link href={selectedCategory === 'All' ? '/products' : `/products?category=${encodeURIComponent(selectedCategory)}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary btn-glow group"
            >
              <span className="flex items-center gap-2">
                {t('products.view_all') || 'View All Products'}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ProductCard({ product, index, isInView }) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { addToCart } = useCart()
  const [showToast, setShowToast] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const images = Array.isArray(product.images) ? product.images : []
  const imageUrl = images.length > 0 ? images[0] : '/placeholder.jpg'

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // 解析 MOQ：如果是字符串 "100 Pieces"，提取数字；如果是数字，直接使用
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
    
    console.log('🛒 Add to Cart - Product:', product)
    console.log('🛒 Add to Cart - Quantity:', quantity)
    console.log('🛒 Add to Cart - addToCart function:', typeof addToCart)
    
    addToCart(product, quantity)
    setAddedToCart(true)
    setShowToast(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // 解析 MOQ
    let quantity = 1
    if (product.moq) {
      if (typeof product.moq === 'string') {
        const match = product.moq.match(/\d+/)
        quantity = match ? parseInt(match[0]) : 1
      } else if (typeof product.moq === 'number') {
        quantity = product.moq
      }
    }
    
    console.log('🛒 Buy Now - Adding product to cart:', { product, quantity })
    addToCart(product, quantity)
    
    // 使用 setTimeout 确保购物车状态更新后再跳转
    setTimeout(() => {
      console.log('🛒 Buy Now - Navigating to checkout')
      router.push('/checkout')
    }, 100)
    
    return false
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -10 }}
        className="glass-strong rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 relative"
      >
        {/* Product Badge */}
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg"
          >
            {t('products.new') || 'New'}
          </motion.div>
        </div>

        {/* Product Image - Clickable */}
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square bg-white/5 overflow-hidden group/image cursor-pointer">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/image:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
            
            <motion.img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
              whileHover={{ scale: 1.1 }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-6">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-blue group-hover:to-neon-purple transition-all duration-300 cursor-pointer">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-500 mb-4 line-clamp-1">
            {t(`categories.${getCategoryKey(product.category)}`) || product.category}
          </p>

          {/* Price and Buttons */}
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-neon-blue">${product.price}</span>
                {product.compare_price && (
                  <span className="text-sm text-gray-500 line-through">${product.compare_price}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('products.moq')}: {product.moq || '100 Pieces'}</p>
            </div>

            {/* Two Buttons - NOT wrapped in Link */}
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm"
              >
                {addedToCart ? `✓ ${t('products.added') || 'Added'}` : (t('products.add_to_cart') || 'Add to Cart')}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="w-full px-4 py-2 rounded-full font-semibold bg-white text-dark-900 text-sm"
              >
                {t('products.buy_now') || 'Buy Now'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10" />
        </div>
      </motion.div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={t('products.added_to_cart') || '已添加到购物车！'}
          onClose={() => setShowToast(false)}
        />
      )}
    </motion.div>
  )
}
