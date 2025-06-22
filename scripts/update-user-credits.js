#!/usr/bin/env node

// 用于测试积分同步功能的脚本
// 使用方法: node scripts/update-user-credits.js <用户邮箱> <新的总积分>
// 例如: node scripts/update-user-credits.js user@example.com 200

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateUserCredits() {
  try {
    const email = process.argv[2]
    const newTotalCredits = parseInt(process.argv[3])

    if (!email || !newTotalCredits) {
      console.log('❌ 使用方法: node scripts/update-user-credits.js <用户邮箱> <新的总积分>')
      console.log('例如: node scripts/update-user-credits.js user@example.com 200')
      process.exit(1)
    }

    console.log(`🔍 查找用户: ${email}`)

    // 通过邮箱查找用户
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      console.log(`❌ 未找到用户: ${email}`)
      console.log('💡 请确认用户邮箱地址是否正确')
      process.exit(1)
    }

    console.log(`✅ 找到用户:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   姓名: ${user.name || '未设置'}`)
    console.log(`   邮箱: ${user.email}`)
    console.log(`   当前总积分: ${user.totalCredits}`)
    console.log(`   已使用积分: ${user.usedCredits}`)
    console.log(`   剩余积分: ${user.totalCredits - user.usedCredits}`)

    // 更新积分
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        totalCredits: newTotalCredits,
        updatedAt: new Date()
      }
    })

    console.log('')
    console.log('🚀 积分更新成功!')
    console.log(`   新的总积分: ${updatedUser.totalCredits}`)
    console.log(`   已使用积分: ${updatedUser.usedCredits}`)
    console.log(`   新的剩余积分: ${updatedUser.totalCredits - updatedUser.usedCredits}`)
    console.log(`   更新时间: ${updatedUser.updatedAt}`)
    
    console.log('')
    console.log('💡 现在可以在前端点击积分旁边的刷新按钮来同步新的积分！')

  } catch (error) {
    console.error('❌ 更新积分失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserCredits() 