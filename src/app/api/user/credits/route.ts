import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取用户积分信息
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const credits = await prisma.userCredit.findUnique({
      where: { userId: session.user.id }
    })

    if (!credits) {
      // 如果没有积分记录，创建一个
      const newCredits = await prisma.userCredit.create({
        data: {
          userId: session.user.id,
          totalCredits: 0,
          usedCredits: 0,
          trialUsed: 0,
          trialLimit: 2,
        }
      })
      
      return NextResponse.json({
        success: true,
        credits: newCredits
      })
    }

    return NextResponse.json({
      success: true,
      credits
    })

  } catch (error) {
    console.error('获取积分信息失败:', error)
    return NextResponse.json(
      { success: false, error: '获取积分信息失败' },
      { status: 500 }
    )
  }
}

// 使用积分或试用次数
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const { useTrial = false, creditsToUse = 1 } = await request.json()

    const credits = await prisma.userCredit.findUnique({
      where: { userId: session.user.id }
    })

    if (!credits) {
      return NextResponse.json(
        { success: false, error: '积分记录不存在' },
        { status: 404 }
      )
    }

    if (useTrial) {
      // 使用试用次数
      if (credits.trialUsed >= credits.trialLimit) {
        return NextResponse.json(
          { success: false, error: '试用次数已用完' },
          { status: 400 }
        )
      }

      await prisma.userCredit.update({
        where: { userId: session.user.id },
        data: { trialUsed: credits.trialUsed + 1 }
      })
    } else {
      // 使用积分
      const availableCredits = credits.totalCredits - credits.usedCredits
      if (availableCredits < creditsToUse) {
        return NextResponse.json(
          { success: false, error: '积分不足' },
          { status: 400 }
        )
      }

      await prisma.userCredit.update({
        where: { userId: session.user.id },
        data: { usedCredits: credits.usedCredits + creditsToUse }
      })
    }

    // 返回更新后的积分信息
    const updatedCredits = await prisma.userCredit.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({
      success: true,
      message: useTrial ? '使用试用次数成功' : '使用积分成功',
      credits: updatedCredits
    })

  } catch (error) {
    console.error('使用积分失败:', error)
    return NextResponse.json(
      { success: false, error: '使用积分失败' },
      { status: 500 }
    )
  }
} 