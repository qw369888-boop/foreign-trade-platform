'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { FiStar, FiChevronLeft, FiChevronRight, FiAward, FiCheckCircle, FiTrendingUp, FiUsers, FiShield, FiGlobe, FiSettings } from 'react-icons/fi'

export default function Testimonials() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Purchasing Manager, Fashion Forward Inc. (USA)',
      avatar: '👩‍💼',
      rating: 5,
      text: 'We\'ve been sourcing handbags from Dayi for 3 years. Their quality control is excellent and they always meet our delivery deadlines. Great partner for our retail business.',
      color: 'from-neon-blue to-cyan-400',
    },
    {
      name: 'Michael Thompson',
      role: 'Owner, Urban Style Boutique (Canada)',
      avatar: '👨‍💼',
      rating: 5,
      text: 'Professional service and competitive pricing. The MOQ of 100 pieces works well for our boutique. Their design team helped us create custom pieces that our customers love.',
      color: 'from-neon-purple to-indigo-400',
    },
    {
      name: 'Lisa Wang',
      role: 'Brand Manager, Trendy Bags Co. (Australia)',
      avatar: '👩‍💻',
      rating: 5,
      text: 'Reliable manufacturer with consistent quality. They understand our brand requirements and deliver exactly what we need. Highly recommend for small to medium businesses.',
      color: 'from-neon-pink to-rose-400',
    },
    {
      name: 'James Miller',
      role: 'Import Manager, Leather Goods Ltd. (UK)',
      avatar: '👨‍🎓',
      rating: 5,
      text: 'Good value for money and professional communication. Their factory tour convinced us of their capabilities. We\'ve placed multiple orders and been satisfied each time.',
      color: 'from-orange-500 to-red-400',
    },
  ]

  const trustIndicators = [
    { icon: FiUsers, number: '500+', label: t('testimonials.trusted_brands') || 'Trusted Brands', color: 'from-blue-500 to-cyan-400' },
    { icon: FiTrendingUp, number: '10,000+', label: t('testimonials.products_delivered') || 'Products Delivered', color: 'from-purple-500 to-pink-400' },
    { icon: FiCheckCircle, number: '98%', label: t('testimonials.satisfaction_rate') || 'Satisfaction Rate', color: 'from-green-500 to-emerald-400' },
    { icon: FiAward, number: '30+', label: t('testimonials.years_experience') || 'Years Experience', color: 'from-orange-500 to-red-400' },
  ]

  const certifications = [
    { name: 'ISO 9001', desc: t('testimonials.quality_management') || 'Quality Management', icon: FiShield, color: 'from-blue-500 to-cyan-400' },
    { name: t('testimonials.export_license') || 'Export License', desc: t('testimonials.global_trade') || 'Global Trade', icon: FiGlobe, color: 'from-green-500 to-emerald-400' },
    { name: t('testimonials.quality_certified') || 'Quality Certified', desc: t('testimonials.premium_standards') || 'Premium Standards', icon: FiAward, color: 'from-purple-500 to-pink-400' },
    { name: 'OEM & ODM', desc: t('testimonials.professional_service') || 'Professional Service', icon: FiSettings, color: 'from-orange-500 to-red-400' },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-900 to-dark-800" />
      
      {/* Animated Background */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {trustIndicators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="glass-strong rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-all"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-4`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className={`text-3xl font-bold gradient-text mb-2`}>
                {item.number}
              </div>
              <div className="text-sm text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

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
            <span className="gradient-text">Customer Feedback</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            What our business partners say about working with us
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            {/* Main Card */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentIndex].color} opacity-5`} />

              {/* Quote Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute top-8 right-8 text-6xl opacity-10"
              >
                "
              </motion.div>

              <div className="relative z-10">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonials[currentIndex].color} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {testimonials[currentIndex].avatar}
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-400">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <FiStar className="w-6 h-6 fill-neon-yellow text-neon-yellow" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl md:text-2xl text-gray-300 leading-relaxed"
                >
                  "{testimonials[currentIndex].text}"
                </motion.p>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full glass-strong hover:glass border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
              >
                <FiChevronLeft className="w-6 h-6" />
              </motion.button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-neon-blue to-neon-purple'
                        : 'w-2 bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full glass-strong hover:glass border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
              >
                <FiChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>

          {/* Background Cards (3D Effect) */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 glass-strong rounded-3xl transform translate-y-4 scale-95 opacity-50" />
            <div className="absolute inset-0 glass-strong rounded-3xl transform translate-y-8 scale-90 opacity-25" />
          </div>
        </div>


      </div>
    </section>
  )
}
