#!/usr/bin/env node

// 手动处理这次支付，模拟webhook
process.env.DATABASE_URL = 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway'

const { PrismaClient } = require('@prisma/client')

async function processPayment() {
  const prisma = new PrismaClient()
  
  try {
    console.log('💳 手动处理支付成功事件...\n')

    // 从URL提取的支付信息
    const paymentInfo = {
      checkout_id: 'ch_ECLkMJMQPMgbxaBmoeYa',
      order_id: 'ord_TTBRnaTKarDmYq1d2lobf',
      customer_id: 'cust_6TcINQ8khsAbH4F9zCMnSF',
      customer_email: 'j2983236233@gmail.com', // 从日志确认的用户邮箱
    }

    console.log('📋 支付信息:')
    console.log(`  订单ID: ${paymentInfo.order_id}`)
    console.log(`  客户邮箱: ${paymentInfo.customer_email}`)
    console.log(`  客户ID: ${paymentInfo.customer_id}`)

    // 检查订单是否已经处理过 - 使用findFirst而不是findUnique
    const existingPurchase = await prisma.purchase.findFirst({
      where: { orderId: paymentInfo.order_id }
    })

    if (existingPurchase) {
      console.log('⚠️ 该订单已经处理过了')
      console.log(`  已有积分: ${existingPurchase.creditsAdded}`)
      console.log(`  购买时间: ${existingPurchase.createdAt}`)
      return
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: paymentInfo.customer_email }
    })

    if (!user) {
      console.log('❌ 未找到用户')
      return
    }

    console.log(`✅ 找到用户: ${user.email} (当前积分: ${user.totalCredits})`)

    // 我们需要确定购买的是哪个产品
    console.log('\n❓ 需要确认购买的产品类型:')
    console.log('1. Starter ($9.9 - 115积分) - prod_3ClKXTvoV2aQBMoEjTTMzM')  
    console.log('2. Standard ($30 - 355积分) - prod_67wDHjBHhgxyDUeaxr7JCG')
    console.log('3. Premium ($99 - 1450积分) - prod_5AkdzTWba2cogt75cngOhu')
    
    console.log('\n🔍 请在Creem后台查看订单详情:')
    console.log(`  订单ID: ${paymentInfo.order_id}`)
    console.log('  查看产品ID和金额，然后告诉我是哪个套餐')

    // 暂时输出用户信息，等确认产品后再处理积分
    console.log(`\n👤 当前用户状态:`)
    console.log(`  邮箱: ${user.email}`)
    console.log(`  积分: ${user.totalCredits}`)
    console.log(`  用户ID: ${user.id}`)

    console.log('\n⚠️ 支付成功但积分未同步，请确认产品类型后手动添加积分')

  } catch (error) {
    console.error('💥 处理支付失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行处理
if (require.main === module) {
  processPayment().catch(console.error)
}

module.exports = { processPayment } 