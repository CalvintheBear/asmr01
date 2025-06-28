const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function checkAllUsers() {
  try {
    console.log('🔍 检查所有用户状态...')
    console.log('=' .repeat(60))
    
    // 获取所有用户
    const allUsers = await db.user.findMany({
      include: {
        videos: { select: { id: true } },
        auditLogs: { 
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📊 总用户数: ${allUsers.length}`)
    console.log('')
    
    // 统计信息
    let stats = {
      total: allUsers.length,
      withClerkId: 0,
      withoutClerkId: 0,
      active: 0,
      inactive: 0,
      withVideos: 0,
      withCredits: 0,
      duplicateEmails: 0
    }
    
    // 检查重复邮箱
    const emailGroups = {}
    allUsers.forEach(user => {
      if (!emailGroups[user.email]) {
        emailGroups[user.email] = []
      }
      emailGroups[user.email].push(user)
    })
    
    console.log('📧 检查重复邮箱...')
    Object.entries(emailGroups).forEach(([email, users]) => {
      if (users.length > 1) {
        console.log(`⚠️  重复邮箱: ${email} (${users.length}个记录)`)
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ID: ${user.id}, Clerk: ${user.clerkUserId || 'NULL'}, 创建: ${user.createdAt.toISOString().slice(0, 10)}`)
        })
        stats.duplicateEmails++
        console.log('')
      }
    })
    
    console.log('👥 用户详细信息:')
    console.log('-'.repeat(60))
    
    allUsers.forEach((user, index) => {
      const hasClerkId = !!user.clerkUserId
      const hasVideos = user.videos.length > 0
      const remainingCredits = user.totalCredits - user.usedCredits
      
      // 更新统计
      if (hasClerkId) stats.withClerkId++
      else stats.withoutClerkId++
      
      if (user.isActive) stats.active++
      else stats.inactive++
      
      if (hasVideos) stats.withVideos++
      if (remainingCredits > 0) stats.withCredits++
      
      // 标识潜在问题
      let issues = []
      if (!hasClerkId) issues.push('缺少Clerk ID')
      if (!user.isActive) issues.push('未激活')
      if (remainingCredits <= 0) issues.push('无积分')
      if (!user.lastLoginAt) issues.push('从未登录')
      
      const status = issues.length > 0 ? `⚠️  [${issues.join(', ')}]` : '✅'
      
      console.log(`${index + 1}. ${status}`)
      console.log(`   📧 邮箱: ${user.email}`)
      console.log(`   🆔 Clerk ID: ${user.clerkUserId || 'NULL'}`)
      console.log(`   💰 积分: ${remainingCredits}/${user.totalCredits} (已用: ${user.usedCredits})`)
      console.log(`   🎥 视频: ${user.videos.length}个`)
      console.log(`   📅 创建: ${user.createdAt.toISOString().slice(0, 10)}`)
      console.log(`   🕐 最后登录: ${user.lastLoginAt ? user.lastLoginAt.toISOString().slice(0, 10) : '从未'}`)
      console.log(`   ⚡ 状态: ${user.isActive ? '激活' : '未激活'}`)
      
      if (user.auditLogs.length > 0) {
        console.log(`   📝 最近操作: ${user.auditLogs[0].action} (${user.auditLogs[0].createdAt.toISOString().slice(0, 10)})`)
      }
      
      console.log('')
    })
    
    // 显示统计摘要
    console.log('📊 统计摘要:')
    console.log('=' .repeat(60))
    console.log(`总用户数: ${stats.total}`)
    console.log(`有Clerk ID: ${stats.withClerkId} (${(stats.withClerkId/stats.total*100).toFixed(1)}%)`)
    console.log(`缺少Clerk ID: ${stats.withoutClerkId} (${(stats.withoutClerkId/stats.total*100).toFixed(1)}%)`)
    console.log(`激活用户: ${stats.active} (${(stats.active/stats.total*100).toFixed(1)}%)`)
    console.log(`有积分用户: ${stats.withCredits} (${(stats.withCredits/stats.total*100).toFixed(1)}%)`)
    console.log(`有视频用户: ${stats.withVideos} (${(stats.withVideos/stats.total*100).toFixed(1)}%)`)
    console.log(`重复邮箱: ${stats.duplicateEmails}组`)
    
    // 建议修复操作
    console.log('')
    console.log('💡 建议修复操作:')
    console.log('=' .repeat(60))
    
    if (stats.withoutClerkId > 0) {
      console.log(`🔧 ${stats.withoutClerkId}个用户缺少Clerk ID - 需要重新登录修复`)
    }
    
    if (stats.duplicateEmails > 0) {
      console.log(`🧹 ${stats.duplicateEmails}组重复邮箱 - 需要清理重复记录`)
    }
    
    if (stats.inactive > 0) {
      console.log(`⚡ ${stats.inactive}个未激活用户 - 检查是否需要激活`)
    }
    
    if (stats.total - stats.withCredits > 0) {
      console.log(`💰 ${stats.total - stats.withCredits}个用户无积分 - 检查是否需要补充`)
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error)
  } finally {
    await db.$disconnect()
  }
}

checkAllUsers() 