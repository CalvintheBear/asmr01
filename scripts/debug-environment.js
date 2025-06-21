#!/usr/bin/env node

console.log('🔍 环境配置调试检查\n')

// 检查环境变量
console.log('📋 当前环境变量:')
console.log('- NODE_ENV:', process.env.NODE_ENV)
console.log('- CREEM_TEST_MODE:', process.env.CREEM_TEST_MODE)
console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
console.log('- CREEM_API_KEY:', process.env.CREEM_API_KEY ? '已设置 (长度: ' + process.env.CREEM_API_KEY.length + ')' : '未设置')
console.log('')

// 模拟Creem配置逻辑
const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
const isProductionDomain = appUrl.includes('cuttingasmr.org')
const isTestMode = process.env.NODE_ENV === 'development' || 
                  process.env.CREEM_TEST_MODE === 'true' ||
                  appUrl.includes('localhost') ||
                  appUrl.includes('trycloudflare.com')

console.log('🧮 环境判断逻辑:')
console.log('- appUrl:', appUrl)
console.log('- isProductionDomain:', isProductionDomain)
console.log('- isTestMode:', isTestMode)
console.log('')

// 产品ID映射
const TEST_PRODUCT_IDS = {
  starter: 'prod_3ClKXTvoV2aQBMoEjTTMzM',
  standard: 'prod_67wDHjBHhgxyDUeaxr7JCG',
  premium: 'prod_5AkdzTWba2cogt75cngOhu'
}

const PRODUCTION_PRODUCT_IDS = {
  starter: 'prod_7jHfoQZh5FuYUbIJgIM9ZQ',
  standard: 'prod_7E4i1f1bV8CPMYc7gRx67l',
  premium: 'prod_6mI2w4gJN4FfZ6FuOFzfcr'
}

// 确定使用的产品ID
let currentProductIds
if (isProductionDomain) {
  currentProductIds = PRODUCTION_PRODUCT_IDS
} else {
  currentProductIds = isTestMode ? TEST_PRODUCT_IDS : PRODUCTION_PRODUCT_IDS
}

console.log('🎯 当前使用的产品ID:')
console.log('- starter:', currentProductIds.starter)
console.log('- standard:', currentProductIds.standard)
console.log('- premium:', currentProductIds.premium)
console.log('')

// 支付链接生成
const generatePaymentUrl = (planType) => {
  const productId = currentProductIds[planType]
  
  if (isProductionDomain) {
    return `https://www.creem.io/payment/${productId}`
  }
  
  const basePath = isTestMode ? 'test/payment' : 'payment'
  return `https://www.creem.io/${basePath}/${productId}`
}

console.log('💳 生成的支付链接:')
console.log('- starter:', generatePaymentUrl('starter'))
console.log('- standard:', generatePaymentUrl('standard'))
console.log('- premium:', generatePaymentUrl('premium'))
console.log('')

// 诊断建议
console.log('🔧 诊断结果:')
if (isProductionDomain && !isTestMode) {
  console.log('✅ 配置正确：生产域名使用生产环境配置')
} else if (isProductionDomain && isTestMode) {
  console.log('⚠️ 配置异常：生产域名但检测为测试模式')
  console.log('   原因可能是：')
  console.log('   - CREEM_TEST_MODE=true')
  console.log('   - NODE_ENV=development')
} else if (!isProductionDomain && isTestMode) {
  console.log('✅ 配置正确：非生产域名使用测试环境配置')
} else {
  console.log('⚠️ 配置异常：非生产域名但使用生产配置')
}

console.log('')
console.log('📝 修复建议:')
if (appUrl.includes('cuttingasmr.org')) {
  console.log('1. 确保 CREEM_TEST_MODE=false 或未设置')
  console.log('2. 确保 NODE_ENV=production')
  console.log('3. 重新部署应用')
} else {
  console.log('1. 确保 NEXT_PUBLIC_APP_URL=https://cuttingasmr.org')
  console.log('2. 在Cloudflare Pages中设置正确的环境变量')
} 