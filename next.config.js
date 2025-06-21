// Cloudflare Pages 配置

// 开发环境设置Cloudflare平台
if (process.env.NODE_ENV === 'development') {
  try {
    const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
    setupDevPlatform();
  } catch (error) {
    // 生产环境或模块不存在时忽略
    console.log('Development platform setup skipped');
  }
}

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
  
  // Cloudflare Pages 优化配置
  experimental: {
    // 启用运行时优化
  },
  
  // 输出配置 - 排除大文件
  webpack: (config, { isServer }) => {
    // 移除问题的polyfill配置，转用其他方法
    
    // 减小包大小
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 20000000, // 20MB
          },
        },
      },
    };
    
    // 生产环境排除source maps
    if (!isServer && process.env.NODE_ENV === 'production') {
      config.devtool = false;
    }
    
    // 配置resolve fallback
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  
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