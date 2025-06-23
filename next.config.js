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
  // 基础配置
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 图片优化配置
  images: {
    unoptimized: Boolean(isCloudflare),
  },
  
  // TypeScript和ESLint配置
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Railway专用配置
  ...(isRailway && {
    output: 'standalone',
    outputFileTracingRoot: process.cwd(),
  }),
  
  // 环境变量配置
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_cGxlYXNlZC1jbGFtLTc5LmNsZXJrLmFjY291bnRzLmRldiQ',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'sk_test_T8He2nKmyV1okMkk8lZcbIh66KSFWoxr3s0lLMyO36',
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/',
    VEO3_API_KEY: process.env.VEO3_API_KEY || 'c98268b5c693894dd721ed1d576edb',
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
    DOMAIN: isRailway 
      ? 'https://cuttingasmr.org'
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    NEXT_PUBLIC_API_URL: isRailway
      ? 'https://cuttingasmr.org/api'
      : (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : 'http://localhost:3000/api'),
    NEXT_PUBLIC_APP_URL: isRailway
      ? 'https://cuttingasmr.org'
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway',
    CREEM_API_KEY: process.env.CREEM_API_KEY || 'creem_4bO7LLLWie17BD2i7qTNNA',
    CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET || 'whsec_6jovyxtbgdcdNEMdH0nspT',
  },
};

module.exports = nextConfig; 