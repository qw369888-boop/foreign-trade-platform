'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { FiStar, FiChevronLeft, FiChevronRight, FiAward, FiCheckCircle, FiTrendingUp, FiUsers, FiShield, FiGlobe, FiSettings } from 'react-icons/fi'

export default function Testimonials() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: isZh ? '采购经理，Fashion Forward Inc. (美国)' : 'Purchasing Manager, Fashion Forward Inc. (USA)',
      avatar: '👩‍💼',
      rating: 5,
      text: isZh 
        ? '我们与大艺合作已有3年。他们的质量控制非常出色，总是能按时交货。是我们零售业务的优秀合作伙伴。'
        : 'We\'ve been sourcing handbags from Dayi for 3 years. Their quality control is excellent and they always meet our delivery deadlines. Great partner for our retail business.',
      color: 'from-neon-blue to-cyan-400',
    },
    {
      name: 'Marco Rodriguez',
      role: isZh ? '品牌总监，Luxury Leather Co. (西班牙)' : 'Brand Director, Luxury Leather Co. (Spain)',
      avatar: '👨‍💼',
      rating: 5,
      text: isZh
        ? '大艺的OEM服务帮助我们将设计理念完美转化为现实。他们的工艺水平和专业建议让我们的产品在欧洲市场大获成功。'
        : 'Dayi\'s OEM service helped us bring our design concepts to life perfectly. Their craftsmanship and professional advice made our products a huge success in the European market.',
      color: 'from-neon-purple to-pink-400',
    },
    {
      name: 'Yuki Tanaka',
      role: isZh ? '产品开发主管，Tokyo Fashion House (日本)' : 'Product Development Lead, Tokyo Fashion House (Japan)',
      avatar: '👩‍🎨',
      rating: 5,
      text: isZh
        ? '与大艺的合作让我们学到了很多。他们不仅是供应商，更是我们的技术顾问。产品质量始终如一，客户满意度很高。'
        : 'Working with Dayi has been educational. They\'re not just suppliers but technical consultants. Consistent quality and high customer satisfaction rates.',
      color: 'from-green-500 to-emerald-400',
    },
    {
      name: 'Emma Thompson',
      role: isZh ? '创始人，Sustainable Style (英国)' : 'Founder, Sustainable Style (UK)',
      avatar: '👩‍🚀',
      rating: 5,
      text: isZh
        ? '大艺在可持续发展方面的承诺与我们的品牌价值观完美契合。他们使用环保材料，生产过程透明，是负责任的制造合作伙伴。'
        : 'Dayi\'s commitment to sustainability aligns perfectly with our brand values. They use eco-friendly materials and maintain transparent production processes. A responsible manufacturing partner.',
      color: 'from-orange-500 to-red-400',
    },
    {
      name: 'Ahmed Hassan',
      role: isZh ? '采购总监，Middle East Retail Group (阿联酋)' : 'Procurement Director, Middle East Retail Group (UAE)',
      avatar: '👨‍💻',
      rating: 5,
      text: isZh
        ? '大艺的产品在中东市场表现出色。他们理解我们的文化需求，提供定制化解决方案。交货及时，质量可靠。'
        : 'Dayi\'s products perform excellently in the Middle East market. They understand our cultural requirements and provide customized solutions. Timely delivery and reliable quality.',
      color: 'from-indigo-500 to-blue-400',
    },
    {
      name: 'Lisa Wang',
      role: isZh ? '电商总监，Global Fashion Online (澳大利亚)' : 'E-commerce Director, Global Fashion Online (Australia)',
      avatar: '👩‍💼',
      rating: 5,
      text: isZh
        ? '作为电商平台，我们需要多样化的产品线。大艺提供了丰富的选择，从经典到时尚，满足了我们不同客户群体的需求。'
        : 'As an e-commerce platform, we need diverse product lines. Dayi provides rich options from classic to trendy, meeting our different customer segments\' needs.',
      color: 'from-teal-500 to-green-400',
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const stats = [
    {
      icon: FiTrendingUp,
      number: '500+',
      label: isZh ? '信赖品牌' : 'Trusted Brands',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: FiUsers,
      number: '10,000+',
      label: isZh ? '产品交付' : 'Products Delivered',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: FiShield,
      number: '98%',
      label: isZh ? '满意度' : 'Satisfaction Rate',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: FiGlobe,
      number: '30+',
      label: isZh ? '年经验' : 'Years Experience',
      color: 'from-orange-500 to-red-400'
    }
  ]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-neon-blue/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-neon-purple/30 rounded-full"
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
              {isZh ? '客户反馈' : 'Customer Feedback'}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {isZh ? '我们的商业伙伴对与我们合作的评价' : 'What our business partners say about working with us'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-strong rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentIndex].color} opacity-5`} />
            
            <div className="relative z-10">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <FiStar key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <motion.blockquote
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-gray-300 text-center mb-8 leading-relaxed italic"
              >
                "{testimonials[currentIndex].text}"
              </motion.blockquote>

              {/* Author Info */}
              <motion.div
                key={`author-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{testimonials[currentIndex].avatar}</div>
                <div className="text-xl font-bold text-white mb-2">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-gray-400">
                  {testimonials[currentIndex].role}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass-strong hover:glass border border-white/20 hover:border-neon-blue/50 transition-all group"
          >
            <FiChevronLeft className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass-strong hover:glass border border-white/20 hover:border-neon-blue/50 transition-all group"
          >
            <FiChevronRight className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-neon-blue shadow-lg shadow-neon-blue/50 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {isZh ? '真实买家评价' : 'Real Buyer Reviews'}
          </h3>
          <p className="text-gray-400 mb-8">
            {isZh ? '我们的B2B客户对我们的评价' : 'What our B2B customers say about us'}
          </p>
          
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-6xl mb-2">👤</div>
              <div className="text-sm text-gray-400">{isZh ? '莎拉·陈' : 'Sarah C.'}</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">👤</div>
              <div className="text-sm text-gray-400">{isZh ? '马可·罗' : 'Marco R.'}</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">👤</div>
              <div className="text-sm text-gray-400">{isZh ? '由纪·田' : 'Yuki T.'}</div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="text-3xl font-bold gradient-text mb-2">500+</div>
            <div className="text-gray-400">
              {isZh ? '满意客户' : 'Happy Customers'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {isZh ? '自1992年以来值得信赖' : 'Trusted worldwide since 1992'}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}