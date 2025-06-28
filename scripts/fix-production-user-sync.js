const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function fixUserSync() {
  try {
    console.log('🔧 修复用户同步问题...')
    
    const targetEmail = 'y2983236233@gmail.com'
    console.log('📧 目标邮箱:', targetEmail)
    
    // 检查用户是否存在
    const existingUser = await db.user.findUnique({
      where: { email: targetEmail }
    })
    
    if (existingUser) {
      console.log('✅ 找到现有用户:', existingUser.id)
      console.log('- 当前Clerk ID:', existingUser.clerkUserId)
      console.log('- 总积分:', existingUser.totalCredits)
      console.log('- 已用积分:', existingUser.usedCredits)
      console.log('- 剩余积分:', existingUser.totalCredits - existingUser.usedCredits)
      
      // 如果Clerk ID为空，需要用户重新登录来更新
      if (!existingUser.clerkUserId) {
        console.log('⚠️ Clerk ID为空，需要用户重新登录')
        
        // 临时激活用户
        const updatedUser = await db.user.update({
          where: { id: existingUser.id },
          data: {
            isActive: true,
            lastLoginAt: new Date()
          }
        })
        
        console.log('✅ 用户已激活，建议重新登录')
      } else {
        console.log('✅ 用户数据正常')
      }
      
    } else {
      console.log('❌ 数据库中未找到用户')
      console.log('💡 建议: 用户首次登录时会自动创建记录')
      
      // 创建新用户记录（预备）
      const newUser = await db.user.create({
        data: {
          email: targetEmail,
          googleFullName: '韩昭江',
          totalCredits: 8,
          usedCredits: 0,
          isActive: true,
          googleVerifiedAt: new Date(),
          lastLoginAt: new Date(),
          clerkUserId: null // 等待用户登录时填入
        }
      })
      
      console.log('✅ 已创建预备用户记录:', newUser.id)
      console.log('💡 用户下次登录时会自动关联Clerk ID')
    }
    
    // 记录修复操作
    await db.auditLog.create({
      data: {
        userId: existingUser?.id || 1, // 临时用ID 1
        action: 'manual_fix_user_sync',
        details: {
          email: targetEmail,
          fixTime: new Date().toISOString(),
          method: 'production_script'
        },
        ipAddress: '::1',
        userAgent: 'manual-fix-script'
      }
    })
    
    console.log('📝 修复操作已记录到审计日志')
    console.log('🎉 修复完成！')
    
  } catch (error) {
    console.error('❌ 修复失败:', error)
  } finally {
    await db.$disconnect()
  }
}

fixUserSync() 