// Cloudflare Pages 配置

// 开发环境设置Cloudflare平台
if (process.env.NODE_ENV === 'development') {
  try {
    const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
    setupDevPlatform();
  } catch (error) {
    // 生产环境或模块不存在时忽略
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基础配置
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 图片优化配置 - Cloudflare Pages需要
  images: {
    unoptimized: true,
  },
  
  // TypeScript和ESLint配置
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 环境变量配置
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_cGxlYXNlZC1jbGFtLTc5LmNsZXJrLmFjY291bnRzLmRldiQ',
    CLERK_SECRET_KEY: 'sk_test_T8He2nKmyV1okMkk8lZcbIh66KSFWoxr3s0lLMyO36',
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/',
    VEO3_API_KEY: process.env.VEO3_API_KEY || 'c98268b5c693894dd721ed1d576edb',
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
    // 动态域名配置
    DOMAIN: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : 'http://localhost:3000/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    // Railway PostgreSQL 数据库连接
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway',
  },
};

module.exports = nextConfig; 