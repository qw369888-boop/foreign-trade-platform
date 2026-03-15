'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSun, FiMoon, FiGlobe, FiChevronDown, FiLogOut, FiPackage } from 'react-icons/fi'
import { useTranslation } from 'next-i18next'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation('common')
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { cartItems } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (lng) => {
    console.log('Changing language to:', lng)
    setIsLangMenuOpen(false)
    // 直接跳转到对应语言的首页
    if (lng === 'en') {
      window.location.href = '/'
    } else {
      window.location.href = `/${lng}`
    }
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-strong shadow-lg shadow-neon-blue/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">D</span>
            </motion.div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Dayi Leather
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.path}
                  className={`relative text-sm font-medium transition-colors hover:text-neon-blue ${
                    router.pathname === item.path
                      ? 'text-neon-blue'
                      : 'text-gray-300'
                  }`}
                >
                  {item.name}
                  {router.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:glass-strong transition-all"
                aria-label="Change language"
              >
                <FiGlobe className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Language Dropdown Menu */}
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass-strong rounded-xl border border-white/10 shadow-xl overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          i18n.language === lang.code
                            ? 'bg-neon-blue/10 text-neon-blue'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                        {i18n.language === lang.code && (
                          <span className="ml-auto text-neon-blue">✓</span>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg glass hover:glass-strong transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </motion.button>
            )}

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:glass-strong transition-all"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.firstName}</span>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass-strong rounded-xl border border-white/10 shadow-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <Link href="/orders">
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white transition-colors"
                          >
                            <FiPackage className="w-4 h-4" />
                            <span className="text-sm">{t('nav.orders') || 'My Orders'}</span>
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            logout()
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span className="text-sm">{t('auth.logout') || 'Logout'}</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium transition-all cursor-pointer hover:scale-105 active:scale-95">
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm">{t('auth.login') || 'Login'}</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg glass hover:glass-strong transition-all"
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink rounded-full text-xs flex items-center justify-center text-white font-bold"
                  >
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass hover:glass-strong transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-lg font-medium transition-colors ${
                      router.pathname === item.path
                        ? 'text-neon-blue'
                        : 'text-gray-300 hover:text-neon-blue'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-2">Language / 语言</p>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        changeLanguage(lang.code)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        i18n.language === lang.code
                          ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
                          : 'glass hover:glass-strong text-gray-300'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menus */}
      {(isLangMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsLangMenuOpen(false)
            setIsUserMenuOpen(false)
          }}
        />
      )}
    </motion.header>
  )
}
