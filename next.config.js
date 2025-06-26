// 多平台部署配置 - 支持 Railway 和 Cloudflare Pages

// Cloudflare 开发环境设置
if (process.env.NODE_ENV === 'development' && !process.env.RAILWAY_ENVIRONMENT) {
  try {
    const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
    setupDevPlatform();
  } catch (error) {
    // 生产环境或模块不存在时忽略
  }
}

// 检测部署平台
const isRailway = !!(process.env.RAILWAY_ENVIRONMENT || process.env.PORT);
const isCloudflare = !!(process.env.CF_PAGES) || !isRailway;

console.log('🏗️ 部署平台检测:', {
  isRailway,
  isCloudflare,
  NODE_ENV: process.env.NODE_ENV,
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
  CF_PAGES: process.env.CF_PAGES,
  PORT: process.env.PORT
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway 构建优化
  output: process.env.RAILWAY_ENVIRONMENT ? 'standalone' : undefined,
  
  // 禁用静态优化，强制使用动态渲染
  experimental: {
    forceSwcTransforms: true,
  },
  
  // 确保正确的 Node.js 环境
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
  
  // 简化的 webpack 配置
  webpack: (config, { isServer, dev }) => {
    // 只在非开发环境下应用优化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false, // 禁用压缩以避免构建问题
      }
    }
    
    return config
  },
  
  // 禁用图像优化（可能导致构建问题）
  images: {
    unoptimized: true,
  },
  
  // ESLint 配置
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 禁用 SWC 压缩
  swcMinify: false,
  
  // 强制动态路由
  trailingSlash: false,
  
  // 环境变量
  env: {
    CUSTOM_ENV: process.env.NODE_ENV,
  },
};

module.exports = nextConfig; 