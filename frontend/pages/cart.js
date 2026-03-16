import Layout from '../components/Layout'
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')
  const { cartItems, removeFromCart, updateQuantity } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const text = {
    title: isZh ? '购物车' : 'Shopping Cart',
    item_count: isZh ? '件商品' : 'item',
    items_count: isZh ? '件商品' : 'items',
    empty_title: isZh ? '购物车为空' : 'Your cart is empty',
    empty_message: isZh ? '还没有添加任何商品到购物车' : 'You haven\'t added any items to your cart yet',
    continue_shopping: isZh ? '继续购物' : 'Continue Shopping',
    remove_item: isZh ? '移除商品' : 'Remove item',
    subtotal: isZh ? '小计' : 'Subtotal',
    order_summary: isZh ? '订单摘要' : 'Order Summary',
    shipping: isZh ? '运费' : 'Shipping',
    free_shipping: isZh ? '免运费' : 'Free',
    tax: isZh ? '税费' : 'Tax',
    total: isZh ? '总计' : 'Total',
    free_shipping_tip: isZh ? '再购买' : 'Add',
    free_shipping_tip_end: isZh ? '即可享受免运费' : 'more for free shipping',
    proceed_checkout: isZh ? '去结账' : 'Proceed to Checkout'
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="gradient-text">{text.title}</span>
            </h1>
            <p className="text-xl text-gray-300">
              {cartItems.length} {cartItems.length === 1 ? text.item_count : text.items_count}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-900"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="glass-strong rounded-3xl p-12 max-w-2xl mx-auto border border-white/10">
                <FiShoppingBag className="w-24 h-24 mx-auto text-neon-blue mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">{text.empty_title}</h2>
                <p className="text-gray-400 mb-8 text-lg">{text.empty_message}</p>
                <Link href={isZh ? "/zh/products" : "/products"}>
                  <button className="btn-primary btn-glow">
                    {text.continue_shopping}
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="glass-strong rounded-3xl overflow-hidden border border-white/10">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-6 p-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all group"
                      >
                        <Link href={`${isZh ? '/zh' : ''}/products/${item.id}`} className="relative flex-shrink-0">
                          <div className="w-28 h-28 rounded-xl bg-white overflow-hidden ring-2 ring-white/10 group-hover:ring-neon-blue/50 transition-all">
                            <img
                              src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '/placeholder.jpg'}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/20 to-transparent rounded-xl pointer-events-none"></div>
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-white line-clamp-2">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title={text.remove_item}
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <p className="text-2xl font-bold gradient-text mb-4">
                            ${item.price.toFixed(2)}
                          </p>
                          
                          <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex items-center glass-strong rounded-xl border border-white/10 overflow-hidden">
                              <button
                                onClick={() => {
                                  let moq = 1
                                  if (item.moq) {
                                    if (typeof item.moq === 'string') {
                                      const match = item.moq.match(/\d+/)
                                      moq = match ? parseInt(match[0]) : 1
                                    } else if (typeof item.moq === 'number') {
                                      moq = item.moq
                                    }
                                  }
                                  const newQuantity = item.quantity - 1
                                  if (newQuantity >= moq) {
                                    updateQuantity(item.id, newQuantity)
                                  }
                                }}
                                disabled={(() => {
                                  let moq = 1
                                  if (item.moq) {
                                    if (typeof item.moq === 'string') {
                                      const match = item.moq.match(/\d+/)
                                      moq = match ? parseInt(match[0]) : 1
                                    } else if (typeof item.moq === 'number') {
                                      moq = item.moq
                                    }
                                  }
                                  return item.quantity <= moq
                                })()}
                                className="px-4 py-2 hover:bg-white/10 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <input
                                type="text"
                                defaultValue={item.quantity}
                                key={item.quantity}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value !== '' && !/^\d+$/.test(value)) {
                                    e.target.value = item.quantity
                                    return
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = e.target.value
                                  let moq = 1
                                  if (item.moq) {
                                    if (typeof item.moq === 'string') {
                                      const match = item.moq.match(/\d+/)
                                      moq = match ? parseInt(match[0]) : 1
                                    } else if (typeof item.moq === 'number') {
                                      moq = item.moq
                                    }
                                  }
                                  const numValue = parseInt(value)
                                  if (value === '' || isNaN(numValue) || numValue < moq) {
                                    updateQuantity(item.id, moq)
                                    e.target.value = moq
                                  } else {
                                    updateQuantity(item.id, numValue)
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur()
                                  }
                                }}
                                className="w-20 px-4 py-2 font-bold text-white text-center bg-transparent border-x border-white/10 focus:outline-none focus:bg-white/5"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-4 py-2 hover:bg-white/10 transition-colors text-white"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                            {item.moq && (
                              <div className="text-xs text-gray-500">
                                MOQ: {item.moq}
                              </div>
                            )}
                            <div className="text-gray-400">
                              {text.subtotal}: <span className="font-bold text-white ml-2">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-strong rounded-3xl p-8 border border-white/10 sticky top-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="gradient-text">{text.order_summary}</span>
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>{text.subtotal}</span>
                      <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>{text.shipping}</span>
                      <span className="font-semibold text-white">
                        {shipping === 0 ? (
                          <span className="text-green-400">{text.free_shipping}</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>{text.tax} (10%)</span>
                      <span className="font-semibold text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-white">{text.total}</span>
                        <span className="gradient-text text-2xl">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {subtotal < 100 && (
                    <div className="glass-strong rounded-xl p-4 mb-6 border border-blue-500/30 bg-blue-500/10">
                      <p className="text-sm text-blue-300">
                        💡 {text.free_shipping_tip} <span className="font-bold text-blue-400">${(100 - subtotal).toFixed(2)}</span> {text.free_shipping_tip_end}
                      </p>
                    </div>
                  )}

                  <Link href={isZh ? "/zh/checkout" : "/checkout"}>
                    <button className="w-full btn-primary btn-glow mb-3 py-4 text-lg">
                      {text.proceed_checkout}
                    </button>
                  </Link>
                  
                  <Link href={isZh ? "/zh/products" : "/products"}>
                    <button className="w-full glass-strong border border-white/10 hover:border-white/20 text-white py-4 rounded-xl transition-all">
                      {text.continue_shopping}
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}