export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { CREDITS_CONFIG } from '@/lib/credits-config'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 检查用户积分:', clerkUserId)

    // 获取用户信息 - 直接从User表获取积分信息
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        email: true,
        totalCredits: true,
        usedCredits: true
      }
    })

    if (!user) {
      console.log('❌ 用户不存在')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const remainingCredits = user.totalCredits - user.usedCredits

    console.log('✅ 积分信息获取成功:', {
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      remainingCredits
    })

    return NextResponse.json({
      success: true,
      userExists: true,
      userId: user.id,
      email: user.email,
      remainingCredits: remainingCredits,
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits
    })

  } catch (error) {
    console.error('💥 获取积分信息失败:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 