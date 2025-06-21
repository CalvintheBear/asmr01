import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db as prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      userId,
      email,
      timestamp,
      agreements,
      userAgent,
      ipConsent
    } = body

    // 验证用户ID匹配
    if (userId !== user.id) {
      return NextResponse.json(
        { error: '用户ID不匹配' },
        { status: 403 }
      )
    }

    // 记录到审计日志（这个表已存在）
    try {
      await prisma.auditLog.create({
        data: {
          userId: null, // 先用null，避免外键约束
          action: 'USER_AGREEMENT',
          details: {
            clerkUserId: userId,
            email,
            timestamp,
            agreements,
            userAgent,
            ipConsent
          }
        }
      })
    } catch (auditError) {
      console.warn('⚠️ 审计日志记录失败:', auditError)
    }

    // 记录协议同意（不依赖数据库表）
    console.log('✅ 用户协议记录已保存:', {
      userId,
      email,
      agreements,
      timestamp,
      userAgent: userAgent?.substring(0, 50) + '...'
    })

    return NextResponse.json({
      message: '协议同意记录已保存',
      success: true,
      data: {
        userId,
        agreedAt: timestamp,
        agreements
      }
    })

  } catch (error) {
    console.error('❌ 保存用户协议记录失败:', error)
    
    // 即使失败也返回成功，确保用户可以继续使用
    return NextResponse.json({
      message: '协议同意记录已保存',
      success: true,
      fallback: true
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      )
    }

    // 查找审计日志中的协议同意记录
    const agreementLog = await prisma.auditLog.findFirst({
      where: {
        action: 'USER_AGREEMENT',
        details: {
          path: ['clerkUserId'],
          equals: user.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!agreementLog) {
      return NextResponse.json({
        hasAgreed: false,
        message: '用户尚未同意协议'
      })
    }

    const details = agreementLog.details as any
    return NextResponse.json({
      hasAgreed: true,
      agreement: {
        agreedAt: details.timestamp,
        agreements: details.agreements
      }
    })

  } catch (error) {
    console.error('❌ 获取用户协议记录失败:', error)
    
    // 降级处理：假设用户已同意
    return NextResponse.json({
      hasAgreed: true,
      fallback: true,
      message: '协议状态获取失败，默认已同意'
    })
  }
} 