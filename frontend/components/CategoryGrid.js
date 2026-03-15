'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { FiShoppingBag, FiBriefcase, FiPackage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function CategoryGrid() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = [
    {
      icon: FiShoppingBag,
      title: 'Handbags',
      titleCN: '手提包',
      count: '5',
      color: 'from-neon-pink to-rose-400',
      gradient: 'bg-gradient-to-br from-neon-pink/20 to-rose-400/20',
      image: 'https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg',
    },
    {
      icon: FiBriefcase,
      title: 'Shoulder Bags',
      titleCN: '单肩包',
      count: '5',
      color: 'from-neon-purple to-indigo-400',
      gradient: 'bg-gradient-to-br from-neon-purple/20 to-indigo-400/20',
      image: 'https://sc04.alicdn.com/kf/Hbea1befbf4aa4e9ea3e2073191b32cbfz.jpg',
    },
    {
      icon: FiPackage,
      title: 'Crossbody Bags',
      titleCN: '斜挎包',
      count: '5',
      color: 'from-neon-blue to-cyan-400',
      gradient: 'bg-gradient-to-br from-neon-blue/20 to-cyan-400/20',
      image: 'https://sc04.alicdn.com/kf/H715c91f9e2b741ce8ff5eb6bae8e9013P.jpg',
    },
    {
      icon: FiShoppingBag,
      title: 'Tote Bags',
      titleCN: '托特包',
      count: '6',
      color: 'from-neon-green to-emerald-400',
      gradient: 'bg-gradient-to-br from-neon-green/20 to-emerald-400/20',
      image: 'https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg',
    },
    {
      icon: FiBriefcase,
      title: 'Bucket Bags',
      titleCN: '水桶包',
      count: '4',
      color: 'from-neon-yellow to-orange-400',
      gradient: 'bg-gradient-to-br from-neon-yellow/20 to-orange-400/20',
      image: 'https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg',
    },
    {
      icon: FiPackage,
      title: 'Backpacks',
      titleCN: '背包',
      count: '4',
      color: 'from-cyan-400 to-blue-400',
      gradient: 'bg-gradient-to-br from-cyan-400/20 to-blue-400/20',
      image: 'https://sc04.alicdn.com/kf/H6d0ecb70d561426195783cbb4b35f67cv.jpg',
    },
  ]

  const itemsPerPage = 3
  const totalPages = Math.ceil(categories.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const visibleCategories = categories.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <span className="gradient-text">热门系列</span>
            <span className="text-2xl sm:text-3xl block mt-2 text-gray-400">Popular Collections</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            精选女士包袋系列，满足各种场合需求
            <span className="block text-base mt-2 text-gray-500">High-quality women's bags for every occasion</span>
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 glass-strong rounded-full p-4 border border-white/20 hover:border-neon-blue transition-all duration-300 group"
          >
            <FiChevronLeft className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 glass-strong rounded-full p-4 border border-white/20 hover:border-neon-blue transition-all duration-300 group"
          >
            <FiChevronRight className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
          </motion.button>

          {/* Carousel Content */}
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleCategories.map((category, index) => (
                <CategoryCard
                  key={category.title}
                  category={category}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-neon-blue w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category, index, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
    >
      <Link href={`/products?category=${category.title}`}>
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer h-full"
        >
          {/* Card */}
          <div className="glass-strong rounded-3xl p-8 h-full relative overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
            {/* Background Gradient */}
            <div className={`absolute inset-0 ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative z-10">
              {/* Image with Animations */}
              <div className="w-full h-48 rounded-2xl mb-6 shadow-lg overflow-hidden bg-white relative group/image">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/image:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 blur-xl bg-gradient-to-br ${category.color}`} />
                </div>
                
                {/* Image */}
                <motion.img 
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-contain p-2 relative z-10 transition-transform duration-700 group-hover/image:scale-110"
                  whileHover={{ rotate: [0, -3, 3, -3, 0] }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Floating Particles */}
                <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <span className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-pink rounded-full animate-float block" />
                  <span className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-neon-blue rounded-full animate-float-delayed block" />
                  <span className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-neon-purple rounded-full animate-float-slow block" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                {category.title}
              </h3>
              <p className="text-gray-500 text-sm mb-3">{category.titleCN}</p>

              {/* Count */}
              <p className="text-gray-400 text-lg mb-4">{category.count} Products</p>

              {/* Arrow */}
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 10 }}
                className="flex items-center text-neon-blue font-semibold"
              >
                <span>Explore</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.div>
            </div>

            {/* Hover Glow Effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1), transparent 70%)`,
              }}
            />
          </div>

          {/* 3D Shadow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 rounded-3xl transform translate-y-2 -z-10 group-hover:translate-y-4 transition-transform duration-300" />
        </motion.div>
      </Link>
    </motion.div>
  )
}
