/**
 * 🔒 API速率限制工具
 * 防止API被恶意频繁调用
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  
  /**
   * 检查是否允许请求
   * @param identifier 标识符(IP地址、用户ID等)
   * @param limit 时间窗口内最大请求数
   * @param windowMs 时间窗口(毫秒)
   * @returns 是否允许请求
   */
  isAllowed(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);
    
    // 如果没有记录或已过期，创建新记录
    if (!entry || now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    // 检查是否超过限制
    if (entry.count >= limit) {
      return false;
    }
    
    // 增加计数
    entry.count++;
    return true;
  }
  
  /**
   * 获取剩余请求次数
   */
  getRemaining(identifier: string, limit: number = 10): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return limit;
    }
    return Math.max(0, limit - entry.count);
  }
  
  /**
   * 获取重置时间
   */
  getResetTime(identifier: string): number | null {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }
    return entry.resetTime;
  }
  
  /**
   * 清理过期记录
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// 全局实例
const globalRateLimiter = new RateLimiter();

// 定期清理过期记录
if (typeof global !== 'undefined') {
  setInterval(() => {
    globalRateLimiter.cleanup();
  }, 5 * 60 * 1000); // 每5分钟清理一次
}

export { globalRateLimiter as rateLimiter };

/**
 * 获取客户端IP地址
 */
export function getClientIP(request: Request): string {
  // 尝试从各种header获取真实IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const connectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (connectingIP) {
    return connectingIP.trim();
  }
  
  return 'unknown';
}

/**
 * 预定义的速率限制配置
 */
export const RATE_LIMITS = {
  // 视频生成 - 每用户每10分钟5次 (更合理，适合正常用户使用)
  VIDEO_GENERATION: { limit: 5, windowMs: 10 * 60 * 1000 },
  
  // 积分查询 - 每用户每分钟50次 (用户可能频繁查看积分)
  CREDITS_CHECK: { limit: 50, windowMs: 60 * 1000 },
  
  // 用户同步 - 每用户每分钟10次 (登录时可能需要多次同步)
  USER_SYNC: { limit: 10, windowMs: 60 * 1000 },
  
  // 管理API - 每用户每分钟5次 (仅限管理员使用)
  ADMIN_API: { limit: 5, windowMs: 60 * 1000 }
};

/**
 * 创建速率限制响应
 */
export function createRateLimitResponse(identifier: string, limit: number) {
  const remaining = globalRateLimiter.getRemaining(identifier, limit);
  const resetTime = globalRateLimiter.getResetTime(identifier);
  
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Too many requests, please try again later',
      retryAfter: resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime ? resetTime.toString() : '',
        'Retry-After': resetTime ? Math.ceil((resetTime - Date.now()) / 1000).toString() : '60'
      }
    }
  );
} 