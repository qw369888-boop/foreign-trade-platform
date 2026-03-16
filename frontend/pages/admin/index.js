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
    todayVisitors: 0
  })
  const [visitorHistory, setVisitorHistory] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [visitorDetails, setVisitorDetails] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [revenueHistory, setRevenueHistory] = useState([])
  const [refundHistory, setRefundHistory] = useState([])
  const [showVisitorHistory, setShowVisitorHistory] = useState(false)
  const [showOnlineUsers, setShowOnlineUsers] = useState(false)
  const [showVisitorDetails, setShowVisitorDetails] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showDataDetails, setShowDataDetails] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentDataType, setCurrentDataType] = useState('')

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

  const fetchVisitorHistory = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/visitor-history?days=30', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setVisitorHistory(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch visitor history:', error)
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/online-users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setOnlineUsers(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch online users:', error)
    }
  }

  const fetchVisitorDetails = async (date) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/visitor-details/${date}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setVisitorDetails(result.data || [])
        setSelectedDate(date)
      }
    } catch (error) {
      console.error('Failed to fetch visitor details:', error)
    }
  }

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/popular-products?days=7', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setPopularProducts(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch popular products:', error)
    }
  }

  const fetchDataByDate = async (date, dataType) => {
    try {
      let endpoint = ''
      switch (dataType) {
        case 'orders':
          endpoint = `/api/admin/orders-by-date/${date}`
          break
        case 'revenue':
          endpoint = `/api/admin/revenue-by-date/${date}`
          break
        case 'refunds':
          endpoint = `/api/admin/refunds-by-date/${date}`
          break
        case 'visitors':
          endpoint = `/api/admin/visitor-details/${date}`
          break
        default:
          return
      }

      const response = await fetch(`http://localhost:4000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        
        switch (dataType) {
          case 'orders':
            setOrderHistory(result.data || [])
            break
          case 'revenue':
            setRevenueHistory(result.data || [])
            break
          case 'refunds':
            setRefundHistory(result.data || [])
            break
          case 'visitors':
            setVisitorDetails(result.data || [])
            break
        }
        
        setSelectedDate(date)
        setShowDataDetails(true)
      }
    } catch (error) {
      console.error(`Failed to fetch ${dataType} data:`, error)
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
    { title: '在线用户', value: stats.onlineUsers, icon: FiUsers, color: 'from-green-500 to-emerald-500', realtime: true, showOnline: true },
    { title: '总订单', value: stats.totalOrders, icon: FiShoppingBag, color: 'from-blue-500 to-cyan-500', showDatePicker: true, dataType: 'orders' },
    { title: '总收入', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'from-purple-500 to-pink-500', showDatePicker: true, dataType: 'revenue' },
    { title: '待处理订单', value: stats.pendingOrders, icon: FiPackage, color: 'from-orange-500 to-red-500' },
    { title: '退款', value: stats.refunds, icon: FiRefreshCw, color: 'from-red-500 to-rose-500', showDatePicker: true, dataType: 'refunds' },
    { title: '今日访客', value: stats.todayVisitors, icon: FiTrendingUp, color: 'from-indigo-500 to-purple-500', showHistory: true, showDatePicker: true, dataType: 'visitors' },
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
                <div className="flex gap-2">
                  {stat.showOnline && (
                    <button
                      onClick={() => {
                        fetchOnlineUsers()
                        setShowOnlineUsers(true)
                      }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-all"
                      title="查看在线用户IP"
                    >
                      <FiUsers className="w-4 h-4 text-green-400" />
                    </button>
                  )}
                  {stat.showDatePicker && (
                    <button
                      onClick={() => {
                        setCurrentDataType(stat.dataType)
                        setShowDatePicker(true)
                      }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-all"
                      title="选择日期查看数据"
                    >
                      📅
                    </button>
                  )}
                  {stat.showHistory && (
                    <button
                      onClick={() => {
                        fetchVisitorHistory()
                        setShowVisitorHistory(true)
                      }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-all"
                      title="查看访客历史"
                    >
                      <FiTrendingUp className="w-4 h-4 text-blue-400" />
                    </button>
                  )}
                  <button
                    onClick={fetchStats}
                    className="p-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <FiRefreshCw className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
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

      {/* 访客历史弹窗 */}
      {showVisitorHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">访客历史统计</h2>
              <button
                onClick={() => setShowVisitorHistory(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {visitorHistory.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-400 border-b border-white/10 pb-2">
                    <div>日期</div>
                    <div>独立访客</div>
                    <div>页面浏览量</div>
                    <div>查看产品数</div>
                  </div>
                  {visitorHistory.map((day, index) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-4 gap-4 p-3 rounded-lg glass hover:glass-strong transition-all cursor-pointer"
                      onClick={() => {
                        fetchVisitorDetails(day.date)
                        setShowVisitorDetails(true)
                      }}
                    >
                      <div className="text-white">{day.date}</div>
                      <div className="text-neon-blue font-semibold">{day.visitors}</div>
                      <div className="text-neon-purple font-semibold">{day.page_views}</div>
                      <div className="text-yellow-400 font-semibold">{day.products_viewed || 0}</div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  暂无访客历史数据
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 在线用户IP弹窗 */}
      {showOnlineUsers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">在线用户详情</h2>
              <button
                onClick={() => setShowOnlineUsers(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {onlineUsers.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-400 border-b border-white/10 pb-2">
                    <div>IP地址</div>
                    <div>地理位置</div>
                    <div>当前页面</div>
                    <div>浏览器</div>
                    <div>操作系统</div>
                    <div>最后活动</div>
                  </div>
                  {onlineUsers.map((user, index) => (
                    <motion.div
                      key={user.session_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-6 gap-4 p-3 rounded-lg glass hover:glass-strong transition-all text-sm"
                    >
                      <div className="text-neon-blue font-mono">{user.ip_address}</div>
                      <div className="text-white">
                        {user.location_country || user.country || '未知'} 
                        {(user.location_city || user.city) && ` - ${user.location_city || user.city}`}
                      </div>
                      <div className="text-gray-300 truncate">{user.page || '/'}</div>
                      <div className="text-gray-300">{user.browser || '未知'}</div>
                      <div className="text-gray-300">{user.os || '未知'}</div>
                      <div className="text-gray-400">{new Date(user.last_activity).toLocaleTimeString()}</div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  当前无在线用户
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 访客详情弹窗 */}
      {showVisitorDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 max-w-7xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">{selectedDate} 访客详情</h2>
              <button
                onClick={() => setShowVisitorDetails(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {visitorDetails.length > 0 ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-400 border-b border-white/10 pb-2">
                    <div>IP地址</div>
                    <div>地理位置</div>
                    <div>访问时间</div>
                    <div>浏览器/系统</div>
                    <div>页面访问数</div>
                    <div>访问页面</div>
                    <div>查看产品</div>
                  </div>
                  {visitorDetails.map((visitor, index) => (
                    <motion.div
                      key={visitor.session_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-7 gap-4 p-3 rounded-lg glass hover:glass-strong transition-all text-sm"
                    >
                      <div className="text-neon-blue font-mono">{visitor.ip_address}</div>
                      <div className="text-white">
                        {visitor.country || '未知'}
                        {visitor.city && ` - ${visitor.city}`}
                      </div>
                      <div className="text-gray-300">{new Date(visitor.created_at).toLocaleString()}</div>
                      <div className="text-gray-300">
                        {visitor.browser || '未知'} / {visitor.os || '未知'}
                      </div>
                      <div className="text-neon-purple font-semibold">{visitor.total_page_views}</div>
                      <div className="text-gray-300 truncate" title={visitor.pages_visited}>
                        {visitor.pages_visited ? visitor.pages_visited.split(',').length + '个页面' : '无'}
                      </div>
                      <div className="text-yellow-400 truncate" title={visitor.products_viewed}>
                        {visitor.products_viewed ? visitor.products_viewed.split(',').slice(0,2).join(', ') + (visitor.products_viewed.split(',').length > 2 ? '...' : '') : '无'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  该日期无访客数据
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 日期选择弹窗 */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                选择日期查看{currentDataType === 'orders' ? '订单' : 
                           currentDataType === 'revenue' ? '收入' : 
                           currentDataType === 'refunds' ? '退款' : '访客'}数据
              </h2>
              <button
                onClick={() => setShowDatePicker(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  选择日期
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-white/10 text-white focus:border-neon-blue focus:outline-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (selectedDate) {
                      if (currentDataType === 'visitors') {
                        fetchVisitorDetails(selectedDate)
                        setShowVisitorDetails(true)
                      } else {
                        fetchDataByDate(selectedDate, currentDataType)
                      }
                      setShowDatePicker(false)
                    }
                  }}
                  disabled={!selectedDate}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  查看{currentDataType === 'orders' ? '订单' : 
                       currentDataType === 'revenue' ? '收入' : 
                       currentDataType === 'refunds' ? '退款' : '访客'}详情
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-all"
                >
                  取消
                </button>
              </div>
              
              <div className="text-sm text-gray-400">
                <p>💡 提示：选择日期后可以查看该日的详细{currentDataType === 'orders' ? '订单' : 
                                                                currentDataType === 'revenue' ? '收入' : 
                                                                currentDataType === 'refunds' ? '退款' : '访客'}记录，包括：</p>
                <ul className="mt-2 space-y-1 ml-4">
                  {currentDataType === 'orders' && (
                    <>
                      <li>• 订单详情和状态</li>
                      <li>• 客户信息和联系方式</li>
                      <li>• 订单金额和支付状态</li>
                    </>
                  )}
                  {currentDataType === 'revenue' && (
                    <>
                      <li>• 收入明细和来源</li>
                      <li>• 支付方式统计</li>
                      <li>• 收入趋势分析</li>
                    </>
                  )}
                  {currentDataType === 'refunds' && (
                    <>
                      <li>• 退款订单详情</li>
                      <li>• 退款原因和金额</li>
                      <li>• 退款处理状态</li>
                    </>
                  )}
                  {currentDataType === 'visitors' && (
                    <>
                      <li>• 访客IP地址和地理位置</li>
                      <li>• 访问的页面和产品</li>
                      <li>• 访问时间和浏览器信息</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 通用数据详情弹窗 */}
      {showDataDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 max-w-7xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {selectedDate} {currentDataType === 'orders' ? '订单' : 
                              currentDataType === 'revenue' ? '收入' : 
                              currentDataType === 'refunds' ? '退款' : '数据'}详情
              </h2>
              <button
                onClick={() => setShowDataDetails(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="text-gray-400 text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {currentDataType === 'orders' && (
                <OrderDetailsTable orders={orderHistory} />
              )}
              {currentDataType === 'revenue' && (
                <RevenueDetailsTable revenue={revenueHistory} />
              )}
              {currentDataType === 'refunds' && (
                <RefundDetailsTable refunds={refundHistory} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// 订单详情表格组件
function OrderDetailsTable({ orders }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-400 border-b border-white/10 pb-2">
        <div>订单号</div>
        <div>客户邮箱</div>
        <div>订单金额</div>
        <div>支付状态</div>
        <div>订单状态</div>
        <div>创建时间</div>
      </div>
      {orders.length > 0 ? orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="grid grid-cols-6 gap-4 p-3 rounded-lg glass hover:glass-strong transition-all text-sm"
        >
          <div className="text-neon-blue font-mono">{order.order_number}</div>
          <div className="text-white">{order.customer_email || '未知'}</div>
          <div className="text-green-400 font-semibold">${order.total}</div>
          <div className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
            {order.payment_status === 'paid' ? '已支付' : '待支付'}
          </div>
          <div className="text-gray-300">{order.status}</div>
          <div className="text-gray-400">{new Date(order.created_at).toLocaleString()}</div>
        </motion.div>
      )) : (
        <div className="text-center py-8 text-gray-400">该日期无订单数据</div>
      )}
    </div>
  )
}

// 收入详情表格组件
function RevenueDetailsTable({ revenue }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-400 border-b border-white/10 pb-2">
        <div>订单号</div>
        <div>收入金额</div>
        <div>支付方式</div>
        <div>货币</div>
        <div>支付时间</div>
      </div>
      {revenue.length > 0 ? revenue.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="grid grid-cols-5 gap-4 p-3 rounded-lg glass hover:glass-strong transition-all text-sm"
        >
          <div className="text-neon-blue font-mono">{item.order_number}</div>
          <div className="text-green-400 font-bold text-lg">${item.amount}</div>
          <div className="text-white">{item.payment_method || 'Unknown'}</div>
          <div className="text-gray-300">{item.currency || 'USD'}</div>
          <div className="text-gray-400">{new Date(item.paid_at).toLocaleString()}</div>
        </motion.div>
      )) : (
        <div className="text-center py-8 text-gray-400">该日期无收入数据</div>
      )}
    </div>
  )
}

// 退款详情表格组件
function RefundDetailsTable({ refunds }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-400 border-b border-white/10 pb-2">
        <div>订单号</div>
        <div>退款金额</div>
        <div>退款原因</div>
        <div>客户邮箱</div>
        <div>退款状态</div>
        <div>退款时间</div>
      </div>
      {refunds.length > 0 ? refunds.map((refund, index) => (
        <motion.div
          key={refund.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="grid grid-cols-6 gap-4 p-3 rounded-lg glass hover:glass-strong transition-all text-sm"
        >
          <div className="text-neon-blue font-mono">{refund.order_number}</div>
          <div className="text-red-400 font-semibold">-${refund.amount}</div>
          <div className="text-gray-300">{refund.reason || '未说明'}</div>
          <div className="text-white">{refund.customer_email}</div>
          <div className="text-yellow-400">{refund.status}</div>
          <div className="text-gray-400">{new Date(refund.refunded_at).toLocaleString()}</div>
        </motion.div>
      )) : (
        <div className="text-center py-8 text-gray-400">该日期无退款数据</div>
      )}
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
