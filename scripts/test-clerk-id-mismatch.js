const { PrismaClient } = require('@prisma/client')

// 模拟环境变量
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway'

async function testClerkIdMismatch() {
  const db = new PrismaClient()
  
  try {
    console.log('🔍 测试Clerk ID匹配问题...\n')
    
    await db.$connect()
    console.log('✅ 数据库连接成功\n')

    // 获取所有用户的Clerk ID
    console.log('📊 数据库中的用户Clerk ID:')
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        email: true,
        clerkUserId: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   DB ID: ${user.id}`)
      console.log(`   Clerk ID: ${user.clerkUserId}`)
      console.log(`   创建时间: ${user.createdAt}`)
      console.log('   ---')
    })

    // 模拟用户同步GET请求失败的情况
    console.log('\n🧪 模拟用户同步GET请求...')
    
    // 测试每个用户的Clerk ID查询
    for (const userData of allUsers) {
      console.log(`\n🔍 测试用户: ${userData.email}`)
      console.log(`   查询Clerk ID: ${userData.clerkUserId}`)
      
      try {
        const foundUser = await db.user.findUnique({
          where: { clerkUserId: userData.clerkUserId },
          include: {
            videos: {
              select: { id: true }
            }
          }
        })

        if (foundUser) {
          console.log(`   ✅ 查询成功: 找到用户 ${foundUser.email}`)
          console.log(`   📊 视频数量: ${foundUser.videos.length}`)
          console.log(`   💎 积分: ${foundUser.totalCredits}/${foundUser.usedCredits}`)
        } else {
          console.log(`   ❌ 查询失败: 未找到用户`)
          console.log(`   🔍 可能的问题: Clerk ID不匹配或数据库问题`)
        }
      } catch (error) {
        console.log(`   💥 查询错误: ${error.message}`)
      }
    }

    // 检查可能的Clerk ID格式问题
    console.log('\n🔍 检查Clerk ID格式:')
    
    const invalidClerkIds = allUsers.filter(user => {
      const clerkId = user.clerkUserId
      return !clerkId || 
             !clerkId.startsWith('user_') || 
             clerkId.length < 15 || 
             clerkId.includes(' ') ||
             clerkId.includes('\n')
    })

    if (invalidClerkIds.length > 0) {
      console.log(`❌ 发现 ${invalidClerkIds.length} 个格式异常的Clerk ID:`)
      invalidClerkIds.forEach(user => {
        console.log(`  用户: ${user.email}`)
        console.log(`  Clerk ID: "${user.clerkUserId}"`)
        console.log(`  长度: ${user.clerkUserId?.length || 0}`)
        console.log(`  包含空格: ${user.clerkUserId?.includes(' ') || false}`)
      })
    } else {
      console.log('✅ 所有Clerk ID格式正常')
    }

    // 检查重复或冲突的Clerk ID
    console.log('\n🔍 检查Clerk ID唯一性:')
    const clerkIdCounts = {}
    
    allUsers.forEach(user => {
      const clerkId = user.clerkUserId
      if (clerkIdCounts[clerkId]) {
        clerkIdCounts[clerkId].push(user)
      } else {
        clerkIdCounts[clerkId] = [user]
      }
    })

    const duplicateIds = Object.entries(clerkIdCounts).filter(([_, users]) => users.length > 1)
    
    if (duplicateIds.length > 0) {
      console.log(`❌ 发现 ${duplicateIds.length} 个重复的Clerk ID:`)
      duplicateIds.forEach(([clerkId, users]) => {
        console.log(`  Clerk ID: ${clerkId}`)
        users.forEach(user => {
          console.log(`    - ${user.email} (DB ID: ${user.id})`)
        })
      })
    } else {
      console.log('✅ 所有Clerk ID都是唯一的')
    }

    // 模拟真实的API调用场景
    console.log('\n🎯 模拟真实API调用场景:')
    
    // 假设我们有一个来自前端的Clerk ID
    const testClerkId = allUsers[0]?.clerkUserId
    if (testClerkId) {
      console.log(`测试Clerk ID: ${testClerkId}`)
      
      // 模拟 /api/user/sync GET请求
      try {
        const user = await db.user.findUnique({
          where: { clerkUserId: testClerkId },
          include: {
            videos: {
              select: { id: true }
            }
          }
        })

        if (!user) {
          console.log('❌ 模拟API调用: User not found (404)')
          console.log('   这就是为什么老用户同步失败的原因！')
        } else {
          console.log('✅ 模拟API调用: 成功找到用户')
          console.log(`   用户: ${user.email}`)
          console.log(`   积分余额: ${user.totalCredits - user.usedCredits}`)
        }
      } catch (error) {
        console.log(`💥 模拟API调用失败: ${error.message}`)
      }
    }

    // 建议解决方案
    console.log('\n💡 解决方案建议:')
    console.log('1. 检查Clerk认证配置是否正确')
    console.log('2. 验证前端传递的Clerk ID是否与数据库一致')
    console.log('3. 检查Clerk ID是否因为重新注册而发生变化')
    console.log('4. 考虑使用邮箱作为备用匹配方式')
    console.log('5. 添加更详细的调试日志来追踪问题')

    return {
      success: true,
      stats: {
        totalUsers: allUsers.length,
        invalidClerkIds: invalidClerkIds.length,
        duplicateClerkIds: duplicateIds.length
      }
    }

  } catch (error) {
    console.error('💥 测试失败:', error)
    return {
      success: false,
      error: error.message
    }
  } finally {
    await db.$disconnect()
    console.log('\n✅ 数据库连接已关闭')
  }
}

// 运行测试
if (require.main === module) {
  testClerkIdMismatch()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Clerk ID匹配测试完成！')
        console.log('📊 统计结果:', result.stats)
      } else {
        console.log('\n❌ 测试失败:', result.error)
      }
    })
    .catch(error => {
      console.error('\n💥 测试执行失败:', error)
    })
}

module.exports = { testClerkIdMismatch } 