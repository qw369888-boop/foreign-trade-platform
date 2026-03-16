'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function HeroCarousel() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slides = [
    {
      id: 1,
      title: isZh ? '2026时尚新品' : '2026 Fashion New Arrivals',
      subtitle: isZh ? '优质手袋，引领时尚潮流' : 'Premium quality handbags, leading fashion trends',
      image: 'https://sc04.alicdn.com/kf/H982baaae6ee541638277a721b5acb7fdt.jpg',
      color: 'from-pink-500 to-rose-600',
      link: isZh ? '/zh/products?category=2026新来者' : '/products?category=2026新来者'
    },
    {
      id: 2,
      title: isZh ? '精选手提包系列' : 'Premium Handbag Collection',
      subtitle: isZh ? '经典设计，卓越品质' : 'Classic design, exceptional quality',
      image: 'https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg',
      color: 'from-purple-500 to-indigo-600',
      link: isZh ? '/zh/products?category=手提包' : '/products?category=手提包'
    },
    {
      id: 3,
      title: isZh ? '专业OEM & ODM服务' : 'Professional OEM & ODM Services',
      subtitle: isZh ? '30年制造经验，值得信赖' : '30 years of manufacturing excellence, trusted worldwide',
      image: 'https://sc04.alicdn.com/kf/H6d0c8c7c8b8c4c5f9e2a3b4c5d6e7f8g.jpg',
      color: 'from-blue-500 to-cyan-600',
      link: isZh ? '/zh/about' : '/about'
    }
  ]

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

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

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0">
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                nextSlide()
              } else if (swipe > swipeConfidenceThreshold) {
                prevSlide()
              }
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slides[currentIndex].image})`
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-dark-900/60 to-transparent" />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentIndex].color} opacity-20`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-white"
              >
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <span className="gradient-text">
                    {slides[currentIndex].title}
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {slides[currentIndex].subtitle}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href={slides[currentIndex].link}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary btn-glow px-10 py-5 text-lg font-semibold"
                    >
                      {isZh ? '立即查看' : 'Explore Now'}
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
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass-strong hover:glass border border-white/20 hover:border-neon-blue/50 transition-all group"
        aria-label={isZh ? "上一张" : "Previous slide"}
      >
        <FiChevronLeft className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass-strong hover:glass border border-white/20 hover:border-neon-blue/50 transition-all group"
        aria-label={isZh ? "下一张" : "Next slide"}
      >
        <FiChevronRight className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-neon-blue shadow-lg shadow-neon-blue/50 scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`${isZh ? '跳转到第' : 'Go to slide'} ${index + 1} ${isZh ? '张' : ''}`}
          />
        ))}
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-20 right-8 z-20 hidden lg:block">
        <div className="glass-strong rounded-2xl p-6 border border-white/10">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold gradient-text">200+</div>
              <div className="text-sm text-gray-400">{isZh ? '产品系列' : 'Product Series'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">30+</div>
              <div className="text-sm text-gray-400">{isZh ? '年经验' : 'Years Experience'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">56</div>
              <div className="text-sm text-gray-400">{isZh ? '出口国家' : 'Export Countries'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 z-20 hidden md:block">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/60"
        >
          <span className="text-sm mb-2 rotate-90 origin-center">
            {isZh ? '滚动' : 'Scroll'}
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}