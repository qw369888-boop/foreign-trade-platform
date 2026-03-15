import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Contact() {
  const { t } = useTranslation('common')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', company: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: FiMail,
      title: t('contact.email'),
      content: 'qw369888@gmail.com',
      link: 'mailto:qw369888@gmail.com',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: FaWhatsapp,
      title: t('contact.whatsapp'),
      content: '+86 157 1365 6900',
      link: 'https://wa.me/8615713656900',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: FiMapPin,
      title: t('contact.address'),
      content: 'Guangzhou, Guangdong, China',
      link: null,
      color: 'from-orange-500 to-red-400'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-cyber-grid opacity-5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">{t('contact.title')}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300">
              {t('contact.subtitle') || "Let's discuss your handbag manufacturing needs"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${info.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                {info.link ? (
                  <a 
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-neon-blue transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-400">{info.content}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* WhatsApp Bot Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-2xl">
                    <FaWhatsapp className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-3">
                    {t('contact.whatsapp_bot_title')}
                  </h2>
                  <p className="text-gray-300 text-lg mb-4">
                    {t('contact.whatsapp_bot_desc')}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm border border-green-500/30">
                      ✓ {t('contact.instant_quotes')}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm border border-green-500/30">
                      ✓ {t('contact.product_catalog')}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm border border-green-500/30">
                      ✓ {t('contact.available_247')}
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <a
                    href="https://wa.me/8615713656900?text=Hello!%20I'm%20interested%20in%20your%20handbags"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all group"
                  >
                    <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    {t('contact.start_chat')}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="gradient-text">{t('contact.form_title')}</span>
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">{t('contact.name')} *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl glass-strong border border-white/10 focus:border-neon-blue focus:outline-none transition-colors text-white placeholder-gray-500"
                      placeholder={t('contact.name_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">{t('contact.email')} *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl glass-strong border border-white/10 focus:border-neon-blue focus:outline-none transition-colors text-white placeholder-gray-500"
                      placeholder={t('contact.email_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">{t('contact.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl glass-strong border border-white/10 focus:border-neon-blue focus:outline-none transition-colors text-white placeholder-gray-500"
                      placeholder={t('contact.phone_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">{t('contact.company')}</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl glass-strong border border-white/10 focus:border-neon-blue focus:outline-none transition-colors text-white placeholder-gray-500"
                      placeholder={t('contact.company_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">{t('contact.message')} *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl glass-strong border border-white/10 focus:border-neon-blue focus:outline-none transition-colors text-white placeholder-gray-500 resize-none"
                      placeholder={t('contact.message_placeholder')}
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400">
                      {t('contact.success_message')}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400">
                      {t('contact.error_message')}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary btn-glow py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        {t('contact.send')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.0234567890!2d113.2644!3d23.1291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzQ0LjgiTiAxMTPCsDE1JzUxLjgiRQ!5e0!3m2!1sen!2scn!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Business Hours */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiMessageCircle className="w-6 h-6 text-neon-blue" />
                  {t('contact.business_hours')}
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>{t('contact.monday_friday')}</span>
                    <span className="text-white font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.saturday')}</span>
                    <span className="text-white font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.sunday')}</span>
                    <span className="text-gray-500">{t('contact.closed')}</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      <span className="text-green-400 font-semibold">{t('contact.whatsapp_available')}</span> {t('contact.whatsapp_247')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
