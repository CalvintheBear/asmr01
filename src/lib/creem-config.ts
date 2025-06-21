// Creem产品配置 - 统一管理所有产品ID
export const CREEM_CONFIG = {
  // 测试环境产品ID（开发使用）
  TEST_PRODUCT_IDS: {
    starter: 'prod_3ClKXTvoV2aQBMoEjTTMzM',   // $9.9 - 115积分
    standard: 'prod_67wDHjBHhgxyDUeaxr7JCG',  // $30 - 355积分
    premium: 'prod_5AkdzTWba2cogt75cngOhu'    // $99 - 1450积分
  },

  // 生产环境产品ID（正式环境）
  PRODUCTION_PRODUCT_IDS: {
    starter: 'prod_7jHfoQZh5FuYUbIJgIM9ZQ',   // $9.9 - 115积分
    standard: 'prod_7E4i1f1bV8CPMYc7gRx67l',  // $30 - 355积分
    premium: 'prod_6mI2w4gJN4FfZ6FuOFzfcr'    // $99 - 1450积分
  },

  // 根据环境获取当前使用的产品ID
  get PRODUCT_IDS(): { starter: string; standard: string; premium: string } {
    // 修复：明确检查是否为生产环境域名
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const isProductionDomain = appUrl.includes('cuttingasmr.org')
    
    // 如果是生产域名，强制使用生产环境配置
    if (isProductionDomain) {
      console.log('🌐 检测到生产域名，使用生产环境产品ID')
      return this.PRODUCTION_PRODUCT_IDS
    }
    
    // 检查是否是开发环境或者设置了测试模式
    const isTestMode = process.env.NODE_ENV === 'development' || 
                      process.env.CREEM_TEST_MODE === 'true' ||
                      appUrl.includes('localhost') ||
                      appUrl.includes('trycloudflare.com')
    
    console.log('🔧 环境判断:', {
      NODE_ENV: process.env.NODE_ENV,
      CREEM_TEST_MODE: process.env.CREEM_TEST_MODE,
      NEXT_PUBLIC_APP_URL: appUrl,
      isProductionDomain,
      isTestMode,
      willUseProduction: isProductionDomain || !isTestMode
    })
    
    // 开发环境使用测试产品ID，生产环境使用正式产品ID
    return isTestMode ? this.TEST_PRODUCT_IDS : this.PRODUCTION_PRODUCT_IDS
  },

  // 根据产品ID反向查找积分包信息（包含测试和生产环境的映射）
  PRODUCT_MAPPING: {
    // 测试环境产品映射
    'prod_3ClKXTvoV2aQBMoEjTTMzM': {
      planType: 'starter' as const,
      creditsToAdd: 115,
      amount: 9.9,
      originalPrice: 12
    },
    'prod_67wDHjBHhgxyDUeaxr7JCG': {
      planType: 'standard' as const,
      creditsToAdd: 355,
      amount: 30,
      originalPrice: 40
    },
    'prod_5AkdzTWba2cogt75cngOhu': {
      planType: 'premium' as const,
      creditsToAdd: 1450,
      amount: 99,
      originalPrice: 120
    },
    
    // 生产环境产品映射
    'prod_7jHfoQZh5FuYUbIJgIM9ZQ': {
      planType: 'starter' as const,
      creditsToAdd: 115,
      amount: 9.9,
      originalPrice: 12
    },
    'prod_7E4i1f1bV8CPMYc7gRx67l': {
      planType: 'standard' as const,
      creditsToAdd: 355,
      amount: 30,
      originalPrice: 40
    },
    'prod_6mI2w4gJN4FfZ6FuOFzfcr': {
      planType: 'premium' as const,
      creditsToAdd: 1450,
      amount: 99,
      originalPrice: 120
    }
  } as const,

  // 支付链接生成
  getPaymentUrl: (planType: 'starter' | 'standard' | 'premium'): string => {
    const productId = CREEM_CONFIG.PRODUCT_IDS[planType]
    
    // 修复：明确检查是否为生产环境域名
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const isProductionDomain = appUrl.includes('cuttingasmr.org')
    
    // 如果是生产域名，强制使用生产环境
    if (isProductionDomain) {
      console.log('🌐 生产域名，使用生产支付链接')
      return `https://www.creem.io/payment/${productId}`
    }
    
    // 检查是否是测试环境
    const isTestMode = process.env.NODE_ENV === 'development' || 
                      process.env.CREEM_TEST_MODE === 'true' ||
                      appUrl.includes('localhost') ||
                      appUrl.includes('trycloudflare.com')
    
    // 测试环境使用test路径，生产环境使用payment路径
    const basePath = isTestMode ? 'test/payment' : 'payment'
    const paymentUrl = `https://www.creem.io/${basePath}/${productId}`
    
    console.log('💳 支付链接生成:', {
      planType,
      productId,
      isTestMode,
      basePath,
      paymentUrl
    })
    
    return paymentUrl
  },

  // 根据产品ID获取积分包信息
  getProductInfo: (productId: string) => {
    return CREEM_CONFIG.PRODUCT_MAPPING[productId as keyof typeof CREEM_CONFIG.PRODUCT_MAPPING]
  },

  // 检查是否是测试环境
  isTestMode: () => {
    // 修复：明确检查是否为生产环境域名
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const isProductionDomain = appUrl.includes('cuttingasmr.org')
    
    // 如果是生产域名，强制返回false（非测试模式）
    if (isProductionDomain) {
      return false
    }
    
    return process.env.NODE_ENV === 'development' || 
           process.env.CREEM_TEST_MODE === 'true' ||
           appUrl.includes('localhost') ||
           appUrl.includes('trycloudflare.com')
  }
}

export type PlanType = 'starter' | 'standard' | 'premium' 