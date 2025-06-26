export const runtime = "edge";

import { auth } from '@clerk/nextjs/server'
import { CREEM_CONFIG } from '@/lib/creem-config'
import { db } from '@/lib/prisma'

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

    // 🔥 NEW: 查找当前用户
    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // 🔥 NEW: 生成唯一订单ID
    const orderId = `creem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 获取产品信息
    const productId = CREEM_CONFIG.PRODUCT_IDS[planType]
    const productInfo = CREEM_CONFIG.getProductInfo(productId)
    
    if (!productInfo) {
      return Response.json({ error: 'Invalid product configuration' }, { status: 400 })
    }

    // 🔥 NEW: 预创建订单记录（pending状态）
    const preOrder = await db.purchase.create({
      data: {
        userId: user.id,
        packageType: productInfo.planType,
        packageName: `${productInfo.planType.charAt(0).toUpperCase() + productInfo.planType.slice(1)} 积分包`,
        amount: productInfo.amount,
        currency: 'USD',
        creditsAdded: productInfo.creditsToAdd,
        productId: productId,
        orderId: orderId,
        customerId: userId, // 使用Clerk用户ID
        paymentEmail: user.email,
        provider: 'creem',
        status: 'pending' // 待支付状态
      }
    })

    console.log('✅ 预创建订单成功:', {
      preOrderId: preOrder.id,
      orderId: orderId,
      userId: user.id,
      userEmail: user.email,
      productType: planType,
      amount: productInfo.amount,
      credits: productInfo.creditsToAdd
    })

    // 🔥 NEW: 生成带订单ID的支付链接
    const basePaymentUrl = CREEM_CONFIG.getPaymentUrl(planType)
    const paymentUrl = `${basePaymentUrl}?order_id=${orderId}&customer_email=${encodeURIComponent(user.email)}`
    
    console.log('Generated payment URL:', paymentUrl)

    // 记录支付创建日志
    await db.auditLog.create({
      data: {
        action: 'payment_created',
        details: {
          userId: user.id,
          userEmail: user.email,
          orderId: orderId,
          productId: productId,
          planType: planType,
          amount: productInfo.amount,
          creditsToAdd: productInfo.creditsToAdd,
          preOrderId: preOrder.id,
          paymentUrl: paymentUrl
        }
      }
    })

    // 返回支付链接和订单信息
    return Response.json({
      success: true,
      checkout_url: paymentUrl,
      order_id: orderId,
      product_id: productId,
      plan_type: planType,
      amount: productInfo.amount,
      credits: productInfo.creditsToAdd,
      user_email: user.email,
      pre_order_id: preOrder.id
    })

  } catch (error) {
    console.error('Payment API error:', error)
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 