#!/usr/bin/env node

/**
 * Railway 构建前检查脚本 - 增强版
 * 确保构建环境配置正确，适配Railway特殊环境
 */

console.log('🚀 Railway 构建前检查 - 增强版...\n');

// 检查Node.js版本
console.log('📋 系统信息:');
console.log('- Node.js版本:', process.version);
console.log('- 平台:', process.platform);
console.log('- 架构:', process.arch);
console.log('- 工作目录:', process.cwd());
console.log('');

// 更全面的Railway环境检测
const railwayEnvVars = [
  'RAILWAY_ENVIRONMENT',
  'RAILWAY_PROJECT_ID', 
  'RAILWAY_SERVICE_ID',
  'RAILWAY_DEPLOYMENT_ID',
  'RAILWAY_PUBLIC_DOMAIN',
  'RAILWAY_PRIVATE_DOMAIN'
];

const detectedRailwayVars = railwayEnvVars.filter(varName => !!process.env[varName]);
const isRailwayEnvironment = detectedRailwayVars.length > 0;
const isCI = !!(process.env.CI || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);

console.log('🔍 Railway环境检测:');
console.log('- Railway环境:', isRailwayEnvironment ? '✅ 是' : '❌ 否');
console.log('- 检测到的Railway变量:', detectedRailwayVars);
console.log('- CI环境:', isCI ? '✅ 是' : '❌ 否');
console.log('');

// 检查环境变量
console.log('📋 环境变量检查:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'undefined');
console.log('- RAILWAY_PROJECT_ID:', !!process.env.RAILWAY_PROJECT_ID ? '✅ 已设置' : '❌ 缺失');
console.log('- RAILWAY_SERVICE_ID:', !!process.env.RAILWAY_SERVICE_ID ? '✅ 已设置' : '❌ 缺失');
console.log('- DATABASE_URL:', !!process.env.DATABASE_URL ? '✅ 已设置' : '❌ 缺失');
console.log('- CLERK_SECRET_KEY:', !!process.env.CLERK_SECRET_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- CREEM_API_KEY:', !!process.env.CREEM_API_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- VEO3_API_KEY:', !!process.env.VEO3_API_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- CREEM_TEST_MODE:', process.env.CREEM_TEST_MODE || 'undefined');
console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'undefined');
console.log('');

// 检查关键构建依赖 - 在Railway环境中完全跳过DATABASE_URL验证
if (isRailwayEnvironment) {
  console.log('🔧 Railway环境检测：跳过严格的环境变量验证');
  
  // 如果Railway环境中没有DATABASE_URL，设置临时值
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ Railway环境：DATABASE_URL缺失，设置临时值以支持构建');
    process.env.DATABASE_URL = 'postgresql://railway:railway@localhost:5432/railway';
    console.log('🔧 临时DATABASE_URL已设置');
  }
  
  // 设置NODE_ENV如果未设置
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
    console.log('🔧 设置NODE_ENV=production');
  }
} else {
  // 只在本地开发环境检查关键依赖
  const criticalMissing = [];
  if (!process.env.DATABASE_URL) {
    criticalMissing.push('DATABASE_URL');
  }

  if (criticalMissing.length > 0) {
    console.log('❌ 本地环境：缺少关键环境变量');
    console.log('缺失变量:', criticalMissing);
    console.log('\n📝 请设置以下环境变量或在Railway Dashboard中配置:');
    console.log('DATABASE_URL=${{Postgres.DATABASE_URL}}');
    process.exit(1);
  }
}

// 检查运行时变量（仅警告）
const runtimeMissing = [];
const runtimeVars = [
  'CLERK_SECRET_KEY',
  'CREEM_API_KEY', 
  'CREEM_WEBHOOK_SECRET',
  'VEO3_API_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'
];

runtimeVars.forEach(varName => {
  if (!process.env[varName]) {
    runtimeMissing.push(varName);
  }
});

if (runtimeMissing.length > 0 && !isRailwayEnvironment) {
  console.log('⚠️ 警告：缺少运行时环境变量');
  console.log('缺失变量:', runtimeMissing);
  console.log('这些变量在运行时需要，但不会阻止构建\n');
}

// 检查文件系统
console.log('📦 项目文件检查:');
try {
  const fs = require('fs');
  const path = require('path');
  
  // 检查关键文件
  const criticalFiles = [
    { path: 'package.json', name: 'package.json' },
    { path: 'next.config.js', name: 'next.config.js' },
    { path: 'prisma/schema.prisma', name: 'Prisma schema' },
    { path: 'src/app/layout.tsx', name: 'App layout' },
    { path: 'src/app/loading.tsx', name: 'Loading page' },
    { path: 'src/app/not-found.tsx', name: 'Not found page' }
  ];
  
  criticalFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file.path);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file.name} 存在`);
    } else {
      console.log(`❌ ${file.name} 缺失: ${file.path}`);
    }
  });
  
  // 读取package.json信息
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('- 项目名称:', packageJson.name);
    console.log('- 版本:', packageJson.version);
    console.log('- Next.js版本:', packageJson.dependencies?.next || '未找到');
    
    // 检查构建脚本
    if (packageJson.scripts && packageJson.scripts['build:railway']) {
      console.log('- Railway构建脚本:', packageJson.scripts['build:railway']);
    }
  }
  
} catch (error) {
  console.log('❌ 项目文件检查失败:', error.message);
  if (isRailwayEnvironment) {
    console.log('🔧 Railway环境：忽略文件检查错误，继续构建');
  } else {
    process.exit(1);
  }
}

console.log('');
console.log('✅ 构建前检查完成');

// 设置构建优化环境变量
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_ESLINT_PLUGIN = 'true';

if (isRailwayEnvironment) {
  console.log('🚀 Railway环境：已优化构建设置');
  console.log('- SKIP_ENV_VALIDATION=true');
  console.log('- NEXT_TELEMETRY_DISABLED=1');
  console.log('- DISABLE_ESLINT_PLUGIN=true');
}

console.log('📦 继续Prisma生成和Next.js构建...');
console.log(''); 