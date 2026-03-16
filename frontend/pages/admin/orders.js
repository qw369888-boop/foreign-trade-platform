import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiSearch, FiEye, FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function OrdersManagement() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async (startDate = '', endDate = '') => {
    try {
      let url = 'http://localhost:4000/api/admin/orders'
      const params = new URLSearchParams()
      
      if (startDate && endDate) {
        params.append('start_date', startDate)
        params.append('end_date', endDate)
      } else if (startDate) {
        // 如果只有开始日期，就查询这一天的数据
        params.append('date', startDate)
      }
      
      if (params.toString()) {
        url += '?' + params.toString()
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        alert('订单状态已更新')
        fetchOrders()
      } else {
        alert('更新失败')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('更新失败')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      shipped: 'bg-purple-500/20 text-purple-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
      refunded: 'bg-gray-500/20 text-gray-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: '待处理',
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消',
      refunded: '已退款'
    }
    return texts[status] || status
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

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
            <h1 className="text-2xl font-bold gradient-text">订单管理</h1>
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
      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号或用户邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>
          
          {/* 日期范围筛选器 */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">开始日期</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue text-sm"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">结束日期</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue text-sm"
              />
            </div>
            
            <button
              onClick={() => fetchOrders(dateRange.start, dateRange.end)}
              className="mt-5 px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 text-white rounded-lg transition-all font-medium"
            >
              查询
            </button>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="delivered">已送达</option>
            <option value="cancelled">已取消</option>
            <option value="refunded">已退款</option>
          </select>
          
          <button
            onClick={() => {
              setDateRange({ start: '', end: '' })
              setSearchTerm('')
              setFilterStatus('all')
              fetchOrders()
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all font-medium"
          >
            重置
          </button>
        </div>

        {/* Orders Table */}
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">订单号</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">用户</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">金额</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">支付状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">创建时间</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      暂无订单数据
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-6 py-4 text-white font-mono text-sm">{order.order_number}</td>
                      <td className="px-6 py-4 text-gray-300">{order.user_email || '访客'}</td>
                      <td className="px-6 py-4 text-white">${parseFloat(order.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {order.payment_status === 'paid' ? '已支付' : '未支付'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {new Date(order.created_at).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 bg-dark-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue"
                          >
                            <option value="pending">待处理</option>
                            <option value="processing">处理中</option>
                            <option value="shipped">已发货</option>
                            <option value="delivered">已送达</option>
                            <option value="cancelled">已取消</option>
                            <option value="refunded">已退款</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
