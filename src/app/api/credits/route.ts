import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

// 获取用户积分信息
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

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

    const creditsData = {
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      remainingCredits: user.totalCredits - user.usedCredits,
      videosCount: user.videos.length
    }

    return NextResponse.json({
      success: true,
      data: creditsData,
      debug: {
        userId: user.id,
        clerkUserId: user.clerkUserId,
        lastUpdated: user.updatedAt,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('获取积分失败:', error)
    return NextResponse.json({ 
      success: false,
      error: '获取积分失败' 
    }, { status: 500 })
  }
}

// 手动刷新积分信息（强制从数据库重新获取）
export async function POST() {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    console.log('🔄 手动刷新积分，Clerk用户ID:', clerkUserId)

    // 强制从数据库重新获取最新数据
    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        videos: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      console.log('❌ 未找到用户:', clerkUserId)
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    console.log('✅ 从数据库获取到用户数据:', {
      id: user.id,
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      videosCount: user.videos.length
    })

    const creditsData = {
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      remainingCredits: user.totalCredits - user.usedCredits,
      videosCount: user.videos.length
    }

    return NextResponse.json({
      success: true,
      data: creditsData,
      message: '积分信息已刷新',
      debug: {
        userId: user.id,
        clerkUserId: user.clerkUserId,
        refreshedAt: new Date().toISOString(),
        fromDatabase: true
      }
    })

  } catch (error) {
    console.error('刷新积分失败:', error)
    return NextResponse.json({ 
      success: false,
      error: '刷新积分失败' 
    }, { status: 500 })
  }
} 