/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages optimization
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
  
  // 优化构建输出 - 减少包大小
  webpack: (config, { isServer }) => {
    // 减少包大小
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // 优化chunk分割以减少单个文件大小
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 20000000, // 20MB max chunk size
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 15000000, // 15MB max for vendor chunks
          },
        },
      },
    };
    
    return config;
  },
  
  // 确保支持API路由
  serverExternalPackages: [],
}

module.exports = nextConfig 