import Layout from '../components/Layout'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import { FiAward, FiUsers, FiTrendingUp, FiGlobe, FiCheckCircle, FiTarget } from 'react-icons/fi'

export default function About() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { 
      icon: FiTrendingUp, 
      number: '30+', 
      label: isZh ? '年经验' : 'Years Experience', 
      color: 'from-blue-500 to-cyan-400' 
    },
    { 
      icon: FiUsers, 
      number: '500+', 
      label: isZh ? '满意客户' : 'Happy Clients', 
      color: 'from-purple-500 to-pink-400' 
    },
    { 
      icon: FiGlobe, 
      number: '56', 
      label: isZh ? '个国家' : 'Countries', 
      color: 'from-green-500 to-emerald-400' 
    },
    { 
      icon: FiAward, 
      number: '10,000+', 
      label: isZh ? '产品交付' : 'Products Delivered', 
      color: 'from-orange-500 to-red-400' 
    },
  ]

  const values = [
    {
      icon: FiCheckCircle,
      title: isZh ? '质量第一' : 'Quality First',
      description: isZh ? '我们从不在质量上妥协。每个产品都经过严格的质量控制。' : 'We never compromise on quality. Every product undergoes strict quality control.',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: FiUsers,
      title: isZh ? '客户至上' : 'Customer Focused',
      description: isZh ? '您的成功就是我们的成功。我们为每位客户提供个性化服务。' : 'Your success is our success. We provide personalized service for every client.',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: FiTarget,
      title: isZh ? '创新发展' : 'Innovation',
      description: isZh ? '我们紧跟时尚潮流，不断改进我们的工艺流程。' : 'We stay ahead of fashion trends and continuously improve our processes.',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: FiGlobe,
      title: isZh ? '全球视野' : 'Global Vision',
      description: isZh ? '以国际标准和本地专业知识为全球客户提供服务。' : 'Serving clients worldwide with international standards and local expertise.',
      color: 'from-orange-500 to-red-400'
    }
  ]

  const timeline = [
    { 
      year: '1992', 
      title: isZh ? '公司成立' : 'Company Founded', 
      description: isZh ? '在广州创立小型皮具工作坊' : 'Started as a small leather workshop in Guangzhou' 
    },
    { 
      year: '2000', 
      title: isZh ? '首次出口' : 'First Export', 
      description: isZh ? '扩展到国际市场' : 'Expanded to international markets' 
    },
    { 
      year: '2010', 
      title: isZh ? 'ISO认证' : 'ISO Certified', 
      description: isZh ? '获得ISO 9001质量认证' : 'Achieved ISO 9001 quality certification' 
    },
    { 
      year: '2015', 
      title: isZh ? '工厂扩建' : 'Factory Expansion', 
      description: isZh ? '扩建至5000+平方米生产设施' : 'Expanded to 5000+ sqm production facility' 
    },
    { 
      year: '2020', 
      title: isZh ? '数字化转型' : 'Digital Transformation', 
      description: isZh ? '推出在线B2B平台' : 'Launched online B2B platform' 
    },
    { 
      year: '2026', 
      title: isZh ? '行业领导者' : 'Industry Leader', 
      description: isZh ? '为56个国家的500+品牌提供服务' : 'Serving 500+ brands across 56 countries' 
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-cyber-grid opacity-5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">{isZh ? '关于我们' : 'About Us'}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              {isZh ? '30+年手袋制造卓越经验' : '30+ Years of Excellence in Handbag Manufacturing'}
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {isZh 
                ? '自1992年以来，我们一直为全球时尚品牌制作优质手袋。我们对质量、创新和客户满意度的承诺使我们成为行业内值得信赖的合作伙伴。'
                : 'Since 1992, we\'ve been crafting premium handbags for fashion brands worldwide. Our commitment to quality, innovation, and customer satisfaction has made us a trusted partner in the industry.'
              }
            </p>
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
                className="glass-strong rounded-2xl p-8 text-center border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section ref={ref} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-center">
              <span className="gradient-text">{isZh ? '我们的故事' : 'Our Story'}</span>
            </h2>
            
            <div className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10 space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                {isZh 
                  ? '1992年在中国广州成立，我们从一个小型皮具工作坊开始，怀着一个远大的梦想：为时尚品牌制作美丽、高品质的手袋。'
                  : 'Founded in 1992 in Guangzhou, China, we started as a small leather workshop with a big dream: to create beautiful, high-quality handbags that fashion brands could be proud of.'
                }
              </p>
              
              <p className="text-lg">
                {isZh
                  ? '在过去的三十年里，我们从一个本地工作坊发展成为国际制造商，为56个国家的500多个品牌提供服务。我们的成功建立在三个支柱之上：卓越的工艺、创新的设计和对客户的坚定承诺。'
                  : 'Over the past three decades, we\'ve grown from a local workshop to an international manufacturer, serving over 500 brands across 56 countries. Our success is built on three pillars: exceptional craftsmanship, innovative design, and unwavering commitment to our clients.'
                }
              </p>
              
              <p className="text-lg">
                {isZh
                  ? '如今，我们5000+平方米的工厂配备了最先进的设备和一支拥有数十年经验的熟练工匠团队，他们为每一件产品都倾注了精心和关怀。我们专注于OEM和ODM服务，帮助时尚品牌精确而用心地实现他们的愿景。'
                  : 'Today, our 5,000+ square meter facility houses state-of-the-art equipment and a team of skilled artisans who bring decades of experience to every product. We specialize in OEM and ODM services, helping fashion brands bring their visions to life with precision and care.'
                }
              </p>
              
              <p className="text-lg">
                {isZh
                  ? '展望未来，我们在拥抱创新和可持续发展的同时，仍然坚持我们的创始原则。我们不仅仅是在制造手袋——我们在建立持久的合作伙伴关系，帮助品牌在全球市场上取得成功。'
                  : 'As we look to the future, we remain committed to our founding principles while embracing innovation and sustainability. We\'re not just manufacturing handbags — we\'re building lasting partnerships and helping brands succeed in the global marketplace.'
                }
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        <div className="absolute inset-0 bg-cyber-grid opacity-5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center">
            <span className="gradient-text">{isZh ? '我们的历程' : 'Our Journey'}</span>
          </h2>
          
          <div className="max-w-5xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-12 last:mb-0"
              >
                <div className="flex items-center gap-8">
                  {/* Year Badge */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-2xl">
                    <span className="text-2xl font-bold text-white">{item.year}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 glass-strong rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-12 top-24 w-0.5 h-12 bg-gradient-to-b from-neon-blue to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center">
            <span className="gradient-text">{isZh ? '我们的价值观' : 'Our Values'}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass-strong rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
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
              <a href={isZh ? "/zh/contact" : "/contact"}>
                <button className="btn-primary btn-glow px-10 py-5 text-lg">
                  {isZh ? '联系我们' : 'Contact Us'}
                </button>
              </a>
              <a href={isZh ? "/zh/products" : "/products"}>
                <button className="px-10 py-5 text-lg rounded-full font-semibold glass-strong hover:glass border-2 border-white/20 hover:border-neon-blue/50 transition-all">
                  {isZh ? '查看产品' : 'View Products'}
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}