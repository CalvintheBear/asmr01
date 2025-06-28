import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 检查所有用户状态...')
    
    // 获取所有用户
    const allUsers = await db.user.findMany({
      include: {
        videos: { select: { id: true } },
        auditLogs: { 
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📊 总用户数: ${allUsers.length}`)
    
    // 统计信息
    let stats = {
      total: allUsers.length,
      withClerkId: 0,
      withoutClerkId: 0,
      active: 0,
      inactive: 0,
      withVideos: 0,
      withCredits: 0,
      duplicateEmails: 0
    }
    
    // 检查重复邮箱
    const emailGroups: { [key: string]: any[] } = {}
    const duplicateEmails: any[] = []
    
    allUsers.forEach(user => {
      if (!emailGroups[user.email]) {
        emailGroups[user.email] = []
      }
      emailGroups[user.email].push(user)
    })
    
    Object.entries(emailGroups).forEach(([email, users]) => {
      if (users.length > 1) {
        console.log(`⚠️  重复邮箱: ${email} (${users.length}个记录)`)
        duplicateEmails.push({
          email,
          count: users.length,
          users: users.map(u => ({
            id: u.id,
            clerkUserId: u.clerkUserId,
            createdAt: u.createdAt
          }))
        })
        stats.duplicateEmails++
      }
    })
    
    // 分析用户状态
    const userAnalysis = allUsers.map((user, index) => {
      const hasClerkId = !!user.clerkUserId
      const hasVideos = user.videos.length > 0
      const remainingCredits = user.totalCredits - user.usedCredits
      
      // 更新统计
      if (hasClerkId) stats.withClerkId++
      else stats.withoutClerkId++
      
      if (user.isActive) stats.active++
      else stats.inactive++
      
      if (hasVideos) stats.withVideos++
      if (remainingCredits > 0) stats.withCredits++
      
      // 标识潜在问题
      let issues = []
      if (!hasClerkId) issues.push('缺少Clerk ID')
      if (!user.isActive) issues.push('未激活')
      if (remainingCredits <= 0) issues.push('无积分')
      if (!user.lastLoginAt) issues.push('从未登录')
      
      return {
        index: index + 1,
        id: user.id,
        email: user.email,
        clerkUserId: user.clerkUserId,
        totalCredits: user.totalCredits,
        usedCredits: user.usedCredits,
        remainingCredits,
        videosCount: user.videos.length,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        recentAction: user.auditLogs[0]?.action || null,
        issues,
        hasIssues: issues.length > 0
      }
    })
    
    // 分离有问题和正常的用户
    const problematicUsers = userAnalysis.filter(u => u.hasIssues)
    const healthyUsers = userAnalysis.filter(u => !u.hasIssues)
    
    // 生成修复建议
    const recommendations = []
    
    if (stats.withoutClerkId > 0) {
      recommendations.push(`🔧 ${stats.withoutClerkId}个用户缺少Clerk ID - 需要重新登录修复`)
    }
    
    if (stats.duplicateEmails > 0) {
      recommendations.push(`🧹 ${stats.duplicateEmails}组重复邮箱 - 需要清理重复记录`)
    }
    
    if (stats.inactive > 0) {
      recommendations.push(`⚡ ${stats.inactive}个未激活用户 - 检查是否需要激活`)
    }
    
    if (stats.total - stats.withCredits > 0) {
      recommendations.push(`💰 ${stats.total - stats.withCredits}个用户无积分 - 检查是否需要补充`)
    }
    
    const result = {
      timestamp: new Date().toISOString(),
      summary: {
        total: stats.total,
        withClerkId: stats.withClerkId,
        withoutClerkId: stats.withoutClerkId,
        active: stats.active,
        inactive: stats.inactive,
        withVideos: stats.withVideos,
        withCredits: stats.withCredits,
        duplicateEmails: stats.duplicateEmails,
        problematicCount: problematicUsers.length,
        healthyCount: healthyUsers.length
      },
      percentages: {
        withClerkId: (stats.withClerkId / stats.total * 100).toFixed(1),
        active: (stats.active / stats.total * 100).toFixed(1),
        withCredits: (stats.withCredits / stats.total * 100).toFixed(1),
        withVideos: (stats.withVideos / stats.total * 100).toFixed(1)
      },
      duplicateEmails,
      problematicUsers,
      healthyUsers: healthyUsers.slice(0, 5), // 只显示前5个正常用户
      recommendations
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ 检查失败:', error)
    return NextResponse.json({ 
      error: 'Failed to check users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 