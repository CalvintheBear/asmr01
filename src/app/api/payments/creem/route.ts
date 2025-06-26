export const runtime = "edge";

import { auth } from '@clerk/nextjs/server'
import { CREEM_CONFIG } from '@/lib/creem-config'

export async function POST(request: Request) {
  try {
    console.log('Payment API called')
    
    // 验证用户登录
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User ID:', userId)

    // 解析请求数据
    const { planType }: { planType: 'starter' | 'standard' | 'premium' } = await request.json()
    
    if (!planType || !['starter', 'standard', 'premium'].includes(planType)) {
      return Response.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    // 获取产品信息
    const productId = CREEM_CONFIG.PRODUCT_IDS[planType]
    const productInfo = CREEM_CONFIG.getProductInfo(productId)
    
    if (!productInfo) {
      return Response.json({ error: 'Invalid product configuration' }, { status: 400 })
    }

    // 生成唯一订单ID (临时方案，不依赖数据库)
    const orderId = `creem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 生成支付链接
    const basePaymentUrl = CREEM_CONFIG.getPaymentUrl(planType)
    const paymentUrl = `${basePaymentUrl}?order_id=${orderId}`
    
    console.log('Generated payment URL:', paymentUrl)
    console.log('Product info:', productInfo)

    // 返回支付链接（简化版本）
    return Response.json({
      success: true,
      checkout_url: paymentUrl,
      order_id: orderId,
      product_id: productId,
      plan_type: planType,
      amount: productInfo.amount,
      credits: productInfo.creditsToAdd
    })

  } catch (error) {
    console.error('Payment API error:', error)
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 