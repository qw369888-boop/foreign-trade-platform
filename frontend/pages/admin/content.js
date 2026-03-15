import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiSave } from 'react-icons/fi'

export default function ContentManagement() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [content, setContent] = useState({
    siteName: 'Foreign Trade Platform',
    siteDescription: 'Premium products for global trade',
    contactEmail: 'contact@example.com',
    contactPhone: '+1 234 567 8900',
    address: '123 Business St, City, Country',
    aboutUs: '',
    termsOfService: '',
    privacyPolicy: '',
    shippingPolicy: '',
    returnPolicy: ''
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSave = async (section) => {
    alert(`${section} 内容已保存（演示模式）`)
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
            <h1 className="text-2xl font-bold gradient-text">内容管理</h1>
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
          {/* Site Info */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">网站信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">网站名称</label>
                <input
                  type="text"
                  value={content.siteName}
                  onChange={(e) => setContent({ ...content, siteName: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">网站描述</label>
                <textarea
                  rows={3}
                  value={content.siteDescription}
                  onChange={(e) => setContent({ ...content, siteDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <button
                onClick={() => handleSave('网站信息')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">联系信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">联系邮箱</label>
                <input
                  type="email"
                  value={content.contactEmail}
                  onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">联系电话</label>
                <input
                  type="tel"
                  value={content.contactPhone}
                  onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">地址</label>
                <input
                  type="text"
                  value={content.address}
                  onChange={(e) => setContent({ ...content, address: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <button
                onClick={() => handleSave('联系信息')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存
              </button>
            </div>
          </div>

          {/* About Us */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">关于我们</h2>
            <textarea
              rows={6}
              value={content.aboutUs}
              onChange={(e) => setContent({ ...content, aboutUs: e.target.value })}
              placeholder="输入关于我们的内容..."
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue mb-4"
            />
            <button
              onClick={() => handleSave('关于我们')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
            >
              <FiSave /> 保存
            </button>
          </div>

          {/* Policies */}
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">政策条款</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">服务条款</label>
                <textarea
                  rows={4}
                  value={content.termsOfService}
                  onChange={(e) => setContent({ ...content, termsOfService: e.target.value })}
                  placeholder="输入服务条款..."
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">隐私政策</label>
                <textarea
                  rows={4}
                  value={content.privacyPolicy}
                  onChange={(e) => setContent({ ...content, privacyPolicy: e.target.value })}
                  placeholder="输入隐私政策..."
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">配送政策</label>
                <textarea
                  rows={4}
                  value={content.shippingPolicy}
                  onChange={(e) => setContent({ ...content, shippingPolicy: e.target.value })}
                  placeholder="输入配送政策..."
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">退换货政策</label>
                <textarea
                  rows={4}
                  value={content.returnPolicy}
                  onChange={(e) => setContent({ ...content, returnPolicy: e.target.value })}
                  placeholder="输入退换货政策..."
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>
              <button
                onClick={() => handleSave('政策条款')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存全部政策
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
