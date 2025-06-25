export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db as prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    // 获取用户在数据库中的完整数据
    const userData = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        videos: true,
        purchases: true,
        auditLogs: true
      }
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    // 获取用户协议记录
    const agreementData = await prisma.userAgreement.findUnique({
      where: { userId: user.id }
    }).catch(() => null)

    // 构建导出数据
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportedBy: user.id,
        dataTypes: ['profile', 'videos', 'purchases', 'agreements', 'audit_logs']
      },
      profile: {
        clerkUserId: userData.clerkUserId,
        email: userData.email,
        googleFullName: userData.googleFullName,
        customDisplayName: userData.customDisplayName,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt,
        totalCredits: userData.totalCredits,
        usedCredits: userData.usedCredits,
        isActive: userData.isActive
      },
      videos: userData.videos.map(video => ({
        id: video.id,
        taskId: video.taskId,
        title: video.title,
        type: video.type,
        prompt: video.prompt,
        status: video.status,
        creditsUsed: video.creditsUsed,
        createdAt: video.createdAt,
        completedAt: video.completedAt,
        hasVideoUrl: !!video.videoUrl,
        hasVideoUrl1080p: !!video.videoUrl1080p,
        hasThumbnail: !!video.thumbnailUrl
      })),
      purchases: userData.purchases.map(purchase => ({
        id: purchase.id,
        packageType: purchase.packageType,
        packageName: purchase.packageName,
        amount: purchase.amount,
        currency: purchase.currency,
        creditsAdded: purchase.creditsAdded,
        orderId: purchase.orderId,
        provider: purchase.provider,
        status: purchase.status,
        createdAt: purchase.createdAt,
        completedAt: purchase.completedAt
      })),
      agreements: agreementData ? {
        agreedAt: agreementData.agreedAt,
        privacyPolicy: agreementData.privacyPolicy,
        termsOfService: agreementData.termsOfService,
        refundPolicy: agreementData.refundPolicy,
        createdAt: agreementData.createdAt,
        updatedAt: agreementData.updatedAt
      } : null,
      auditLogs: userData.auditLogs.map(log => ({
        id: log.id,
        action: log.action,
        details: log.details,
        createdAt: log.createdAt
      })),
      summary: {
        totalVideos: userData.videos.length,
        totalPurchases: userData.purchases.length,
        totalSpent: userData.purchases.reduce((sum, p) => sum + p.amount, 0),
        registeredDays: Math.floor((new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      }
    }

    console.log('✅ 用户数据导出成功:', {
      userId: user.id,
      email: userData.email,
      dataSize: JSON.stringify(exportData).length
    })

    return NextResponse.json(exportData)

  } catch (error) {
    console.error('❌ 用户数据导出失败:', error)
    
    return NextResponse.json(
      { 
        error: 'Data export failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 