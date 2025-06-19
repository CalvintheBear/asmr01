/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimization for Cloudflare Pages deployment
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreDuringBuilds: true,
  },
  basePath: '',
  assetPrefix: '',
  // 为 Veo3 API 添加环境变量配置
  env: {
    VEO3_API_KEY: process.env.VEO3_API_KEY || '',
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
  },
  // Force clean build - updated for latest deployment
}

module.exports = nextConfig 