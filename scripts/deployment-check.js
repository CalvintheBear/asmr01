#!/usr/bin/env node

/**
 * 🚀 部署前代码检查脚本
 * 根据项目架构.md全面检查代码和配置
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

console.log('🔍 开始全面的部署前检查...\n');

// 1. 检查环境变量配置
function checkEnvironmentVariables() {
  console.log('📋 1. 检查环境变量配置');
  
  const requiredVars = [
    'DATABASE_URL',
    'CLERK_SECRET_KEY', 
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CREEM_API_KEY',
    'CREEM_WEBHOOK_SECRET',
    'VEO3_API_KEY'
  ];

  const optionalVars = [
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV',
    'CREEM_TEST_MODE',
    'VEO3_API_BASE_URL'
  ];

  let envVarIssues = [];

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      envVarIssues.push(`❌ ${varName}: 缺失`);
    } else {
      console.log(`✅ ${varName}: 已设置`);
    }
  });

  optionalVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '⚠️';
    console.log(`${status} ${varName}: ${value || '未设置'}`);
  });

  return envVarIssues;
}

// 2. 检查代码文件结构
function checkCodeStructure() {
  console.log('\n🏗️ 2. 检查代码文件结构');
  
  const criticalFiles = [
    'src/app/layout.tsx',
    'src/lib/prisma.ts',
    'src/lib/creem-config.ts', 
    'src/lib/veo3-api.ts',
    'src/lib/api-key-pool.ts',
    'src/app/api/webhooks/creem/route.ts',
    'src/app/api/generate-video/route.ts',
    'src/app/api/credits/route.ts',
    'prisma/schema.prisma',
    'next.config.js',
    'package.json'
  ];

  let missingFiles = [];

  criticalFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${filePath}`);
    } else {
      missingFiles.push(`❌ ${filePath}: 文件缺失`);
    }
  });

  return missingFiles;
}

// 3. 检查API路由配置
function checkApiRoutes() {
  console.log('\n🚀 3. 检查API路由配置');
  
  const apiRoutes = [
    'src/app/api/health/route.ts',
    'src/app/api/credits/route.ts',
    'src/app/api/generate-video/route.ts',
    'src/app/api/video-status/[id]/route.ts',
    'src/app/api/webhooks/creem/route.ts',
    'src/app/api/payments/creem-advanced/route.ts',
    'src/app/api/payments/creem/route.ts',
    'src/app/api/user/sync/route.ts'
  ];

  let apiIssues = [];

  apiRoutes.forEach(routePath => {
    if (fs.existsSync(routePath)) {
      console.log(`✅ ${routePath}`);
      
      // 检查文件内容中的关键配置
      const content = fs.readFileSync(routePath, 'utf8');
      
      // 检查是否正确使用了环境变量
      if (routePath.includes('webhook') && !content.includes('process.env.CREEM_WEBHOOK_SECRET')) {
        apiIssues.push(`⚠️ ${routePath}: 缺少CREEM_WEBHOOK_SECRET验证`);
      }
      
      if (routePath.includes('generate-video') && !content.includes('VEO3_API_KEY')) {
        apiIssues.push(`⚠️ ${routePath}: 缺少VEO3_API_KEY配置`);
      }
      
    } else {
      apiIssues.push(`❌ ${routePath}: API路由缺失`);
    }
  });

  return apiIssues;
}

// 4. 检查数据库配置
function checkDatabaseConfig() {
  console.log('\n🗄️ 4. 检查数据库配置');
  
  let dbIssues = [];

  // 检查Prisma schema
  if (fs.existsSync('prisma/schema.prisma')) {
    const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
    
    if (schema.includes('env("DATABASE_URL")')) {
      console.log('✅ Prisma配置正确');
    } else {
      dbIssues.push('❌ Prisma schema缺少DATABASE_URL配置');
    }

    // 检查必需的数据表
    const requiredModels = ['User', 'Video', 'Purchase', 'AuditLog'];
    requiredModels.forEach(model => {
      if (schema.includes(`model ${model}`)) {
        console.log(`✅ 数据模型 ${model} 存在`);
      } else {
        dbIssues.push(`❌ 数据模型 ${model} 缺失`);
      }
    });

  } else {
    dbIssues.push('❌ prisma/schema.prisma 文件缺失');
  }

  return dbIssues;
}

// 5. 检查支付配置
function checkPaymentConfig() {
  console.log('\n💳 5. 检查支付配置');
  
  let paymentIssues = [];

  if (fs.existsSync('src/lib/creem-config.ts')) {
    const config = fs.readFileSync('src/lib/creem-config.ts', 'utf8');
    
    // 检查产品ID配置
    if (config.includes('TEST_PRODUCT_IDS') && config.includes('PRODUCTION_PRODUCT_IDS')) {
      console.log('✅ Creem产品ID配置完整');
    } else {
      paymentIssues.push('❌ Creem产品ID配置不完整');
    }

    // 检查双API架构支持
    if (config.includes('getPaymentUrl')) {
      console.log('✅ 支付链接生成逻辑存在');
    } else {
      paymentIssues.push('❌ 支付链接生成逻辑缺失');
    }

  } else {
    paymentIssues.push('❌ src/lib/creem-config.ts 文件缺失');
  }

  return paymentIssues;
}

// 6. 检查Next.js配置
function checkNextConfig() {
  console.log('\n⚙️ 6. 检查Next.js配置');
  
  let configIssues = [];

  if (fs.existsSync('next.config.js')) {
    const config = fs.readFileSync('next.config.js', 'utf8');
    
    // 检查多平台部署支持
    if (config.includes('isRailway') && config.includes('isCloudflare')) {
      console.log('✅ 多平台部署配置存在');
    } else {
      configIssues.push('⚠️ 多平台部署配置可能不完整');
    }

    // 检查Edge Runtime支持
    if (config.includes('forceSwcTransforms')) {
      console.log('✅ Edge Runtime配置存在');
    } else {
      configIssues.push('⚠️ Edge Runtime配置缺失');
    }

  } else {
    configIssues.push('❌ next.config.js 文件缺失');
  }

  return configIssues;
}

// 7. 检查安全配置
function checkSecurityConfig() {
  console.log('\n🔒 7. 检查安全配置');
  
  let securityIssues = [];

  // 检查Clerk配置
  if (fs.existsSync('src/app/layout.tsx')) {
    const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
    
    if (layout.includes('ClerkProvider') && layout.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')) {
      console.log('✅ Clerk认证配置正确');
    } else {
      securityIssues.push('❌ Clerk认证配置不完整');
    }
  }

  // 检查中间件配置
  if (fs.existsSync('src/middleware.ts')) {
    const middleware = fs.readFileSync('src/middleware.ts', 'utf8');
    
    if (middleware.includes('clerkMiddleware')) {
      console.log('✅ 认证中间件配置正确');
    } else {
      securityIssues.push('❌ 认证中间件配置缺失');
    }
  } else {
    securityIssues.push('❌ src/middleware.ts 文件缺失');
  }

  return securityIssues;
}

// 8. 生成部署报告
function generateDeploymentReport(allIssues) {
  console.log('\n📊 8. 生成部署检查报告');
  
  const totalIssues = allIssues.reduce((sum, issues) => sum + issues.length, 0);
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 部署检查汇总报告');
  console.log('='.repeat(60));
  
  if (totalIssues === 0) {
    console.log('🎉 恭喜！所有检查都通过了！');
    console.log('✅ 项目已准备好部署到GitHub、Railway和CloudFlare');
    console.log('\n🚀 推荐的部署步骤：');
    console.log('1. git add .');
    console.log('2. git commit -m "准备部署 - 所有检查通过"');
    console.log('3. git push origin main');
    console.log('4. 检查Railway和CloudFlare的自动部署状态');
  } else {
    console.log(`❌ 发现 ${totalIssues} 个问题需要修复：\n`);
    
    allIssues.forEach((issues, index) => {
      const categories = [
        '环境变量', '代码结构', 'API路由', 
        '数据库配置', '支付配置', 'Next.js配置', '安全配置'
      ];
      
      if (issues.length > 0) {
        console.log(`📂 ${categories[index]}:`);
        issues.forEach(issue => console.log(`   ${issue}`));
        console.log('');
      }
    });
    
    console.log('🔧 请修复以上问题后重新运行检查');
  }
  
  console.log('\n💡 需要帮助？参考以下文档：');
  console.log('- 环境设置: ENVIRONMENT_SETUP.md');
  console.log('- 部署指南: DEPLOYMENT_GUIDE.md'); 
  console.log('- 项目架构: 项目架构.md');
  
  return totalIssues === 0;
}

// 主检查流程
async function runFullCheck() {
  try {
    const allIssues = [
      checkEnvironmentVariables(),
      checkCodeStructure(),
      checkApiRoutes(),
      checkDatabaseConfig(),
      checkPaymentConfig(),
      checkNextConfig(),
      checkSecurityConfig()
    ];

    const isReadyForDeployment = generateDeploymentReport(allIssues);
    
    process.exit(isReadyForDeployment ? 0 : 1);
    
  } catch (error) {
    console.error('💥 检查过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行检查
runFullCheck(); 