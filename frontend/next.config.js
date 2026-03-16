/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'your-domain.com'],
  },
  // 静态导出配置
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // 生产环境优化
  compress: true,
  poweredByHeader: false,
  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.vercel.app',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.vercel.app',
  },
}

module.exports = nextConfig