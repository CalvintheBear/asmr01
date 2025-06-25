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

    // 重置用户偏好设置（这里主要是清除本地存储的偏好）
    // 如果后续有偏好设置表，可以在这里清除

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'RESET_PREFERENCES',
        details: {
          resetType: 'ASMR_PREFERENCES',
          timestamp: new Date().toISOString()
        }
      }
    })

    console.log('✅ 用户偏好设置已重置:', {
      userId: user.id,
      email: userData.email
    })

    return NextResponse.json({
      message: '偏好设置已重置',
      note: '请刷新页面查看效果'
    })

  } catch (error) {
    console.error('❌ 重置偏好设置失败:', error)
    
    return NextResponse.json(
      { 
        error: 'Reset failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 