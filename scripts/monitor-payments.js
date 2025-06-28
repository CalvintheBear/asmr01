const { PrismaClient } = require('@prisma/client')

// 设置环境变量
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway'

async function monitorPayments() {
  const db = new PrismaClient()
  
  try {
    console.log('💰 支付系统健康监控 - ' + new Date().toLocaleString())
    console.log('════════════════════════════════════════════════\n')

    // 1. 检查最近24小时的支付
    const last24Hours = new Date()
    last24Hours.setHours(last24Hours.getHours() - 24)
    
    const recentPayments = await db.purchase.findMany({
      where: {
        createdAt: {
          gte: last24Hours
        }
      },
      include: {
        user: {
          select: {
            email: true,
            totalCredits: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 近24小时支付统计:`)
    console.log(`   总支付: ${recentPayments.length} 笔`)
    console.log(`   成功: ${recentPayments.filter(p => p.status === 'completed').length} 笔`)
    console.log(`   待处理: ${recentPayments.filter(p => p.status === 'pending').length} 笔`)
    console.log(`   失败: ${recentPayments.filter(p => p.status !== 'completed' && p.status !== 'pending').length} 笔\n`)

    // 2. 检查待处理的订单
    const pendingOrders = await db.purchase.findMany({
      where: {
        status: 'pending',
        createdAt: {
          gte: last24Hours
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    if (pendingOrders.length > 0) {
      console.log(`⚠️ 待处理订单 (${pendingOrders.length} 笔):`)
      pendingOrders.forEach(order => {
        console.log(`   📦 订单 ${order.orderId}:`)
        console.log(`      用户: ${order.user?.email || '未关联'}`)
        console.log(`      产品: ${order.packageType}`)
        console.log(`      金额: $${order.amount}`)
        console.log(`      时间: ${order.createdAt.toLocaleString()}`)
        console.log()
      })
    } else {
      console.log('✅ 无待处理订单\n')
    }

    // 3. 检查失败的订单
    const failedOrders = await db.purchase.findMany({
      where: {
        status: {
          in: ['user_not_found', 'credit_allocation_failed']
        },
        createdAt: {
          gte: last24Hours
        }
      }
    })

    if (failedOrders.length > 0) {
      console.log(`❌ 失败订单 (${failedOrders.length} 笔):`)
      failedOrders.forEach(order => {
        console.log(`   📦 订单 ${order.orderId}:`)
        console.log(`      状态: ${order.status}`)
        console.log(`      邮箱: ${order.paymentEmail}`)
        console.log(`      金额: $${order.amount}`)
        console.log(`      时间: ${order.createdAt.toLocaleString()}`)
        console.log()
      })
    } else {
      console.log('✅ 无失败订单\n')
    }

    // 4. 检查最近的webhook事件
    const recentWebhooks = await db.auditLog.findMany({
      where: {
        action: 'webhook_received',
        createdAt: {
          gte: last24Hours
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    console.log(`🔔 近期Webhook事件 (${recentWebhooks.length} 个):`)
    if (recentWebhooks.length > 0) {
      recentWebhooks.forEach(webhook => {
        const details = webhook.details
        console.log(`   📨 ${details.eventType || 'unknown'}:`)
        console.log(`      订单: ${details.orderId || 'N/A'}`)
        console.log(`      邮箱: ${details.customerEmail || 'N/A'}`)
        console.log(`      时间: ${webhook.createdAt.toLocaleString()}`)
      })
    } else {
      console.log('   📭 无webhook事件')
    }

    console.log('\n════════════════════════════════════════════════')
    console.log('✅ 支付系统监控完成')

  } catch (error) {
    console.error('❌ 监控脚本执行失败:', error)
  } finally {
    await db.$disconnect()
  }
}

// 如果直接运行脚本
if (require.main === module) {
  monitorPayments()
}

module.exports = { monitorPayments } 