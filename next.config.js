/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: 'export' 以支持 API 路由
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  basePath: '',
  assetPrefix: '',
  // 为 Veo3 API 添加环境变量配置
  env: {
    VEO3_API_KEY: process.env.VEO3_API_KEY || '',
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
  }
}

module.exports = nextConfig 