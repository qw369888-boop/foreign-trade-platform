import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { FiCheckCircle, FiPackage, FiMail } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function OrderSuccess() {
  const router = useRouter()
  const { orderId } = router.query
  const isZh = router.asPath.startsWith('/zh')
  const [order, setOrder] = useState(null)

  const text = {
    title: isZh ? '订单提交成功！' : 'Order Placed Successfully!',
    subtitle: isZh ? '感谢您的购买' : 'Thank you for your purchase',
    order_id: isZh ? '订单号' : 'Order ID',
    email_sent: isZh ? '确认邮件' : 'Confirmation Email',
    email_desc: isZh ? '请查看您的邮箱获取订单详情' : 'Check your inbox for order details',
    processing: isZh ? '订单处理中' : 'Order Processing',
    processing_desc: isZh ? '我们将尽快发货' : 'We\'ll ship your order soon',
    continue_shopping: isZh ? '继续购物' : 'Continue Shopping',
    back_home: isZh ? '返回首页' : 'Back to Home'
  }

  useEffect(() => {
    if (orderId) {
      // 可以从后端获取订单详情
      setOrder({ id: orderId })
    }
  }, [orderId])

  return (
    <Layout>
      <div className="min-h-screen bg-dark-900 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-strong rounded-3xl p-12 border border-white/10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-16 h-16 text-green-400" />
                </div>
              </motion.div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {text.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                {text.subtitle}
              </p>

              {orderId && (
                <div className="glass-strong rounded-xl p-6 mb-8 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">
                    {text.order_id}
                  </p>
                  <p className="text-2xl font-bold gradient-text">#{orderId}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-strong rounded-xl p-6 border border-white/10">
                  <FiMail className="w-8 h-8 text-neon-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">
                    {text.email_sent}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {text.email_desc}
                  </p>
                </div>

                <div className="glass-strong rounded-xl p-6 border border-white/10">
                  <FiPackage className="w-8 h-8 text-neon-purple mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">
                    {text.processing}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {text.processing_desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={isZh ? "/zh/products" : "/products"}>
                  <button className="btn-primary">
                    {text.continue_shopping}
                  </button>
                </Link>
                <Link href={isZh ? "/zh" : "/"}>
                  <button className="glass-strong border border-white/10 hover:border-white/20 text-white py-3 px-8 rounded-xl transition-all">
                    {text.back_home}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}