/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置 - Cloudflare Pages兼容性
  images: {
    unoptimized: true, // Cloudflare Pages需要关闭Next.js图片优化
  },
  
  // TypeScript和ESLint配置 - 加快构建速度
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 编译优化 - 减少缓存文件大小
  webpack: (config, { isServer }) => {
    // 禁用可能产生大缓存文件的功能
    if (isServer) {
      config.cache = {
        type: 'memory', // 使用内存缓存而不是文件缓存
      };
    }
    
    // 优化chunk分割，确保单个文件不超过25MB
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 20000000, // 20MB限制，留5MB缓冲
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
            maxSize: 15000000, // 15MB限制
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 15000000, // 15MB限制
          },
        },
      },
    };
    
    return config;
  },
  
  // 环境变量配置
  env: {
    VEO3_API_KEY: process.env.VEO3_API_KEY || '',
    VEO3_API_BASE_URL: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
  },
  
  // 性能优化
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  
  // 确保API路由正常工作
  serverExternalPackages: [],
};

module.exports = nextConfig; 