import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiSave, FiMail, FiCreditCard, FiGlobe, FiShield } from 'react-icons/fi'

export default function Settings() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [settings, setSettings] = useState({
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    emailFrom: 'noreply@example.com',
    
    // Payment Settings
    paypalClientId: 'test',
    paypalSecret: '',
    paypalMode: 'sandbox',
    stripePublicKey: '',
    stripeSecretKey: '',
    
    // Site Settings
    currency: 'USD',
    language: 'en',
    timezone: 'UTC',
    
    // Security Settings
    jwtSecret: process.env.JWT_SECRET || '',
    sessionTimeout: '7d',
    maxLoginAttempts: '5'
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSave = async (section) => {
    alert(`${section} 设置已保存（演示模式）`)
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">系统设置</h1>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 rounded-lg glass hover:glass-strong transition-all text-white"
            >
              返回后台
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Email Settings */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FiMail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">邮件设置</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">SMTP 主机</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">SMTP 端口</label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">SMTP 用户名</label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">SMTP 密码</label>
                <input
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">发件人邮箱</label>
                <input
                  type="email"
                  value={settings.emailFrom}
                  onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <button
                onClick={() => handleSave('邮件')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存邮件设置
              </button>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <FiCreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">支付设置</h2>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">PayPal</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">PayPal Client ID</label>
                <input
                  type="text"
                  value={settings.paypalClientId}
                  onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">PayPal Secret</label>
                <input
                  type="password"
                  value={settings.paypalSecret}
                  onChange={(e) => setSettings({ ...settings, paypalSecret: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">模式</label>
                <select
                  value={settings.paypalMode}
                  onChange={(e) => setSettings({ ...settings, paypalMode: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="sandbox">沙盒模式</option>
                  <option value="live">生产模式</option>
                </select>
              </div>
              
              <h3 className="text-lg font-semibold text-white pt-4">Stripe</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Stripe Public Key</label>
                <input
                  type="text"
                  value={settings.stripePublicKey}
                  onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Stripe Secret Key</label>
                <input
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <button
                onClick={() => handleSave('支付')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存支付设置
              </button>
            </div>
          </div>

          {/* Site Settings */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FiGlobe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">网站设置</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">货币</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="USD">USD - 美元</option>
                  <option value="EUR">EUR - 欧元</option>
                  <option value="GBP">GBP - 英镑</option>
                  <option value="CNY">CNY - 人民币</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">默认语言</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">时区</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Shanghai">Asia/Shanghai</option>
                </select>
              </div>
              <button
                onClick={() => handleSave('网站')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存网站设置
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">安全设置</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">会话超时</label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="1h">1小时</option>
                  <option value="24h">24小时</option>
                  <option value="7d">7天</option>
                  <option value="30d">30天</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">最大登录尝试次数</label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <button
                onClick={() => handleSave('安全')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存安全设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
