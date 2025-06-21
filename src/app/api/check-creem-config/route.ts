export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { CREEM_CONFIG } from '@/lib/creem-config'

// 环境配置检查API - 更新于2024年12月 - 确保生产环境配置正确
export async function GET(request: NextRequest) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const nodeEnv = process.env.NODE_ENV
    const creemTestMode = process.env.CREEM_TEST_MODE
    const isTestMode = CREEM_CONFIG.isTestMode()
    
    // 检查API密钥
    const creemApiKey = process.env.CREEM_SECRET_KEY || process.env.CREEM_API_KEY
    const creemWebhookSecret = process.env.CREEM_WEBHOOK_SECRET
    
    const response = {
      success: true,
      environment: {
        NODE_ENV: nodeEnv,
        CREEM_TEST_MODE: creemTestMode,
        NEXT_PUBLIC_APP_URL: appUrl,
        isTestMode: isTestMode
      },
      productIds: {
        current: CREEM_CONFIG.PRODUCT_IDS,
        test: CREEM_CONFIG.TEST_PRODUCT_IDS,
        production: CREEM_CONFIG.PRODUCTION_PRODUCT_IDS
      },
      paymentUrls: {
        starter: CREEM_CONFIG.getPaymentUrl('starter'),
        standard: CREEM_CONFIG.getPaymentUrl('standard'),
        premium: CREEM_CONFIG.getPaymentUrl('premium')
      },
      apiKeys: {
        creemApiKeyExists: !!creemApiKey,
        creemApiKeyPrefix: creemApiKey ? creemApiKey.substring(0, 10) + '...' : 'NOT_SET',
        creemWebhookSecretExists: !!creemWebhookSecret,
        creemWebhookSecretPrefix: creemWebhookSecret ? creemWebhookSecret.substring(0, 10) + '...' : 'NOT_SET'
      },
      recommendation: isTestMode 
        ? '⚠️ 当前使用测试环境配置，如需生产环境请设置正确的环境变量'
        : '✅ 当前使用生产环境配置'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('检查Creem配置失败:', error)
    return NextResponse.json({ 
      success: false,
      error: '检查配置失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 