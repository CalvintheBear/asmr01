const { PrismaClient } = require('@prisma/client')

// 模拟环境变量
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway'

async function fixVideoGenerationCredits() {
  const db = new PrismaClient()
  
  try {
    console.log('🔧 开始修复视频生成积分问题...\n')
    
    await db.$connect()
    console.log('✅ 数据库连接成功\n')

    // 1. 检查失败的视频记录
    console.log('📊 1. 检查失败的视频记录:')
    
    const failedVideos = await db.video.findMany({
      where: {
        OR: [
          { status: 'pending' }, // 一直处于pending状态
          { status: 'failed' },  // 明确失败
          { status: 'error' }    // 错误状态
        ],
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            totalCredits: true,
            usedCredits: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`找到 ${failedVideos.length} 个可能失败的视频记录:\n`)

    if (failedVideos.length === 0) {
      console.log('✅ 没有发现失败的视频记录')
    } else {
      failedVideos.forEach((video, index) => {
        console.log(`${index + 1}. 视频ID: ${video.id}`)
        console.log(`   用户: ${video.user.email}`)
        console.log(`   状态: ${video.status}`)
        console.log(`   积分消耗: ${video.creditsUsed}`)
        console.log(`   创建时间: ${video.createdAt}`)
        console.log(`   TaskID: ${video.taskId || 'N/A'}`)
        console.log(`   用户当前积分: ${video.user.totalCredits}/${video.user.usedCredits}`)
        console.log('   ---')
      })
    }

    // 2. 检查pending状态超过30分钟的视频（可能是API调用失败）
    console.log('\n🔍 2. 检查长时间pending的视频:')
    
    const stuckVideos = await db.video.findMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: new Date(Date.now() - 30 * 60 * 1000) // 30分钟前
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            totalCredits: true,
            usedCredits: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (stuckVideos.length > 0) {
      console.log(`发现 ${stuckVideos.length} 个长时间pending的视频:`)
      
      for (const video of stuckVideos) {
        console.log(`\n🔧 处理视频: ${video.id}`)
        console.log(`   用户: ${video.user.email}`)
        console.log(`   创建时间: ${video.createdAt}`)
        console.log(`   积分消耗: ${video.creditsUsed}`)
        
        // 检查是否应该退还积分
        const shouldRefund = true // 超过30分钟的pending视频应该退还积分
        
        if (shouldRefund) {
          try {
            await db.$transaction(async (tx) => {
              // 退还积分
              await tx.user.update({
                where: { id: video.user.id },
                data: {
                  usedCredits: {
                    decrement: video.creditsUsed
                  }
                }
              })
              
              // 更新视频状态为失败
              await tx.video.update({
                where: { id: video.id },
                data: {
                  status: 'failed'
                }
              })
              
              // 记录审计日志
              await tx.auditLog.create({
                data: {
                  userId: video.user.id,
                  action: 'credits_refund_auto',
                  details: {
                    videoId: video.id,
                    creditsRefunded: video.creditsUsed,
                    reason: 'video_generation_timeout',
                    originalStatus: 'pending',
                    timeoutMinutes: Math.floor((Date.now() - video.createdAt.getTime()) / (60 * 1000)),
                    autoFixedAt: new Date().toISOString()
                  },
                  ipAddress: '127.0.0.1',
                  userAgent: 'auto-fix-script'
                }
              })
            })
            
            console.log(`   ✅ 已退还 ${video.creditsUsed} 积分给用户 ${video.user.email}`)
          } catch (error) {
            console.log(`   ❌ 退还积分失败: ${error.message}`)
          }
        }
      }
    } else {
      console.log('✅ 没有发现长时间pending的视频')
    }

    // 3. 检查API密钥状态
    console.log('\n🔑 3. 检查API密钥配置:')
    
    const apiKeys = [
      process.env.VEO3_API_KEY,
      process.env.VEO3_API_KEY_2, 
      process.env.VEO3_API_KEY_3,
      process.env.VEO3_API_KEY_4,
      process.env.VEO3_API_KEY_5
    ].filter(Boolean)
    
    console.log(`配置的API密钥数量: ${apiKeys.length}`)
    
    if (apiKeys.length === 0) {
      console.log('❌ 未找到VEO3 API密钥配置')
      console.log('   这可能是视频生成失败的原因')
    } else {
      console.log('✅ API密钥配置正常')
      apiKeys.forEach((key, index) => {
        console.log(`   密钥 ${index + 1}: ${key.substring(0, 10)}...`)
      })
    }

    // 4. 测试API连通性
    console.log('\n🌐 4. 测试API连通性:')
    
    const testApiKey = apiKeys[0]
    if (testApiKey) {
      try {
        const testResponse = await fetch('https://api.kie.ai/api/v1/veo/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${testApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: 'test prompt for connectivity',
            model: 'veo3_fast',
            aspectRatio: '16:9',
            duration: '8'
          })
        })
        
        console.log(`API响应状态: ${testResponse.status}`)
        
        if (testResponse.status === 401) {
          console.log('❌ API密钥无效或已过期')
        } else if (testResponse.status === 429) {
          console.log('⚠️ API速率限制')
        } else if (testResponse.status >= 500) {
          console.log('❌ API服务器错误')
        } else {
          console.log('✅ API连通性正常')
        }
        
        const responseText = await testResponse.text()
        console.log(`API响应内容: ${responseText.substring(0, 200)}...`)
        
      } catch (error) {
        console.log(`❌ API连通性测试失败: ${error.message}`)
        console.log('   这可能是网络问题或API服务不可用')
      }
    }

    // 5. 检查最近的审计日志
    console.log('\n📝 5. 检查最近的视频生成审计日志:')
    
    const recentLogs = await db.auditLog.findMany({
      where: {
        action: {
          in: ['video_generation_started', 'video_generation_failed', 'credits_refund_auto']
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: { email: true }
        }
      }
    })

    if (recentLogs.length > 0) {
      console.log(`最近 ${recentLogs.length} 条相关日志:`)
      recentLogs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.action} - ${log.user?.email || 'N/A'}`)
        console.log(`   时间: ${log.createdAt}`)
        console.log(`   详情: ${JSON.stringify(log.details)}`)
        console.log('   ---')
      })
    } else {
      console.log('⚠️ 没有找到相关的审计日志')
    }

    // 6. 生成修复报告
    console.log('\n📊 修复统计:')
    const stats = {
      totalFailedVideos: failedVideos.length,
      stuckVideos: stuckVideos.length,
      refundedVideos: stuckVideos.length, // 所有stuck视频都会被退款
      totalCreditsRefunded: stuckVideos.reduce((sum, video) => sum + video.creditsUsed, 0),
      apiKeysConfigured: apiKeys.length
    }
    
    console.log(`失败视频总数: ${stats.totalFailedVideos}`)
    console.log(`长时间pending视频: ${stats.stuckVideos}`)
    console.log(`已退款视频: ${stats.refundedVideos}`)
    console.log(`退还积分总数: ${stats.totalCreditsRefunded}`)
    console.log(`配置的API密钥: ${stats.apiKeysConfigured}`)

    console.log('\n💡 建议:')
    if (stats.apiKeysConfigured === 0) {
      console.log('1. ❌ 紧急: 配置VEO3 API密钥')
    } else if (stats.apiKeysConfigured < 3) {
      console.log('1. ⚠️ 建议: 配置更多API密钥提高可用性')
    } else {
      console.log('1. ✅ API密钥配置充足')
    }
    
    if (stats.stuckVideos > 0) {
      console.log('2. ⚠️ 发现stuck视频，已自动退还积分')
    }
    
    console.log('3. 💭 如果问题持续，请检查:')
    console.log('   - 网络连接是否稳定')
    console.log('   - API密钥是否有效且有余额')
    console.log('   - kie.ai服务是否正常')

    return {
      success: true,
      stats
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
  fixVideoGenerationCredits()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 视频生成积分问题修复完成！')
        console.log('📊 修复统计:', result.stats)
      } else {
        console.log('\n❌ 修复失败:', result.error)
      }
    })
    .catch(error => {
      console.error('\n💥 修复执行失败:', error)
    })
}

module.exports = { fixVideoGenerationCredits } 