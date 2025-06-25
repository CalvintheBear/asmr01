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
    // 🔒 从环境变量加载API密钥，优雅回退到原有密钥保证系统可用
    const apiKeys = [
      process.env.VEO3_API_KEY, // 主密钥
      process.env.VEO3_API_KEY_2, // 备用密钥1
      process.env.VEO3_API_KEY_3, // 备用密钥2  
      process.env.VEO3_API_KEY_4, // 备用密钥3
      process.env.VEO3_API_KEY_5, // 备用密钥4
    ].filter(Boolean) as string[]; // 过滤空值
    
    // 如果环境变量中没有API密钥，抛出错误确保安全配置
    if (apiKeys.length === 0) {
      throw new Error(
        '🚨 未在环境变量中找到API密钥！请设置以下环境变量：\n' +
        '  - VEO3_API_KEY (主密钥)\n' +
        '  - VEO3_API_KEY_2 (备用密钥1)\n' +
        '  - VEO3_API_KEY_3 (备用密钥2)\n' +
        '  - VEO3_API_KEY_4 (备用密钥3)\n' +
        '  - VEO3_API_KEY_5 (备用密钥4)\n' +
        '详细配置请参考 ENVIRONMENT_SETUP.md'
      );
    }

    this.keys = apiKeys.map(key => ({
      key,
      lastUsed: 0,
      errorCount: 0,
      isBlocked: false,
    }));

    console.log(`🔑 API密钥池初始化完成，共 ${this.keys.length} 个密钥`);
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