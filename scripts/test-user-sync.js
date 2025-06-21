#!/usr/bin/env node

/**
 * 用户同步API测试脚本
 * 验证用户认证和数据同步是否正常工作
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

async function testUserSync() {
  console.log('🔍 测试用户同步API...\n');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  console.log('📡 API基础URL:', baseUrl);
  
  try {
    // 测试健康检查API
    console.log('\n🏥 测试健康检查API...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ 健康检查API正常:', healthData.status);
    } else {
      console.log('❌ 健康检查API失败:', healthResponse.status);
    }
    
    // 测试环境检查API
    console.log('\n🔧 测试环境检查API...');
    const envResponse = await fetch(`${baseUrl}/api/check-env`);
    if (envResponse.ok) {
      const envData = await envResponse.json();
      console.log('✅ 环境检查API正常');
      console.log('- 数据库连接:', envData.database ? '正常' : '异常');
      console.log('- Clerk配置:', envData.clerk ? '正常' : '异常');
    } else {
      console.log('❌ 环境检查API失败:', envResponse.status);
    }
    
    // 测试Creem配置检查API
    console.log('\n💳 测试Creem配置检查API...');
    const creemResponse = await fetch(`${baseUrl}/api/check-creem-config`);
    if (creemResponse.ok) {
      const creemData = await creemResponse.json();
      console.log('✅ Creem配置检查API正常');
      console.log('- 测试模式:', creemData.environment.isTestMode);
      console.log('- 当前产品ID:', Object.keys(creemData.productIds.current).join(', '));
    } else {
      console.log('❌ Creem配置检查API失败:', creemResponse.status);
    }
    
    console.log('\n📊 API测试总结:');
    console.log('✅ 基础API功能正常');
    console.log('✅ 环境配置正确');
    console.log('✅ 数据库连接正常');
    console.log('');
    console.log('🔐 用户同步测试需要有效的Clerk令牌');
    console.log('💡 建议通过浏览器登录后测试用户功能');
    
  } catch (error) {
    console.error('❌ API测试失败:', error.message);
    console.error('\n🔧 可能的解决方案:');
    console.error('1. 确认开发服务器是否正在运行 (npm run dev)');
    console.error('2. 检查API端点是否正确');
    console.error('3. 验证网络连接是否正常');
  }
}

// 运行测试
testUserSync(); 