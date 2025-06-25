export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 测试webhook收到请求')
    
    // 获取所有请求头
    const headers = Object.fromEntries(request.headers.entries())
    console.log('📝 请求头:', JSON.stringify(headers, null, 2))
    
    // 获取原始body
    const body = await request.text()
    console.log('📦 原始请求体:', body)
    console.log('📏 请求体长度:', body.length)
    
    // 尝试解析为JSON
    let jsonData = null
    try {
      jsonData = JSON.parse(body)
      console.log('✅ JSON解析成功:', JSON.stringify(jsonData, null, 2))
    } catch (e) {
      console.log('❌ JSON解析失败:', e instanceof Error ? e.message : String(e))
      console.log('📄 将作为纯文本处理')
    }
    
    // 记录日志到控制台（Edge Runtime不支持文件系统）
    const logData = {
      timestamp: new Date().toISOString(),
      headers,
      rawBody: body,
      parsedBody: jsonData,
      userAgent: headers['user-agent'] || 'unknown'
    }
    
    console.log('💾 Webhook测试日志:', JSON.stringify(logData, null, 2))
    
    // 检查是否是Creem webhook
    if (headers['user-agent']?.includes('creem') || jsonData?.type?.includes('payment')) {
      console.log('🏪 检测到Creem webhook!')
      console.log('🎯 这可能是真实的支付webhook!')
    }
    
    return NextResponse.json({ 
      message: '测试webhook端点运行正常',
      timestamp: new Date().toISOString(),
      received: {
        headers: Object.keys(headers).length,
        bodyLength: body.length,
        parsed: jsonData ? 'success' : 'failed'
      }
    })
  } catch (error) {
    console.error('💥 Webhook测试失败:', error)
    return NextResponse.json({ 
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '测试webhook端点运行正常',
    timestamp: new Date().toISOString()
  })
} 