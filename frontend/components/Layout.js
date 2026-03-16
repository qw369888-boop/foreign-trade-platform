import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, title, description }) {
  const router = useRouter()
  const isZh = router.asPath.startsWith('/zh')

  const defaultTitle = isZh ? 'TradePro - 专业手袋制造商' : 'TradePro - Professional Handbag Manufacturer'
  const defaultDescription = isZh 
    ? '专业手袋制造商，始于1992年。为全球时尚品牌提供高品质OEM & ODM服务。'
    : 'Professional handbag manufacturer since 1992. Providing high-quality OEM & ODM services for global fashion brands.'

  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description || defaultDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.8n83.top${router.asPath}`} />
        <meta property="og:image" content="https://www.8n83.top/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
        <meta name="twitter:image" content="https://www.8n83.top/og-image.jpg" />
        
        {/* Language */}
        <meta httpEquiv="content-language" content={isZh ? 'zh-CN' : 'en-US'} />
        <link rel="alternate" hrefLang="en" href={`https://www.8n83.top${router.asPath.replace('/zh', '')}`} />
        <link rel="alternate" hrefLang="zh" href={`https://www.8n83.top/zh${router.asPath.replace('/zh', '')}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.8n83.top${router.asPath.replace('/zh', '')}`} />
      </Head>
      
      <div className="min-h-screen bg-dark-900 text-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}