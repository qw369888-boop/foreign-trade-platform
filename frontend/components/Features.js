'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'next-i18next'

export default function Features() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      key: 'custom',
      gradient: 'from-blue-500 to-cyan-400',
      delay: 0,
    },
    {
      key: 'quality',
      gradient: 'from-purple-500 to-pink-400',
      delay: 0.1,
    },
    {
      key: 'delivery',
      gradient: 'from-orange-500 to-red-400',
      delay: 0.2,
    },
    {
      key: 'export',
      gradient: 'from-green-500 to-emerald-400',
      delay: 0.3,
    },
    {
      key: 'factory',
      gradient: 'from-indigo-500 to-blue-400',
      delay: 0.4,
    },
    {
      key: 'team',
      gradient: 'from-pink-500 to-rose-400',
      delay: 0.5,
    },
  ]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900" />
      <div className="absolute inset-0 bg-cyber-grid opacity-10" />

      {/* Floating Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"
      />

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
            <span className="gradient-text">{t('features.title')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            {t('features.subtitle')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: feature.delay,
                type: 'spring',
                stiffness: 100,
              }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="glass-strong rounded-3xl p-8 h-full border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Number Badge */}
                <div className="relative z-10 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: feature.delay + 0.2, type: 'spring' }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>

                  {/* Bottom Accent Line */}
                  <div className={`h-1 bg-gradient-to-r ${feature.gradient} rounded-full mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${feature.gradient} opacity-20 rounded-bl-full`} />
                </div>
              </motion.div>

              {/* Shadow Layer */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-3xl transform translate-y-2 -z-10 group-hover:translate-y-4 transition-transform duration-300`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
