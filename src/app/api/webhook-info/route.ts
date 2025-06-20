import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const isLocalhost = process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')
  
  return NextResponse.json({
    success: true,
    webhookInfo: {
      // 当前配置的webhook URL
      currentWebhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/creem`,
      
      // 环境信息
      environment: process.env.NODE_ENV,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      isLocalhost: isLocalhost,
      
      // Creem后台配置建议
      recommendations: {
        forLocalDevelopment: {
          problem: "Creem无法访问localhost地址",
          solutions: [
            "使用ngrok暴露本地服务器: npx ngrok http 3000",
            "更新Creem webhook URL为ngrok生成的https地址",
            "或者使用测试功能验证积分更新逻辑"
          ]
        },
        forProduction: {
          webhookUrl: "https://your-domain.com/api/webhooks/creem",
          successUrl: "https://your-domain.com/payment/success",
          cancelUrl: "https://your-domain.com/payment/cancel"
        }
      },
      
      // 验证积分更新的方法
      testingOptions: {
        testWebhook: "/api/test-standard-creem - 测试Standard套餐355积分",
        testPremium: "/api/test-creem - 测试Premium套餐1450积分",
        creditsCheck: "/api/credits-check - 检查当前用户积分"
      }
    }
  })
} 