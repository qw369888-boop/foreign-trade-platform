import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      router.push('/')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-dark-900 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-strong rounded-3xl p-8 border border-white/10">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                <span className="gradient-text">{t('auth.login') || 'Login'}</span>
              </h1>
              <p className="text-gray-400 text-center mb-8">
                {t('auth.login_subtitle') || 'Welcome back!'}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {t('auth.email') || 'Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {t('auth.password') || 'Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (t('auth.logging_in') || 'Logging in...') : (t('auth.login') || 'Login')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {t('auth.no_account') || "Don't have an account?"}{' '}
                  <Link href="/register" className="text-neon-blue hover:text-neon-purple transition-colors">
                    {t('auth.register') || 'Register'}
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
