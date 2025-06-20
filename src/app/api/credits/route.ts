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

    console.log('📊 获取用户积分信息:', clerkUserId)

    // 直接从User表获取积分信息
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        email: true,
        totalCredits: true,
        usedCredits: true,
        videos: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      console.log('❌ 用户不存在')
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const creditsInfo = {
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      remainingCredits: user.totalCredits - user.usedCredits,
      videosCount: user.videos.length
    }

    console.log('✅ 积分信息获取成功:', creditsInfo)

    return NextResponse.json({
      success: true,
      data: creditsInfo
    })

  } catch (error) {
    console.error('💥 获取积分信息失败:', error)
    return NextResponse.json({ 
      error: '获取积分信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 