#!/usr/bin/env node

console.log('🚂 Railway 配置检查开始...\n');

// 检查Railway环境变量
const railwayVars = [
  'RAILWAY_ENVIRONMENT',
  'RAILWAY_PROJECT_ID', 
  'RAILWAY_PUBLIC_DOMAIN',
  'PORT'
];

const requiredVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CREEM_API_KEY',
  'CREEM_WEBHOOK_SECRET',
  'VEO3_API_KEY',
  'NODE_ENV'
];

console.log('🔍 Railway 特定环境变量:');
railwayVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName === 'PORT' ? value : '已设置'}`);
  } else {
    console.log(`⚠️  ${varName}: 未设置`);
  }
});

console.log('\n🔍 必需环境变量:');
let allRequired = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('KEY') || varName.includes('SECRET')) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: 未设置`);
    allRequired = false;
  }
});

// 检查Clerk配置
console.log('\n🔍 Clerk 配置检查:');
const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecret = process.env.CLERK_SECRET_KEY;

if (clerkPub && clerkSecret) {
  const isTestMode = clerkPub.startsWith('pk_test_') || clerkSecret.startsWith('sk_test_');
  console.log(`📝 环境模式: ${isTestMode ? '测试环境' : '生产环境'}`);
  
  if (isTestMode) {
    console.log('⚠️  当前使用测试环境Clerk密钥');
  } else {
    console.log('✅ 使用生产环境Clerk密钥');
  }
}

// 检查数据库连接
console.log('\n🔍 数据库配置:');
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  if (dbUrl.includes('railway.app')) {
    console.log('✅ 使用Railway PostgreSQL数据库');
  } else if (dbUrl.includes('localhost')) {
    console.log('⚠️  使用本地数据库');
  } else {
    console.log('✅ 使用外部数据库');
  }
}

// 检查域名配置
console.log('\n🔍 域名配置:');
const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (railwayDomain) {
  console.log(`✅ Railway域名: ${railwayDomain}`);
} else {
  console.log('⚠️  Railway域名未设置');
}

if (appUrl) {
  console.log(`📝 应用URL: ${appUrl}`);
} else {
  console.log('⚠️  应用URL未设置');
}

// 检查Creem支付配置
console.log('\n🔍 Creem 支付配置:');
const creemKey = process.env.CREEM_API_KEY;
const creemWebhook = process.env.CREEM_WEBHOOK_SECRET;

if (creemKey && creemWebhook) {
  const isTestMode = process.env.CREEM_TEST_MODE === 'true';
  console.log(`✅ Creem配置完整`);
  console.log(`📝 测试模式: ${isTestMode ? '开启' : '关闭'}`);
} else {
  console.log('❌ Creem配置不完整');
}

console.log('\n📊 总结:');
if (allRequired) {
  console.log('✅ 所有必需环境变量已设置');
} else {
  console.log('❌ 存在缺失的环境变量');
}

// Railway特定建议
console.log('\n💡 Railway 部署建议:');
console.log('1. 确保在Railway中设置了所有生产环境变量');
console.log('2. 使用 npm run start:railway 作为启动命令');
console.log('3. 确保PORT环境变量由Railway自动设置');
console.log('4. 检查Railway的域名设置是否正确');

const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
console.log(`\n🏗️  当前环境: ${isRailway ? 'Railway' : '其他平台'}`); 