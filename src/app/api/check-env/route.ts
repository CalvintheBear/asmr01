export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { CREEM_CONFIG } from '@/lib/creem-config'

// 环境变量检查API - 2025-06-22 更新
export async function GET(request: NextRequest) {
  const isTestMode = CREEM_CONFIG.isTestMode()
  const productIds = CREEM_CONFIG.PRODUCT_IDS

  return NextResponse.json({
    // 基础环境信息
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    
    // Clerk配置信息
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 15)}...` : 'NOT_FOUND',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? `${process.env.CLERK_SECRET_KEY.substring(0, 15)}...` : 'NOT_FOUND',
    HAS_CLERK_SECRET: !!process.env.CLERK_SECRET_KEY,
    HAS_CLERK_PUBLISHABLE: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_ENV_TYPE: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('_test_') ? 'TEST' : 
                   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('_live_') ? 'LIVE' : 'UNKNOWN',
    
    // Creem配置信息
    CREEM_API_KEY: process.env.CREEM_API_KEY ? `${process.env.CREEM_API_KEY.substring(0, 10)}...` : 'NOT_FOUND',
    CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET ? `${process.env.CREEM_WEBHOOK_SECRET.substring(0, 10)}...` : 'NOT_FOUND',
    
    // Creem环境配置
    isTestMode,
    currentProductIds: productIds,
    starterUrl: CREEM_CONFIG.getPaymentUrl('starter'),
    standardUrl: CREEM_CONFIG.getPaymentUrl('standard'),
    premiumUrl: CREEM_CONFIG.getPaymentUrl('premium'),
    
    // 数据库配置
    HAS_DATABASE_URL: !!process.env.DATABASE_URL,
    
    // 用于诊断的额外信息
    webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/creem`,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    
    timestamp: new Date().toISOString()
  })
} 