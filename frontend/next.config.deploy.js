/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig