#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://cuttingasmr.org';

console.log('🔍 全面API功能测试开始...\n');

// 测试API端点
async function testAPI(path, method = 'GET', body = null, description = '') {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    console.log(`🔍 测试 ${description || path}`);
    console.log(`   方法: ${method}`);
    console.log(`   URL: ${url}`);
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script/1.0'
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   状态码: ${res.statusCode}`);
        console.log(`   响应头: ${res.headers['content-type'] || 'N/A'}`);
        
        try {
          if (data) {
            const result = JSON.parse(data);
            console.log(`   响应: ${JSON.stringify(result).substring(0, 100)}...`);
            resolve({ 
              success: res.statusCode >= 200 && res.statusCode < 300, 
              status: res.statusCode,
              data: result 
            });
          } else {
            resolve({ 
              success: res.statusCode >= 200 && res.statusCode < 300, 
              status: res.statusCode,
              data: null 
            });
          }
        } catch (error) {
          console.log(`   响应: ${data.substring(0, 100)}...`);
          resolve({ 
            success: res.statusCode >= 200 && res.statusCode < 300, 
            status: res.statusCode,
            data: data 
          });
        }
        console.log('');
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ 连接失败: ${err.message}`);
      console.log('');
      resolve({ success: false, error: err.message });
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function runAllTests() {
  console.log(`🌐 测试目标: ${BASE_URL}`);
  console.log(`⏰ 测试时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  const tests = [
    // 1. 基础系统API
    { path: '/api/health', method: 'GET', desc: '系统健康检查' },
    { path: '/api/check-env', method: 'GET', desc: '环境配置检查' },
    { path: '/api/check-creem-config', method: 'GET', desc: 'Creem支付配置' },
    { path: '/api/webhook-info', method: 'GET', desc: 'Webhook信息' },
    
    // 2. 用户认证相关API (应该返回401)
    { path: '/api/credits', method: 'GET', desc: '积分查询API（需要认证）' },
    { path: '/api/credits-check', method: 'GET', desc: '积分检查API（需要认证）' },
    { path: '/api/user/sync', method: 'GET', desc: '用户同步API（需要认证）' },
    { path: '/api/user/videos', method: 'GET', desc: '用户视频API（需要认证）' },
    { path: '/api/user/purchases', method: 'GET', desc: '用户购买记录API（需要认证）' },
    { path: '/api/user/agreement', method: 'GET', desc: '用户协议API（需要认证）' },
    { path: '/api/user/export-data', method: 'GET', desc: '用户数据导出API（需要认证）' },
    
    // 3. 视频生成相关API
    { path: '/api/generate-video', method: 'POST', desc: '视频生成API（需要认证）', body: { prompt: 'test' } },
    { path: '/api/video-status/test123', method: 'GET', desc: '视频状态查询API（测试不存在的taskId）' },
    { path: '/api/video-details/test123', method: 'GET', desc: '视频详情API（测试不存在的taskId）' },
    
    // 4. 支付相关API
    { path: '/api/payments/creem', method: 'GET', desc: 'Creem支付API（应该405）' },
    { path: '/api/payments/creem', method: 'POST', desc: 'Creem支付API（需要认证）', body: { productId: 'test' } },
    { path: '/api/webhooks/creem', method: 'POST', desc: 'Creem Webhook（需要签名）', body: { test: true } },
    
    // 5. 管理员API
    { path: '/api/manual-credits-recovery', method: 'POST', desc: '手动积分恢复API（需要认证）', body: { userId: 'test' } },
    { path: '/api/simulate-webhook', method: 'POST', desc: '模拟Webhook API（需要认证）', body: { test: true } },
    
    // 6. 测试API
    { path: '/api/test-creem', method: 'GET', desc: '测试Creem配置' },
    { path: '/api/test-standard-creem', method: 'GET', desc: '测试标准Creem配置' },
    { path: '/api/webhook-test', method: 'GET', desc: 'Webhook测试' },
  ];
  
  let totalTests = 0;
  let successfulTests = 0;
  let authRequiredTests = 0;
  let failedTests = [];
  
  console.log('🔧 === 基础系统API测试 ===');
  for (let i = 0; i < 4; i++) {
    const test = tests[i];
    const result = await testAPI(test.path, test.method, test.body, test.desc);
    totalTests++;
    
    if (result.success) {
      console.log(`✅ ${test.desc}: 正常`);
      successfulTests++;
    } else {
      console.log(`❌ ${test.desc}: 失败 (${result.status})`);
      failedTests.push(`${test.desc}: ${result.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🔐 === 认证相关API测试 ===');
  for (let i = 4; i < 11; i++) {
    const test = tests[i];
    const result = await testAPI(test.path, test.method, test.body, test.desc);
    totalTests++;
    
    if (result.status === 401) {
      console.log(`✅ ${test.desc}: 正确要求认证`);
      authRequiredTests++;
    } else if (result.success) {
      console.log(`⚠️  ${test.desc}: 意外成功（应该需要认证）`);
      successfulTests++;
    } else {
      console.log(`❌ ${test.desc}: 异常失败 (${result.status})`);
      failedTests.push(`${test.desc}: ${result.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🎥 === 视频系统API测试 ===');
  for (let i = 11; i < 14; i++) {
    const test = tests[i];
    const result = await testAPI(test.path, test.method, test.body, test.desc);
    totalTests++;
    
    if (result.status === 401) {
      console.log(`✅ ${test.desc}: 正确要求认证`);
      authRequiredTests++;
    } else if (result.status === 404) {
      console.log(`✅ ${test.desc}: 正常（任务不存在）`);
      successfulTests++;
    } else if (result.success) {
      console.log(`✅ ${test.desc}: 正常`);
      successfulTests++;
    } else {
      console.log(`❌ ${test.desc}: 失败 (${result.status})`);
      failedTests.push(`${test.desc}: ${result.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n💳 === 支付系统API测试 ===');
  for (let i = 14; i < 17; i++) {
    const test = tests[i];
    const result = await testAPI(test.path, test.method, test.body, test.desc);
    totalTests++;
    
    if (result.status === 401) {
      console.log(`✅ ${test.desc}: 正确要求认证`);
      authRequiredTests++;
    } else if (result.status === 405) {
      console.log(`✅ ${test.desc}: 正确（方法不允许）`);
      successfulTests++;
    } else if (result.success) {
      console.log(`✅ ${test.desc}: 正常`);
      successfulTests++;
    } else {
      console.log(`❌ ${test.desc}: 失败 (${result.status})`);
      failedTests.push(`${test.desc}: ${result.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🔧 === 管理和测试API ===');
  for (let i = 17; i < tests.length; i++) {
    const test = tests[i];
    const result = await testAPI(test.path, test.method, test.body, test.desc);
    totalTests++;
    
    if (result.status === 401) {
      console.log(`✅ ${test.desc}: 正确要求认证`);
      authRequiredTests++;
    } else if (result.success) {
      console.log(`✅ ${test.desc}: 正常`);
      successfulTests++;
    } else {
      console.log(`❌ ${test.desc}: 失败 (${result.status})`);
      failedTests.push(`${test.desc}: ${result.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 汇总报告
  console.log('\n📊 === API测试汇总报告 ===');
  console.log(`总测试数: ${totalTests}`);
  console.log(`✅ 正常响应: ${successfulTests}`);
  console.log(`🔐 正确认证: ${authRequiredTests}`);
  console.log(`❌ 异常失败: ${failedTests.length}`);
  console.log(`成功率: ${((successfulTests + authRequiredTests) / totalTests * 100).toFixed(1)}%`);
  
  if (failedTests.length > 0) {
    console.log('\n❌ 异常失败的API:');
    failedTests.forEach(test => console.log(`   - ${test}`));
  }
  
  console.log('\n🎯 API系统评估:');
  const healthScore = (successfulTests + authRequiredTests) / totalTests;
  if (healthScore >= 0.9) {
    console.log('✅ API系统运行良好，所有核心功能正常');
  } else if (healthScore >= 0.7) {
    console.log('⚠️  API系统基本正常，有少量问题需要关注');
  } else {
    console.log('❌ API系统存在较多问题，需要立即修复');
  }
  
  console.log('\n🎯 测试完成');
}

runAllTests(); 