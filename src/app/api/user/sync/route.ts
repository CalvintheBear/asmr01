import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST() {
  try {
    const { userId: clerkUserId } = await auth()
    
    // 先检查认证状态
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 尝试获取用户信息，处理速率限制
    let user
    try {
      user = await currentUser()
    } catch (clerkError: any) {
      // 检查是否是速率限制错误
      if (clerkError?.status === 429 || clerkError?.clerkError) {
        console.log('⚠️ Clerk API速率限制:', clerkError)
        return NextResponse.json({ 
          error: 'API速率限制，请稍后重试',
          retryAfter: clerkError?.retryAfter || 30
        }, { status: 429 })
      }
      throw clerkError
    }

    if (!user) {
      return NextResponse.json({ error: '无法获取用户信息' }, { status: 401 })
    }

    console.log('🔄 开始用户数据同步...')
    console.log('👤 Clerk用户ID:', clerkUserId)

    const userData = {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      fullName: user.fullName || ''
    }

    console.log('👤 用户信息:', userData)
    console.log('💾 开始数据库操作...')

    // 同步用户信息到数据库 - 使用简化的User模型
    const syncedUser = await db.user.upsert({
      where: {
        clerkUserId: clerkUserId
      },
      update: {
        // 只更新Google数据，保护业务数据
        googleFullName: userData.fullName,
        lastLoginAt: new Date()
      },
      create: {
        clerkUserId: clerkUserId,
        email: userData.email,
        googleFullName: userData.fullName,
        totalCredits: 8, // 新用户默认8积分
        usedCredits: 0,
        isActive: true,
        googleVerifiedAt: new Date(),
        lastLoginAt: new Date()
      }
    })

    // 记录审计日志
    await db.auditLog.create({
      data: {
        userId: syncedUser.id,
        action: 'user_sync',
        details: {
          clerkUserId,
          email: userData.email,
          fullName: userData.fullName,
          isNewUser: !syncedUser.updatedAt
        },
        ipAddress: '::1',
        userAgent: 'server-sync'
      }
    })

    console.log('✅ 用户数据已同步:', {
      id: syncedUser.id,
      email: syncedUser.email,
      totalCredits: syncedUser.totalCredits,
      usedCredits: syncedUser.usedCredits
    })
    console.log('✅ 审计日志已记录')
    console.log('🎉 用户数据同步完成')

    return NextResponse.json({
      success: true,
      user: {
        id: syncedUser.id,
        email: syncedUser.email,
        clerkUserId: syncedUser.clerkUserId,
        totalCredits: syncedUser.totalCredits,
        usedCredits: syncedUser.usedCredits,
        remainingCredits: syncedUser.totalCredits - syncedUser.usedCredits
      }
    })

  } catch (error) {
    console.error('💥 用户同步失败:', error)
    return NextResponse.json({ 
      error: '用户同步失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    console.log('📖 获取用户信息...')
    console.log('🔍 查询用户:', clerkUserId)

    // 获取用户信息 - 使用简化的查询
    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        videos: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      videosCount: user.videos.length,
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      remainingCredits: user.totalCredits - user.usedCredits
    }

    console.log('✅ 用户信息获取成功:', userInfo)

    return NextResponse.json({
      success: true,
      user: userInfo
    })

  } catch (error) {
    console.error('💥 获取用户信息失败:', error)
    return NextResponse.json({ 
      error: '获取用户信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 