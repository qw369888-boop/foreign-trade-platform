import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiRefreshCw } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function Analytics() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    topProducts: [],
    recentOrders: []
  })
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      // 模拟数据
      setStats({
        totalRevenue: 12580.50,
        totalOrders: 156,
        totalUsers: 89,
        totalProducts: 18,
        avgOrderValue: 80.65,
        conversionRate: 3.2,
        topProducts: [
          { name: 'Fashion PU Leather Shoulder Bag', sales: 45, revenue: 562.50 },
          { name: 'Wholesale PU Leather Tote Bag', sales: 38, revenue: 513.00 },
          { name: 'OEM ODM Fashionable Handbag', sales: 32, revenue: 441.60 },
          { name: 'Custom Laptop Bag for Women', sales: 28, revenue: 616.00 },
          { name: 'Premium Pu Ladies Hand Bag', sales: 25, revenue: 347.50 }
        ],
        recentOrders: []
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  const statCards = [
    { title: '总收入', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'from-green-500 to-emerald-500', change: '+12.5%' },
    { title: '总订单', value: stats.totalOrders, icon: FiShoppingBag, color: 'from-blue-500 to-cyan-500', change: '+8.3%' },
    { title: '总用户', value: stats.totalUsers, icon: FiUsers, color: 'from-purple-500 to-pink-500', change: '+15.2%' },
    { title: '总产品', value: stats.totalProducts, icon: FiPackage, color: 'from-orange-500 to-red-500', change: '+2' },
    { title: '平均订单金额', value: `$${stats.avgOrderValue.toFixed(2)}`, icon: FiTrendingUp, color: 'from-indigo-500 to-purple-500', change: '+5.7%' },
    { title: '转化率', value: `${stats.conversionRate}%`, icon: FiRefreshCw, color: 'from-pink-500 to-rose-500', change: '+0.8%' }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">分析报告</h1>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
              >
                <option value="today">今天</option>
                <option value="7days">最近7天</option>
                <option value="30days">最近30天</option>
                <option value="90days">最近90天</option>
                <option value="year">今年</option>
              </select>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 rounded-lg glass hover:glass-strong transition-all text-white"
              >
                返回后台
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
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
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Top Products */}
        <div className="glass-strong rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">热销产品 Top 5</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.sales} 件销售</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${product.revenue.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">收入</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">销售趋势</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              图表区域（需要集成图表库）
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">产品分类分布</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              图表区域（需要集成图表库）
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
