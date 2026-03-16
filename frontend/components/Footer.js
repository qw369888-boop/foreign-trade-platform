'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi'

export default function Footer() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')

  const footerLinks = {
    products: [
      { name: isZh ? '手提包' : 'Handbags', href: isZh ? '/zh/products?category=Handbags' : '/products?category=Handbags' },
      { name: isZh ? '托特包' : 'Tote Bags', href: isZh ? '/zh/products?category=Tote%20Bags' : '/products?category=Tote%20Bags' },
      { name: isZh ? '单肩包' : 'Shoulder Bags', href: isZh ? '/zh/products?category=Shoulder%20Bags' : '/products?category=Shoulder%20Bags' },
      { name: isZh ? '斜挎包' : 'Crossbody Bags', href: isZh ? '/zh/products?category=Crossbody%20Bags' : '/products?category=Crossbody%20Bags' },
    ],
    company: [
      { name: isZh ? '关于我们' : 'About Us', href: isZh ? '/zh/about' : '/about' },
      { name: isZh ? '招聘' : 'Careers', href: isZh ? '/zh/careers' : '/careers' },
      { name: isZh ? '新闻' : 'Press', href: isZh ? '/zh/press' : '/press' },
      { name: isZh ? '博客' : 'Blog', href: isZh ? '/zh/blog' : '/blog' },
    ],
    support: [
      { name: isZh ? '帮助中心' : 'Help Center', href: isZh ? '/zh/help' : '/help' },
      { name: isZh ? '联系我们' : 'Contact Us', href: isZh ? '/zh/contact' : '/contact' },
      { name: isZh ? '物流配送' : 'Shipping', href: isZh ? '/zh/shipping' : '/shipping' },
      { name: isZh ? '退换货' : 'Returns', href: isZh ? '/zh/returns' : '/returns' },
    ],
    legal: [
      { name: isZh ? '隐私政策' : 'Privacy Policy', href: isZh ? '/zh/privacy' : '/privacy' },
      { name: isZh ? '服务条款' : 'Terms of Service', href: isZh ? '/zh/terms' : '/terms' },
      { name: isZh ? 'Cookie政策' : 'Cookie Policy', href: isZh ? '/zh/cookies' : '/cookies' },
      { name: 'GDPR', href: isZh ? '/zh/gdpr' : '/gdpr' },
    ],
  }

  const socialLinks = [
    { icon: FiFacebook, href: '#', color: 'hover:text-blue-400' },
    { icon: FiTwitter, href: '#', color: 'hover:text-sky-400' },
    { icon: FiInstagram, href: '#', color: 'hover:text-pink-400' },
    { icon: FiLinkedin, href: '#', color: 'hover:text-blue-500' },
    { icon: FiGithub, href: '#', color: 'hover:text-gray-400' },
  ]

  return (
    <footer className="relative overflow-hidden bg-dark-900 border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cyber-grid opacity-5" />
      
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={isZh ? "/zh" : "/"} className="flex items-center space-x-2 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-2xl">T</span>
              </motion.div>
              <span className="text-2xl font-bold gradient-text">TradePro</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {isZh ? '专业手袋制造商，始于1992年。为全球时尚品牌提供高品质OEM & ODM服务。' : 'Professional handbag manufacturer since 1992. Providing high-quality OEM & ODM services for global fashion brands.'}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.a
                whileHover={{ x: 5 }}
                href="mailto:qw369888@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-neon-blue transition-colors"
              >
                <FiMail className="w-4 h-4" />
                <span className="text-sm">qw369888@gmail.com</span>
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="https://wa.me/8615713656900"
                className="flex items-center gap-3 text-gray-400 hover:text-neon-blue transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span className="text-sm">+86 157 1365 6900</span>
              </motion.a>
              <div className="flex items-center gap-3 text-gray-400">
                <FiMapPin className="w-4 h-4" />
                <span className="text-sm">{isZh ? '广州，广东，中国' : 'Guangzhou, Guangdong, China'}</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <FooterLinkSection title={isZh ? '产品' : 'Products'} links={footerLinks.products} />
          <FooterLinkSection title={isZh ? '公司' : 'Company'} links={footerLinks.company} />
          <FooterLinkSection title={isZh ? '支持' : 'Support'} links={footerLinks.support} />
          <FooterLinkSection title={isZh ? '法律' : 'Legal'} links={footerLinks.legal} />
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 border-t border-white/10"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              {isZh ? '保持更新' : 'Stay Updated'}
            </h3>
            <p className="text-gray-400 mb-6">
              {isZh ? '订阅我们的新闻通讯，获取最新更新和优惠' : 'Subscribe to our newsletter for the latest updates and offers'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={isZh ? '输入您的邮箱' : 'Enter your email'}
                className="flex-1 px-6 py-3 rounded-full glass-strong border border-white/10 focus:border-neon-blue focus:outline-none transition-colors text-white placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
              >
                {isZh ? '订阅' : 'Subscribe'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TradePro. {isZh ? '版权所有。' : 'All rights reserved.'}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-full glass hover:glass-strong transition-all ${social.color}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </div>

          {/* Back to Top */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 rounded-full glass hover:glass-strong transition-all text-gray-400 hover:text-white text-sm"
          >
            {isZh ? '返回顶部 ↑' : 'Back to Top ↑'}
          </motion.button>
        </div>
      </div>
    </footer>
  )
}

// Footer Link Section Component
function FooterLinkSection({ title, links }) {
  return (
    <div>
      <h4 className="text-lg font-bold text-white mb-6">{title}</h4>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={link.href}
              className="text-gray-400 hover:text-neon-blue transition-colors text-sm block py-1"
            >
              <span className="hover:translate-x-1 transition-transform inline-block">
                {link.name}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}