// Creem产品配置 - 统一管理所有产品ID
export const CREEM_CONFIG = {
  // 当前使用的产品ID（测试环境，基于用户提供的实际ID）
  CURRENT_PRODUCT_IDS: {
    starter: 'prod_3ClKXTvoV2aQBMoEjTTMzM',   // $9.9 - 115积分
    standard: 'prod_67wDHjBHhgxyDUeaxr7JCG',  // $30 - 355积分
    premium: 'prod_5AkdzTWba2cogt75cngOhu'    // $99 - 1450积分
  },

  // 生产环境产品ID（预留）
  PRODUCTION_PRODUCT_IDS: {
    starter: 'prod_3ClKXTvoV2aQBMoEjTTMzM',   // 与测试环境相同
    standard: 'prod_67wDHjBHhgxyDUeaxr7JCG',  // 与测试环境相同
    premium: 'prod_5AkdzTWba2cogt75cngOhu'    // 与测试环境相同
  },

  // 根据环境获取当前使用的产品ID
  get PRODUCT_IDS(): { starter: string; standard: string; premium: string } {
    // 检查是否是开发环境或者设置了测试模式
    const isTestMode = process.env.NODE_ENV === 'development' || 
                      process.env.CREEM_TEST_MODE === 'true' ||
                      process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')
    
    // 目前测试和生产环境使用相同的产品ID
    return this.CURRENT_PRODUCT_IDS
  },

  // 根据产品ID反向查找积分包信息（统一映射表）
  PRODUCT_MAPPING: {
    // Starter 套餐
    'prod_3ClKXTvoV2aQBMoEjTTMzM': {
      planType: 'starter' as const,
      creditsToAdd: 115,
      amount: 9.9,
      originalPrice: 12
    },
    // Standard 套餐  
    'prod_67wDHjBHhgxyDUeaxr7JCG': {
      planType: 'standard' as const,
      creditsToAdd: 355,
      amount: 30,
      originalPrice: 40
    },
    // Premium 套餐
    'prod_5AkdzTWba2cogt75cngOhu': {
      planType: 'premium' as const,
      creditsToAdd: 1450,
      amount: 99,
      originalPrice: 120
    }
  } as const,

  // 支付链接生成
  getPaymentUrl: (planType: 'starter' | 'standard' | 'premium'): string => {
    const productId = CREEM_CONFIG.PRODUCT_IDS[planType]
    
    // 检查是否是测试环境
    const isTestMode = process.env.NODE_ENV === 'development' || 
                      process.env.CREEM_TEST_MODE === 'true' ||
                      process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')
    
    // 测试环境使用test路径，生产环境使用payment路径
    const basePath = isTestMode ? 'test/payment' : 'payment'
    return `https://www.creem.io/${basePath}/${productId}`
  },

  // 根据产品ID获取积分包信息
  getProductInfo: (productId: string) => {
    return CREEM_CONFIG.PRODUCT_MAPPING[productId as keyof typeof CREEM_CONFIG.PRODUCT_MAPPING]
  },

  // 检查是否是测试环境
  isTestMode: () => {
    return process.env.NODE_ENV === 'development' || 
           process.env.CREEM_TEST_MODE === 'true' ||
           process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')
  }
}

export type PlanType = 'starter' | 'standard' | 'premium' 