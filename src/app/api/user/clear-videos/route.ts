import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db as prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      )
    }

    // 获取用户在数据库中的记录
    const userData = await prisma.user.findUnique({
      where: { clerkUserId: user.id }
    })

    if (!userData) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 删除用户的所有视频记录
    const deletedVideos = await prisma.video.deleteMany({
      where: { userId: userData.id }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'CLEAR_VIDEO_HISTORY',
        details: {
          deletedCount: deletedVideos.count,
          timestamp: new Date().toISOString()
        }
      }
    })

    console.log('✅ 用户视频历史已清除:', {
      userId: user.id,
      email: userData.email,
      deletedCount: deletedVideos.count
    })

    return NextResponse.json({
      message: '视频历史已清除',
      deletedCount: deletedVideos.count
    })

  } catch (error) {
    console.error('❌ 清除视频历史失败:', error)
    
    return NextResponse.json(
      { 
        error: '清除失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 