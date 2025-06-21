export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        error: '未授权访问' 
      }, { status: 401 })
    }

    // 根据Clerk用户ID查找数据库用户
    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ 
        error: '用户不存在' 
      }, { status: 404 })
    }

    // 获取用户的购买历史
    const purchases = await db.purchase.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20 // 最多返回20条记录
    })

    // 格式化购买历史
    const formattedPurchases = purchases.map((purchase: any) => ({
      id: purchase.id,
      packageType: purchase.packageType,
      packageName: purchase.packageName,
      amount: purchase.amount,
      currency: purchase.currency,
      creditsAdded: purchase.creditsAdded,
      productId: purchase.productId,
      orderId: purchase.orderId,
      provider: purchase.provider,
      status: purchase.status,
      createdAt: purchase.createdAt,
      formattedDate: new Date(purchase.createdAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }))

    return NextResponse.json({
      success: true,
      data: {
        purchases: formattedPurchases,
        totalPurchases: purchases.length,
        totalSpent: purchases.reduce((sum: number, p: any) => sum + p.amount, 0),
        totalCreditsEarned: purchases.reduce((sum: number, p: any) => sum + p.creditsAdded, 0)
      }
    })

  } catch (error) {
    console.error('获取购买历史失败:', error)
    return NextResponse.json({ 
      error: '获取购买历史失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 