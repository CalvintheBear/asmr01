import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getApiKeyPoolStatus } from '@/lib/api-key-pool';
import { rateLimiter, getClientIP, RATE_LIMITS, createRateLimitResponse } from '@/lib/rate-limiter';

export async function GET(request: NextRequest) {
  try {
    // 🔒 安全检查: 仅允许管理员访问
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 🔒 速率限制检查 - 基于用户而非IP
    const userIdentifier = `admin-api:${userId}`;
    
    if (!rateLimiter.isAllowed(userIdentifier, RATE_LIMITS.ADMIN_API.limit, RATE_LIMITS.ADMIN_API.windowMs)) {
      console.log(`🚫 用户 ${userId} 管理API访问频率过高`);
      return createRateLimitResponse(userIdentifier, RATE_LIMITS.ADMIN_API.limit);
    }
    
    // 🔒 额外安全检查: 可以在这里添加管理员白名单验证
    // const adminEmails = ['admin@cuttingasmr.org'];
    // if (!adminEmails.includes(userEmail)) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }
    
    const poolStatus = getApiKeyPoolStatus();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      pool: poolStatus,
      summary: {
        total: poolStatus.totalKeys,
        available: poolStatus.availableKeys,
        blocked: poolStatus.blockedKeys,
        healthRatio: poolStatus.availableKeys / poolStatus.totalKeys
      }
    });
  } catch (error) {
    console.error('获取API密钥池状态失败:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get status' 
      },
      { status: 500 }
    );
  }
} 