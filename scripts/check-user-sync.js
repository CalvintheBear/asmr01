const { PrismaClient } = require('@prisma/client')

// 模拟环境变量
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway'

async function checkUserSync() {
  const db = new PrismaClient()
  
  try {
    console.log('🔍 检查用户同步问题...\n')
    
    // 连接数据库
    await db.$connect()
    console.log('✅ 数据库连接成功\n')

    // 查看所有用户
    console.log('📊 查看数据库中的所有用户:')
    const allUsers = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    console.log(`找到 ${allUsers.length} 个用户:\n`)
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. 用户ID: ${user.id}`)
      console.log(`   Clerk ID: ${user.clerkUserId}`)
      console.log(`   邮箱: ${user.email}`)
      console.log(`   全名: ${user.googleFullName || 'N/A'}`)
      console.log(`   总积分: ${user.totalCredits}`)
      console.log(`   已用积分: ${user.usedCredits}`)
      console.log(`   活跃状态: ${user.isActive}`)
      console.log(`   创建时间: ${user.createdAt}`)
      console.log(`   最后登录: ${user.lastLoginAt || 'N/A'}`)
      console.log(`   Google验证: ${user.googleVerifiedAt || 'N/A'}`)
      console.log('   ---')
    })

    // 检查数据库结构
    console.log('\n📋 检查数据库表结构:')
    
    // 检查User表字段
    const userTableInfo = await db.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `
    
    console.log('User表字段:')
    userTableInfo.forEach(column => {
      console.log(`  ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable})`)
    })

    // 检查是否有缺失必要字段的用户
    console.log('\n🔍 检查问题用户:')
    
    const problemUsers = await db.user.findMany({
      where: {
        OR: [
          { clerkUserId: null },
          { clerkUserId: '' },
          { email: null },
          { email: '' },
          { totalCredits: null },
          { usedCredits: null }
        ]
      }
    })

    if (problemUsers.length > 0) {
      console.log(`发现 ${problemUsers.length} 个问题用户:`)
      problemUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`)
        console.log(`   问题: clerkUserId=${user.clerkUserId}, email=${user.email}`)
        console.log(`   积分: total=${user.totalCredits}, used=${user.usedCredits}`)
      })
    } else {
      console.log('✅ 没有发现明显的问题用户')
    }

    // 检查重复的Clerk ID
    console.log('\n🔍 检查重复Clerk ID:')
    const clerkIdCounts = await db.$queryRaw`
      SELECT "clerkUserId", COUNT(*) as count 
      FROM "User" 
      WHERE "clerkUserId" IS NOT NULL AND "clerkUserId" != ''
      GROUP BY "clerkUserId" 
      HAVING COUNT(*) > 1;
    `

    if (clerkIdCounts.length > 0) {
      console.log(`发现 ${clerkIdCounts.length} 个重复的Clerk ID:`)
      clerkIdCounts.forEach(item => {
        console.log(`  Clerk ID: ${item.clerkUserId} (重复 ${item.count} 次)`)
      })
    } else {
      console.log('✅ 没有重复的Clerk ID')
    }

    // 检查最近的审计日志
    console.log('\n📝 检查最近的用户同步日志:')
    const recentSyncLogs = await db.auditLog.findMany({
      where: {
        action: 'user_sync'
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: {
            email: true,
            clerkUserId: true
          }
        }
      }
    })

    if (recentSyncLogs.length > 0) {
      console.log(`最近 ${recentSyncLogs.length} 次同步记录:`)
      recentSyncLogs.forEach((log, index) => {
        console.log(`${index + 1}. 时间: ${log.createdAt}`)
        console.log(`   用户: ${log.user?.email || 'N/A'}`)
        console.log(`   Clerk ID: ${log.user?.clerkUserId || 'N/A'}`)
        console.log(`   详情: ${JSON.stringify(log.details)}`)
        console.log('   ---')
      })
    } else {
      console.log('⚠️ 没有找到用户同步日志')
    }

    // 检查可能的解决方案
    console.log('\n💡 问题诊断和解决建议:')
    
    if (allUsers.length === 0) {
      console.log('❌ 数据库中没有用户，这是主要问题')
    } else {
      // 检查字段兼容性
      const hasRequiredFields = allUsers.every(user => 
        user.hasOwnProperty('totalCredits') && 
        user.hasOwnProperty('usedCredits') &&
        user.hasOwnProperty('isActive')
      )
      
      if (!hasRequiredFields) {
        console.log('❌ 发现数据库结构不兼容，需要迁移')
        console.log('建议: 运行数据库迁移 prisma db push')
      } else {
        console.log('✅ 数据库结构看起来正常')
      }

      // 检查 Clerk ID 格式
      const invalidClerkIds = allUsers.filter(user => 
        !user.clerkUserId || 
        !user.clerkUserId.startsWith('user_') || 
        user.clerkUserId.length < 10
      )

      if (invalidClerkIds.length > 0) {
        console.log(`❌ 发现 ${invalidClerkIds.length} 个无效的Clerk ID`)
        console.log('建议: 这些用户可能需要重新同步或清理')
      }
    }

    return {
      success: true,
      stats: {
        totalUsers: allUsers.length,
        problemUsers: problemUsers.length,
        duplicateClerkIds: clerkIdCounts.length,
        recentSyncs: recentSyncLogs.length
      }
    }

  } catch (error) {
    console.error('💥 检查失败:', error)
    return {
      success: false,
      error: error.message
    }
  } finally {
    await db.$disconnect()
    console.log('\n✅ 数据库连接已关闭')
  }
}

// 运行检查
if (require.main === module) {
  checkUserSync()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 用户同步检查完成！')
        console.log('📊 统计:', result.stats)
      } else {
        console.log('\n❌ 检查失败:', result.error)
      }
    })
    .catch(error => {
      console.error('\n💥 检查执行失败:', error)
    })
}

module.exports = { checkUserSync } 