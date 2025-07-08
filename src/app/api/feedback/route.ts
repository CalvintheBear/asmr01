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
        { error: '反馈内容不能为空' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: '反馈内容过长，请控制在2000字符以内' },
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
        { error: '发送失败，请稍后重试' },
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
      message: '反馈已成功提交'
    })

  } catch (error) {
    console.error('处理反馈时发生错误:', error)
    return NextResponse.json(
      { error: '系统错误，请稍后重试' },
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
    general: '一般反馈',
    bug: '错误报告',
    feature: '功能建议',
    rating: '产品评价'
  }

  const typeName = typeNames[type as keyof typeof typeNames] || '未知类型'
  
  let subject = `CuttingASMR用户反馈 - ${typeName}`
  if (rating) {
    subject += ` (${rating}星评价)`
  }

  let content = `
CuttingASMR用户反馈报告
========================

反馈类型: ${typeName}
时间: ${new Date().toLocaleString('zh-CN')}

${rating ? `评分: ${rating}/5 星\n` : ''}

反馈内容:
${message}

用户信息:
- 用户ID: ${userId || '匿名用户'}
- 用户名称: ${userInfo?.userName || '未提供'}
- 联系邮箱: ${email || '未提供'}
- 提交时间: ${userInfo?.timestamp || new Date().toISOString()}

技术信息:
- User Agent: ${userInfo?.userAgent || '未知'}
- IP地址: 已隐藏（隐私保护）

---
此邮件由CuttingASMR反馈系统自动发送
请勿直接回复此邮件
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
    // 使用Cloudflare Email Workers API或第三方邮件服务
    // 这里使用简化的API调用示例
    
    const emailPayload = {
      to: 'supportadmin@cuttingasmr.org',
      from: 'noreply@cuttingasmr.org',
      subject: emailData.subject,
      text: emailData.content,
      replyTo: emailData.replyTo
    }

    // 如果配置了邮件服务API密钥，使用真实邮件服务
    const mailAPIKey = process.env.MAIL_API_KEY
    if (mailAPIKey) {
      // 这里可以集成SendGrid、Mailgun、Resend等邮件服务
      // 示例：使用Resend
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
      // 开发环境或未配置邮件服务时，仅记录日志
      console.log('📧 邮件内容（开发模式）:')
      console.log('收件人:', emailPayload.to)
      console.log('主题:', emailPayload.subject)
      console.log('内容:')
      console.log(emailPayload.text)
      console.log('回复地址:', emailPayload.replyTo)
      
      return true // 开发环境总是返回成功
    }

  } catch (error) {
    console.error('发送邮件失败:', error)
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