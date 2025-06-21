export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { CREEM_CONFIG } from '@/lib/creem-config'

export async function GET(request: NextRequest) {
  try {
    // 获取当前环境信息
    const nodeEnv = process.env.NODE_ENV
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const creemTestMode = process.env.CREEM_TEST_MODE
    
    // 检查环境判断逻辑
    const isTestMode = nodeEnv === 'development' || 
                      creemTestMode === 'true' ||
                      appUrl?.includes('localhost') ||
                      appUrl?.includes('trycloudflare.com')
    
    // 获取当前使用的产品ID
    const currentProductIds = CREEM_CONFIG.PRODUCT_IDS
    
    // 获取支付URL示例
    const paymentUrls = {
      starter: CREEM_CONFIG.getPaymentUrl('starter'),
      standard: CREEM_CONFIG.getPaymentUrl('standard'),
      premium: CREEM_CONFIG.getPaymentUrl('premium')
    }
    
    // 检查API密钥配置
    const creemApiKey = process.env.CREEM_API_KEY
    const creemWebhookSecret = process.env.CREEM_WEBHOOK_SECRET
    
    return NextResponse.json({
      success: true,
      environment: {
        NODE_ENV: nodeEnv,
        NEXT_PUBLIC_APP_URL: appUrl,
        CREEM_TEST_MODE: creemTestMode,
        isTestMode: isTestMode
      },
      productIds: {
        current: currentProductIds,
        test: CREEM_CONFIG.TEST_PRODUCT_IDS,
        production: CREEM_CONFIG.PRODUCTION_PRODUCT_IDS
      },
      paymentUrls: paymentUrls,
      apiKeys: {
        creemApiKeyExists: !!creemApiKey,
        creemApiKeyPrefix: creemApiKey ? creemApiKey.substring(0, 10) + '...' : 'NOT_SET',
        creemWebhookSecretExists: !!creemWebhookSecret,
        creemWebhookSecretPrefix: creemWebhookSecret ? creemWebhookSecret.substring(0, 10) + '...' : 'NOT_SET'
      },
      recommendation: isTestMode ? 
        '⚠️ 当前使用测试环境配置，如需生产环境请设置正确的环境变量' :
        '✅ 当前使用生产环境配置'
    })

  } catch (error) {
    console.error('检查Creem配置失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 