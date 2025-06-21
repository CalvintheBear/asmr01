/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
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
  
  // 性能优化
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  
  // 环境变量配置 - 统一使用3000端口
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_cGxlYXNlZC1jbGFtLTc5LmNsZXJrLmFjY291bnRzLmRldiQ',
    CLERK_SECRET_KEY: 'sk_test_T8He2nKmyV1okMkk8lZcbIh66KSFWoxr3s0lLMyO36',
          NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/',
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/',
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/',
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/',
    VEO3_API_KEY: process.env.VEO3_API_KEY || 'c98268b5c693894dd721ed1d576edb',
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
    DOMAIN: 'http://localhost:3000',
    // 确保所有内部API调用都使用3000端口  
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : 'http://localhost:3000/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    // Railway PostgreSQL 数据库连接 - 用户实际数据库
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway',
  },
};

module.exports = nextConfig; 