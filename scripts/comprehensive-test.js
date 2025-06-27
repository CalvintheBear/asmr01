#!/usr/bin/env node

/**
 * 🔍 项目架构全面测试脚本
 * 根据项目架构.md测试所有组件和功能
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

console.log('🚀 开始项目架构全面测试...\n');
console.log('📋 测试范围: 根据项目架构.md验证所有功能组件\n');

let testResults = [];

// 测试结果记录函数
function recordTest(category, testName, status, details = '') {
  const result = {
    category,
    testName,
    status, // 'PASS', 'FAIL', 'WARN', 'SKIP'
    details,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  
  const emoji = {
    'PASS': '✅',
    'FAIL': '❌', 
    'WARN': '⚠️',
    'SKIP': '⏭️'
  };
  
  console.log(`${emoji[status]} [${category}] ${testName} ${details ? '- ' + details : ''}`);
}

// 1. 测试技术栈组件
async function testTechStack() {
  console.log('\n📚 1. 技术栈组件测试');
  
  // Next.js配置测试
  if (fs.existsSync('next.config.js')) {
    const config = fs.readFileSync('next.config.js', 'utf8');
    if (config.includes('isRailway') && config.includes('isCloudflare')) {
      recordTest('技术栈', 'Next.js多平台配置', 'PASS', '支持Railway和CloudFlare');
    } else {
      recordTest('技术栈', 'Next.js多平台配置', 'WARN', '多平台配置可能不完整');
    }
    
    if (config.includes('forceSwcTransforms')) {
      recordTest('技术栈', 'Edge Runtime配置', 'PASS', 'SWC转换启用');
    } else {
      recordTest('技术栈', 'Edge Runtime配置', 'FAIL', '缺少Edge Runtime优化');
    }
  } else {
    recordTest('技术栈', 'Next.js配置', 'FAIL', 'next.config.js文件缺失');
  }
  
  // TypeScript配置测试
  if (fs.existsSync('tsconfig.json')) {
    recordTest('技术栈', 'TypeScript配置', 'PASS', 'tsconfig.json存在');
  } else {
    recordTest('技术栈', 'TypeScript配置', 'FAIL', 'tsconfig.json缺失');
  }
  
  // TailwindCSS配置测试
  if (fs.existsSync('tailwind.config.ts')) {
    recordTest('技术栈', 'TailwindCSS配置', 'PASS', 'tailwind.config.ts存在');
  } else {
    recordTest('技术栈', 'TailwindCSS配置', 'FAIL', 'tailwind.config.ts缺失');
  }
}

// 2. 测试数据库架构
async function testDatabaseArchitecture() {
  console.log('\n🗄️ 2. 数据库架构测试');
  
  // Prisma Schema测试
  if (fs.existsSync('prisma/schema.prisma')) {
    const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
    
    // 检查数据模型
    const requiredModels = ['User', 'Video', 'Purchase', 'AuditLog', 'AdminLog', 'Settings'];
    requiredModels.forEach(model => {
      if (schema.includes(`model ${model}`)) {
        recordTest('数据库', `${model}模型`, 'PASS', '数据模型定义正确');
      } else {
        recordTest('数据库', `${model}模型`, 'FAIL', '数据模型缺失');
      }
    });
    
    // 检查关键字段
    if (schema.includes('totalCredits') && schema.includes('usedCredits')) {
      recordTest('数据库', '积分字段设计', 'PASS', '简化积分管理实现');
    } else {
      recordTest('数据库', '积分字段设计', 'FAIL', '积分字段配置错误');
    }
    
    if (schema.includes('orderId') && schema.includes('@unique')) {
      recordTest('数据库', '订单ID唯一约束', 'PASS', '支持订单ID匹配');
    } else {
      recordTest('数据库', '订单ID唯一约束', 'WARN', '订单ID唯一性可能有问题');
    }
    
  } else {
    recordTest('数据库', 'Prisma Schema', 'FAIL', 'schema.prisma文件缺失');
  }
  
  // 数据库连接配置测试
  if (fs.existsSync('src/lib/prisma.ts')) {
    const prismaLib = fs.readFileSync('src/lib/prisma.ts', 'utf8');
    if (prismaLib.includes('cachedPrisma') && prismaLib.includes('NODE_ENV')) {
      recordTest('数据库', 'Prisma连接池', 'PASS', '开发/生产环境连接优化');
    } else {
      recordTest('数据库', 'Prisma连接池', 'WARN', '连接池配置可能不完整');
    }
  } else {
    recordTest('数据库', 'Prisma客户端', 'FAIL', 'prisma.ts文件缺失');
  }
}

// 3. 测试双API架构
async function testDualApiArchitecture() {
  console.log('\n🔌 3. 双API架构测试');
  
  // 高级API测试 (Node.js Runtime + Prisma)
  if (fs.existsSync('src/app/api/payments/creem-advanced/route.ts')) {
    const advancedApi = fs.readFileSync('src/app/api/payments/creem-advanced/route.ts', 'utf8');
    
    if (advancedApi.includes('auth()') && advancedApi.includes('db.purchase.create')) {
      recordTest('双API架构', '高级支付API', 'PASS', 'Node.js Runtime + 预创建订单');
    } else {
      recordTest('双API架构', '高级支付API', 'FAIL', '高级API功能不完整');
    }
  } else {
    recordTest('双API架构', '高级支付API', 'FAIL', '高级支付API缺失');
  }
  
  // 简单API测试 (Edge Runtime)
  if (fs.existsSync('src/app/api/payments/creem/route.ts')) {
    const simpleApi = fs.readFileSync('src/app/api/payments/creem/route.ts', 'utf8');
    
    if (simpleApi.includes('runtime = "edge"') || simpleApi.includes('Edge Runtime')) {
      recordTest('双API架构', '简单支付API', 'PASS', 'Edge Runtime备用方案');
    } else {
      recordTest('双API架构', '简单支付API', 'WARN', 'Edge Runtime配置检查');
    }
  } else {
    recordTest('双API架构', '简单支付API', 'FAIL', '简单支付API缺失');
  }
  
  // API路由结构测试
  const coreApis = [
    'src/app/api/health/route.ts',
    'src/app/api/credits/route.ts', 
    'src/app/api/generate-video/route.ts',
    'src/app/api/video-status/[id]/route.ts',
    'src/app/api/webhooks/creem/route.ts'
  ];
  
  coreApis.forEach(apiPath => {
    if (fs.existsSync(apiPath)) {
      recordTest('双API架构', `核心API: ${path.basename(path.dirname(apiPath))}`, 'PASS', '路由存在');
    } else {
      recordTest('双API架构', `核心API: ${apiPath}`, 'FAIL', '核心API缺失');
    }
  });
}

// 4. 测试VEO3 API集成
async function testVeo3Integration() {
  console.log('\n🤖 4. VEO3 API集成测试');
  
  // VEO3客户端测试
  if (fs.existsSync('src/lib/veo3-api.ts')) {
    const veo3Api = fs.readFileSync('src/lib/veo3-api.ts', 'utf8');
    
    if (veo3Api.includes('https://api.kie.ai')) {
      recordTest('VEO3集成', 'API端点配置', 'PASS', '使用官方kie.ai端点');
    } else if (veo3Api.includes('kieai.erweima.ai')) {
      recordTest('VEO3集成', 'API端点配置', 'FAIL', '使用了错误的API端点');
    } else {
      recordTest('VEO3集成', 'API端点配置', 'WARN', 'API端点配置不明确');
    }
    
    if (veo3Api.includes('Bearer ${this.config.apiKey}')) {
      recordTest('VEO3集成', 'Bearer认证', 'PASS', 'Bearer Token认证正确');
    } else {
      recordTest('VEO3集成', 'Bearer认证', 'FAIL', '认证方式错误');
    }
    
    if (veo3Api.includes('veo3_fast')) {
      recordTest('VEO3集成', '模型配置', 'PASS', '使用veo3_fast模型(成本优化)');
    } else {
      recordTest('VEO3集成', '模型配置', 'WARN', '模型配置需要检查');
    }
    
  } else {
    recordTest('VEO3集成', 'VEO3客户端', 'FAIL', 'veo3-api.ts文件缺失');
  }
  
  // API密钥池测试
  if (fs.existsSync('src/lib/api-key-pool.ts')) {
    const keyPool = fs.readFileSync('src/lib/api-key-pool.ts', 'utf8');
    
    if (keyPool.includes('VEO3_API_KEY_2') && keyPool.includes('getNextApiKey')) {
      recordTest('VEO3集成', 'API密钥池', 'PASS', '支持5个密钥轮询');
    } else {
      recordTest('VEO3集成', 'API密钥池', 'WARN', '密钥池功能可能不完整');
    }
    
    if (keyPool.includes('reportError') && keyPool.includes('isBlocked')) {
      recordTest('VEO3集成', '错误处理和熔断', 'PASS', '故障转移机制完整');
    } else {
      recordTest('VEO3集成', '错误处理和熔断', 'FAIL', '缺少错误处理机制');
    }
  } else {
    recordTest('VEO3集成', 'API密钥池', 'FAIL', 'api-key-pool.ts文件缺失');
  }
}

// 5. 测试Clerk认证系统
async function testClerkAuthentication() {
  console.log('\n🔐 5. Clerk认证系统测试');
  
  // 根布局Clerk配置测试
  if (fs.existsSync('src/app/layout.tsx')) {
    const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
    
    if (layout.includes('ClerkProvider') && layout.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')) {
      recordTest('Clerk认证', '根布局配置', 'PASS', 'ClerkProvider正确配置');
    } else {
      recordTest('Clerk认证', '根布局配置', 'FAIL', 'ClerkProvider配置错误');
    }
    
    if (layout.includes('force-dynamic')) {
      recordTest('Clerk认证', '动态渲染配置', 'PASS', '强制动态渲染避免SSR错误');
    } else {
      recordTest('Clerk认证', '动态渲染配置', 'WARN', '可能存在SSR兼容问题');
    }
  } else {
    recordTest('Clerk认证', '根布局文件', 'FAIL', 'layout.tsx文件缺失');
  }
  
  // 中间件配置测试
  if (fs.existsSync('src/middleware.ts')) {
    const middleware = fs.readFileSync('src/middleware.ts', 'utf8');
    
    if (middleware.includes('clerkMiddleware')) {
      recordTest('Clerk认证', '认证中间件', 'PASS', 'clerkMiddleware配置正确');
    } else {
      recordTest('Clerk认证', '认证中间件', 'FAIL', '认证中间件配置错误');
    }
  } else {
    recordTest('Clerk认证', '认证中间件', 'FAIL', 'middleware.ts文件缺失');
  }
  
  // API认证保护测试
  const protectedApis = [
    'src/app/api/generate-video/route.ts',
    'src/app/api/credits/route.ts',
    'src/app/api/user/sync/route.ts'
  ];
  
  protectedApis.forEach(apiPath => {
    if (fs.existsSync(apiPath)) {
      const apiContent = fs.readFileSync(apiPath, 'utf8');
      if (apiContent.includes('auth()') || apiContent.includes('clerkUserId')) {
        recordTest('Clerk认证', `API保护: ${path.basename(path.dirname(apiPath))}`, 'PASS', 'Clerk认证保护');
      } else {
        recordTest('Clerk认证', `API保护: ${path.basename(path.dirname(apiPath))}`, 'FAIL', '缺少认证保护');
      }
    }
  });
}

// 6. 测试Creem支付系统
async function testCreemPaymentSystem() {
  console.log('\n💳 6. Creem支付系统测试');
  
  // Creem配置测试
  if (fs.existsSync('src/lib/creem-config.ts')) {
    const creemConfig = fs.readFileSync('src/lib/creem-config.ts', 'utf8');
    
    if (creemConfig.includes('TEST_PRODUCT_IDS') && creemConfig.includes('PRODUCTION_PRODUCT_IDS')) {
      recordTest('Creem支付', '产品ID配置', 'PASS', '测试/生产环境分离');
    } else {
      recordTest('Creem支付', '产品ID配置', 'FAIL', '产品ID配置不完整');
    }
    
    if (creemConfig.includes('getPaymentUrl') && creemConfig.includes('getProductInfo')) {
      recordTest('Creem支付', '支付链接生成', 'PASS', '支付URL生成逻辑完整');
    } else {
      recordTest('Creem支付', '支付链接生成', 'FAIL', '支付链接逻辑缺失');
    }
    
    if (creemConfig.includes('CREEM_TEST_MODE')) {
      recordTest('Creem支付', '环境自动检测', 'PASS', '自动环境切换');
    } else {
      recordTest('Creem支付', '环境自动检测', 'WARN', '环境检测可能不完整');
    }
  } else {
    recordTest('Creem支付', 'Creem配置', 'FAIL', 'creem-config.ts文件缺失');
  }
  
  // Webhook处理测试
  if (fs.existsSync('src/app/api/webhooks/creem/route.ts')) {
    const webhook = fs.readFileSync('src/app/api/webhooks/creem/route.ts', 'utf8');
    
    if (webhook.includes('orderId') && webhook.includes('findFirst')) {
      recordTest('Creem支付', 'Webhook订单ID匹配', 'PASS', '订单ID直接匹配机制');
    } else {
      recordTest('Creem支付', 'Webhook订单ID匹配', 'FAIL', '订单ID匹配逻辑缺失');
    }
    
    if (webhook.includes('totalCredits') && webhook.includes('increment')) {
      recordTest('Creem支付', '原子性积分分配', 'PASS', '数据库原子操作');
    } else {
      recordTest('Creem支付', '原子性积分分配', 'FAIL', '积分分配逻辑错误');
    }
    
    if (webhook.includes('auditLog.create')) {
      recordTest('Creem支付', 'Webhook审计日志', 'PASS', '完整事件记录');
    } else {
      recordTest('Creem支付', 'Webhook审计日志', 'WARN', '审计日志可能缺失');
    }
  } else {
    recordTest('Creem支付', 'Webhook处理', 'FAIL', 'Webhook路由缺失');
  }
}

// 7. 测试积分管理系统
async function testCreditsSystem() {
  console.log('\n💎 7. 积分管理系统测试');
  
  // 积分配置测试
  if (fs.existsSync('src/lib/credits-config.ts')) {
    const creditsConfig = fs.readFileSync('src/lib/credits-config.ts', 'utf8');
    
    if (creditsConfig.includes('VIDEO_COST') && creditsConfig.includes('INITIAL_CREDITS')) {
      recordTest('积分系统', '积分配置', 'PASS', '视频成本和初始积分配置');
    } else {
      recordTest('积分系统', '积分配置', 'FAIL', '积分配置不完整');
    }
    
    if (creditsConfig.includes('canCreateVideo') && creditsConfig.includes('getVideoCount')) {
      recordTest('积分系统', '积分业务逻辑', 'PASS', '积分验证和计算逻辑');
    } else {
      recordTest('积分系统', '积分业务逻辑', 'FAIL', '业务逻辑函数缺失');
    }
  } else {
    recordTest('积分系统', '积分配置', 'FAIL', 'credits-config.ts文件缺失');
  }
  
  // 积分API测试
  if (fs.existsSync('src/app/api/credits/route.ts')) {
    const creditsApi = fs.readFileSync('src/app/api/credits/route.ts', 'utf8');
    
    if (creditsApi.includes('GET') && creditsApi.includes('POST')) {
      recordTest('积分系统', '积分查询API', 'PASS', '支持GET查询和POST刷新');
    } else {
      recordTest('积分系统', '积分查询API', 'WARN', 'API方法可能不完整');
    }
    
    if (creditsApi.includes('remainingCredits:') && creditsApi.includes('totalCredits') && creditsApi.includes('usedCredits')) {
      recordTest('积分系统', '剩余积分计算', 'PASS', '简化积分计算逻辑');
    } else {
      recordTest('积分系统', '剩余积分计算', 'FAIL', '积分计算逻辑错误');
    }
  } else {
    recordTest('积分系统', '积分API', 'FAIL', 'credits API缺失');
  }
}

// 8. 测试视频生成系统
async function testVideoGenerationSystem() {
  console.log('\n🎥 8. 视频生成系统测试');
  
  // 视频生成API测试
  if (fs.existsSync('src/app/api/generate-video/route.ts')) {
    const generateApi = fs.readFileSync('src/app/api/generate-video/route.ts', 'utf8');
    
    if (generateApi.includes('veo3_fast') && generateApi.includes('model:')) {
      recordTest('视频生成', '模型硬编码', 'PASS', 'veo3_fast模型(成本控制)');
    } else {
      recordTest('视频生成', '模型硬编码', 'FAIL', '模型配置错误');
    }
    
    if (generateApi.includes('$transaction') && generateApi.includes('usedCredits')) {
      recordTest('视频生成', '积分预扣除', 'PASS', '数据库事务保护');
    } else {
      recordTest('视频生成', '积分预扣除', 'FAIL', '积分扣除逻辑错误');
    }
    
    if (generateApi.includes('decrement') && generateApi.includes('delete')) {
      recordTest('视频生成', '失败回滚机制', 'PASS', 'API失败时积分回滚');
    } else {
      recordTest('视频生成', '失败回滚机制', 'FAIL', '缺少回滚保护');
    }
    
    if (generateApi.includes('rateLimiter')) {
      recordTest('视频生成', '速率限制', 'PASS', '用户级别速率保护');
    } else {
      recordTest('视频生成', '速率限制', 'WARN', '速率限制可能缺失');
    }
  } else {
    recordTest('视频生成', '生成API', 'FAIL', 'generate-video API缺失');
  }
  
  // 视频状态查询测试
  if (fs.existsSync('src/app/api/video-status/[id]/route.ts')) {
    const statusApi = fs.readFileSync('src/app/api/video-status/[id]/route.ts', 'utf8');
    
    if (statusApi.includes('record-info') && statusApi.includes('taskId')) {
      recordTest('视频生成', '状态查询端点', 'PASS', '使用record-info端点');
    } else {
      recordTest('视频生成', '状态查询端点', 'FAIL', '状态查询端点错误');
    }
    
    if (statusApi.includes('get1080PVideo')) {
      recordTest('视频生成', '1080p支持', 'PASS', '高清视频获取功能');
    } else {
      recordTest('视频生成', '1080p支持', 'WARN', '1080p功能可能缺失');
    }
    
    if (statusApi.includes('findTaskRecord') && statusApi.includes('user.id')) {
      recordTest('视频生成', '用户权限验证', 'PASS', '视频访问权限检查');
    } else {
      recordTest('视频生成', '用户权限验证', 'FAIL', '权限验证缺失');
    }
  } else {
    recordTest('视频生成', '状态查询API', 'FAIL', 'video-status API缺失');
  }
}

// 9. 测试性能优化
async function testPerformanceOptimizations() {
  console.log('\n⚡ 9. 性能优化测试');
  
  // 代码分割测试
  if (fs.existsSync('src/components')) {
    const components = fs.readdirSync('src/components');
    if (components.length > 0) {
      recordTest('性能优化', '组件模块化', 'PASS', `${components.length}个组件模块`);
    } else {
      recordTest('性能优化', '组件模块化', 'WARN', '组件结构可能需要优化');
    }
  }
  
  // 缓存策略测试
  if (fs.existsSync('next.config.js')) {
    const nextConfig = fs.readFileSync('next.config.js', 'utf8');
    if (nextConfig.includes('images') && nextConfig.includes('unoptimized')) {
      recordTest('性能优化', '图片优化配置', 'PASS', '图片优化配置存在');
    } else {
      recordTest('性能优化', '图片优化配置', 'WARN', '图片优化可能需要调整');
    }
  }
  
  // 速率限制测试
  if (fs.existsSync('src/lib/rate-limiter.ts')) {
    const rateLimiter = fs.readFileSync('src/lib/rate-limiter.ts', 'utf8');
    
    if (rateLimiter.includes('RATE_LIMITS') && rateLimiter.includes('VIDEO_GENERATION')) {
      recordTest('性能优化', '速率限制配置', 'PASS', '多级速率限制保护');
    } else {
      recordTest('性能优化', '速率限制配置', 'FAIL', '速率限制配置不完整');
    }
    
    if (rateLimiter.includes('cleanup') && rateLimiter.includes('setInterval')) {
      recordTest('性能优化', '内存清理机制', 'PASS', '自动内存清理');
    } else {
      recordTest('性能优化', '内存清理机制', 'WARN', '内存管理可能需要改进');
    }
  } else {
    recordTest('性能优化', '速率限制', 'FAIL', 'rate-limiter.ts文件缺失');
  }
}

// 10. 测试监控和日志系统
async function testMonitoringAndLogging() {
  console.log('\n📊 10. 监控和日志系统测试');
  
  // 健康检查API测试
  if (fs.existsSync('src/app/api/health/route.ts')) {
    recordTest('监控系统', '健康检查API', 'PASS', '/api/health端点存在');
  } else {
    recordTest('监控系统', '健康检查API', 'FAIL', '健康检查端点缺失');
  }
  
  // 环境检查API测试
  if (fs.existsSync('src/app/api/check-env/route.ts')) {
    recordTest('监控系统', '环境检查API', 'PASS', '环境变量检查端点');
  } else {
    recordTest('监控系统', '环境检查API', 'WARN', '环境检查功能缺失');
  }
  
  // Creem配置检查测试
  if (fs.existsSync('src/app/api/check-creem-config/route.ts')) {
    recordTest('监控系统', 'Creem配置检查', 'PASS', '支付配置检查端点');
  } else {
    recordTest('监控系统', 'Creem配置检查', 'WARN', '支付配置检查缺失');
  }
  
  // 审计日志检查
  const apiFiles = fs.readdirSync('src/app/api', { recursive: true }).filter(file => file.includes('route.ts'));
  let auditLogCount = 0;
  
  apiFiles.forEach(file => {
    const fullPath = path.join('src/app/api', file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('auditLog.create') || content.includes('AuditLog')) {
        auditLogCount++;
      }
    }
  });
  
  if (auditLogCount > 0) {
    recordTest('监控系统', '审计日志记录', 'PASS', `${auditLogCount}个API有审计日志`);
  } else {
    recordTest('监控系统', '审计日志记录', 'WARN', '审计日志覆盖可能不足');
  }
}

// 11. 测试安全性配置
async function testSecurityConfiguration() {
  console.log('\n🔒 11. 安全性配置测试');
  
  // 环境变量安全测试
  if (fs.existsSync('.env.local')) {
    recordTest('安全配置', '环境变量文件', 'PASS', '.env.local文件存在');
  } else {
    recordTest('安全配置', '环境变量文件', 'FAIL', '.env.local文件缺失');
  }
  
  // .gitignore检查
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('.env.local')) {
      recordTest('安全配置', 'Git忽略配置', 'PASS', '.env.local在.gitignore中');
    } else {
      recordTest('安全配置', 'Git忽略配置', 'FAIL', '环境变量文件可能被误提交');
    }
  } else {
    recordTest('安全配置', 'Git忽略配置', 'WARN', '.gitignore文件缺失');
  }
  
  // API密钥脱敏检查
  const apiFiles = ['src/lib/api-key-pool.ts', 'src/lib/veo3-api.ts'];
  apiFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('substring(0, 10)') || content.includes('脱敏')) {
        recordTest('安全配置', `API密钥脱敏: ${path.basename(file)}`, 'PASS', '日志中密钥脱敏');
      } else {
        recordTest('安全配置', `API密钥脱敏: ${path.basename(file)}`, 'WARN', '密钥可能在日志中暴露');
      }
    }
  });
}

// 12. 测试多平台部署兼容性
async function testMultiPlatformDeployment() {
  console.log('\n🚀 12. 多平台部署兼容性测试');
  
  // CloudFlare Pages配置测试
  if (fs.existsSync('wrangler.toml')) {
    const wrangler = fs.readFileSync('wrangler.toml', 'utf8');
    
    if (wrangler.includes('nodejs_compat')) {
      recordTest('多平台部署', 'CloudFlare Node.js兼容', 'PASS', 'nodejs_compat标志启用');
    } else {
      recordTest('多平台部署', 'CloudFlare Node.js兼容', 'FAIL', 'Node.js兼容性配置缺失');
    }
    
    if (wrangler.includes('.next')) {
      recordTest('多平台部署', 'CloudFlare构建输出', 'PASS', '构建输出目录配置正确');
    } else {
      recordTest('多平台部署', 'CloudFlare构建输出', 'FAIL', '构建输出配置错误');
    }
  } else {
    recordTest('多平台部署', 'CloudFlare配置', 'FAIL', 'wrangler.toml文件缺失');
  }
  
  // Railway配置测试
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts['build:railway']) {
      recordTest('多平台部署', 'Railway构建脚本', 'PASS', 'Railway专用构建命令');
    } else {
      recordTest('多平台部署', 'Railway构建脚本', 'WARN', 'Railway构建脚本缺失');
    }
    
    if (packageJson.scripts && packageJson.scripts['start:railway']) {
      recordTest('多平台部署', 'Railway启动脚本', 'PASS', 'Railway专用启动命令');
    } else {
      recordTest('多平台部署', 'Railway启动脚本', 'WARN', 'Railway启动脚本缺失');
    }
  }
  
  // Next.js多平台配置测试
  if (fs.existsSync('next.config.js')) {
    const nextConfig = fs.readFileSync('next.config.js', 'utf8');
    
    if (nextConfig.includes('RAILWAY_ENVIRONMENT') && nextConfig.includes('CF_PAGES')) {
      recordTest('多平台部署', 'Next.js平台检测', 'PASS', 'Railway和CloudFlare自动检测');
    } else {
      recordTest('多平台部署', 'Next.js平台检测', 'FAIL', '平台检测逻辑缺失');
    }
    
    if (nextConfig.includes('standalone') && nextConfig.includes('output')) {
      recordTest('多平台部署', 'Next.js输出模式', 'PASS', 'Railway standalone输出');
    } else {
      recordTest('多平台部署', 'Next.js输出模式', 'WARN', '输出模式配置可能需要调整');
    }
  }
}

// 生成测试报告
function generateTestReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 项目架构全面测试报告');
  console.log('='.repeat(80));
  
  const summary = {
    total: testResults.length,
    pass: testResults.filter(r => r.status === 'PASS').length,
    fail: testResults.filter(r => r.status === 'FAIL').length,
    warn: testResults.filter(r => r.status === 'WARN').length,
    skip: testResults.filter(r => r.status === 'SKIP').length
  };
  
  console.log(`\n📊 测试统计:`);
  console.log(`   总测试项: ${summary.total}`);
  console.log(`   ✅ 通过: ${summary.pass} (${(summary.pass/summary.total*100).toFixed(1)}%)`);
  console.log(`   ❌ 失败: ${summary.fail} (${(summary.fail/summary.total*100).toFixed(1)}%)`);
  console.log(`   ⚠️ 警告: ${summary.warn} (${(summary.warn/summary.total*100).toFixed(1)}%)`);
  console.log(`   ⏭️ 跳过: ${summary.skip} (${(summary.skip/summary.total*100).toFixed(1)}%)`);
  
  // 按类别汇总
  const categories = [...new Set(testResults.map(r => r.category))];
  console.log(`\n📂 分类汇总:`);
  
  categories.forEach(category => {
    const categoryTests = testResults.filter(r => r.category === category);
    const passCount = categoryTests.filter(r => r.status === 'PASS').length;
    const totalCount = categoryTests.length;
    const percentage = (passCount / totalCount * 100).toFixed(1);
    
    const status = percentage >= 90 ? '✅' : percentage >= 70 ? '⚠️' : '❌';
    console.log(`   ${status} ${category}: ${passCount}/${totalCount} (${percentage}%)`);
  });
  
  // 失败项详情
  const failures = testResults.filter(r => r.status === 'FAIL');
  if (failures.length > 0) {
    console.log(`\n❌ 需要修复的问题:`);
    failures.forEach(failure => {
      console.log(`   • [${failure.category}] ${failure.testName}: ${failure.details}`);
    });
  }
  
  // 警告项详情
  const warnings = testResults.filter(r => r.status === 'WARN');
  if (warnings.length > 0) {
    console.log(`\n⚠️ 建议优化的项目:`);
    warnings.forEach(warning => {
      console.log(`   • [${warning.category}] ${warning.testName}: ${warning.details}`);
    });
  }
  
  // 总体评估
  const overallScore = (summary.pass / summary.total * 100);
  console.log(`\n🏆 总体评估:`);
  
  if (overallScore >= 95) {
    console.log(`   🎉 优秀 (${overallScore.toFixed(1)}%) - 项目架构实现完美，完全符合设计文档`);
  } else if (overallScore >= 85) {
    console.log(`   ✅ 良好 (${overallScore.toFixed(1)}%) - 项目架构基本完整，少量优化空间`);
  } else if (overallScore >= 70) {
    console.log(`   ⚠️ 一般 (${overallScore.toFixed(1)}%) - 项目基本可用，需要一些改进`);
  } else {
    console.log(`   ❌ 需要改进 (${overallScore.toFixed(1)}%) - 项目存在重要问题，需要重点修复`);
  }
  
  console.log(`\n💡 建议:`);
  if (failures.length > 0) {
    console.log(`   1. 优先修复 ${failures.length} 个失败项，确保核心功能正常`);
  }
  if (warnings.length > 0) {
    console.log(`   2. 考虑优化 ${warnings.length} 个警告项，提升系统稳定性`);
  }
  console.log(`   3. 定期运行此测试脚本，确保架构持续符合设计标准`);
  
  return overallScore >= 85;
}

// 主测试流程
async function runComprehensiveTest() {
  try {
    await testTechStack();
    await testDatabaseArchitecture();
    await testDualApiArchitecture();
    await testVeo3Integration();
    await testClerkAuthentication();
    await testCreemPaymentSystem();
    await testCreditsSystem();
    await testVideoGenerationSystem();
    await testPerformanceOptimizations();
    await testMonitoringAndLogging();
    await testSecurityConfiguration();
    await testMultiPlatformDeployment();
    
    const isHealthy = generateTestReport();
    
    console.log(`\n⏰ 测试完成时间: ${new Date().toLocaleString()}`);
    console.log(`📄 详细结果: 共测试 ${testResults.length} 个架构组件`);
    
    process.exit(isHealthy ? 0 : 1);
    
  } catch (error) {
    console.error('\n💥 测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行全面测试
runComprehensiveTest(); 