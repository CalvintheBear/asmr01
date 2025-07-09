import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST() {
  try {
    const { userId: clerkUserId } = await auth()
    
    // 先检查认证状态
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 尝试获取用户信息，处理速率限制
    let user
    try {
      user = await currentUser()
    } catch (clerkError: any) {
      // 检查是否是速率限制错误
      if (clerkError?.status === 429 || clerkError?.clerkError) {
        console.log('⚠️ Clerk API速率限制:', clerkError)
        return NextResponse.json({ 
          error: 'API rate limit exceeded, please try again later',
          retryAfter: clerkError?.retryAfter || 30
        }, { status: 429 })
      }
      throw clerkError
    }

    if (!user) {
      return NextResponse.json({ error: 'Unable to get user information' }, { status: 401 })
    }

    console.log('🔄 开始用户数据同步...')
    console.log('👤 Clerk用户ID:', clerkUserId)

    const userData = {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      fullName: user.fullName || ''
    }

    console.log('👤 用户信息:', userData)
    console.log('💾 开始数据库操作...')

    // 同步用户信息到数据库 - 使用简化的User模型
    const syncedUser = await db.user.upsert({
      where: {
        clerkUserId: clerkUserId
      },
      update: {
        // 只更新Google数据，保护业务数据
        googleFullName: userData.fullName,
        lastLoginAt: new Date()
      },
      create: {
        clerkUserId: clerkUserId,
        email: userData.email,
        googleFullName: userData.fullName,
        totalCredits: 18, // 新用户默认18积分
        usedCredits: 0,
        isActive: true,
        googleVerifiedAt: new Date(),
        lastLoginAt: new Date()
      }
    })

    // 记录审计日志
    await db.auditLog.create({
      data: {
        userId: syncedUser.id,
        action: 'user_sync',
        details: {
          clerkUserId,
          email: userData.email,
          fullName: userData.fullName,
          isNewUser: !syncedUser.updatedAt
        },
        ipAddress: '::1',
        userAgent: 'server-sync'
      }
    })

    console.log('✅ 用户数据已同步:', {
      id: syncedUser.id,
      email: syncedUser.email,
      totalCredits: syncedUser.totalCredits,
      usedCredits: syncedUser.usedCredits
    })
    console.log('✅ 审计日志已记录')
    console.log('🎉 用户数据同步完成')

    return NextResponse.json({
      success: true,
      user: {
        id: syncedUser.id,
        email: syncedUser.email,
        clerkUserId: syncedUser.clerkUserId,
        totalCredits: syncedUser.totalCredits,
        usedCredits: syncedUser.usedCredits,
        remainingCredits: syncedUser.totalCredits - syncedUser.usedCredits
      }
    })

  } catch (error) {
    console.error('💥 用户同步失败:', error)
    return NextResponse.json({ 
      error: 'User synchronization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📖 获取用户信息...')
    console.log('🔍 查询用户:', clerkUserId)

    // 🔥 改进: 添加邮箱备用匹配机制
    let user = null
    let matchMethod = 'clerk_id'

    // 首先尝试通过Clerk ID查找
    user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        videos: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      console.log('⚠️ 通过Clerk ID未找到用户，尝试获取用户邮箱进行备用匹配...')
      
      // 如果找不到，尝试通过当前用户邮箱查找
      try {
        const currentUserInfo = await currentUser()
        const userEmail = currentUserInfo?.primaryEmailAddress?.emailAddress
        
        if (userEmail) {
          console.log('🔍 通过邮箱查找用户:', userEmail)
          
          user = await db.user.findUnique({
            where: { email: userEmail },
            include: {
              videos: {
                select: { id: true }
              }
            }
          })

          if (user) {
            matchMethod = 'email'
            console.log('✅ 通过邮箱找到用户，正在更新Clerk ID...')
            
            // 更新用户的Clerk ID
            user = await db.user.update({
              where: { id: user.id },
              data: { 
                clerkUserId: clerkUserId,
                lastLoginAt: new Date()
              },
              include: {
                videos: {
                  select: { id: true }
                }
              }
            })

            // 记录Clerk ID更新日志
            await db.auditLog.create({
              data: {
                userId: user.id,
                action: 'clerk_id_updated',
                details: {
                  oldClerkId: 'not_found',
                  newClerkId: clerkUserId,
                  email: userEmail,
                  matchMethod: 'email',
                  reason: 'automatic_clerk_id_sync'
                },
                ipAddress: '::1',
                userAgent: 'server-sync'
              }
            })

            console.log('✅ Clerk ID已更新并记录审计日志')
          }
        }
      } catch (clerkError) {
        console.error('⚠️ 获取当前用户邮箱失败:', clerkError)
      }
    }

    if (!user) {
      console.log('❌ 通过Clerk ID和邮箱都未找到用户')
      
      // 记录查找失败的审计日志
      await db.auditLog.create({
        data: {
          action: 'user_lookup_failed',
          details: {
            clerkUserId: clerkUserId,
            searchMethods: ['clerk_id', 'email'],
            timestamp: new Date().toISOString(),
            suggestion: 'User may need to re-register or data may be inconsistent'
          },
          ipAddress: '::1',
          userAgent: 'server-sync'
        }
      })

      return NextResponse.json({ 
        error: 'User not found',
        details: 'Unable to find user by Clerk ID or email. Please try logging out and logging back in.',
        clerkUserId: clerkUserId
      }, { status: 404 })
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      videosCount: user.videos.length,
      totalCredits: user.totalCredits,
      usedCredits: user.usedCredits,
      remainingCredits: user.totalCredits - user.usedCredits,
      matchMethod: matchMethod
    }

    console.log('✅ 用户信息获取成功:', userInfo)

    return NextResponse.json({
      success: true,
      user: userInfo
    })

  } catch (error) {
    console.error('💥 获取用户信息失败:', error)
    
    // 记录详细错误日志
    try {
      await db.auditLog.create({
        data: {
          action: 'user_sync_error',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
          },
          ipAddress: '::1',
          userAgent: 'server-sync'
        }
      })
    } catch (logError) {
      console.error('⚠️ 记录错误日志失败:', logError)
    }

    return NextResponse.json({ 
      error: 'Failed to get user information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 