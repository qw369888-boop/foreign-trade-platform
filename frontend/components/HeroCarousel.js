'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function HeroCarousel() {
  const { t, i18n } = useTranslation('common')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slides = [
    {
      id: 1,
      titleKey: 'carousel.slide1_title',
      subtitleKey: 'carousel.slide1_subtitle',
      image: 'https://sc04.alicdn.com/kf/H982baaae6ee541638277a721b5acb7fdt.jpg',
      color: 'from-pink-500 to-rose-600',
      link: '/products?category=2026新来者'
    },
    {
      id: 2,
      titleKey: 'carousel.slide2_title',
      subtitleKey: 'carousel.slide2_subtitle',
      image: 'https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg',
      color: 'from-purple-500 to-indigo-600',
      link: '/products?category=手提包'
    },
    {
      id: 3,
      titleKey: 'carousel.slide3_title',
      subtitleKey: 'carousel.slide3_subtitle',
      image: 'https://sc04.alicdn.com/kf/Hbea1befbf4aa4e9ea3e2073191b32cbfz.jpg',
      color: 'from-blue-500 to-cyan-600',
      link: '/products?category=肩包'
    },
    {
      id: 4,
      titleKey: 'carousel.slide4_title',
      subtitleKey: 'carousel.slide4_subtitle',
      image: 'https://sc04.alicdn.com/kf/H715c91f9e2b741ce8ff5eb6bae8e9013P.jpg',
      color: 'from-green-500 to-emerald-600',
      link: '/products?category=斜挎包'
    },
    {
      id: 5,
      titleKey: 'carousel.slide5_title',
      subtitleKey: 'carousel.slide5_subtitle',
      image: 'https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg',
      color: 'from-orange-500 to-red-600',
      link: '/products?category=热卖'
    }
  ]

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-dark-900">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-5" />

      {/* Carousel Container */}
      <div className="relative h-full w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-left z-10"
                >
                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4"
                  >
                    <span className={`bg-gradient-to-r ${slides[currentIndex].color} bg-clip-text text-transparent`}>
                      {t(slides[currentIndex].titleKey)}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-2xl sm:text-3xl text-gray-400 mb-6"
                  >
                    {t(slides[currentIndex].subtitleKey)}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <Link href={slides[currentIndex].link}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r ${slides[currentIndex].color} shadow-2xl hover:shadow-neon-blue/50 transition-all duration-300 relative overflow-hidden group`}
                      >
                        <span className="relative z-10">
                          {t('hero.cta_primary') || 'Explore Now'}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex gap-8 mt-12"
                  >
                    <div>
                      <div className="text-3xl font-bold text-white">200+</div>
                      <div className="text-sm text-gray-500">{t('carousel.stat_products')}</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">30+</div>
                      <div className="text-sm text-gray-500">{t('carousel.stat_years')}</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">56</div>
                      <div className="text-sm text-gray-500">{t('carousel.stat_countries')}</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative"
                >
                  {/* Glow Effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${slides[currentIndex].color} blur-3xl opacity-30 rounded-full`}
                  />

                  {/* Product Image */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <div className="aspect-square bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex items-center justify-center">
                      <motion.img
                        src={slides[currentIndex].image}
                        alt={slides[currentIndex].title}
                        className="w-full h-full object-contain"
                        animate={{
                          y: [0, -10, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 rounded-full blur-2xl"
                  />
                  <motion.div
                    animate={{
                      y: [0, 20, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-neon-blue/30 to-neon-green/30 rounded-full blur-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 glass-strong rounded-full p-4 border border-white/20 hover:border-neon-blue transition-all duration-300 group"
      >
        <FiChevronLeft className="w-8 h-8 text-white group-hover:text-neon-blue transition-colors" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 glass-strong rounded-full p-4 border border-white/20 hover:border-neon-blue transition-all duration-300 group"
      >
        <FiChevronRight className="w-8 h-8 text-white group-hover:text-neon-blue transition-colors" />
      </motion.button>

      {/* Dots Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? `bg-gradient-to-r ${slides[currentIndex].color} w-12 h-3`
                : 'bg-white/30 hover:bg-white/50 w-3 h-3'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${slides[currentIndex].color}`}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 5, ease: 'linear' }}
        key={currentIndex}
      />
    </section>
  )
}
