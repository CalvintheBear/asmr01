#!/usr/bin/env node

/**
 * API密钥池测试脚本
 */

// 由于是Node.js环境，需要模拟ES模块导入
const { getApiKey, reportApiSuccess, reportApiError, getApiKeyPoolStatus } = require('../src/lib/api-key-pool.ts');

async function testApiKeyPool() {
  console.log('🧪 开始测试API密钥池...\n');

  try {
    // 1. 获取初始状态
    console.log('📊 初始密钥池状态:');
    const initialStatus = getApiKeyPoolStatus();
    console.log(JSON.stringify(initialStatus, null, 2));

    // 2. 测试获取密钥
    console.log('\n🔑 测试获取API密钥:');
    for (let i = 0; i < 8; i++) {
      const key = getApiKey();
      console.log(`第${i + 1}次: ${key.substring(0, 10)}...`);
    }

    // 3. 测试错误报告
    console.log('\n❌ 测试错误报告:');
    const testKey = getApiKey();
    reportApiError(testKey, new Error('Test rate limit error'));
    reportApiError(testKey, new Error('Another test error'));
    reportApiError(testKey, new Error('Third test error')); // 这应该会触发封禁

    // 4. 获取更新后的状态
    console.log('\n📊 错误报告后的状态:');
    const afterErrorStatus = getApiKeyPoolStatus();
    console.log(JSON.stringify(afterErrorStatus, null, 2));

    // 5. 测试成功报告
    console.log('\n✅ 测试成功报告:');
    reportApiSuccess(testKey);

    // 6. 最终状态
    console.log('\n📊 最终状态:');
    const finalStatus = getApiKeyPoolStatus();
    console.log(JSON.stringify(finalStatus, null, 2));

    console.log('\n🎉 API密钥池测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

// 运行测试
testApiKeyPool().catch(console.error); 