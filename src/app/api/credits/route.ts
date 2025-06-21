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
      data: creditsData
    })

  } catch (error) {
    console.error('获取积分失败:', error)
    return NextResponse.json({ 
      success: false,
      error: '获取积分失败' 
    }, { status: 500 })
  }
} 