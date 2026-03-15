'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi'

export default function Footer() {
  const { t } = useTranslation('common')

  const footerLinks = {
    products: [
      { name: t('categories.handbags') || 'Handbags', href: '/products?category=Handbags' },
      { name: t('categories.tote_bags') || 'Tote Bags', href: '/products?category=Tote Bags' },
      { name: t('categories.shoulder_bags') || 'Shoulder Bags', href: '/products?category=Shoulder Bags' },
      { name: t('categories.crossbody_bags') || 'Crossbody Bags', href: '/products?category=Crossbody Bags' },
    ],
    company: [
      { name: t('footer.about') || 'About Us', href: '/about' },
      { name: t('footer.careers') || 'Careers', href: '/careers' },
      { name: t('footer.press') || 'Press', href: '/press' },
      { name: t('footer.blog') || 'Blog', href: '/blog' },
    ],
    support: [
      { name: t('footer.help') || 'Help Center', href: '/help' },
      { name: t('footer.contact') || 'Contact Us', href: '/contact' },
      { name: t('footer.shipping') || 'Shipping', href: '/shipping' },
      { name: t('footer.returns') || 'Returns', href: '/returns' },
    ],
    legal: [
      { name: t('footer.privacy') || 'Privacy Policy', href: '/privacy' },
      { name: t('footer.terms') || 'Terms of Service', href: '/terms' },
      { name: t('footer.cookies') || 'Cookie Policy', href: '/cookies' },
      { name: t('footer.gdpr') || 'GDPR', href: '/gdpr' },
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
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
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
              {t('footer.description') || 'Next-generation platform for international commerce. Connect with verified suppliers worldwide.'}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.a
                whileHover={{ x: 5 }}
                href="mailto:qw369888@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-neon-blue transition-colors"
              >
                <FiMail className="w-5 h-5" />
                <span>{t('footer.email') || 'qw369888@gmail.com'}</span>
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="https://wa.me/8615713656900"
                className="flex items-center gap-3 text-gray-400 hover:text-neon-blue transition-colors"
              >
                <FiPhone className="w-5 h-5" />
                <span>{t('footer.phone') || '+86 157 1365 6900'}</span>
              </motion.a>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-gray-400"
              >
                <FiMapPin className="w-5 h-5" />
                <span>{t('footer.address') || 'Guangzhou, Guangdong, China'}</span>
              </motion.div>
            </div>
          </div>

          {/* Links Sections */}
          <FooterLinkSection title={t('footer.products_title') || 'Products'} links={footerLinks.products} />
          <FooterLinkSection title={t('footer.company_title') || 'Company'} links={footerLinks.company} />
          <FooterLinkSection title={t('footer.support_title') || 'Support'} links={footerLinks.support} />
          <FooterLinkSection title={t('footer.legal_title') || 'Legal'} links={footerLinks.legal} />
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
              {t('footer.newsletter_title') || 'Stay Updated'}
            </h3>
            <p className="text-gray-400 mb-6">
              {t('footer.newsletter_desc') || 'Subscribe to our newsletter for the latest updates and offers'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('footer.email_placeholder') || 'Enter your email'}
                className="flex-1 px-6 py-3 rounded-full glass-strong border border-white/10 focus:border-neon-blue focus:outline-none transition-colors text-white placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
              >
                {t('footer.subscribe') || 'Subscribe'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TradePro. {t('footer.rights') || 'All rights reserved.'}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full glass-strong flex items-center justify-center text-gray-400 ${social.color} transition-colors border border-white/10 hover:border-white/20`}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </div>

          {/* Back to Top */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-2 rounded-full glass-strong border border-white/10 hover:border-neon-blue text-gray-400 hover:text-neon-blue transition-all text-sm font-medium"
          >
            {t('footer.back_to_top') || 'Back to Top'} ↑
          </motion.button>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkSection({ title, links }) {
  return (
    <div>
      <h4 className="text-white font-bold mb-6 text-lg">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href}>
              <motion.span
                whileHover={{ x: 5 }}
                className="text-gray-400 hover:text-neon-blue transition-colors inline-block"
              >
                {link.name}
              </motion.span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
