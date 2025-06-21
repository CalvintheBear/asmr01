#!/usr/bin/env node

/**
 * 环境变量检查脚本
 * 验证所有必需的环境变量是否正确设置
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

console.log('🔍 检查环境变量配置...\n');

// 必需的环境变量列表
const requiredEnvVars = [
  'DATABASE_URL',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CREEM_API_KEY',
  'CREEM_WEBHOOK_SECRET',
  'VEO3_API_KEY'
];

// 可选但重要的环境变量
const optionalEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV',
  'CREEM_TEST_MODE',
  'VEO3_API_BASE_URL'
];

let allGood = true;

console.log('📋 必需环境变量检查:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const exists = !!value;
  const status = exists ? '✅' : '❌';
  const displayValue = exists ? 
    (value.length > 20 ? value.substring(0, 15) + '...' : value) : 
    'NOT_SET';
  
  console.log(`${status} ${varName}: ${displayValue}`);
  
  if (!exists) {
    allGood = false;
  }
});

console.log('\n📋 可选环境变量检查:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  const exists = !!value;
  const status = exists ? '✅' : '⚠️';
  const displayValue = exists ? value : 'NOT_SET';
  
  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log('\n🎯 环境判断:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('- 是否为开发环境:', process.env.NODE_ENV === 'development');
console.log('- CREEM测试模式:', process.env.CREEM_TEST_MODE === 'true');

// 数据库连接测试
console.log('\n🗄️ 数据库连接检查:');
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('✅ 数据库URL格式正确');
    console.log('- 主机:', url.hostname);
    console.log('- 端口:', url.port);
    console.log('- 数据库:', url.pathname.substring(1));
  } catch (error) {
    console.log('❌ 数据库URL格式错误:', error.message);
    allGood = false;
  }
} else {
  console.log('❌ DATABASE_URL未设置');
  allGood = false;
}

// Clerk配置检查
console.log('\n🔐 Clerk配置检查:');
const clerkPublicKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (clerkPublicKey && clerkPublicKey.startsWith('pk_')) {
  console.log('✅ Clerk公钥格式正确');
} else {
  console.log('❌ Clerk公钥格式错误或未设置');
  allGood = false;
}

if (clerkSecretKey && clerkSecretKey.startsWith('sk_')) {
  console.log('✅ Clerk私钥格式正确');
} else {
  console.log('❌ Clerk私钥格式错误或未设置');
  allGood = false;
}

// Creem配置检查
console.log('\n💳 Creem配置检查:');
const creemApiKey = process.env.CREEM_API_KEY;
const creemWebhookSecret = process.env.CREEM_WEBHOOK_SECRET;

if (creemApiKey && creemApiKey.startsWith('creem_')) {
  console.log('✅ Creem API密钥格式正确');
} else {
  console.log('❌ Creem API密钥格式错误或未设置');
  allGood = false;
}

if (creemWebhookSecret && creemWebhookSecret.startsWith('whsec_')) {
  console.log('✅ Creem Webhook密钥格式正确');
} else {
  console.log('❌ Creem Webhook密钥格式错误或未设置');
  allGood = false;
}

console.log('\n📊 检查结果:');
if (allGood) {
  console.log('✅ 所有必需环境变量配置正确！');
  console.log('🚀 应用可以正常启动');
} else {
  console.log('❌ 发现配置问题，请检查上述错误');
  console.log('🔧 修复后重新运行检查');
}

console.log('\n💡 如果遇到问题:');
console.log('1. 检查 .env.local 文件是否存在');
console.log('2. 确认所有必需的环境变量都已设置');
console.log('3. 验证API密钥格式是否正确');
console.log('4. 重启开发服务器以加载新的环境变量'); 