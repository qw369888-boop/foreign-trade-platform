'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { FiStar, FiShoppingCart, FiHeart, FiCheck } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import Toast from './Toast'

export default function ProductCard({ product, index = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setAdded(true)
    setShowToast(true)
    setTimeout(() => {
      setAdded(false)
      setShowToast(false)
    }, 2000)
  }

  return (
    <>
      <Toast 
        show={showToast} 
        message="已添加到购物车！" 
        type="success"
        onClose={() => setShowToast(false)}
      />
      <motion.div
        ref={ref}
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
          {/* Image Container */}
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-dark-700 to-dark-800 cursor-pointer">
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                📦
              </div>

              {/* Hover Overlay with Two Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/60 to-transparent flex flex-col items-center justify-end pb-6 gap-3"
              >
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-4/5 px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-xl transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <FiCheck className="w-5 h-5" />
                      已添加
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      添加购物车
                    </>
                  )}
                </motion.button>
                
                <Link href={`/checkout?product=${product.id}`} className="w-4/5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 rounded-full font-semibold bg-white text-dark-900 shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    立即购买
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-6">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-blue group-hover:to-neon-purple transition-all duration-300 cursor-pointer">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 4)
                        ? 'fill-neon-yellow text-neon-yellow'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {product.rating || 4.5} ({product.reviews || 100})
              </span>
            </div>

            {/* Price and Buttons */}
            <div className="space-y-3">
              <div className="text-2xl font-bold gradient-text">
                ${product.price}
              </div>
              
              {/* Two Buttons */}
              <div className="flex flex-col gap-2">
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-4 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <FiCheck className="w-4 h-4" />
                      已添加
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-4 h-4" />
                      添加购物车
                    </>
                  )}
                </motion.button>
                
                <Link href={`/products/${product.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2.5 rounded-full font-semibold bg-white text-dark-900 transition-all"
                  >
                    立即购买
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

      {/* 3D Shadow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 rounded-3xl transform translate-y-2 -z-10 group-hover:translate-y-4 transition-transform duration-300" />
    </motion.div>
    </>
  )
}
