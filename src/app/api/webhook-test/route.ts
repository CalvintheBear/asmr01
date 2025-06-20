import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
    
    // 写入日志文件
    const logData = {
      timestamp: new Date().toISOString(),
      headers,
      rawBody: body,
      parsedBody: jsonData,
      userAgent: headers['user-agent'] || 'unknown'
    }
    
    const logFile = path.join(process.cwd(), 'webhook-logs.json')
    const logs = []
    
    // 读取现有日志
    try {
      const existingLogs = fs.readFileSync(logFile, 'utf8')
      logs.push(...JSON.parse(existingLogs))
    } catch (e) {
      // 文件不存在或格式错误，创建新数组
    }
    
    // 添加新日志
    logs.push(logData)
    
    // 保持最新50条记录
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50)
    }
    
    // 写入文件
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2))
    console.log('💾 日志已保存到 webhook-logs.json')
    
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
      error: 'webhook处理失败',
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