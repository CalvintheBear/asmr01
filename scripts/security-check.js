#!/usr/bin/env node

/**
 * 🔒 系统安全检查脚本
 * 验证API安全配置和敏感信息保护
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 开始系统安全检查（用户友好版本）...\n');

let securityScore = 0;
let totalChecks = 0;
const issues = [];
const successes = [];

function checkItem(name, condition, errorMsg, successMsg) {
  totalChecks++;
  if (condition) {
    securityScore++;
    successes.push(`✅ ${name}: ${successMsg}`);
  } else {
    issues.push(`❌ ${name}: ${errorMsg}`);
  }
}

// 1. 检查next.config.js是否移除了硬编码敏感信息
console.log('📋 检查配置文件安全性...');
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  checkItem(
    'API密钥硬编码检查',
    !nextConfigContent.includes('c982688b5c6938943dd721ed1d576edb') && 
    !nextConfigContent.includes('26d5d2de23b9f511998f39cda771ae4d'),
    '配置文件中仍有硬编码的API密钥',
    '未发现硬编码的API密钥'
  );
  
  checkItem(
    '数据库连接串硬编码检查', 
    !nextConfigContent.includes('wGgVnAtvDEZxDmyZfMuJJLqSmteroInW'),
    '配置文件中仍有硬编码的数据库连接串',
    '未发现硬编码的数据库连接串'
  );
  
  checkItem(
    'Clerk密钥硬编码检查',
    !nextConfigContent.includes('sk_test_T8He2nKmyV1okMkk8lZcbIh66KSFWoxr3s0lLMyO36'),
    '配置文件中仍有硬编码的Clerk密钥',
    '未发现硬编码的Clerk密钥'
  );
  
  checkItem(
    '安全响应头配置',
    nextConfigContent.includes('X-Frame-Options') && nextConfigContent.includes('X-Content-Type-Options'),
    '缺少安全响应头配置',
    '已配置安全响应头'
  );
  
} catch (error) {
  issues.push(`❌ next.config.js读取失败: ${error.message}`);
  totalChecks += 4;
}

// 2. 检查API密钥池是否使用环境变量
console.log('🔑 检查API密钥池安全性...');
try {
  const apiKeyPoolPath = path.join(process.cwd(), 'src/lib/api-key-pool.ts');
  const apiKeyPoolContent = fs.readFileSync(apiKeyPoolPath, 'utf8');
  
  checkItem(
    'API密钥池环境变量使用',
    apiKeyPoolContent.includes('process.env.VEO3_API_KEY') && 
    !apiKeyPoolContent.includes('c982688b5c6938943dd721ed1d576edb'),
    'API密钥池仍使用硬编码密钥',
    'API密钥池已改为使用环境变量'
  );
  
} catch (error) {
  issues.push(`❌ api-key-pool.ts读取失败: ${error.message}`);
  totalChecks++;
}

// 3. 检查速率限制实现
console.log('⏱️ 检查速率限制保护...');
try {
  const rateLimiterPath = path.join(process.cwd(), 'src/lib/rate-limiter.ts');
  const rateLimiterExists = fs.existsSync(rateLimiterPath);
  
  checkItem(
    '速率限制库存在',
    rateLimiterExists,
    '速率限制库不存在',
    '速率限制库已创建'
  );
  
  if (rateLimiterExists) {
    const rateLimiterContent = fs.readFileSync(rateLimiterPath, 'utf8');
    checkItem(
      '速率限制功能完整性',
      rateLimiterContent.includes('isAllowed') && rateLimiterContent.includes('RATE_LIMITS'),
      '速率限制功能不完整',
      '速率限制功能完整'
    );
  } else {
    totalChecks++;
  }
  
} catch (error) {
  issues.push(`❌ rate-limiter.ts检查失败: ${error.message}`);
  totalChecks += 2;
}

// 4. 检查关键API端点保护
console.log('🛡️ 检查API端点保护...');
try {
  const generateVideoPath = path.join(process.cwd(), 'src/app/api/generate-video/route.ts');
  const generateVideoContent = fs.readFileSync(generateVideoPath, 'utf8');
  
  checkItem(
    '视频生成API速率限制',
    generateVideoContent.includes('rateLimiter.isAllowed') && generateVideoContent.includes('VIDEO_GENERATION'),
    '视频生成API缺少速率限制保护',
    '视频生成API已添加速率限制保护'
  );
  
  const apiKeyStatusPath = path.join(process.cwd(), 'src/app/api/api-key-status/route.ts');
  const apiKeyStatusContent = fs.readFileSync(apiKeyStatusPath, 'utf8');
  
  checkItem(
    'API密钥状态端点认证',
    apiKeyStatusContent.includes('auth()') && apiKeyStatusContent.includes('Unauthorized'),
    'API密钥状态端点缺少认证保护',
    'API密钥状态端点已添加认证保护'
  );
  
} catch (error) {
  issues.push(`❌ API端点检查失败: ${error.message}`);
  totalChecks += 2;
}

// 5. 检查环境变量配置文档
console.log('📋 检查安全文档...');
const envSetupPath = path.join(process.cwd(), 'ENVIRONMENT_SETUP.md');
const securityAnalysisPath = path.join(process.cwd(), 'API_SECURITY_ANALYSIS.md');

checkItem(
  '环境变量配置文档',
  fs.existsSync(envSetupPath),
  '缺少环境变量配置文档',
  '环境变量配置文档已创建'
);

checkItem(
  '安全分析报告',
  fs.existsSync(securityAnalysisPath),
  '缺少安全分析报告',
  '安全分析报告已创建'
);

// 6. 检查.env.local是否被Git忽略
console.log('🔐 检查敏感文件保护...');
try {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    checkItem(
      '.env.local Git忽略',
      gitignoreContent.includes('.env.local') || gitignoreContent.includes('.env*.local'),
      '.env.local文件未被Git忽略，可能泄露敏感信息',
      '.env.local文件已被Git忽略'
    );
  } else {
    issues.push('❌ .gitignore文件不存在');
    totalChecks++;
  }
} catch (error) {
  issues.push(`❌ .gitignore检查失败: ${error.message}`);
  totalChecks++;
}

// 输出结果
console.log('\n🎯 安全检查结果:');
console.log('='.repeat(50));

if (successes.length > 0) {
  console.log('\n✅ 通过的检查项:');
  successes.forEach(success => console.log(success));
}

if (issues.length > 0) {
  console.log('\n❌ 需要修复的问题:');
  issues.forEach(issue => console.log(issue));
}

const scorePercentage = Math.round((securityScore / totalChecks) * 100);
console.log(`\n📊 安全评分: ${securityScore}/${totalChecks} (${scorePercentage}%)`);

if (scorePercentage >= 90) {
  console.log('🎉 优秀！系统安全性很好！');
} else if (scorePercentage >= 75) {
  console.log('✅ 良好！还有一些小问题需要修复');
} else if (scorePercentage >= 60) {
  console.log('⚠️ 中等！建议尽快修复安全问题');
} else {
  console.log('🚨 严重！存在重大安全风险，请立即修复！');
}

console.log('\n🔒 安全检查完成');
process.exit(issues.length > 0 ? 1 : 0); 