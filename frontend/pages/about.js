import Layout from '../components/Layout'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { FiAward, FiUsers, FiTrendingUp, FiGlobe, FiCheckCircle, FiTarget } from 'react-icons/fi'

export default function About() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { icon: FiTrendingUp, number: '30+', label: 'Years Experience', color: 'from-blue-500 to-cyan-400' },
    { icon: FiUsers, number: '500+', label: 'Happy Clients', color: 'from-purple-500 to-pink-400' },
    { icon: FiGlobe, number: '56', label: 'Countries', color: 'from-green-500 to-emerald-400' },
    { icon: FiAward, number: '10,000+', label: 'Products Delivered', color: 'from-orange-500 to-red-400' },
  ]

  const values = [
    {
      icon: FiCheckCircle,
      title: 'Quality First',
      description: 'We never compromise on quality. Every product undergoes strict quality control.',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: FiUsers,
      title: 'Customer Focused',
      description: 'Your success is our success. We provide personalized service for every client.',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: FiTarget,
      title: 'Innovation',
      description: 'We stay ahead of fashion trends and continuously improve our processes.',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: FiGlobe,
      title: 'Global Vision',
      description: 'Serving clients worldwide with international standards and local expertise.',
      color: 'from-orange-500 to-red-400'
    }
  ]

  const timeline = [
    { year: '1992', title: 'Company Founded', description: 'Started as a small leather workshop in Guangzhou' },
    { year: '2000', title: 'First Export', description: 'Expanded to international markets' },
    { year: '2010', title: 'ISO Certified', description: 'Achieved ISO 9001 quality certification' },
    { year: '2015', title: 'Factory Expansion', description: 'Expanded to 5000+ sqm production facility' },
    { year: '2020', title: 'Digital Transformation', description: 'Launched online B2B platform' },
    { year: '2026', title: 'Industry Leader', description: 'Serving 500+ brands across 56 countries' }
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
              <span className="gradient-text">About Us</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              30+ Years of Excellence in Handbag Manufacturing
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Since 1992, we've been crafting premium handbags for fashion brands worldwide. 
              Our commitment to quality, innovation, and customer satisfaction has made us a trusted partner in the industry.
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
              <span className="gradient-text">Our Story</span>
            </h2>
            
            <div className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10 space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Founded in 1992 in Guangzhou, China, we started as a small leather workshop with a big dream: 
                to create beautiful, high-quality handbags that fashion brands could be proud of.
              </p>
              
              <p className="text-lg">
                Over the past three decades, we've grown from a local workshop to an international manufacturer, 
                serving over 500 brands across 56 countries. Our success is built on three pillars: 
                exceptional craftsmanship, innovative design, and unwavering commitment to our clients.
              </p>
              
              <p className="text-lg">
                Today, our 5,000+ square meter facility houses state-of-the-art equipment and a team of 
                skilled artisans who bring decades of experience to every product. We specialize in OEM and ODM services, 
                helping fashion brands bring their visions to life with precision and care.
              </p>
              
              <p className="text-lg">
                As we look to the future, we remain committed to our founding principles while embracing 
                innovation and sustainability. We're not just manufacturing handbags – we're building lasting 
                partnerships and helping brands succeed in the global marketplace.
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
            <span className="gradient-text">Our Journey</span>
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
            <span className="gradient-text">Our Values</span>
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
              <span className="gradient-text">Ready to Work Together?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create something amazing for your brand
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact">
                <button className="btn-primary btn-glow px-10 py-5 text-lg">
                  Contact Us
                </button>
              </a>
              <a href="/products">
                <button className="px-10 py-5 text-lg rounded-full font-semibold glass-strong hover:glass border-2 border-white/20 hover:border-neon-blue/50 transition-all">
                  View Products
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
