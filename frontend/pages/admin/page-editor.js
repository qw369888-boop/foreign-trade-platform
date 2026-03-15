import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { FiSave, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageEditor() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [selectedSection, setSelectedSection] = useState('hero')
  const [content, setContent] = useState({
    hero: {
      title: 'Premium Products for Global Trade',
      subtitle: 'Discover high-quality products from trusted manufacturers',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      backgroundImage: '/hero-bg.jpg',
      enabled: true
    },
    carousel: {
      enabled: true,
      autoplay: true,
      interval: 5000,
      slides: [
        { image: '/slide1.jpg', title: 'Slide 1', description: 'Description 1', link: '/products' },
        { image: '/slide2.jpg', title: 'Slide 2', description: 'Description 2', link: '/products' },
        { image: '/slide3.jpg', title: 'Slide 3', description: 'Description 3', link: '/products' }
      ]
    },
    featuredProducts: {
      enabled: true,
      title: 'Featured Products',
      subtitle: 'Check out our best sellers',
      limit: 8
    },
    features: {
      enabled: true,
      title: 'Why Choose Us',
      items: [
        { icon: '🌍', title: 'Global Shipping', description: 'Worldwide delivery available' },
        { icon: '✅', title: 'Quality Guaranteed', description: 'All products verified' },
        { icon: '💰', title: 'Best Prices', description: 'Competitive wholesale rates' },
        { icon: '🏭', title: 'OEM/ODM', description: 'Customization services' }
      ]
    },
    manufacturing: {
      enabled: true,
      title: 'Manufacturing Capabilities',
      subtitle: 'Professional production with 30+ years experience',
      capabilities: [
        { title: 'Design', description: 'Custom design services', icon: '✏️' },
        { title: 'Production', description: 'Large-scale manufacturing', icon: '🏭' },
        { title: 'Quality Control', description: 'Strict QC process', icon: '✅' },
        { title: 'Packaging', description: 'Custom packaging options', icon: '📦' }
      ],
      stats: [
        { number: '30+', label: 'Years Experience' },
        { number: '10000+', label: 'Products Delivered' },
        { number: '500+', label: 'Happy Clients' },
        { number: '50+', label: 'Countries Served' }
      ]
    },
    testimonials: {
      enabled: true,
      title: 'What Our Clients Say',
      subtitle: 'Trusted by businesses worldwide',
      reviews: [
        { name: 'John Doe', company: 'ABC Corp', rating: 5, text: 'Excellent quality and service!', avatar: '/avatar1.jpg' },
        { name: 'Jane Smith', company: 'XYZ Ltd', rating: 5, text: 'Very professional team', avatar: '/avatar2.jpg' },
        { name: 'Mike Johnson', company: 'DEF Inc', rating: 5, text: 'Great products and fast delivery', avatar: '/avatar3.jpg' }
      ]
    },
    brands: {
      enabled: true,
      title: 'Trusted by Leading Brands',
      logos: [
        { name: 'Brand 1', image: '/brand1.png', link: '#' },
        { name: 'Brand 2', image: '/brand2.png', link: '#' },
        { name: 'Brand 3', image: '/brand3.png', link: '#' },
        { name: 'Brand 4', image: '/brand4.png', link: '#' }
      ]
    },
    certifications: {
      enabled: true,
      title: 'Certifications & Quality',
      subtitle: 'Certified by international standards',
      certs: [
        { name: 'ISO 9001', image: '/cert-iso.png', description: 'Quality Management' },
        { name: 'CE', image: '/cert-ce.png', description: 'European Conformity' },
        { name: 'FDA', image: '/cert-fda.png', description: 'Food & Drug Administration' }
      ]
    },
    process: {
      enabled: true,
      title: 'Our Production Process',
      subtitle: 'From design to delivery',
      steps: [
        { number: '01', title: 'Consultation', description: 'Understand your requirements' },
        { number: '02', title: 'Design', description: 'Create custom designs' },
        { number: '03', title: 'Sample', description: 'Produce samples for approval' },
        { number: '04', title: 'Production', description: 'Mass production' },
        { number: '05', title: 'QC', description: 'Quality inspection' },
        { number: '06', title: 'Delivery', description: 'Ship to your location' }
      ]
    }
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/page-content/home', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success && data.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Load error:', error)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/page-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ page: 'home', content })
      })

      if (response.ok) {
        alert('✅ 页面内容已保存')
      } else {
        alert('❌ 保存失败')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('❌ 保存失败')
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  const sections = [
    { id: 'hero', name: '主横幅', icon: '🎯' },
    { id: 'carousel', name: '轮播图', icon: '🎠' },
    { id: 'featuredProducts', name: '特色产品', icon: '⭐' },
    { id: 'features', name: '特色功能', icon: '✨' },
    { id: 'manufacturing', name: '生产能力', icon: '🏭' },
    { id: 'process', name: '生产流程', icon: '🔄' },
    { id: 'certifications', name: '认证资质', icon: '🏆' },
    { id: 'testimonials', name: '客户评价', icon: '💬' },
    { id: 'brands', name: '合作品牌', icon: '🤝' }
  ]

  const renderEditor = () => {
    const section = content[selectedSection]
    if (!section) return null

    return (
      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="glass-strong rounded-2xl p-6 border border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={section.enabled !== false}
              onChange={(e) => setContent({
                ...content,
                [selectedSection]: { ...section, enabled: e.target.checked }
              })}
              className="w-5 h-5 rounded bg-dark-800 border-white/10"
            />
            <span className="text-white font-semibold">启用此板块</span>
          </label>
        </div>

        {/* Section-specific editors */}
        {selectedSection === 'hero' && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">主横幅设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">主标题</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...section, title: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">副标题</label>
                <input
                  type="text"
                  value={section.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...section, subtitle: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">按钮文字</label>
                  <input
                    type="text"
                    value={section.buttonText}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...section, buttonText: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">按钮链接</label>
                  <input
                    type="text"
                    value={section.buttonLink}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...section, buttonLink: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">背景图片 URL</label>
                <input
                  type="text"
                  value={section.backgroundImage}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...section, backgroundImage: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'features' && section.items && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">特色功能列表</h3>
              <button
                onClick={() => setContent({
                  ...content,
                  features: {
                    ...section,
                    items: [...section.items, { icon: '✨', title: '', description: '' }]
                  }
                })}
                className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
              >
                <FiPlus /> 添加
              </button>
            </div>
            {section.items.map((item, index) => (
              <div key={index} className="mb-4 p-4 bg-dark-800 rounded-lg">
                <div className="flex items-start gap-4">
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...section.items]
                      newItems[index].icon = e.target.value
                      setContent({
                        ...content,
                        features: { ...section, items: newItems }
                      })
                    }}
                    placeholder="图标"
                    className="w-20 px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white text-center"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...section.items]
                        newItems[index].title = e.target.value
                        setContent({
                          ...content,
                          features: { ...section, items: newItems }
                        })
                      }}
                      placeholder="标题"
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...section.items]
                        newItems[index].description = e.target.value
                        setContent({
                          ...content,
                          features: { ...section, items: newItems }
                        })
                      }}
                      placeholder="描述"
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newItems = section.items.filter((_, i) => i !== index)
                      setContent({
                        ...content,
                        features: { ...section, items: newItems }
                      })
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSection === 'process' && section.steps && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">生产流程步骤</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={section.title}
                onChange={(e) => setContent({
                  ...content,
                  process: { ...section, title: e.target.value }
                })}
                placeholder="板块标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
              <input
                type="text"
                value={section.subtitle}
                onChange={(e) => setContent({
                  ...content,
                  process: { ...section, subtitle: e.target.value }
                })}
                placeholder="副标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">流程步骤</h4>
              <button
                onClick={() => setContent({
                  ...content,
                  process: {
                    ...section,
                    steps: [...section.steps, { number: String(section.steps.length + 1).padStart(2, '0'), title: '', description: '' }]
                  }
                })}
                className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
              >
                <FiPlus /> 添加步骤
              </button>
            </div>
            <div className="space-y-4">
              {section.steps.map((step, index) => (
                <div key={index} className="p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-white font-semibold">步骤 {index + 1}</span>
                    <button
                      onClick={() => {
                        const newSteps = section.steps.filter((_, i) => i !== index)
                        setContent({
                          ...content,
                          process: { ...section, steps: newSteps }
                        })
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={step.number}
                      onChange={(e) => {
                        const newSteps = [...section.steps]
                        newSteps[index].number = e.target.value
                        setContent({
                          ...content,
                          process: { ...section, steps: newSteps }
                        })
                      }}
                      placeholder="编号"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const newSteps = [...section.steps]
                        newSteps[index].title = e.target.value
                        setContent({
                          ...content,
                          process: { ...section, steps: newSteps }
                        })
                      }}
                      placeholder="标题"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => {
                        const newSteps = [...section.steps]
                        newSteps[index].description = e.target.value
                        setContent({
                          ...content,
                          process: { ...section, steps: newSteps }
                        })
                      }}
                      placeholder="描述"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'certifications' && section.certs && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">认证资质</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={section.title}
                onChange={(e) => setContent({
                  ...content,
                  certifications: { ...section, title: e.target.value }
                })}
                placeholder="板块标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">认证列表</h4>
              <button
                onClick={() => setContent({
                  ...content,
                  certifications: {
                    ...section,
                    certs: [...section.certs, { name: '', image: '', description: '' }]
                  }
                })}
                className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
              >
                <FiPlus /> 添加认证
              </button>
            </div>
            <div className="space-y-4">
              {section.certs.map((cert, index) => (
                <div key={index} className="p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-white font-semibold">认证 {index + 1}</span>
                    <button
                      onClick={() => {
                        const newCerts = section.certs.filter((_, i) => i !== index)
                        setContent({
                          ...content,
                          certifications: { ...section, certs: newCerts }
                        })
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newCerts = [...section.certs]
                        newCerts[index].name = e.target.value
                        setContent({
                          ...content,
                          certifications: { ...section, certs: newCerts }
                        })
                      }}
                      placeholder="认证名称"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={cert.image}
                      onChange={(e) => {
                        const newCerts = [...section.certs]
                        newCerts[index].image = e.target.value
                        setContent({
                          ...content,
                          certifications: { ...section, certs: newCerts }
                        })
                      }}
                      placeholder="图片 URL"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={cert.description}
                      onChange={(e) => {
                        const newCerts = [...section.certs]
                        newCerts[index].description = e.target.value
                        setContent({
                          ...content,
                          certifications: { ...section, certs: newCerts }
                        })
                      }}
                      placeholder="描述"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'carousel' && section.slides && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">轮播图设置</h3>
            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={section.autoplay}
                  onChange={(e) => setContent({
                    ...content,
                    carousel: { ...section, autoplay: e.target.checked }
                  })}
                  className="w-5 h-5"
                />
                <span className="text-white">自动播放</span>
              </label>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">切换间隔（毫秒）</label>
                <input
                  type="number"
                  value={section.interval}
                  onChange={(e) => setContent({
                    ...content,
                    carousel: { ...section, interval: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">幻灯片列表</h4>
              <button
                onClick={() => setContent({
                  ...content,
                  carousel: {
                    ...section,
                    slides: [...section.slides, { image: '', title: '', description: '', link: '' }]
                  }
                })}
                className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
              >
                <FiPlus /> 添加幻灯片
              </button>
            </div>
            {section.slides.map((slide, index) => (
              <div key={index} className="mb-4 p-4 bg-dark-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-white font-semibold">幻灯片 {index + 1}</span>
                  <button
                    onClick={() => {
                      const newSlides = section.slides.filter((_, i) => i !== index)
                      setContent({
                        ...content,
                        carousel: { ...section, slides: newSlides }
                      })
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={slide.image}
                    onChange={(e) => {
                      const newSlides = [...section.slides]
                      newSlides[index].image = e.target.value
                      setContent({
                        ...content,
                        carousel: { ...section, slides: newSlides }
                      })
                    }}
                    placeholder="图片 URL"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => {
                      const newSlides = [...section.slides]
                      newSlides[index].title = e.target.value
                      setContent({
                        ...content,
                        carousel: { ...section, slides: newSlides }
                      })
                    }}
                    placeholder="标题"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={slide.description}
                    onChange={(e) => {
                      const newSlides = [...section.slides]
                      newSlides[index].description = e.target.value
                      setContent({
                        ...content,
                        carousel: { ...section, slides: newSlides }
                      })
                    }}
                    placeholder="描述"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={slide.link}
                    onChange={(e) => {
                      const newSlides = [...section.slides]
                      newSlides[index].link = e.target.value
                      setContent({
                        ...content,
                        carousel: { ...section, slides: newSlides }
                      })
                    }}
                    placeholder="链接"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSection === 'testimonials' && section.reviews && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">客户评价</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={section.title}
                onChange={(e) => setContent({
                  ...content,
                  testimonials: { ...section, title: e.target.value }
                })}
                placeholder="板块标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
              <input
                type="text"
                value={section.subtitle}
                onChange={(e) => setContent({
                  ...content,
                  testimonials: { ...section, subtitle: e.target.value }
                })}
                placeholder="副标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">评价列表</h4>
              <button
                onClick={() => setContent({
                  ...content,
                  testimonials: {
                    ...section,
                    reviews: [...section.reviews, { name: '', company: '', rating: 5, text: '', avatar: '' }]
                  }
                })}
                className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
              >
                <FiPlus /> 添加评价
              </button>
            </div>
            {section.reviews.map((review, index) => (
              <div key={index} className="mb-4 p-4 bg-dark-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-white font-semibold">评价 {index + 1}</span>
                  <button
                    onClick={() => {
                      const newReviews = section.reviews.filter((_, i) => i !== index)
                      setContent({
                        ...content,
                        testimonials: { ...section, reviews: newReviews }
                      })
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={review.name}
                    onChange={(e) => {
                      const newReviews = [...section.reviews]
                      newReviews[index].name = e.target.value
                      setContent({
                        ...content,
                        testimonials: { ...section, reviews: newReviews }
                      })
                    }}
                    placeholder="姓名"
                    className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={review.company}
                    onChange={(e) => {
                      const newReviews = [...section.reviews]
                      newReviews[index].company = e.target.value
                      setContent({
                        ...content,
                        testimonials: { ...section, reviews: newReviews }
                      })
                    }}
                    placeholder="公司"
                    className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-3">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={review.rating}
                    onChange={(e) => {
                      const newReviews = [...section.reviews]
                      newReviews[index].rating = parseInt(e.target.value)
                      setContent({
                        ...content,
                        testimonials: { ...section, reviews: newReviews }
                      })
                    }}
                    placeholder="评分 (1-5)"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <textarea
                    rows={3}
                    value={review.text}
                    onChange={(e) => {
                      const newReviews = [...section.reviews]
                      newReviews[index].text = e.target.value
                      setContent({
                        ...content,
                        testimonials: { ...section, reviews: newReviews }
                      })
                    }}
                    placeholder="评价内容"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={review.avatar}
                    onChange={(e) => {
                      const newReviews = [...section.reviews]
                      newReviews[index].avatar = e.target.value
                      setContent({
                        ...content,
                        testimonials: { ...section, reviews: newReviews }
                      })
                    }}
                    placeholder="头像 URL"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSection === 'brands' && section.logos && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">合作品牌</h3>
            <div className="mb-6">
              <input
                type="text"
                value={section.title}
                onChange={(e) => setContent({
                  ...content,
                  brands: { ...section, title: e.target.value }
                })}
                placeholder="板块标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">品牌 Logo 列表</h4>
              <button
                onClick={() => setContent({
                  ...content,
                  brands: {
                    ...section,
                    logos: [...section.logos, { name: '', image: '', link: '' }]
                  }
                })}
                className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
              >
                <FiPlus /> 添加品牌
              </button>
            </div>
            {section.logos.map((logo, index) => (
              <div key={index} className="mb-4 p-4 bg-dark-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-white font-semibold">品牌 {index + 1}</span>
                  <button
                    onClick={() => {
                      const newLogos = section.logos.filter((_, i) => i !== index)
                      setContent({
                        ...content,
                        brands: { ...section, logos: newLogos }
                      })
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={logo.name}
                    onChange={(e) => {
                      const newLogos = [...section.logos]
                      newLogos[index].name = e.target.value
                      setContent({
                        ...content,
                        brands: { ...section, logos: newLogos }
                      })
                    }}
                    placeholder="品牌名称"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={logo.image}
                    onChange={(e) => {
                      const newLogos = [...section.logos]
                      newLogos[index].image = e.target.value
                      setContent({
                        ...content,
                        brands: { ...section, logos: newLogos }
                      })
                    }}
                    placeholder="Logo 图片 URL"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={logo.link}
                    onChange={(e) => {
                      const newLogos = [...section.logos]
                      newLogos[index].link = e.target.value
                      setContent({
                        ...content,
                        brands: { ...section, logos: newLogos }
                      })
                    }}
                    placeholder="链接"
                    className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSection === 'manufacturing' && (
          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">生产能力</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => setContent({
                    ...content,
                    manufacturing: { ...section, title: e.target.value }
                  })}
                  placeholder="板块标题"
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={section.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    manufacturing: { ...section, subtitle: e.target.value }
                  })}
                  placeholder="副标题"
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Capabilities */}
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">能力列表</h4>
                <button
                  onClick={() => setContent({
                    ...content,
                    manufacturing: {
                      ...section,
                      capabilities: [...(section.capabilities || []), { title: '', description: '', icon: '✨' }]
                    }
                  })}
                  className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
                >
                  <FiPlus /> 添加能力
                </button>
              </div>
              {(section.capabilities || []).map((cap, index) => (
                <div key={index} className="mb-4 p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-white font-semibold">能力 {index + 1}</span>
                    <button
                      onClick={() => {
                        const newCaps = section.capabilities.filter((_, i) => i !== index)
                        setContent({
                          ...content,
                          manufacturing: { ...section, capabilities: newCaps }
                        })
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cap.icon}
                      onChange={(e) => {
                        const newCaps = [...section.capabilities]
                        newCaps[index].icon = e.target.value
                        setContent({
                          ...content,
                          manufacturing: { ...section, capabilities: newCaps }
                        })
                      }}
                      placeholder="图标"
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={cap.title}
                      onChange={(e) => {
                        const newCaps = [...section.capabilities]
                        newCaps[index].title = e.target.value
                        setContent({
                          ...content,
                          manufacturing: { ...section, capabilities: newCaps }
                        })
                      }}
                      placeholder="标题"
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={cap.description}
                      onChange={(e) => {
                        const newCaps = [...section.capabilities]
                        newCaps[index].description = e.target.value
                        setContent({
                          ...content,
                          manufacturing: { ...section, capabilities: newCaps }
                        })
                      }}
                      placeholder="描述"
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="glass-strong rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">统计数据</h4>
                <button
                  onClick={() => setContent({
                    ...content,
                    manufacturing: {
                      ...section,
                      stats: [...(section.stats || []), { number: '', label: '' }]
                    }
                  })}
                  className="px-3 py-1 rounded-lg bg-neon-blue text-white text-sm flex items-center gap-2"
                >
                  <FiPlus /> 添加统计
                </button>
              </div>
              {(section.stats || []).map((stat, index) => (
                <div key={index} className="mb-4 p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-white font-semibold">统计 {index + 1}</span>
                    <button
                      onClick={() => {
                        const newStats = section.stats.filter((_, i) => i !== index)
                        setContent({
                          ...content,
                          manufacturing: { ...section, stats: newStats }
                        })
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => {
                        const newStats = [...section.stats]
                        newStats[index].number = e.target.value
                        setContent({
                          ...content,
                          manufacturing: { ...section, stats: newStats }
                        })
                      }}
                      placeholder="数字（如：30+）"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...section.stats]
                        newStats[index].label = e.target.value
                        setContent({
                          ...content,
                          manufacturing: { ...section, stats: newStats }
                        })
                      }}
                      placeholder="标签（如：Years Experience）"
                      className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === 'featuredProducts' && (
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">特色产品设置</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => setContent({
                  ...content,
                  featuredProducts: { ...section, title: e.target.value }
                })}
                placeholder="板块标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
              <input
                type="text"
                value={section.subtitle}
                onChange={(e) => setContent({
                  ...content,
                  featuredProducts: { ...section, subtitle: e.target.value }
                })}
                placeholder="副标题"
                className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">显示数量</label>
                <input
                  type="number"
                  value={section.limit}
                  onChange={(e) => setContent({
                    ...content,
                    featuredProducts: { ...section, limit: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">首页板块编辑器</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="px-4 py-2 rounded-lg glass hover:glass-strong transition-all text-white flex items-center gap-2"
              >
                <FiEye /> 预览
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2"
              >
                <FiSave /> 保存所有更改
              </button>
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
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="glass-strong rounded-2xl p-4 border border-white/10 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">板块列表</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                      selectedSection === section.id
                        ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                        : 'glass hover:glass-strong text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.name}</span>
                    {content[section.id]?.enabled === false && (
                      <span className="ml-auto text-xs text-red-400">已禁用</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderEditor()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
