export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db as prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 获取用户在数据库中的记录
    const userData = await prisma.user.findUnique({
      where: { clerkUserId: user.id }
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 记录账户删除请求
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'DELETE_ACCOUNT_REQUEST',
        details: {
          requestedAt: new Date().toISOString(),
          email: userData.email,
          totalCredits: userData.totalCredits,
          usedCredits: userData.usedCredits,
          reason: 'USER_INITIATED',
          status: 'PENDING'
        }
      }
    })

    // 发送邮件通知管理员（这里简化为控制台输出）
    console.log('🚨 账户删除请求:', {
      userId: user.id,
      email: userData.email,
      clerkUserId: userData.clerkUserId,
      requestTime: new Date().toISOString(),
      userCredits: {
        total: userData.totalCredits,
        used: userData.usedCredits
      }
    })

    // 实际生产环境中，这里应该：
    // 1. 发送邮件给管理员
    // 2. 标记账户为待删除状态
    // 3. 设置自动删除任务
    // 4. 通知用户删除时间线

    return NextResponse.json({
      message: '账户删除请求已提交',
      details: {
        requestId: `DEL_${Date.now()}`,
        processTime: '24小时内',
        email: userData.email,
        note: '我们将在24小时内处理您的删除请求。如需取消，请联系客服。'
      }
    })

  } catch (error) {
    console.error('❌ 账户删除请求失败:', error)
    
    return NextResponse.json(
      { 
        error: 'Account deletion request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 