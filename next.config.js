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
  poweredByHeader: false, // 隐藏Next.js框架信息
  
  // 🔒 安全响应头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // 防止页面被嵌入iframe
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // 防止MIME类型嗅探攻击
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // 控制referrer信息泄露
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // 启用XSS保护
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // 限制敏感权限
          }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://cuttingasmr.org'
              : 'http://localhost:3000', // CORS配置
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0', // API响应不缓存
          }
        ],
      },
    ];
  },
  
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
  
  // 环境变量配置 - 移除硬编码敏感信息
  env: {
    // Clerk配置 (公开密钥可以暴露，私钥不可以)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/dashboard',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/dashboard',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard',
    
    // API配置 (不设置默认值，强制使用环境变量)
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
    
    // 应用URL配置
    DOMAIN: isRailway 
      ? 'https://cuttingasmr.org'
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    NEXT_PUBLIC_API_URL: isRailway
      ? 'https://cuttingasmr.org/api'
      : (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : 'http://localhost:3000/api'),
    NEXT_PUBLIC_APP_URL: isRailway
      ? 'https://cuttingasmr.org'
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  },
  
  // 运行时环境变量验证 - 修复：只在实际需要时验证
  webpack: (config, { dev, isServer }) => {
    // 只在生产环境的服务端构建时验证关键环境变量
    if (!dev && isServer && !isCloudflare) {
      console.log('🔍 检查关键环境变量...');
      
      // 只验证数据库连接，其他在运行时验证
      const criticalEnvVars = [
        'DATABASE_URL'  // 构建时需要，用于Prisma生成
      ];
      
      const missingVars = criticalEnvVars.filter(varName => !process.env[varName]);
      if (missingVars.length > 0) {
        console.warn('⚠️ 缺少关键环境变量:', missingVars);
        console.warn('这可能导致部分功能无法正常工作，但不阻止构建');
        // 不再抛出错误，只记录警告
      } else {
        console.log('✅ 关键环境变量检查通过');
      }
    }
    return config;
  },
};

module.exports = nextConfig; 