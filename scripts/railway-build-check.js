#!/usr/bin/env node

/**
 * Railway 构建前检查脚本
 * 确保构建环境配置正确
 */

console.log('🚀 Railway 构建前检查...\n');

// 检查环境变量
console.log('📋 环境变量检查:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'undefined');
console.log('- DATABASE_URL:', !!process.env.DATABASE_URL ? '✅ 已设置' : '❌ 缺失');
console.log('- CLERK_SECRET_KEY:', !!process.env.CLERK_SECRET_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- CREEM_API_KEY:', !!process.env.CREEM_API_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');
console.log('- VEO3_API_KEY:', !!process.env.VEO3_API_KEY ? '✅ 已设置' : '⚠️ 缺失（运行时需要）');

// 检查关键构建依赖
const criticalMissing = [];
if (!process.env.DATABASE_URL) {
  criticalMissing.push('DATABASE_URL');
}

if (criticalMissing.length > 0) {
  console.log('\n❌ 构建失败：缺少关键环境变量');
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
  console.log('\n⚠️ 警告：缺少运行时环境变量');
  console.log('缺失变量:', runtimeMissing);
  console.log('这些变量在运行时需要，但不会阻止构建');
}

console.log('\n✅ 构建前检查完成');
console.log('�� 开始Prisma生成...'); 