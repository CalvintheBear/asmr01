// Creem产品配置 - 统一管理所有产品ID
export const CREEM_CONFIG = {
  // 测试环境产品ID（开发使用）
  TEST_PRODUCT_IDS: {
    starter: 'prod_lhs2fDYYFI3zopjMPlFmm',   // $9.9 - 115积分
    standard: 'prod_5tjwlfqHOw6sj2KRimpxCj',  // $30 - 355积分
    premium: 'prod_3qqpqcmyQnY5OvYqmarL8R'    // $99 - 1450积分
  },

  // 生产环境产品ID（新Creem store）
  PRODUCTION_PRODUCT_IDS: {
    starter: 'prod_44gUntOAeR5KU9a4wkr45U',   // $9.9 - 115积分
    standard: 'prod_2tyKrzLDOi7TLMNiIpHsj4',  // $30 - 355积分
    premium: 'prod_7aRS2kaSvk33msxNfnIAV8'    // $99 - 1450积分
  },

  // 根据环境获取当前使用的产品ID
  get PRODUCT_IDS(): { starter: string; standard: string; premium: string } {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    
    // 🔥 修复：优先检查 CREEM_TEST_MODE 环境变量
    const explicitTestMode = process.env.CREEM_TEST_MODE === 'true'
    const explicitProductionMode = process.env.CREEM_TEST_MODE === 'false'
    
    // 检查其他测试模式条件
    const isDevelopmentEnv = process.env.NODE_ENV === 'development'
    const isLocalUrl = appUrl.includes('localhost') || appUrl.includes('trycloudflare.com')
    
    // 最终测试模式判断逻辑
    let isTestMode = false
    
    if (explicitTestMode) {
      // 明确设置为测试模式
      isTestMode = true
      console.log('🧪 明确设置为测试模式 (CREEM_TEST_MODE=true)')
    } else if (explicitProductionMode) {
      // 明确设置为生产模式
      isTestMode = false
      console.log('🚀 明确设置为生产模式 (CREEM_TEST_MODE=false)')
    } else {
      // 自动检测模式
      isTestMode = isDevelopmentEnv || isLocalUrl
      console.log('🔍 自动检测模式:', { isDevelopmentEnv, isLocalUrl, result: isTestMode })
    }
    
    console.log('🔧 环境判断:', {
      NODE_ENV: process.env.NODE_ENV,
      CREEM_TEST_MODE: process.env.CREEM_TEST_MODE,
      NEXT_PUBLIC_APP_URL: appUrl,
      explicitTestMode,
      explicitProductionMode,
      isDevelopmentEnv,
      isLocalUrl,
      finalIsTestMode: isTestMode,
      willUseProductIds: isTestMode ? 'TEST_PRODUCT_IDS' : 'PRODUCTION_PRODUCT_IDS'
    })
    
    // 返回对应的产品ID
    return isTestMode ? this.TEST_PRODUCT_IDS : this.PRODUCTION_PRODUCT_IDS
  },

  // 根据产品ID反向查找积分包信息（包含测试和生产环境的映射）
  PRODUCT_MAPPING: {
    // 新测试环境产品映射
    'prod_lhs2fDYYFI3zopjMPlFmm': {
      planType: 'starter' as const,
      creditsToAdd: 115,
      amount: 9.9,
      originalPrice: 12
    },
    'prod_5tjwlfqHOw6sj2KRimpxCj': {
      planType: 'standard' as const,
      creditsToAdd: 355,
      amount: 30,
      originalPrice: 40
    },
    'prod_3qqpqcmyQnY5OvYqmarL8R': {
      planType: 'premium' as const,
      creditsToAdd: 1450,
      amount: 99,
      originalPrice: 120
    },
    
    // 旧测试环境产品映射（保留兼容性）
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
    'prod_44gUntOAeR5KU9a4wkr45U': {
      planType: 'starter' as const,
      creditsToAdd: 115,
      amount: 9.9,
      originalPrice: 12
    },
    'prod_2tyKrzLDOi7TLMNiIpHsj4': {
      planType: 'standard' as const,
      creditsToAdd: 355,
      amount: 30,
      originalPrice: 40
    },
    'prod_7aRS2kaSvk33msxNfnIAV8': {
      planType: 'premium' as const,
      creditsToAdd: 1450,
      amount: 99,
      originalPrice: 120
    }
  } as const,

  // 支付链接生成
  getPaymentUrl: (planType: 'starter' | 'standard' | 'premium'): string => {
    const productId = CREEM_CONFIG.PRODUCT_IDS[planType]
    
    // 🔥 修复：使用相同的测试模式判断逻辑
    const explicitTestMode = process.env.CREEM_TEST_MODE === 'true'
    const explicitProductionMode = process.env.CREEM_TEST_MODE === 'false'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const isDevelopmentEnv = process.env.NODE_ENV === 'development'
    const isLocalUrl = appUrl.includes('localhost') || appUrl.includes('trycloudflare.com')
    
    let isTestMode = false
    if (explicitTestMode) {
      isTestMode = true
    } else if (explicitProductionMode) {
      isTestMode = false
    } else {
      isTestMode = isDevelopmentEnv || isLocalUrl
    }
    
    // 测试环境使用test路径，生产环境使用payment路径
    const basePath = isTestMode ? 'test/payment' : 'payment'
    const paymentUrl = `https://www.creem.io/${basePath}/${productId}`
    
    console.log('💳 支付链接生成:', {
      planType,
      productId,
      isTestMode,
      basePath,
      paymentUrl,
      CREEM_TEST_MODE: process.env.CREEM_TEST_MODE
    })
    
    return paymentUrl
  },

  // 根据产品ID获取积分包信息
  getProductInfo: (productId: string) => {
    return CREEM_CONFIG.PRODUCT_MAPPING[productId as keyof typeof CREEM_CONFIG.PRODUCT_MAPPING]
  },

  // 检查是否是测试环境
  isTestMode: () => {
    // 🔥 修复：使用相同的测试模式判断逻辑
    const explicitTestMode = process.env.CREEM_TEST_MODE === 'true'
    const explicitProductionMode = process.env.CREEM_TEST_MODE === 'false'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const isDevelopmentEnv = process.env.NODE_ENV === 'development'
    const isLocalUrl = appUrl.includes('localhost') || appUrl.includes('trycloudflare.com')
    
    if (explicitTestMode) {
      return true
    } else if (explicitProductionMode) {
      return false
    } else {
      return isDevelopmentEnv || isLocalUrl
    }
  }
}

export type PlanType = 'starter' | 'standard' | 'premium' 