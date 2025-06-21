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
      where: { clerkUserId }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      remainingCredits: user.totalCredits - user.usedCredits
    })

  } catch (error) {
    console.error('获取积分失败:', error)
    return NextResponse.json({ error: '获取积分失败' }, { status: 500 })
  }
} 