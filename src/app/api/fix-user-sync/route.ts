import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

// 修复用户同步问题
export async function POST() {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unable to get user information' }, { status: 401 })
    }

    const userEmail = user.primaryEmailAddress?.emailAddress
    if (!userEmail) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    console.log('🔧 修复用户同步问题...')
    console.log('📧 当前用户邮箱:', userEmail)
    console.log('🆔 当前Clerk ID:', clerkUserId)

    // 1. 检查是否已有正确的记录
    const existingByClerkId = await db.user.findUnique({
      where: { clerkUserId }
    })

    if (existingByClerkId) {
      console.log('✅ 通过Clerk ID找到用户，同步正常')
      return NextResponse.json({
        success: true,
        message: 'User sync is already correct',
        user: {
          id: existingByClerkId.id,
          email: existingByClerkId.email,
          clerkUserId: existingByClerkId.clerkUserId,
          totalCredits: existingByClerkId.totalCredits,
          usedCredits: existingByClerkId.usedCredits,
          remainingCredits: existingByClerkId.totalCredits - existingByClerkId.usedCredits
        }
      })
    }

    // 2. 通过邮箱查找现有记录
    const existingByEmail = await db.user.findUnique({
      where: { email: userEmail }
    })

    let syncedUser

    if (existingByEmail) {
      console.log('🔄 找到邮箱记录，更新Clerk ID...')
      // 更新现有记录的Clerk ID
      syncedUser = await db.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkUserId: clerkUserId,
          googleFullName: user.fullName || existingByEmail.googleFullName,
          lastLoginAt: new Date()
        }
      })

      // 记录修复日志
      await db.auditLog.create({
        data: {
          userId: syncedUser.id,
          action: 'clerk_id_fixed',
          details: {
            oldClerkId: existingByEmail.clerkUserId,
            newClerkId: clerkUserId,
            email: userEmail,
            fixMethod: 'email_match_update'
          },
          ipAddress: '::1',
          userAgent: 'manual-fix'
        }
      })

      console.log('✅ Clerk ID修复成功')

    } else {
      console.log('📝 创建新用户记录...')
      // 创建新记录
      syncedUser = await db.user.create({
        data: {
          clerkUserId: clerkUserId,
          email: userEmail,
          googleFullName: user.fullName || '',
          totalCredits: 8, // 新用户默认8积分
          usedCredits: 0,
          isActive: true,
          googleVerifiedAt: new Date(),
          lastLoginAt: new Date()
        }
      })

      // 记录创建日志
      await db.auditLog.create({
        data: {
          userId: syncedUser.id,
          action: 'user_created_manual_fix',
          details: {
            clerkUserId,
            email: userEmail,
            fullName: user.fullName,
            initialCredits: 8
          },
          ipAddress: '::1',
          userAgent: 'manual-fix'
        }
      })

      console.log('✅ 新用户创建成功')
    }

    return NextResponse.json({
      success: true,
      message: 'User sync fixed successfully',
      action: existingByEmail ? 'updated' : 'created',
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
    console.error('💥 修复失败:', error)
    return NextResponse.json({ 
      error: 'Fix failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 