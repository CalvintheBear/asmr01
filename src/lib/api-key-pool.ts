/**
 * API密钥池管理系统
 * 实现多密钥轮询、错误处理、重试机制
 */

interface ApiKeyStatus {
  key: string;
  lastUsed: number;
  errorCount: number;
  isBlocked: boolean;
  blockUntil?: number;
}

class ApiKeyPool {
  private keys: ApiKeyStatus[] = [];
  private currentIndex = 0;
  private readonly maxErrorCount = 3;
  private readonly blockDuration = 5 * 60 * 1000; // 5分钟封禁时间

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys() {
    // 🔑 使用固定的3个Veo3 Fast API密钥
    const apiKeys = [
      '3f06398cf9d8dc02a243f2dd5f2f9489',
      'db092e9551f4631136cab1b141fdfd21',
      '6a77fe3ca6856170f6618d4f249cfc6a'
    ];

    this.keys = apiKeys.map(key => ({
      key,
      lastUsed: 0,
      errorCount: 0,
      isBlocked: false,
    }));

    console.log(`🔑 Veo3 Fast API密钥池初始化完成，共 ${this.keys.length} 个密钥`);
  }

  /**
   * 获取下一个可用的API密钥
   */
  getNextApiKey(): string {
    // 清理过期的封禁状态
    this.cleanupBlockedKeys();

    // 查找可用密钥
    const availableKeys = this.keys.filter(k => !k.isBlocked);
    
    if (availableKeys.length === 0) {
      console.warn('⚠️ 所有API密钥都被封禁，使用第一个密钥作为备用');
      return this.keys[0].key;
    }

    // 轮询策略：选择下一个可用密钥
    let attempts = 0;
    while (attempts < this.keys.length) {
      const keyStatus = this.keys[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      
      if (!keyStatus.isBlocked) {
        keyStatus.lastUsed = Date.now();
        console.log(`🔑 使用API密钥: ${keyStatus.key.substring(0, 10)}...`);
        return keyStatus.key;
      }
      
      attempts++;
    }

    // 备用策略：返回第一个密钥
    const fallbackKey = this.keys[0];
    fallbackKey.lastUsed = Date.now();
    console.log(`🔑 备用策略：使用密钥 ${fallbackKey.key.substring(0, 10)}...`);
    return fallbackKey.key;
  }

  /**
   * 报告API密钥调用成功
   */
  reportSuccess(apiKey: string) {
    const keyStatus = this.keys.find(k => k.key === apiKey);
    if (keyStatus) {
      keyStatus.errorCount = 0; // 重置错误计数
      if (keyStatus.isBlocked) {
        keyStatus.isBlocked = false;
        keyStatus.blockUntil = undefined;
        console.log(`✅ 密钥 ${apiKey.substring(0, 10)}... 恢复正常`);
      }
    }
  }

  /**
   * 报告API密钥调用失败
   */
  reportError(apiKey: string, error: any) {
    const keyStatus = this.keys.find(k => k.key === apiKey);
    if (!keyStatus) return;

    keyStatus.errorCount++;
    console.log(`❌ 密钥 ${apiKey.substring(0, 10)}... 错误计数: ${keyStatus.errorCount}`);

    // 检查是否需要封禁密钥
    if (keyStatus.errorCount >= this.maxErrorCount) {
      keyStatus.isBlocked = true;
      keyStatus.blockUntil = Date.now() + this.blockDuration;
      console.log(`🚫 密钥 ${apiKey.substring(0, 10)}... 被临时封禁 ${this.blockDuration / 1000 / 60} 分钟`);
    }

    // 检查是否是速率限制错误
    if (this.isRateLimitError(error)) {
      console.log(`⏱️ 检测到速率限制错误，延长封禁时间`);
      keyStatus.blockUntil = Date.now() + this.blockDuration * 2; // 双倍封禁时间
    }
  }

  /**
   * 检查是否是速率限制错误
   */
  private isRateLimitError(error: any): boolean {
    const errorStr = String(error).toLowerCase();
    return errorStr.includes('rate limit') || 
           errorStr.includes('too many requests') || 
           errorStr.includes('429');
  }

  /**
   * 清理过期的封禁状态
   */
  private cleanupBlockedKeys() {
    const now = Date.now();
    this.keys.forEach(keyStatus => {
      if (keyStatus.isBlocked && keyStatus.blockUntil && now > keyStatus.blockUntil) {
        keyStatus.isBlocked = false;
        keyStatus.blockUntil = undefined;
        keyStatus.errorCount = 0;
        console.log(`🔓 密钥 ${keyStatus.key.substring(0, 10)}... 封禁解除`);
      }
    });
  }

  /**
   * 获取密钥池状态
   */
  getPoolStatus() {
    return {
      totalKeys: this.keys.length,
      availableKeys: this.keys.filter(k => !k.isBlocked).length,
      blockedKeys: this.keys.filter(k => k.isBlocked).length,
      keys: this.keys.map(k => ({
        key: k.key.substring(0, 10) + '...',
        lastUsed: k.lastUsed,
        errorCount: k.errorCount,
        isBlocked: k.isBlocked,
        blockUntil: k.blockUntil,
      }))
    };
  }

  /**
   * 重置所有密钥状态
   */
  resetAllKeys() {
    this.keys.forEach(keyStatus => {
      keyStatus.errorCount = 0;
      keyStatus.isBlocked = false;
      keyStatus.blockUntil = undefined;
    });
    console.log('🔄 所有API密钥状态已重置');
  }
}

// 创建单例实例
export const apiKeyPool = new ApiKeyPool();

// 导出便捷函数
export function getApiKey(): string {
  return apiKeyPool.getNextApiKey();
}

export function reportApiSuccess(apiKey: string) {
  apiKeyPool.reportSuccess(apiKey);
}

export function reportApiError(apiKey: string, error: any) {
  apiKeyPool.reportError(apiKey, error);
}

export function getApiKeyPoolStatus() {
  return apiKeyPool.getPoolStatus();
} 