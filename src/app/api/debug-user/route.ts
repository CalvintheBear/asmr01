import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email') || 'y2983236233@gmail.com'
    
    console.log('🔍 调试用户同步问题...')
    console.log('📧 目标邮箱:', email)
    
    // 通过邮箱查找用户
    const userByEmail = await db.user.findUnique({
      where: { email },
      include: {
        videos: { select: { id: true } },
        auditLogs: { 
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })
    
    const result: any = {
      email,
      timestamp: new Date().toISOString(),
      found: !!userByEmail
    }
    
    if (userByEmail) {
      result.user = {
        id: userByEmail.id,
        clerkUserId: userByEmail.clerkUserId,
        email: userByEmail.email,
        totalCredits: userByEmail.totalCredits,
        usedCredits: userByEmail.usedCredits,
        remainingCredits: userByEmail.totalCredits - userByEmail.usedCredits,
        videosCount: userByEmail.videos.length,
        createdAt: userByEmail.createdAt,
        lastLoginAt: userByEmail.lastLoginAt,
        isActive: userByEmail.isActive,
        recentLogs: userByEmail.auditLogs.map(log => ({
          action: log.action,
          createdAt: log.createdAt,
          details: log.details
        }))
      }
      
      // 检查潜在问题
      result.issues = []
      if (!userByEmail.clerkUserId) {
        result.issues.push('Clerk用户ID为空')
      }
      if (!userByEmail.isActive) {
        result.issues.push('用户未激活')
      }
    } else {
      result.message = '数据库中未找到该邮箱的用户'
    }
    
    // 检查重复记录
    const duplicateUsers = await db.user.findMany({
      where: {
        email: { contains: email }
      },
      select: {
        id: true,
        email: true,
        clerkUserId: true,
        createdAt: true
      }
    })
    
    result.duplicateCheck = {
      count: duplicateUsers.length,
      records: duplicateUsers
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ 调试失败:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 