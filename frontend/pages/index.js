import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiArrowRight, FiStar, FiAward, FiUsers, FiGlobe } from 'react-icons/fi'

export default function Home() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')

  const stats = [
    { number: '30+', label: isZh ? '年经验' : 'Years Experience' },
    { number: '500+', label: isZh ? '信赖品牌' : 'Trusted Brands' },
    { number: '56', label: isZh ? '出口国家' : 'Export Countries' },
    { number: '5000+', label: isZh ? '工厂面积(㎡)' : 'Factory Area (㎡)' }
  ]

  const features = [
    {
      icon: FiAward,
      title: isZh ? '质量保证' : 'Quality Assurance',
      description: isZh ? 'ISO 9001认证，严格的质量控制体系' : 'ISO 9001 certified with strict quality control system'
    },
    {
      icon: FiUsers,
      title: isZh ? '专业团队' : 'Professional Team',
      description: isZh ? '30年经验的设计和生产团队' : '30 years of experience in design and production team'
    },
    {
      icon: FiGlobe,
      title: isZh ? '全球服务' : 'Global Service',
      description: isZh ? '服务全球56个国家和地区' : 'Serving 56 countries and regions worldwide'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-cyber-grid opacity-5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">
                {isZh ? '专业手袋制造商' : 'Professional Handbag Manufacturer'}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              {isZh ? 'OEM & ODM 始于1992年' : 'OEM & ODM Since 1992'}
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              {isZh 
                ? '为全球专业品牌提供高品质皮具供应，30年制造经验，值得信赖的合作伙伴。'
                : 'Providing high-quality leather goods supply for global professional brands, 30 years of manufacturing experience, trusted partner.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isZh ? "/zh/products" : "/products"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary btn-glow px-10 py-5 text-lg font-semibold flex items-center gap-2"
                >
                  {isZh ? '查看产品' : 'View Products'}
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href={isZh ? "/zh/contact" : "/contact"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 text-lg font-semibold rounded-full glass-strong hover:glass border-2 border-white/20 hover:border-neon-blue/50 transition-all"
                >
                  {isZh ? '联系我们' : 'Contact Us'}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-strong rounded-2xl p-8 text-center border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-strong rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple p-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 opacity-30" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="gradient-text">
                {isZh ? '准备好合作了吗？' : 'Ready to Work Together?'}
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {isZh ? '让我们为您的品牌创造令人惊叹的产品' : 'Let\'s create something amazing for your brand'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isZh ? "/zh/contact" : "/contact"}>
                <button className="btn-primary btn-glow px-10 py-5 text-lg">
                  {isZh ? '联系我们' : 'Contact Us'}
                </button>
              </Link>
              <Link href={isZh ? "/zh/products" : "/products"}>
                <button className="px-10 py-5 text-lg rounded-full font-semibold glass-strong hover:glass border-2 border-white/20 hover:border-neon-blue/50 transition-all">
                  {isZh ? '查看产品' : 'View Products'}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}