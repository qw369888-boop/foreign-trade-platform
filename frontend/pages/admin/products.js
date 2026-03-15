import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsManagement() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    name_zh: '',
    price: '',
    category: '',
    moq: '',
    description: '',
    images: []
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个产品吗？')) return

    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        alert('删除成功')
        fetchProducts()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('删除失败')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      name_zh: product.name_zh || '',
      price: product.price || '',
      category: product.category || '',
      moq: product.moq || '',
      description: product.description || '',
      images: product.images || []
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = editingProduct
      ? `http://localhost:4000/api/products/${editingProduct.id}`
      : 'http://localhost:4000/api/products'

    const method = editingProduct ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingProduct ? '更新成功' : '添加成功')
        setShowModal(false)
        setEditingProduct(null)
        setFormData({
          name: '',
          name_zh: '',
          price: '',
          category: '',
          moq: '',
          description: '',
          images: []
        })
        fetchProducts()
      } else {
        alert('操作失败')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('操作失败')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name_zh?.includes(searchTerm)
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
            <h1 className="text-2xl font-bold gradient-text">产品管理</h1>
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
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索产品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>
          <button
            onClick={() => {
              setEditingProduct(null)
              setFormData({
                name: '',
                name_zh: '',
                price: '',
                category: '',
                moq: '',
                description: '',
                images: []
              })
              setShowModal(true)
            }}
            className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
          >
            <FiPlus /> 添加产品
          </button>
        </div>

        {/* Products Table */}
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full">
            <thead className="bg-dark-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">图片</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">名称</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">价格</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">分类</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">MOQ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-white"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{product.name}</div>
                    <div className="text-gray-400 text-sm">{product.name_zh}</div>
                  </td>
                  <td className="px-6 py-4 text-white">${product.price}</td>
                  <td className="px-6 py-4 text-gray-300">{product.category}</td>
                  <td className="px-6 py-4 text-gray-300">{product.moq}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-all"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass-strong rounded-2xl p-6 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingProduct ? '编辑产品' : '添加产品'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">英文名称</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">中文名称</label>
                  <input
                    type="text"
                    value={formData.name_zh}
                    onChange={(e) => setFormData({ ...formData, name_zh: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">价格</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">MOQ</label>
                    <input
                      type="text"
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">分类</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">描述</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg glass hover:glass-strong text-white transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium"
                  >
                    {editingProduct ? '更新' : '添加'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
