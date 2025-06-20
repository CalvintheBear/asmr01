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

    // 获取支付链接
    const paymentUrl = CREEM_CONFIG.getPaymentUrl(planType)
    const productInfo = CREEM_CONFIG.getProductInfo(CREEM_CONFIG.PRODUCT_IDS[planType])
    
    console.log('Generated payment URL:', paymentUrl)
    console.log('Product info:', productInfo)

    // 返回支付链接
    return Response.json({
      success: true,
      checkout_url: paymentUrl,
      product_id: CREEM_CONFIG.PRODUCT_IDS[planType],
      plan_type: planType,
      amount: productInfo?.amount,
      credits: productInfo?.creditsToAdd
    })

  } catch (error) {
    console.error('Payment API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 