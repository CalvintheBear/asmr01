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
    console.log('- CREEM_SECRET_KEY存在:', !!process.env.CREEM_SECRET_KEY)
    console.log('- CLERK_SECRET_KEY存在:', !!process.env.CLERK_SECRET_KEY)
    
    // 安全地获取请求数据
    let payload: any
    try {
      const body = await request.text()
      console.log('📝 原始请求体:', body)
      payload = JSON.parse(body)
    } catch (parseError) {
      console.error('💥 JSON解析失败:', parseError)
      console.log('📝 请求头:', Object.fromEntries(request.headers.entries()))
      return NextResponse.json({ 
        error: 'JSON解析失败',
        details: parseError instanceof Error ? parseError.message : '未知解析错误'
      }, { status: 400 })
    }
    
    console.log('📦 Payload:', JSON.stringify(payload))
    
    // 获取请求头信息
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || '::1'
    const signature = request.headers.get('x-creem-signature') || 'test-signature...'
    
    console.log('🌐 User-Agent:', userAgent)
    console.log('📍 IP地址:', ipAddress)
    console.log('🔑 签名:', signature)

    // 开发环境跳过签名验证
    if (process.env.NODE_ENV !== 'production') {
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
      message: '事件类型不需要处理',
      eventType: payload.eventType 
    })

  } catch (error) {
    console.error('💥 Webhook处理错误:', error)
    return NextResponse.json({ 
      error: '处理webhook失败',
      details: error instanceof Error ? error.message : '未知错误'
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
      throw new Error('缺少必要的支付数据字段: productId=' + productId + ', customerEmail=' + customerEmail + ', orderId=' + orderId)
    }

    console.log('✅ 第1步：支付数据验证通过')

    // 🔸 第2步：产品信息识别
    const productInfo = CREEM_CONFIG.getProductInfo(productId)
    if (!productInfo) {
      throw new Error(`❌ 未知的产品ID: ${productId}`)
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
        message: '该订单已处理过，跳过重复处理'
      }
    }

    // 先创建订单记录（无论用户匹配是否成功）
    const purchaseRecord = await db.purchase.create({
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

    // 🔸 第4步：用户邮箱精准匹配
    console.log(`✅ 第4步：开始用户邮箱匹配: ${customerEmail}`)
    const user = await db.user.findUnique({
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
            suggestion: '需要手动关联用户或提醒用户使用正确邮箱注册'
          }
        }
      })
      
      return { 
        success: false, 
        error: 'user_not_found',
        customerEmail: customerEmail,
        purchaseId: purchaseRecord.id,
        suggestion: '订单已记录，但用户未找到。请确保使用与注册账号相同的邮箱进行支付，或联系客服处理'
      }
    }

    console.log(`✅ 第4步：用户匹配成功: ${user.id}`)
    console.log(`  📧 用户邮箱: ${user.email}`)
    console.log(`  💎 当前积分: ${user.totalCredits}`)

    // 🔸 第5步：更新用户积分和订单状态
    console.log('✅ 第5步：开始积分更新...')
    
    const creditsToAdd = productInfo.creditsToAdd
    const newTotalCredits = user.totalCredits + creditsToAdd

    // 更新用户积分
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        totalCredits: newTotalCredits,
        updatedAt: new Date()
      }
    })

    // 更新订单记录，关联用户并标记完成
    await db.purchase.update({
      where: { id: purchaseRecord.id },
      data: {
        userId: user.id,
        status: 'completed'
      }
    })

    console.log('✅ 第5步：积分更新和订单完成:')
    console.log(`  👤 用户: ${user.email}`)
    console.log(`  📦 套餐: ${productInfo.planType}`)
    console.log(`  ➕ 增加积分: ${creditsToAdd}`)
    console.log(`  📊 原积分: ${user.totalCredits}`)
    console.log(`  📊 新积分: ${updatedUser.totalCredits}`)
    console.log(`  📦 订单状态: completed`)

    // 记录成功的积分同步操作
    await db.auditLog.create({
      data: {
        action: 'credits_synced_success',
        details: {
          userId: user.id,
          userEmail: user.email,
          paymentEmail: customerEmail,
          emailMatch: user.email === customerEmail,
          productId: productId,
          productName: productInfo.planType,
          creditsAdded: creditsToAdd,
          oldTotal: user.totalCredits,
          newTotal: updatedUser.totalCredits,
          orderId: orderId,
          purchaseId: purchaseRecord.id,
          timestamp: new Date().toISOString(),
          processSteps: [
            '1. 数据验证通过',
            '2. 产品信息识别成功', 
            '3. 订单记录创建成功',
            '4. 用户邮箱匹配成功',
            '5. 积分更新和订单完成'
          ]
        }
      }
    })

    console.log('🎉 所有步骤完成! 积分已成功同步到用户账户')

    return {
      success: true,
      message: '积分同步成功',
      userId: user.id,
      userEmail: user.email,
      paymentEmail: customerEmail,
      productName: productInfo.planType,
      creditsAdded: creditsToAdd,
      oldTotal: user.totalCredits,
      newTotal: updatedUser.totalCredits,
      packageType: productInfo.planType,
      purchaseId: purchaseRecord.id,
      processSteps: 5
    }

  } catch (error) {
    console.error('💥 积分同步失败:', error)
    
    // 记录错误信息
    await db.auditLog.create({
      data: {
        action: 'credits_sync_failed',
        details: {
          error: error instanceof Error ? error.message : '未知错误',
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

 