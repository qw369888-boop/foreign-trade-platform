import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiPackage, FiRefreshCw } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    onlineUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    refunds: 0,
    visitors: 0
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // 获取统计数据
    fetchStats()
    // 每30秒刷新一次
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const statCards = [
    { title: '在线用户', value: stats.onlineUsers, icon: FiUsers, color: 'from-green-500 to-emerald-500' },
    { title: '总订单', value: stats.totalOrders, icon: FiShoppingBag, color: 'from-blue-500 to-cyan-500' },
    { title: '总收入', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'from-purple-500 to-pink-500' },
    { title: '待处理订单', value: stats.pendingOrders, icon: FiPackage, color: 'from-orange-500 to-red-500' },
    { title: '退款', value: stats.refunds, icon: FiRefreshCw, color: 'from-red-500 to-rose-500' },
    { title: '访客数', value: stats.visitors, icon: FiTrendingUp, color: 'from-indigo-500 to-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">管理后台</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">欢迎, {user.firstName}</span>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 rounded-lg glass hover:glass-strong transition-all text-white"
              >
                返回前台
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-strong rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={fetchStats}
                  className="p-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <FiRefreshCw className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ManagementCard
            title="页面编辑器"
            description="编辑独立站所有板块内容"
            icon="✏️"
            onClick={() => router.push('/admin/page-editor')}
          />
          <ManagementCard
            title="产品管理"
            description="添加、编辑、删除产品"
            icon="📦"
            onClick={() => router.push('/admin/products')}
          />
          <ManagementCard
            title="订单管理"
            description="查看和处理订单"
            icon="🛒"
            onClick={() => router.push('/admin/orders')}
          />
          <ManagementCard
            title="用户管理"
            description="管理用户账户"
            icon="👥"
            onClick={() => router.push('/admin/users')}
          />
          <ManagementCard
            title="内容管理"
            description="编辑网站信息和政策"
            icon="📝"
            onClick={() => router.push('/admin/content')}
          />
          <ManagementCard
            title="分析报告"
            description="查看详细数据"
            icon="📊"
            onClick={() => router.push('/admin/analytics')}
          />
          <ManagementCard
            title="设置"
            description="系统配置"
            icon="⚙️"
            onClick={() => router.push('/admin/settings')}
          />
        </div>
      </div>
    </div>
  )
}

function ManagementCard({ title, description, icon, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="glass-strong rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-neon-blue/50 transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  )
}
