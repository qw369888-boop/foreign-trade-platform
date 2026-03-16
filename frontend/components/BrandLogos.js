'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function BrandLogos() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')

  const brands = [
    { name: 'Nike', logo: '/logos/nike.svg' },
    { name: 'Adidas', logo: '/logos/adidas.svg' },
    { name: 'Puma', logo: '/logos/puma.svg' },
    { name: 'Under Armour', logo: '/logos/under-armour.svg' },
    { name: 'New Balance', logo: '/logos/new-balance.svg' },
    { name: 'Reebok', logo: '/logos/reebok.svg' },
    { name: 'Converse', logo: '/logos/converse.svg' },
    { name: 'Vans', logo: '/logos/vans.svg' }
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-800/50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">
              {isZh ? '信赖我们的品牌' : 'Trusted by Leading Brands'}
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            {isZh ? '全球500+知名品牌的选择' : 'Chosen by 500+ global leading brands'}
          </p>
        </motion.div>

        {/* Brand Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center p-4 glass rounded-xl hover:glass-strong transition-all duration-300"
            >
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{brand.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">500+</div>
            <div className="text-gray-400">{isZh ? '信赖品牌' : 'Trusted Brands'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">10,000+</div>
            <div className="text-gray-400">{isZh ? '产品交付' : 'Products Delivered'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">98%</div>
            <div className="text-gray-400">{isZh ? '满意度' : 'Satisfaction Rate'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">30+</div>
            <div className="text-gray-400">{isZh ? '年经验' : 'Years Experience'}</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}