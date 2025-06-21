export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { CREEM_CONFIG } from '@/lib/creem-config'

// Webhook模拟器 - 用于手动处理支付成功
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, productId, customerEmail, amount } = body

    console.log('🎭 模拟Webhook调用:', { orderId, productId, customerEmail, amount })

    // 验证必要参数
    if (!productId) {
      return NextResponse.json({ 
        error: '缺少产品ID' 
      }, { status: 400 })
    }

    // 解析产品信息
    const productInfo = CREEM_CONFIG.getProductInfo(productId)
    if (!productInfo) {
      return NextResponse.json({ 
        error: `未知的产品ID: ${productId}` 
      }, { status: 400 })
    }

    // 查找当前用户
    const user = await db.user.findUnique({
      where: { clerkUserId }
    })

    if (!user) {
      return NextResponse.json({ 
        error: '用户不存在' 
      }, { status: 404 })
    }

    // 检查是否已经处理过这个订单
    if (orderId) {
      const existingPurchase = await db.purchase.findFirst({
        where: {
          userId: user.id,
          orderId: orderId
        }
      })

      if (existingPurchase) {
        return NextResponse.json({ 
          error: '此订单已经处理过了',
          purchaseId: existingPurchase.id
        }, { status: 409 })
      }
    }

    // 更新用户积分
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        totalCredits: {
          increment: productInfo.creditsToAdd
        },
        updatedAt: new Date()
      }
    })

    // 创建购买记录
    const purchase = await db.purchase.create({
      data: {
        userId: user.id,
        packageType: productInfo.planType,
        packageName: `${productInfo.planType.toUpperCase()}积分包 (手动处理)`,
        amount: parseFloat(amount || productInfo.amount.toString()),
        currency: 'USD',
        creditsAdded: productInfo.creditsToAdd,
        productId: productId,
        orderId: orderId || `sim_${Date.now()}`,
        customerId: user.clerkUserId,
        provider: 'creem',
        status: 'completed'
      }
    })

    // 记录模拟webhook操作
    await db.auditLog.create({
      data: {
        action: 'simulated_webhook',
        details: {
          userId: user.id,
          userEmail: user.email,
          creditsAdded: productInfo.creditsToAdd,
          orderId: orderId,
          productId: productId,
          method: 'manual_simulation',
          originalCredits: user.totalCredits,
          newCredits: updatedUser.totalCredits
        }
      }
    })

    console.log('✅ 模拟Webhook处理成功:', {
      userId: user.id,
      oldCredits: user.totalCredits,
      newCredits: updatedUser.totalCredits,
      addedCredits: productInfo.creditsToAdd
    })

    return NextResponse.json({
      success: true,
      message: '积分处理成功',
      details: {
        userId: user.id,
        userEmail: user.email,
        creditsAdded: productInfo.creditsToAdd,
        newTotal: updatedUser.totalCredits,
        packageType: productInfo.planType,
        orderId: orderId,
        purchaseId: purchase.id
      }
    })

  } catch (error) {
    console.error('💥 模拟Webhook处理失败:', error)
    return NextResponse.json({ 
      error: '处理失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 