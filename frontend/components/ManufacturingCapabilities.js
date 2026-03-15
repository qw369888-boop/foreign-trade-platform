'use client'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { FiChevronLeft, FiChevronRight, FiAward, FiCheckCircle } from 'react-icons/fi'

export default function ManufacturingCapabilities() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // 工厂图片（使用官网真实图片 - 4张工厂车间）
  const factoryImages = [
    {
      url: 'https://sacdepinko.cn/wp-content/uploads/2024/10/10019-1.jpg',
    },
    {
      url: 'https://sacdepinko.cn/wp-content/uploads/2024/10/10022-1.jpg',
    },
    {
      url: 'https://sacdepinko.cn/wp-content/uploads/2024/10/10025.jpg',
    },
    {
      url: 'https://sacdepinko.cn/wp-content/uploads/2024/09/10004-1024x505.jpg',
    }
  ]

  // 认证证书（使用 Testimonials 的样式）
  const certifications = [
    { name: 'ISO 9001', desc: t('manufacturing.iso_desc') || 'Quality Management System', icon: 'FiShield', color: 'from-blue-500 to-cyan-600' },
    { name: 'BSCI', desc: t('manufacturing.bsci_desc') || 'Business Social Compliance', icon: 'FiCheckCircle', color: 'from-green-500 to-emerald-600' },
    { name: 'SGS', desc: t('manufacturing.sgs_desc') || 'Product Quality Certification', icon: 'FiAward', color: 'from-purple-500 to-pink-600' },
    { name: 'CE', desc: t('manufacturing.ce_desc') || 'European Conformity', icon: 'FiCheckCircle', color: 'from-orange-500 to-yellow-600' }
  ]

  // 生产流程
  const productionSteps = [
    { 
      title: t('manufacturing.step1_title') || 'Design',
      desc: t('manufacturing.step1_desc') || 'Professional design team'
    },
    { 
      title: t('manufacturing.step2_title') || 'Material',
      desc: t('manufacturing.step2_desc') || 'Premium PU leather'
    },
    { 
      title: t('manufacturing.step3_title') || 'Cutting',
      desc: t('manufacturing.step3_desc') || 'Precision cutting'
    },
    { 
      title: t('manufacturing.step4_title') || 'QC',
      desc: t('manufacturing.step4_desc') || 'Strict inspection'
    },
    { 
      title: t('manufacturing.step5_title') || 'Shipping',
      desc: t('manufacturing.step5_desc') || 'Timely delivery'
    }
  ]

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % factoryImages.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + factoryImages.length) % factoryImages.length)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">{t('manufacturing.title') || 'Manufacturing Capabilities'}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('manufacturing.subtitle') || '30+ Years of Excellence in Handbag Manufacturing'}
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative mb-20">
          <div className="relative h-[600px] rounded-3xl overflow-hidden glass-strong">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0"
              >
                <img
                  src={factoryImages[currentIndex].url}
                  alt="Factory"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass-strong hover:glass border border-white/10 hover:border-white/20 flex items-center justify-center transition-all z-10"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass-strong hover:glass border border-white/10 hover:border-white/20 flex items-center justify-center transition-all z-10"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {factoryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-neon-blue'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Production Process & Certifications - Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-20"
        >
          {/* Production Process - With Flow Arrows */}
          <div>
            <h3 className="text-3xl font-bold mb-10 text-neon-blue flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              {t('manufacturing.process_title') || '生产流程'}
            </h3>
            <div className="relative space-y-4">
              {productionSteps.map((step, index) => (
                <div key={index} className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    className="glass-strong rounded-2xl p-6 hover:glass transition-all border border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-neon-blue/20 group cursor-pointer relative overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${
                        index === 0 ? 'from-blue-500 to-purple-600' :
                        index === 1 ? 'from-purple-500 to-pink-600' :
                        index === 2 ? 'from-blue-400 to-cyan-500' :
                        index === 3 ? 'from-purple-400 to-blue-500' :
                        'from-blue-500 to-purple-500'
                      } flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{step.desc}</p>
                      </div>
                      {/* Progress Indicator */}
                      <div className="flex-shrink-0 text-xs text-gray-500 font-mono">
                        {index + 1}/{productionSteps.length}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Flow Arrow */}
                  {index < productionSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex justify-center py-2"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-0.5 h-3 bg-gradient-to-b from-neon-blue/50 to-transparent" />
                        <div className="text-neon-blue/50 text-xs">▼</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications - Right Side */}
          <div>
            <h3 className="text-3xl font-bold mb-10 text-neon-blue flex items-center gap-3">
              <FiAward className="w-8 h-8" />
              {t('manufacturing.cert_title') || 'Quality Certifications'}
            </h3>
            <div className="space-y-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: -8 }}
                  className="glass-strong rounded-2xl p-6 hover:glass transition-all border border-white/10 hover:border-neon-blue/30 hover:shadow-2xl group cursor-pointer relative overflow-hidden"
                >
                  {/* 3D Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    {/* 3D Icon */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all group-hover:rotate-6 group-hover:scale-110`}>
                      <FiCheckCircle className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {cert.desc}
                      </p>
                    </div>
                    
                    {/* Verified Badge */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-lg font-bold">✓</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
