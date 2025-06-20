import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 模拟Standard套餐的webhook数据
  const testWebhookData = {
    type: 'payment.succeeded',
    data: {
      product_id: 'prod_EteLSyF3Dzkt5dNqt7Duu', // Standard套餐的测试产品ID ($30)
      customer_email: 'j2983236233@gmail.com', // 当前用户邮箱
      customer_id: 'cust_test123',
      order_id: 'ord_test_standard_123',
      amount: '30',
      currency: 'USD',
      status: 'completed'
    }
  }

  try {
    console.log('🧪 发送Standard测试webhook数据...')
    
    // 向自己的webhook endpoint发送测试数据
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/creem`
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-creem-signature': 'test-signature' // 开发环境会跳过验证
      },
      body: JSON.stringify(testWebhookData)
    })

    const result = await response.text()
    
    return NextResponse.json({
      success: true,
      message: '测试Standard webhook已发送',
      webhookUrl,
      testData: testWebhookData,
      webhookResponse: {
        status: response.status,
        body: result
      }
    })

  } catch (error) {
    console.error('测试Standard webhook失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 