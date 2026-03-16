'use client'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FiChevronLeft, FiChevronRight, FiAward, FiCheckCircle } from 'react-icons/fi'

export default function ManufacturingCapabilities() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')
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
      url: 'https://sacdepinko.cn/wp-content/uploads/2024/10/10023-1.jpg',
    },
    {
      url: 'https://sacdepinko.cn/wp-content/uploads/2024/10/10024-1.jpg',
    }
  ]

  const processes = [
    {
      step: '01',
      title: isZh ? '设计开发' : 'Design & Development',
      description: isZh ? '专业设计团队，创新产品开发' : 'Professional design team, innovative product development',
      icon: '🎨'
    },
    {
      step: '02', 
      title: isZh ? '材料采购' : 'Material Sourcing',
      description: isZh ? '优质原材料，严格质量把控' : 'Premium materials, strict quality control',
      icon: '📦'
    },
    {
      step: '03',
      title: isZh ? '精密制造' : 'Precision Manufacturing', 
      description: isZh ? '先进设备，精工制作' : 'Advanced equipment, precision craftsmanship',
      icon: '⚙️'
    },
    {
      step: '04',
      title: isZh ? '质量检测' : 'Quality Testing',
      description: isZh ? '多重检测，确保品质' : 'Multiple inspections, quality assurance',
      icon: '🔍'
    },
    {
      step: '05',
      title: isZh ? '包装发货' : 'Packaging & Shipping',
      description: isZh ? '安全包装，及时交付' : 'Safe packaging, timely delivery',
      icon: '📮'
    }
  ]

  const certifications = [
    {
      name: 'ISO 9001',
      description: isZh ? '质量管理体系认证' : 'Quality Management System',
      icon: FiAward,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      name: 'BSCI',
      description: isZh ? '商业社会标准认证' : 'Business Social Compliance Initiative',
      icon: FiCheckCircle,
      color: 'from-green-500 to-emerald-400'
    },
    {
      name: 'SGS',
      description: isZh ? '国际检验认证' : 'International Inspection & Certification',
      icon: FiAward,
      color: 'from-purple-500 to-pink-400'
    },
    {
      name: 'CE',
      description: isZh ? '欧盟合格认证' : 'European Conformity',
      icon: FiCheckCircle,
      color: 'from-orange-500 to-red-400'
    }
  ]

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % factoryImages.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + factoryImages.length) % factoryImages.length)
  }

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 4000)

    return () => clearInterval(timer)
  }, [currentIndex])

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
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-900 to-dark-800" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-1/4 w-96 h-96 border border-neon-purple/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-1/4 w-64 h-64 border border-neon-blue/20 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">
              {isZh ? '制造实力' : 'Manufacturing Capabilities'}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {isZh ? '30+年手袋制造卓越经验' : '30+ Years of Excellence in Handbag Manufacturing'}
          </p>
        </motion.div>

        {/* Factory Images Carousel */}
        <div className="mb-20">
          <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden">
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
                  alt={`${isZh ? '工厂车间' : 'Factory Workshop'} ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full glass-strong hover:glass border border-white/20 hover:border-neon-blue/50 transition-all group"
            >
              <FiChevronLeft className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full glass-strong hover:glass border border-white/20 hover:border-neon-blue/50 transition-all group"
            >
              <FiChevronRight className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
              {factoryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-neon-blue shadow-lg shadow-neon-blue/50 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Factory Stats Overlay */}
            <div className="absolute bottom-6 right-6 z-10">
              <div className="glass-strong rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold gradient-text">500+</div>
                    <div className="text-xs text-gray-400">{isZh ? '信赖品牌' : 'Trusted Brands'}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold gradient-text">10,000+</div>
                    <div className="text-xs text-gray-400">{isZh ? '产品交付' : 'Products Delivered'}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold gradient-text">98%</div>
                    <div className="text-xs text-gray-400">{isZh ? '满意度' : 'Satisfaction Rate'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Process */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="gradient-text">{isZh ? '生产流程' : 'Production Process'}</span>
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processes.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 text-center h-full">
                  {/* Step Number */}
                  <div className="text-4xl font-bold gradient-text mb-4">{process.step}</div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-4">{process.icon}</div>
                  
                  {/* Title */}
                  <h4 className="text-lg font-bold text-white mb-3">{process.title}</h4>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">{process.description}</p>
                </div>

                {/* Arrow (except for last item) */}
                {index < processes.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">▶</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <h3 className="text-3xl font-bold mb-12">
            <span className="gradient-text">{isZh ? '质量认证' : 'Quality Certifications'}</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${cert.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <cert.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{cert.name}</h4>
                <p className="text-gray-400 text-sm">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}