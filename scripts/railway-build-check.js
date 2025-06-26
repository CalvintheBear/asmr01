#!/usr/bin/env node

/**
 * Railway 构建前检查脚本
 * 确保构建环境配置正确
 */

console.log('🚀 Railway 构建前检查...\n');

// 检查Node.js版本
console.log('📋 系统信息:');
console.log('- Node.js版本:', process.version);
console.log('- 平台:', process.platform);
console.log('- 架构:', process.arch);
console.log('');

// 检查环境变量
console.log('📋 环境变量检查:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'undefined');
console.log('- DATABASE_URL:', !!process.env.DATABASE_URL ? '✅ 已设置' : '❌ 缺失');
console.log('- CLERK_SECRET_KEY:', !!process.env.CLERK_SECRET_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- CREEM_API_KEY:', !!process.env.CREEM_API_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- VEO3_API_KEY:', !!process.env.VEO3_API_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- CREEM_TEST_MODE:', process.env.CREEM_TEST_MODE || 'undefined');
console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'undefined');
console.log('');

// 检查关键构建依赖
const criticalMissing = [];
if (!process.env.DATABASE_URL) {
  criticalMissing.push('DATABASE_URL');
}

if (criticalMissing.length > 0) {
  console.log('❌ 构建失败：缺少关键环境变量');
  console.log('缺失变量:', criticalMissing);
  console.log('\n📝 请在Railway Dashboard中设置以下环境变量:');
  console.log('DATABASE_URL=${{Postgres.DATABASE_URL}}');
  process.exit(1);
}

// 检查运行时变量（警告但不阻止构建）
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

if (runtimeMissing.length > 0) {
  console.log('⚠️ 警告：缺少运行时环境变量');
  console.log('缺失变量:', runtimeMissing);
  console.log('这些变量在运行时需要，但不会阻止构建');
  console.log('');
}

// 检查package.json和依赖
console.log('📦 项目文件检查:');
try {
  const fs = require('fs');
  const path = require('path');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log('✅ package.json 存在');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('- 项目名称:', packageJson.name);
    console.log('- 版本:', packageJson.version);
    console.log('- Next.js版本:', packageJson.dependencies?.next || '未找到');
  } else {
    console.log('❌ package.json 不存在');
    process.exit(1);
  }
  
  const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (fs.existsSync(prismaSchemaPath)) {
    console.log('✅ Prisma schema 存在');
  } else {
    console.log('⚠️ Prisma schema 不存在');
  }
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    console.log('✅ next.config.js 存在');
  } else {
    console.log('⚠️ next.config.js 不存在');
  }
  
} catch (error) {
  console.log('❌ 项目文件检查失败:', error.message);
}

console.log('');
console.log('✅ 构建前检查完成');
console.log('📦 开始Prisma生成...');

// 设置构建优化环境变量
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.NEXT_TELEMETRY_DISABLED = '1'; 