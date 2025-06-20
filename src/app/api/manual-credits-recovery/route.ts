import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { CREEM_CONFIG } from '@/lib/creem-config'

// 手动积分恢复 - 用于处理邮箱不匹配的支付
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, customerEmail, productId, amount } = body

    console.log('🔧 开始手动积分恢复...')
    console.log('📋 恢复参数:', { orderId, customerEmail, productId, amount })

    // 验证必要参数
    if (!orderId && !customerEmail) {
      return NextResponse.json({ 
        error: '需要提供订单ID或客户邮箱' 
      }, { status: 400 })
    }

    // 查找当前登录用户
    const currentUser = await db.user.findUnique({
      where: { clerkUserId }
    })

    if (!currentUser) {
      return NextResponse.json({ 
        error: '当前用户不存在' 
      }, { status: 404 })
    }

    // 查找未匹配的支付记录
    const unmatchedPayments = await db.auditLog.findMany({
      where: {
        action: 'payment_user_not_found',
        ...(orderId && { 'details.orderId': orderId }),
        ...(customerEmail && { 'details.customerEmail': customerEmail })
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    if (unmatchedPayments.length === 0) {
      return NextResponse.json({ 
        error: '未找到匹配的未处理支付记录' 
      }, { status: 404 })
    }

    const paymentLog = unmatchedPayments[0]
    const paymentDetails = paymentLog.details as any

    console.log('📋 找到未处理支付:', paymentDetails)

    // 解析产品信息
    let productInfo
    if (paymentDetails.productId) {
      productInfo = CREEM_CONFIG.getProductInfo(paymentDetails.productId)
    } else if (amount) {
      // 根据金额反推积分包类型
      if (amount == 9.9) productInfo = CREEM_CONFIG.getProductInfo('starter')
      else if (amount == 30) productInfo = CREEM_CONFIG.getProductInfo('standard')  
      else if (amount == 99) productInfo = CREEM_CONFIG.getProductInfo('premium')
    }

    if (!productInfo) {
      return NextResponse.json({ 
        error: '无法识别积分包类型' 
      }, { status: 400 })
    }

    // 检查是否已经处理过
    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: currentUser.id,
        orderId: paymentDetails.orderId,
        status: 'completed'
      }
    })

    if (existingPurchase) {
      return NextResponse.json({ 
        error: '此订单已经处理过了' 
      }, { status: 409 })
    }

    // 更新用户积分
    const updatedUser = await db.user.update({
      where: { id: currentUser.id },
      data: {
        totalCredits: {
          increment: productInfo.creditsToAdd
        },
        updatedAt: new Date()
      }
    })

    // 创建购买记录
    await db.purchase.create({
      data: {
        userId: currentUser.id,
        packageType: productInfo.planType,
        packageName: `${productInfo.planType.toUpperCase()}积分包 (手动恢复)`,
        amount: parseFloat(paymentDetails.amount || amount),
        currency: 'USD',
        creditsAdded: productInfo.creditsToAdd,
        productId: paymentDetails.productId,
        orderId: paymentDetails.orderId,
        customerId: paymentDetails.customerId,
        provider: 'creem',
        status: 'completed'
      }
    })

    // 记录手动恢复操作
    await db.auditLog.create({
      data: {
        action: 'manual_credits_recovery',
        details: {
          recoveredUserId: currentUser.id,
          recoveredUserEmail: currentUser.email,
          originalPaymentEmail: paymentDetails.customerEmail,
          creditsAdded: productInfo.creditsToAdd,
          orderId: paymentDetails.orderId,
          recoveryMethod: 'user_initiated',
          originalPaymentLogId: paymentLog.id
        }
      }
    })

    console.log('✅ 手动积分恢复成功:', {
      userId: currentUser.id,
      oldCredits: currentUser.totalCredits,
      newCredits: updatedUser.totalCredits,
      addedCredits: productInfo.creditsToAdd
    })

    return NextResponse.json({
      success: true,
      message: '积分恢复成功',
      details: {
        userId: currentUser.id,
        userEmail: currentUser.email,
        originalPaymentEmail: paymentDetails.customerEmail,
        creditsAdded: productInfo.creditsToAdd,
        newTotal: updatedUser.totalCredits,
        packageType: productInfo.planType,
        orderId: paymentDetails.orderId
      }
    })

  } catch (error) {
    console.error('💥 手动积分恢复失败:', error)
    return NextResponse.json({ 
      error: '恢复积分失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

// 获取未匹配的支付列表
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 获取所有未匹配的支付记录
    const unmatchedPayments = await db.auditLog.findMany({
      where: {
        action: 'payment_user_not_found'
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        details: true,
        createdAt: true
      }
    })

    const formattedPayments = unmatchedPayments.map((log: any) => {
      const details = log.details as any
      return {
        id: log.id,
        customerEmail: details.customerEmail,
        orderId: details.orderId,
        productId: details.productId,
        amount: details.amount,
        creditsToAdd: details.creditsToAdd,
        createdAt: log.createdAt,
        suggestion: details.suggestion
      }
    })

    return NextResponse.json({
      success: true,
      unmatchedPayments: formattedPayments
    })

  } catch (error) {
    console.error('💥 获取未匹配支付失败:', error)
    return NextResponse.json({ 
      error: '获取数据失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 