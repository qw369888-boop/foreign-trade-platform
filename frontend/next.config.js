/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  // 静态导出时禁用国际化路由
  // i18n 配置会在静态导出时被忽略
}

module.exports = nextConfig