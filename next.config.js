/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway deployment configuration
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
    ignoreBuildErrors: true,
  },
  env: {
    VEO3_API_KEY: process.env.VEO3_API_KEY || '',
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
  },
  // 确保支持API路由和服务器端渲染
  // Railway特定配置 - 使用Next.js 15正确的配置项
  serverExternalPackages: [],
  // 确保正确的输出配置
  output: undefined, // 确保不是 'export'（静态导出）
}

module.exports = nextConfig 