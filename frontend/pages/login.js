import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 静态文本替代翻译
  const loginText = {
    title: '登录',
    subtitle: '欢迎回来！',
    email: '邮箱',
    password: '密码',
    login_button: '登录',
    no_account: '还没有账户？',
    register: '注册',
    email_placeholder: 'you@example.com',
    password_placeholder: '••••••••'
  }

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
                <span className="gradient-text">{loginText.title}</span>
              </h1>
              <p className="text-gray-400 text-center mb-8">
                {loginText.subtitle}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {loginText.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    placeholder={loginText.email_placeholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {loginText.password}
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    placeholder={loginText.password_placeholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '登录中...' : loginText.login_button}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {loginText.no_account}{' '}
                  <Link href="/register" className="text-neon-blue hover:text-neon-purple transition-colors">
                    {loginText.register}
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
