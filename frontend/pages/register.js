import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const text = {
    register: isZh ? '注册' : 'Register',
    register_subtitle: isZh ? '创建您的账户' : 'Create your account',
    first_name: isZh ? '名字' : 'First Name',
    last_name: isZh ? '姓氏' : 'Last Name',
    email: isZh ? '邮箱' : 'Email',
    phone: isZh ? '电话' : 'Phone',
    optional: isZh ? '可选' : 'Optional',
    password: isZh ? '密码' : 'Password',
    password_hint: isZh ? '至少6个字符' : 'At least 6 characters',
    confirm_password: isZh ? '确认密码' : 'Confirm Password',
    registering: isZh ? '创建账户中...' : 'Creating account...',
    have_account: isZh ? '已有账户？' : 'Already have an account?',
    login: isZh ? '登录' : 'Login',
    passwords_not_match: isZh ? '密码不匹配' : 'Passwords do not match',
    password_too_short: isZh ? '密码至少需要6个字符' : 'Password must be at least 6 characters'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(text.passwords_not_match)
      return
    }

    if (formData.password.length < 6) {
      setError(text.password_too_short)
      return
    }

    setLoading(true)

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    })

    if (result.success) {
      router.push(isZh ? '/zh' : '/')
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
                <span className="gradient-text">{text.register}</span>
              </h1>
              <p className="text-gray-400 text-center mb-8">
                {text.register_subtitle}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {text.first_name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      {text.last_name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {text.email}
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
                    {text.phone} ({text.optional})
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {text.password}
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {text.password_hint}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {text.confirm_password}
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? text.registering : text.register}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {text.have_account}{' '}
                  <Link href={isZh ? "/zh/login" : "/login"} className="text-neon-blue hover:text-neon-purple transition-colors">
                    {text.login}
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