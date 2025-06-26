export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { CREEM_CONFIG } from '@/lib/creem-config'

// 测试订单ID支付流程 - 验证改进方案
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planType = 'standard', simulateEmail = 'different@email.com' } = body

    console.log('🧪 开始测试订单ID支付流程...')
    console.log('📋 测试参数:', { planType, simulateEmail, clerkUserId })

    // 1️⃣ 模拟支付创建过程
    console.log('\n🎯 第1步：模拟创建支付订单...')
    
    // 查找当前用户
    const user = await db.user.findUnique({
      where: { clerkUserId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 生成测试订单ID
    const testOrderId = `test_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 获取产品信息
    const productId = CREEM_CONFIG.PRODUCT_IDS[planType as keyof typeof CREEM_CONFIG.PRODUCT_IDS]
    const productInfo = CREEM_CONFIG.getProductInfo(productId)
    
    if (!productInfo) {
      return NextResponse.json({ error: 'Invalid product configuration' }, { status: 400 })
    }

    // 预创建订单记录
    const preOrder = await db.purchase.create({
      data: {
        userId: user.id,
        packageType: productInfo.planType,
        packageName: `${productInfo.planType.charAt(0).toUpperCase() + productInfo.planType.slice(1)} 积分包 (测试)`,
        amount: productInfo.amount,
        currency: 'USD',
        creditsAdded: productInfo.creditsToAdd,
        productId: productId,
        orderId: testOrderId,
        customerId: clerkUserId,
        paymentEmail: user.email,
        provider: 'creem',
        status: 'pending'
      }
    })

    console.log('✅ 预创建订单成功:', {
      preOrderId: preOrder.id,
      orderId: testOrderId,
      userId: user.id,
      userEmail: user.email,
      productType: planType,
      amount: productInfo.amount,
      credits: productInfo.creditsToAdd
    })

    // 2️⃣ 模拟webhook回调过程
    console.log('\n🎯 第2步：模拟Webhook回调...')
    
    // 模拟Creem webhook数据
    const mockWebhookData = {
      eventType: 'checkout.completed',
      object: {
        order: {
          id: testOrderId,
          product: productId,
          amount: Math.round(productInfo.amount * 100), // Creem使用分为单位
          currency: 'USD'
        },
        customer: {
          id: `cust_test_${Date.now()}`,
          email: simulateEmail // 故意使用不同邮箱测试兼容性
        }
      }
    }

    console.log('📦 模拟webhook数据:', mockWebhookData)

    // 调用自己的webhook处理函数
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/creem`
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-creem-signature': 'test-signature'
      },
      body: JSON.stringify(mockWebhookData)
    })

    const webhookResult = await webhookResponse.json()
    
    console.log('🎉 Webhook处理结果:', webhookResult)

    // 3️⃣ 验证结果
    console.log('\n🎯 第3步：验证处理结果...')
    
    // 查询更新后的用户积分
    const updatedUser = await db.user.findUnique({
      where: { id: user.id }
    })

    // 查询订单状态
    const updatedOrder = await db.purchase.findUnique({
      where: { id: preOrder.id }
    })

    const verification = {
      orderIdMatch: webhookResult.success === true,
      creditsSynced: updatedUser ? updatedUser.totalCredits > user.totalCredits : false,
      orderCompleted: updatedOrder?.status === 'completed',
      creditsAdded: updatedUser ? updatedUser.totalCredits - user.totalCredits : 0,
      expectedCredits: productInfo.creditsToAdd
    }

    console.log('📊 验证结果:', verification)

    return NextResponse.json({
      success: true,
      message: '订单ID支付流程测试完成',
      testResults: {
        step1_orderCreation: {
          success: true,
          preOrderId: preOrder.id,
          orderId: testOrderId,
          userEmail: user.email,
          paymentEmail: simulateEmail,
          emailsMatch: user.email === simulateEmail
        },
        step2_webhookProcessing: {
          success: webhookResult.success,
          webhookResponse: webhookResult,
          matchMethod: webhookResult.success ? 'order_id_match' : 'email_fallback'
        },
        step3_verification: verification,
        improvement: {
          oldFlow: '依赖邮箱匹配 → 容易失败',
          newFlow: '优先订单ID匹配 → 邮箱兜底 → 更可靠',
          result: verification.orderIdMatch && verification.creditsSynced ? 
            '✅ 改进方案工作正常' : 
            '❌ 仍有问题需要修复'
        }
      }
    })

  } catch (error) {
    console.error('💥 测试订单ID支付流程失败:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 