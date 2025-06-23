import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Creem Customer Portal API端点 - 符合AI Wrapper Compliance要求
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Creem Customer Portal URL
    // 注意：这是通用的客户门户URL，用户可以在这里管理他们的支付方式和订阅
    const creemPortalUrl = 'https://www.creem.io/customer-portal'
    
    // 记录访问日志（可选）
    console.log(`用户 ${userId} 访问Creem客户门户`)
    
    return NextResponse.json({
      success: true,
      portalUrl: creemPortalUrl,
      message: '重定向到Creem客户门户'
    })
    
  } catch (error) {
    console.error('获取Creem Portal URL失败:', error)
    return NextResponse.json({ 
      success: false,
      error: '无法获取客户门户URL',
      portalUrl: 'https://www.creem.io/customer-portal' // 备用URL
    }, { status: 500 })
  }
} 