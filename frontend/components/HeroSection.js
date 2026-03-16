'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const [displayText, setDisplayText] = useState('')
  const [mounted, setMounted] = useState(false)
  
  // 静态文本替代翻译
  const heroText = {
    title: 'Professional Handbag Manufacturer',
    subtitle: 'OEM & ODM Since 1992',
    description: 'High Quality Leather Bags Supplier for Professional Brands Worldwide',
    cta_primary: 'View Products',
    cta_secondary: 'Contact Us',
    stat1: 'Years Experience',
    stat2: 'Countries',
    stat3: 'Factory Area (㎡)'
  }
  
  const fullText = heroText.title
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    setDisplayText('')
    setCurrentIndex(0)
  }, [fullText])

  useEffect(() => {
    if (mounted && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, fullText, mounted])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Full-Screen Background Image - 人物在右侧的构图 */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale }}
      >
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
          alt="Fashion Background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        
        {/* 优化的渐变遮罩 - 左侧深色，右侧透明，不遮挡人物 */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-dark-900/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-900" />
        
        {/* 品牌色叠加 */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-transparent" />
      </motion.div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-5" />

      {/* Floating Particles - 减少数量 */}
      <ParticleField />

      {/* Gradient Orb - 左侧 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-blue/30 rounded-full blur-3xl"
      />

      {/* Content - 左对齐，避开右侧人物 */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* 简化的标题 - 单行或两行 */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="gradient-text block" style={{ WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' }}>
                  {mounted ? displayText : fullText}
                  {mounted && currentIndex < fullText.length && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-12 sm:h-14 md:h-16 lg:h-20 bg-neon-blue ml-2"
                    />
                  )}
                </span>
              </h1>
              
              {/* 副标题 - 简洁版本 */}
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-300"
              >
                {heroText.subtitle}
              </motion.p>
            </div>

            {/* 描述文字 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-xl"
            >
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
                {heroText.description}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary btn-glow group relative overflow-hidden px-10 py-5 text-lg font-semibold"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {heroText.cta_primary}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 text-lg rounded-full font-semibold glass-strong hover:glass border-2 border-white/20 hover:border-neon-blue/50 transition-all duration-300"
                >
                  {heroText.cta_secondary}
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats - 横向排列 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-wrap gap-8 pt-8"
            >
              <StatItem number="30+" label={heroText.stat1} />
              <StatItem number="56" label={heroText.stat2} />
              <StatItem number="5000+" label={heroText.stat3} />
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-gray-400 text-sm">Scroll</div>
          <div className="w-6 h-10 rounded-full border-2 border-neon-blue/50 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-neon-blue rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative corner - 只保留左上角 */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-neon-blue/30" />
    </section>
  )
}

function StatItem({ number, label }) {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  // 提取数字部分
  const targetNumber = parseInt(number.replace(/[^0-9]/g, '')) || 0
  const suffix = number.replace(/[0-9]/g, '')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || targetNumber === 0) return

    const duration = 2000
    const steps = 60
    const increment = targetNumber / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetNumber) {
        setCount(targetNumber)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [targetNumber, mounted])

  // 如果没有挂载或者目标数字为0，直接显示原始数字
  const displayNumber = mounted && targetNumber > 0 ? count : targetNumber

  return (
    <div className="flex items-baseline gap-2">
      <div className="text-4xl sm:text-5xl font-bold gradient-text">
        {displayNumber}{suffix}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 50, // 只在左侧50%区域
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
