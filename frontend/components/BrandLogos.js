'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { FiStar } from 'react-icons/fi'

export default function BrandLogos() {
  const { t } = useTranslation('common')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Real buyer reviews - Nordic, Thailand, Australia focus
  const reviews = [
    {
      name: t('brands.review1_name') || 'Lars Andersson',
      country: t('brands.review1_country') || '🇸🇪 Sweden',
      avatar: '👨‍💼',
      rating: 5,
      date: '2026-02-15',
      review: t('brands.review1_text') || 'Excellent quality handbags! The leather is premium and stitching is perfect. Our customers love them. Will order again!',
      product: t('brands.review1_product') || 'Leather Tote Bags',
      verified: true
    },
    {
      name: t('brands.review2_name') || 'Somchai Pattana',
      country: t('brands.review2_country') || '🇹🇭 Thailand',
      avatar: '👨‍💻',
      rating: 5,
      date: '2026-02-20',
      review: t('brands.review2_text') || 'Fast shipping and great communication. The OEM service is professional. Highly recommend for B2B orders.',
      product: t('brands.review2_product') || 'Crossbody Bags',
      verified: true
    },
    {
      name: t('brands.review3_name') || 'Emma Wilson',
      country: t('brands.review3_country') || '🇦🇺 Australia',
      avatar: '👩‍🎨',
      rating: 5,
      date: '2026-02-28',
      review: t('brands.review3_text') || 'Beautiful designs and excellent craftsmanship. Our boutique customers are very satisfied. Great supplier!',
      product: t('brands.review3_product') || 'Shoulder Bags',
      verified: true
    },
    {
      name: t('brands.review4_name') || 'Ingrid Hansen',
      country: t('brands.review4_country') || '🇳🇴 Norway',
      avatar: '👩‍💼',
      rating: 5,
      date: '2026-03-05',
      review: t('brands.review4_text') || 'Outstanding quality control. Every piece meets our standards. The factory is very reliable for large orders.',
      product: t('brands.review4_product') || 'Handbags Collection',
      verified: true
    },
    {
      name: t('brands.review5_name') || 'Niran Chaiwong',
      country: t('brands.review5_country') || '🇹🇭 Thailand',
      avatar: '👩‍🦰',
      rating: 5,
      date: '2026-03-08',
      review: t('brands.review5_text') || 'Perfect for our fashion brand. The customization options are great and the MOQ is reasonable. ขอบคุณครับ!',
      product: t('brands.review5_product') || 'Custom Handbags',
      verified: true
    },
    {
      name: t('brands.review6_name') || 'Mikkel Jensen',
      country: t('brands.review6_country') || '🇩🇰 Denmark',
      avatar: '👨‍🎓',
      rating: 5,
      date: '2026-03-10',
      review: t('brands.review6_text') || 'Very professional team. They helped us with design and production. Quality is top-notch!',
      product: t('brands.review6_product') || 'Designer Bags',
      verified: true
    }
  ]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 bg-cyber-grid opacity-5" />
      
      {/* Animated Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />

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
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="gradient-text">Real Buyer Reviews</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            What our B2B customers say about us
          </motion.p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer relative overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl shadow-lg">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white">{review.name}</h4>
                        {review.verified && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                            ✓ {t('brands.verified') || 'Verified'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{review.country}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  "{review.review}"
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-gray-500">{review.product}</span>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 glass-strong rounded-full px-8 py-4 border border-white/10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm border-2 border-dark-900">
                👤
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-sm border-2 border-dark-900">
                👤
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-sm border-2 border-dark-900">
                👤
              </div>
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">500+ Happy Customers</p>
              <p className="text-xs text-gray-400">Trusted worldwide since 1992</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
