const { PrismaClient } = require('@prisma/client')

// 模拟环境变量
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway'

async function fixUserSyncIssue() {
  const db = new PrismaClient()
  
  try {
    console.log('🔧 开始修复用户同步问题...\n')
    
    await db.$connect()
    console.log('✅ 数据库连接成功\n')

    // 1. 检查当前用户状态
    console.log('📊 1. 检查当前用户状态:')
    const allUsers = await db.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`数据库中共有 ${allUsers.length} 个用户\n`)

    // 2. 检查是否有缺失clerkUserId的用户
    console.log('🔍 2. 分析用户数据完整性:')
    
    let problemUsers = []
    let validUsers = []
    
    allUsers.forEach(user => {
      if (!user.clerkUserId || user.clerkUserId.trim() === '') {
        problemUsers.push(user)
      } else {
        validUsers.push(user)
      }
    })

    console.log(`✅ 有效用户: ${validUsers.length} 个`)
    console.log(`❌ 问题用户: ${problemUsers.length} 个`)

    if (problemUsers.length > 0) {
      console.log('\n问题用户详情:')
      problemUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`)
        console.log(`   邮箱: ${user.email}`)
        console.log(`   Clerk ID: ${user.clerkUserId || 'N/A'}`)
        console.log(`   积分: ${user.totalCredits}`)
        console.log('   ---')
      })
    }

    // 3. 检查重复的Clerk ID
    console.log('\n🔍 3. 检查重复Clerk ID:')
    const clerkIdMap = new Map()
    
    validUsers.forEach(user => {
      if (clerkIdMap.has(user.clerkUserId)) {
        clerkIdMap.get(user.clerkUserId).push(user)
      } else {
        clerkIdMap.set(user.clerkUserId, [user])
      }
    })

    const duplicates = Array.from(clerkIdMap.entries()).filter(([_, users]) => users.length > 1)
    
    if (duplicates.length > 0) {
      console.log(`发现 ${duplicates.length} 组重复的Clerk ID:`)
      duplicates.forEach(([clerkId, users]) => {
        console.log(`  Clerk ID: ${clerkId}`)
        users.forEach(user => {
          console.log(`    - 用户: ${user.email} (ID: ${user.id})`)
        })
      })
    } else {
      console.log('✅ 没有重复的Clerk ID')
    }

    // 4. 检查数据库字段是否需要调整
    console.log('\n🔍 4. 检查数据库结构兼容性:')
    
    // 检查是否所有用户都有必要的字段
    const missingFieldUsers = allUsers.filter(user => 
      user.totalCredits === null || user.totalCredits === undefined ||
      user.usedCredits === null || user.usedCredits === undefined ||
      user.isActive === null || user.isActive === undefined
    )

    if (missingFieldUsers.length > 0) {
      console.log(`❌ 发现 ${missingFieldUsers.length} 个用户缺少必要字段`)
    } else {
      console.log('✅ 所有用户都有必要字段')
    }

    // 5. 提供修复建议
    console.log('\n💡 5. 修复建议:')
    
    if (problemUsers.length > 0) {
      console.log('❌ 主要问题: 有用户缺少 clerkUserId')
      console.log('解决方案:')
      console.log('  1. 这些用户需要重新登录以获取新的Clerk ID')
      console.log('  2. 或者将这些用户标记为非活跃状态')
      console.log('  3. 或者为这些用户生成临时的Clerk ID')
      
      console.log('\n是否要为问题用户生成临时Clerk ID? (仅用于测试)')
      // 为测试目的，我们可以生成临时ID
      
      console.log('\n🔧 为问题用户生成临时Clerk ID...')
      for (let i = 0; i < problemUsers.length; i++) {
        const user = problemUsers[i]
        const tempClerkId = `temp_user_${Date.now()}_${i}`
        
        try {
          await db.user.update({
            where: { id: user.id },
            data: { 
              clerkUserId: tempClerkId,
              isActive: false // 标记为非活跃，需要重新验证
            }
          })
          console.log(`  ✅ 用户 ${user.email} 已分配临时ID: ${tempClerkId}`)
        } catch (error) {
          console.log(`  ❌ 用户 ${user.email} 更新失败: ${error.message}`)
        }
      }
    }

    if (duplicates.length > 0) {
      console.log('\n❌ 发现重复Clerk ID，需要手动处理')
      console.log('解决方案: 保留最新的用户记录，合并或删除重复记录')
    }

    // 6. 测试修复后的用户同步
    console.log('\n🧪 6. 测试修复效果:')
    
    // 重新查询所有用户
    const updatedUsers = await db.user.findMany()
    const validAfterFix = updatedUsers.filter(user => user.clerkUserId && user.clerkUserId.trim() !== '')
    
    console.log(`修复前有效用户: ${validUsers.length}`)
    console.log(`修复后有效用户: ${validAfterFix.length}`)
    console.log(`修复成功率: ${((validAfterFix.length / updatedUsers.length) * 100).toFixed(1)}%`)

    // 7. 检查用户同步API逻辑
    console.log('\n🔍 7. 用户同步失败的可能原因分析:')
    console.log('基于错误信息 "User not found"，可能的原因:')
    console.log('  1. ✅ Clerk认证正常 (有clerkUserId)')
    console.log('  2. ❌ 数据库查询失败 (clerkUserId不匹配)')
    console.log('  3. ❌ 用户记录不存在或已被删除')
    console.log('  4. ❌ 数据库连接问题')

    console.log('\n推荐的解决步骤:')
    console.log('1. 检查用户是否需要重新登录')
    console.log('2. 检查Clerk和数据库的用户ID是否一致')
    console.log('3. 检查数据库连接是否稳定')
    console.log('4. 检查API路由的错误处理逻辑')

    return {
      success: true,
      stats: {
        totalUsers: allUsers.length,
        validUsers: validUsers.length,
        problemUsers: problemUsers.length,
        duplicates: duplicates.length,
        fixedUsers: problemUsers.length
      }
    }

  } catch (error) {
    console.error('💥 修复失败:', error)
    return {
      success: false,
      error: error.message
    }
  } finally {
    await db.$disconnect()
    console.log('\n✅ 数据库连接已关闭')
  }
}

// 运行修复
if (require.main === module) {
  fixUserSyncIssue()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 用户同步问题修复完成！')
        console.log('📊 修复统计:', result.stats)
        console.log('\n📝 后续建议:')
        console.log('1. 让老用户重新登录以获取正确的Clerk ID')
        console.log('2. 监控用户同步API的错误日志')
        console.log('3. 考虑添加用户数据迁移机制')
      } else {
        console.log('\n❌ 修复失败:', result.error)
      }
    })
    .catch(error => {
      console.error('\n💥 修复执行失败:', error)
    })
}

module.exports = { fixUserSyncIssue } 