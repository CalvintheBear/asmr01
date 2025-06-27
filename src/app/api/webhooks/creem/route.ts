import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { CREEM_CONFIG } from '@/lib/creem-config'

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 收到Creem webhook请求')
    
    // 调试环境变量
    console.log('🔧 环境变量检查:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- DATABASE_URL存在:', !!process.env.DATABASE_URL)
    console.log('- CREEM_API_KEY存在:', !!process.env.CREEM_API_KEY)
    console.log('- CLERK_SECRET_KEY存在:', !!process.env.CLERK_SECRET_KEY)
    
    // 获取请求头信息
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || '::1'
    const signature = request.headers.get('x-creem-signature') || 'test-signature...'
    
    console.log('🌐 User-Agent:', userAgent)
    console.log('📍 IP地址:', ipAddress)
    console.log('🔑 签名:', signature)

    // 安全地获取请求数据
    let payload: any
    let body: string
    try {
      body = await request.text()
      console.log('📝 原始请求体:', body)
      payload = JSON.parse(body)
    } catch (parseError) {
      console.error('💥 JSON解析失败:', parseError)
      console.log('📝 请求头:', Object.fromEntries(request.headers.entries()))
      return NextResponse.json({ 
        error: 'JSON parsing failed',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 400 })
    }
    
    console.log('📦 Payload:', JSON.stringify(payload))

    // 🔒 签名验证
    if (process.env.NODE_ENV === 'production') {
      console.log('🔒 生产环境，进行签名验证')
      const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
      
      if (!webhookSecret) {
        console.error('❌ CREEM_WEBHOOK_SECRET环境变量未配置')
        return NextResponse.json({ 
          error: 'Webhook secret not configured' 
        }, { status: 500 })
      }
      
      if (!signature || signature === 'test-signature...') {
        console.error('❌ 缺少有效的webhook签名')
        return NextResponse.json({ 
          error: 'Missing or invalid webhook signature' 
        }, { status: 401 })
      }
      
      // 验证签名
      try {
        const crypto = require('crypto')
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(body)
          .digest('hex')
        
        // Creem可能使用不同的签名格式，检查多种可能的格式
        const signatureFormats = [
          signature,
          signature.replace('sha256=', ''),
          `sha256=${expectedSignature}`,
          expectedSignature
        ]
        
        const isValidSignature = signatureFormats.includes(expectedSignature) ||
                               signatureFormats.some(sig => sig === `sha256=${expectedSignature}`)
        
        if (!isValidSignature) {
          console.error('❌ Webhook签名验证失败')
          console.log('🔍 预期签名:', expectedSignature)
          console.log('🔍 接收签名:', signature)
          return NextResponse.json({ 
            error: 'Invalid webhook signature' 
          }, { status: 401 })
        }
        
        console.log('✅ Webhook签名验证成功')
      } catch (verifyError) {
        console.error('❌ 签名验证过程出错:', verifyError)
        return NextResponse.json({ 
          error: 'Signature verification failed' 
        }, { status: 500 })
      }
    } else {
      console.log('⚠️ 开发环境，跳过签名验证')
    }

    console.log('📨 收到Creem webhook事件:', payload.eventType)
    console.log('📄 事件数据:', JSON.stringify(payload, null, 2))

    // 记录所有webhook事件到数据库（用于调试）
    try {
      await db.auditLog.create({
        data: {
          action: 'webhook_received',
          details: {
            eventType: payload.eventType,
            productId: payload.object?.order?.product,
            customerEmail: payload.object?.customer?.email,
            amount: payload.object?.order?.amount,
            orderId: payload.object?.order?.id,
            timestamp: new Date().toISOString()
          },
          ipAddress,
          userAgent
        }
      })
      console.log('📝 Webhook事件已记录到审计日志')
    } catch (auditError) {
      console.error('⚠️ 记录审计日志失败:', auditError)
    }

    // 处理支付成功事件
    if (payload.eventType === 'checkout.completed') {
      const result = await handlePaymentSucceeded(payload.object)
      return NextResponse.json(result)
    }

    // 处理其他事件类型
    return NextResponse.json({ 
      success: true, 
      message: 'Event type does not need processing',
      eventType: payload.eventType 
    })

  } catch (error) {
    console.error('💥 Webhook处理错误:', error)
    return NextResponse.json({ 
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Webhook处理函数 - 支付成功时的积分分配逻辑（优化处理顺序）
async function handlePaymentSucceeded(paymentData: any) {
  try {
    console.log('🎉 开始处理支付成功事件...')
    console.log('原始支付数据:', JSON.stringify(paymentData, null, 2))

    // 🔸 第1步：验证必要字段
    const productId = paymentData.order?.product
    const customerEmail = paymentData.customer?.email  
    const orderId = paymentData.order?.id
    const amount = paymentData.order?.amount
    const customerId = paymentData.customer?.id
    
    if (!productId || !customerEmail || !orderId) {
      throw new Error('Missing required payment data fields: productId=' + productId + ', customerEmail=' + customerEmail + ', orderId=' + orderId)
    }

    console.log('✅ 第1步：支付数据验证通过')

    // 🔸 第2步：产品信息识别
    const productInfo = CREEM_CONFIG.getProductInfo(productId)
    if (!productInfo) {
      throw new Error(`❌ Unknown product ID: ${productId}`)
    }

    console.log('✅ 第2步：产品信息解析成功:')
    console.log(`  📦 产品ID: ${productId}`)
    console.log(`  🏷️ 产品名称: ${productInfo.planType}`)
    console.log(`  💎 积分数量: ${productInfo.creditsToAdd}`)
    console.log(`  💰 金额: $${productInfo.amount}`)
    console.log(`  📧 支付邮箱: ${customerEmail}`)

    // 🔸 第3步：检测重复订单并创建订单记录
    console.log('✅ 第3步：开始创建订单记录...')
    
    // 检测重复订单
    const existingPurchase = await db.purchase.findFirst({
      where: { orderId: orderId }
    })
    
    if (existingPurchase) {
      console.log(`⚠️ 检测到重复订单: ${orderId}，跳过处理`)
      return {
        success: false,
        error: 'duplicate_order',
        orderId: orderId,
        message: 'This order has already been processed, skipping duplicate processing'
      }
    }

    // 先创建订单记录（无论用户匹配是否成功）
    let purchaseRecord = await db.purchase.create({
      data: {
        userId: null, // 暂时为空，后续匹配成功后更新
        packageType: productInfo.planType,
        packageName: `${productInfo.planType.charAt(0).toUpperCase() + productInfo.planType.slice(1)} 积分包`,
        amount: parseFloat(amount?.toString() || '0') / 100, // Creem金额是分为单位
        currency: paymentData.order?.currency || 'USD',
        creditsAdded: productInfo.creditsToAdd,
        productId: productId,
        orderId: orderId,
        customerId: customerId,
        paymentEmail: customerEmail,
        provider: 'creem',
        status: 'pending' // 暂时为待处理状态
      }
    })

    console.log(`✅ 第3步：订单记录已创建: ${purchaseRecord.id}`)
    console.log(`  📧 支付邮箱: ${customerEmail}`)
    console.log(`  📦 产品类型: ${productInfo.planType}`)
    console.log(`  💎 待分配积分: ${productInfo.creditsToAdd}`)

    // 🔸 第4步：通过订单ID查找预创建的订单记录
    console.log(`✅ 第4步：开始通过订单ID查找用户: ${orderId}`)
    
    // 优先通过订单ID查找预创建的订单
    const existingOrder = await db.purchase.findFirst({
      where: { 
        orderId: orderId,
        status: 'pending' // 只查找待支付状态的订单
      },
      include: {
        user: true
      }
    })

    let user = null
    let isOrderIdMatch = false

    if (existingOrder && existingOrder.user) {
      console.log(`✅ 通过订单ID找到用户: ${existingOrder.user.email}`)
      user = existingOrder.user
      isOrderIdMatch = true
      
      // 更新现有订单记录而不是创建新的
      await db.purchase.update({
        where: { id: existingOrder.id },
        data: {
          status: 'completed',
          paymentEmail: customerEmail, // 更新支付邮箱
          customerId: customerId,
          amount: parseFloat(amount?.toString() || '0') / 100 // 更新实际支付金额
        }
      })
      
      // 使用现有订单记录
      purchaseRecord = existingOrder
      
    } else {
      // 如果订单ID匹配失败，回退到邮箱匹配
      console.log(`⚠️ 订单ID匹配失败，回退到邮箱匹配: ${customerEmail}`)
      user = await db.user.findUnique({
        where: { email: customerEmail }
      })
      
      if (!user) {
        console.log(`❌ 第4步：用户匹配失败: ${customerEmail}`)
        
        // 更新订单状态为用户未找到
        await db.purchase.update({
          where: { id: purchaseRecord.id },
          data: {
            status: 'user_not_found'
          }
        })

        // 记录未匹配的支付，供后续手动处理
        await db.auditLog.create({
          data: {
            action: 'payment_user_not_found',
            details: {
              customerEmail: customerEmail,
              orderId: orderId,
              purchaseId: purchaseRecord.id,
              productId: productId,
              productName: productInfo.planType,
              amount: amount,
              creditsToAdd: productInfo.creditsToAdd,
              timestamp: new Date().toISOString(),
              suggestion: 'Both order ID and email matching failed. Please contact customer service',
              orderIdMatch: false,
              emailMatch: false
            }
          }
        })
        
        return { 
          success: false, 
          error: 'user_not_found',
          customerEmail: customerEmail,
          purchaseId: purchaseRecord.id,
          suggestion: 'Both order ID and email matching failed. Please contact customer service'
        }
      }
    }

    console.log(`✅ 第4步：用户匹配成功: ${user.id}`)
    console.log(`  📧 用户邮箱: ${user.email}`)
    console.log(`  💎 当前积分: ${user.totalCredits}`)
    console.log(`  🔗 匹配方式: ${isOrderIdMatch ? '订单ID匹配' : '邮箱匹配'}`)

    // 🔸 第5步：为用户分配积分
    console.log(`✅ 第5步：开始为用户分配积分: ${user.email}`)
    
    try {
      await db.user.update({
        where: { id: user.id },
        data: {
          totalCredits: {
            increment: productInfo.creditsToAdd
          }
        }
      })
      
      console.log(`✅ 积分分配成功: ${user.email}增加了${productInfo.creditsToAdd}积分`)
      
      // 更新订单状态为完成
      await db.purchase.update({
        where: { id: purchaseRecord.id },
        data: {
          status: 'completed',
          userId: user.id // 关联用户ID
        }
      })
      
    } catch (error) {
      console.error(`💥 第5步：积分分配失败: ${user.email}`, error)
      
      // 记录积分分配失败事件
      await db.auditLog.create({
        data: {
          action: 'payment_credit_allocation_failed',
          details: {
            customerEmail: customerEmail,
            orderId: orderId,
            userId: user.id,
            purchaseId: purchaseRecord.id,
            creditsToAdd: productInfo.creditsToAdd,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }
        }
      })

      // 更新订单状态为失败
      await db.purchase.update({
        where: { id: purchaseRecord.id },
        data: {
          status: 'credit_allocation_failed',
          userId: user.id
        }
      })
      
      return { 
        success: false, 
        error: 'credit_allocation_failed',
        userId: user.id,
        purchaseId: purchaseRecord.id
      }
    }

    // 🔸 第6步：返回成功响应
    console.log(`✅ 第6步：Webhook处理成功: ${orderId}`)

    return { 
      success: true, 
      message: 'Payment processed successfully',
      orderId: orderId,
      userId: user.id,
      creditsAdded: productInfo.creditsToAdd,
      orderIdMatch: isOrderIdMatch,
      emailMatch: !isOrderIdMatch && !!user
    }

  } catch (error) {
    console.error('💥 积分同步失败:', error)
    
    // 记录错误信息
    await db.auditLog.create({
      data: {
        action: 'credits_sync_failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          paymentData: paymentData,
          timestamp: new Date().toISOString(),
          failurePoint: '处理过程中发生错误'
        }
      }
    }).catch((logError: any) => {
      console.error('记录错误日志失败:', logError)
    })
    
    throw error
  }
}

 