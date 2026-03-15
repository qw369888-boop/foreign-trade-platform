import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiSearch, FiTrash2, FiShield, FiUser } from 'react-icons/fi'

export default function UsersManagement() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    if (!confirm(`确定要将此用户角色更改为 ${newRole === 'admin' ? '管理员' : '普通用户'} 吗？`)) return

    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        alert('角色已更新')
        fetchUsers()
      } else {
        alert('更新失败')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('更新失败')
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('确定要删除此用户吗？此操作不可恢复！')) return

    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        alert('用户已删除')
        fetchUsers()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('删除失败')
    }
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <h1 className="text-2xl font-bold gradient-text">用户管理</h1>
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
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">邮箱</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">姓名</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">角色</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">注册时间</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">最后登录</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      暂无用户数据
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-6 py-4 text-white font-mono">{u.id}</td>
                      <td className="px-6 py-4 text-white">{u.email}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {u.first_name} {u.last_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {u.role === 'admin' ? '管理员' : '用户'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {new Date(u.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {u.last_login ? new Date(u.last_login).toLocaleDateString('zh-CN') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                            className="p-2 rounded-lg hover:bg-purple-500/10 text-purple-400 transition-all"
                            title={u.role === 'admin' ? '设为普通用户' : '设为管理员'}
                          >
                            {u.role === 'admin' ? <FiUser className="w-4 h-4" /> : <FiShield className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
                            title="删除用户"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
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
