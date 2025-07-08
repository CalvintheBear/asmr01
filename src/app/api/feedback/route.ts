// 在Cloudflare Pages中必须使用Edge Runtime
export const runtime = 'edge'

import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份（可选，允许匿名反馈）
    const { userId } = await auth()
    
    const body = await request.json()
    const { type, message, rating, email, userInfo } = body

    // 基本验证
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feedback content cannot be empty' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Feedback content is too long, please keep it under 2000 characters' },
        { status: 400 }
      )
    }

    // 构建邮件内容
    const emailContent = buildEmailContent({
      type,
      message,
      rating,
      email,
      userInfo,
      userId
    })

    // 发送邮件到企业邮箱
    const emailSent = await sendFeedbackEmail(emailContent)

    if (!emailSent) {
      console.error('邮件发送失败')
      return NextResponse.json(
        { error: 'Failed to send feedback, please try again later' },
        { status: 500 }
      )
    }

    // 记录反馈到审计日志（如果用户已登录）
    if (userId) {
      try {
        await logFeedbackToDatabase({
          userId,
          type,
          message,
          rating,
          email
        })
      } catch (error) {
        console.error('记录反馈到数据库失败:', error)
        // 不影响主流程，仅记录错误
      }
    }

    console.log(`✅ 收到${type}类型反馈，已发送到企业邮箱`)

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully'
    })

  } catch (error) {
    console.error('处理反馈时发生错误:', error)
    return NextResponse.json(
      { error: 'System error, please try again later' },
      { status: 500 }
    )
  }
}

// 构建邮件内容
function buildEmailContent(data: {
  type: string
  message: string
  rating?: number
  email?: string
  userInfo?: any
  userId?: string | null
}) {
  const { type, message, rating, email, userInfo, userId } = data
  
  const typeNames = {
    general: 'General Feedback',
    bug: 'Bug Report',
    feature: 'Feature Request',
    rating: 'Product Rating'
  }

  const typeName = typeNames[type as keyof typeof typeNames] || '未知类型'
  
  let subject = `CuttingASMR User Feedback - ${typeName}`
  if (rating) {
    subject += ` (${rating} Star Rating)`
  }

  let content = `
CuttingASMR User Feedback Report
===============================

Feedback Type: ${typeName}
Date: ${new Date().toLocaleString('en-US')}

${rating ? `Rating: ${rating}/5 Stars\n` : ''}

Feedback Content:
${message}

User Information:
- User ID: ${userId || 'Anonymous User'}
- User Name: ${userInfo?.userName || 'Not provided'}
- Contact Email: ${email || 'Not provided'}
- Submission Time: ${userInfo?.timestamp || new Date().toISOString()}

Technical Information:
- User Agent: ${userInfo?.userAgent || 'Unknown'}
- IP Address: Hidden (Privacy Protection)

---
This email was automatically sent by CuttingASMR feedback system
Please do not reply to this email directly
  `.trim()

  return {
    subject,
    content,
    replyTo: email || undefined
  }
}

// 发送邮件到企业邮箱
async function sendFeedbackEmail(emailData: {
  subject: string
  content: string
  replyTo?: string
}) {
  try {
    const emailPayload = {
      to: 'supportadmin@cuttingasmr.org',
      from: 'noreply@cuttingasmr.org',
      subject: emailData.subject,
      text: emailData.content,
      replyTo: emailData.replyTo
    }

    // 检查邮件服务配置
    const mailAPIKey = process.env.MAIL_API_KEY
    const resendAPIKey = process.env.RESEND_API_KEY
    
    if (resendAPIKey) {
      console.log('🚀 使用Resend发送邮件...')
      // 使用Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendAPIKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'CuttingASMR Feedback <noreply@cuttingasmr.org>',
          to: ['supportadmin@cuttingasmr.org'],
          subject: emailData.subject,
          text: emailData.content,
          reply_to: emailData.replyTo
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Resend邮件发送成功:', result.id)
        return true
      } else {
        const error = await response.text()
        console.error('❌ Resend邮件发送失败:', response.status, error)
        return false
      }
    } else if (mailAPIKey) {
      console.log('🚀 使用通用邮件API发送...')
      // 通用邮件API（如SendGrid等）
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mailAPIKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      })

      return response.ok
    } else {
      // 开发环境或未配置邮件服务时，详细记录日志
      console.log('\n📧 邮件内容（开发模式 - 未配置邮件服务）:')
      console.log('=' .repeat(50))
      console.log('收件人:', emailPayload.to)
      console.log('发件人:', emailPayload.from)
      console.log('主题:', emailPayload.subject)
      console.log('回复地址:', emailPayload.replyTo || '无')
      console.log('内容:')
      console.log('-'.repeat(30))
      console.log(emailPayload.text)
      console.log('=' .repeat(50))
      console.log('\n⚠️  要启用真实邮件发送，请配置以下环境变量之一:')
      console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx  (推荐)')
      console.log('   MAIL_API_KEY=your_api_key')
      console.log('\n📖 配置指南: https://resend.com/docs/introduction')
      
      return true // 开发环境总是返回成功，避免阻塞用户体验
    }

  } catch (error) {
    console.error('💥 发送邮件时发生错误:', error)
    return false
  }
}

// 记录反馈到数据库
async function logFeedbackToDatabase(data: {
  userId: string
  type: string
  message: string
  rating?: number
  email?: string
}) {
  try {
    // 使用数据库连接记录审计日志
    // 注意：在Edge Runtime中，数据库连接需要特别处理
    
    const auditData = {
      userId: data.userId,
      action: 'feedback_submitted',
      details: {
        feedbackType: data.type,
        messageLength: data.message.length,
        hasRating: !!data.rating,
        rating: data.rating,
        hasEmail: !!data.email,
        timestamp: new Date().toISOString()
      },
      ipAddress: '127.0.0.1', // 从request获取真实IP
      userAgent: 'feedback-system'
    }

    // 这里需要导入并使用Prisma客户端
    // 由于Edge Runtime的限制，可能需要使用HTTP API调用
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://cuttingasmr.org'}/api/audit-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'internal-secret'}`
      },
      body: JSON.stringify(auditData)
    })

    if (!response.ok) {
      throw new Error(`审计日志记录失败: ${response.status}`)
    }

    console.log('✅ 反馈已记录到审计日志')

  } catch (error) {
    console.error('记录审计日志失败:', error)
    throw error
  }
} 