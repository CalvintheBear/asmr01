const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function checkSpecificUser() {
  try {
    console.log('🔍 检查特定用户同步问题...')
    console.log('📧 目标邮箱: y2983236233@gmail.com')
    
    // 首先通过邮箱查找
    const userByEmail = await db.user.findUnique({
      where: { email: 'y2983236233@gmail.com' },
      include: {
        videos: { select: { id: true } },
        auditLogs: { 
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })
    
    if (userByEmail) {
      console.log('✅ 通过邮箱找到用户:')
      console.log('- 数据库ID:', userByEmail.id)
      console.log('- Clerk用户ID:', userByEmail.clerkUserId)
      console.log('- 邮箱:', userByEmail.email)
      console.log('- 总积分:', userByEmail.totalCredits)
      console.log('- 已用积分:', userByEmail.usedCredits)
      console.log('- 剩余积分:', userByEmail.totalCredits - userByEmail.usedCredits)
      console.log('- 视频数量:', userByEmail.videos.length)
      console.log('- 创建时间:', userByEmail.createdAt)
      console.log('- 最后登录:', userByEmail.lastLoginAt)
      console.log('- 是否激活:', userByEmail.isActive)
      
      if (userByEmail.auditLogs.length > 0) {
        console.log('\n📝 最近的审计日志:')
        userByEmail.auditLogs.forEach((log, index) => {
          console.log(`${index + 1}. ${log.action} - ${log.createdAt.toISOString()}`)
          if (log.details) {
            console.log('   详情:', JSON.stringify(log.details, null, 2))
          }
        })
      }
      
      // 检查Clerk ID是否为空或异常
      if (!userByEmail.clerkUserId) {
        console.log('\n⚠️ 问题发现: Clerk用户ID为空')
        console.log('💡 建议: 用户重新登录时应该会自动修复')
      }
      
    } else {
      console.log('❌ 数据库中未找到该邮箱的用户')
      console.log('💡 这可能是新用户，首次登录时会自动创建')
    }
    
    // 检查是否有重复的邮箱记录
    console.log('\n🔍 检查是否有重复邮箱记录...')
    const duplicateUsers = await db.user.findMany({
      where: {
        email: { contains: 'y2983236233@gmail.com' }
      },
      select: {
        id: true,
        email: true,
        clerkUserId: true,
        createdAt: true
      }
    })
    
    if (duplicateUsers.length > 1) {
      console.log('⚠️ 发现重复记录:')
      duplicateUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}, Clerk: ${user.clerkUserId}, 创建: ${user.createdAt}`)
      })
    } else {
      console.log('✅ 无重复记录')
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error)
  } finally {
    await db.$disconnect()
  }
}

checkSpecificUser() 