'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { FiShield, FiTruck, FiAward, FiUsers, FiGlobe, FiClock } from 'react-icons/fi'

export default function Features() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')

  const features = [
    {
      icon: FiShield,
      title: isZh ? '质量保证' : 'Quality Assurance',
      description: isZh ? 'ISO 9001认证，严格的质量控制体系' : 'ISO 9001 certified with strict quality control system',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiTruck,
      title: isZh ? '快速交付' : 'Fast Delivery', 
      description: isZh ? '全球物流网络，7-15天快速交付' : 'Global logistics network, 7-15 days fast delivery',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FiAward,
      title: isZh ? '专业认证' : 'Professional Certification',
      description: isZh ? 'BSCI、SGS、CE等多项国际认证' : 'BSCI, SGS, CE and other international certifications',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FiUsers,
      title: isZh ? '专业团队' : 'Professional Team',
      description: isZh ? '30年经验的设计和生产团队' : '30 years of experience in design and production team',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: FiGlobe,
      title: isZh ? '全球服务' : 'Global Service',
      description: isZh ? '服务全球56个国家和地区' : 'Serving 56 countries and regions worldwide',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: FiClock,
      title: isZh ? '24/7支持' : '24/7 Support',
      description: isZh ? '全天候客户服务和技术支持' : '24/7 customer service and technical support',
      color: 'from-teal-500 to-green-500'
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-900 to-dark-800" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-neon-blue/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-neon-purple/20 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">
              {isZh ? '为什么选择我们' : 'Why Choose Us'}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {isZh ? '专业手袋制造商，值得信赖的合作伙伴' : 'Professional handbag manufacturer, trusted partner'}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="glass-strong rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary btn-glow px-8 py-4 text-lg font-semibold"
          >
            {isZh ? '了解更多' : 'Learn More'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}