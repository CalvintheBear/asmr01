#!/usr/bin/env node

/**
 * 开发环境设置脚本
 * 用于确保本地测试环境正确配置
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 设置开发环境...\n');

// 检查环境变量文件是否存在
const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

// 开发环境配置模板
const devConfig = `# 开发环境配置 - 确保测试模式
NODE_ENV=development
CREEM_TEST_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Creem测试环境配置
CREEM_API_KEY=creem_test_GKMtqafu2trplagJwPT7KG
CREEM_WEBHOOK_SECRET=whsec_7f0rJaepEmBRixuDutTRw

# 数据库配置（请替换为实际值）
# DATABASE_URL=postgresql://your_database_url_here

# Clerk配置（请替换为实际值）  
# CLERK_SECRET_KEY=sk_live_IHF9Y65N6Q6NUtJU5FNmlges6IBrFPFwzwXwqb3Qxf
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuY3V0dGluZ2FzbXIub3JnJA

# VEO3 API配置
# VEO3_API_KEY=your_veo3_api_key_here
# VEO3_API_BASE_URL=https://api.kie.ai
`;

try {
  // 检查是否已经存在.env.local
  if (fs.existsSync(envLocalPath)) {
    console.log('✅ .env.local 文件已存在');
    
    // 读取现有配置
    const existingConfig = fs.readFileSync(envLocalPath, 'utf8');
    
    // 检查关键配置
    const hasDevMode = existingConfig.includes('NODE_ENV=development');
    const hasTestMode = existingConfig.includes('CREEM_TEST_MODE=true');
    const hasLocalUrl = existingConfig.includes('localhost:3000');
    
    console.log('📋 当前配置检查:');
    console.log('- NODE_ENV=development:', hasDevMode ? '✅' : '❌');
    console.log('- CREEM_TEST_MODE=true:', hasTestMode ? '✅' : '❌');
    console.log('- 本地URL配置:', hasLocalUrl ? '✅' : '❌');
    
    if (!hasDevMode || !hasTestMode || !hasLocalUrl) {
      console.log('\n⚠️ 发现配置问题，请手动检查 .env.local 文件');
      console.log('确保包含以下配置:');
      console.log('NODE_ENV=development');
      console.log('CREEM_TEST_MODE=true');
      console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000');
    } else {
      console.log('\n✅ 开发环境配置正确！');
    }
    
  } else {
    console.log('❌ 未找到 .env.local 文件');
    console.log('\n请手动创建 .env.local 文件，内容如下:');
    console.log('─'.repeat(50));
    console.log(devConfig);
    console.log('─'.repeat(50));
    
    // 创建 .env.example 作为参考
    fs.writeFileSync(envExamplePath, devConfig);
    console.log('✅ 已创建 .env.example 文件作为参考');
  }

  console.log('\n🚀 开发环境设置完成！');
  console.log('\n📋 下一步操作:');
  console.log('1. 启动开发服务器: npm run dev');
  console.log('2. 访问测试页面: http://localhost:3000/test-payment');
  console.log('3. 检查配置: http://localhost:3000/api/check-creem-config');
  console.log('4. 测试支付流程: http://localhost:3000/pricing');

} catch (error) {
  console.error('💥 设置失败:', error.message);
} 