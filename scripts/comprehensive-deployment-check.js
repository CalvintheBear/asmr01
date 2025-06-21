#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://cuttingasmr.org';

console.log('🔍 全面部署状态检查开始...\n');

// 测试API端点
async function testEndpoint(path, description, expectedStatus = 200) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    console.log(`🔍 测试 ${description}`);
    console.log(`   URL: ${url}`);
    
    const req = https.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === expectedStatus;
        console.log(`   状态码: ${res.statusCode} ${success ? '✅' : '❌'}`);
        console.log(`   响应头: ${res.headers['content-type'] || 'N/A'}`);
        
        let parsedData = null;
        if (res.headers['content-type']?.includes('application/json')) {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            console.log(`   ⚠️  JSON解析失败: ${e.message}`);
          }
        }
        
        resolve({ 
          success, 
          status: res.statusCode, 
          data: parsedData, 
          rawData: data,
          headers: res.headers 
        });
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ 连接失败: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    
    req.on('timeout', () => {
      console.log(`   ⏰ 请求超时`);
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });
  });
}

async function comprehensiveCheck() {
  console.log(`🌐 检查目标: ${BASE_URL}`);
  console.log(`⏰ 检查时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  // 1. 基础页面检查
  console.log('📄 === 基础页面检查 ===');
  const pageTests = [
    { path: '/', desc: '主页', expected: 200 },
    { path: '/pricing', desc: '定价页面', expected: 200 },
    { path: '/profile', desc: '个人中心', expected: 200 },
    { path: '/help', desc: '帮助页面', expected: 200 },
    { path: '/about', desc: '关于页面', expected: 200 },
    { path: '/terms', desc: '服务条款', expected: 200 },
    { path: '/privacy', desc: '隐私政策', expected: 200 },
    { path: '/refund', desc: '退款政策', expected: 200 },
  ];
  
  const pageResults = [];
  for (const test of pageTests) {
    const result = await testEndpoint(test.path, test.desc, test.expected);
    pageResults.push({ ...test, ...result });
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 2. API端点检查
  console.log('🔌 === API端点检查 ===');
  const apiTests = [
    { path: '/api/health', desc: '系统健康检查' },
    { path: '/api/check-env', desc: '环境配置检查' },
    { path: '/api/check-creem-config', desc: 'Creem支付配置' },
    { path: '/api/credits', desc: '积分查询API' },
    { path: '/api/user/sync', desc: '用户同步API' },
    { path: '/api/webhook-info', desc: 'Webhook信息' },
  ];
  
  const apiResults = [];
  for (const test of apiTests) {
    const result = await testEndpoint(test.path, test.desc);
    apiResults.push({ ...test, ...result });
    
    // 特殊处理某些API的详细信息
    if (result.success && result.data) {
      if (test.path === '/api/check-env') {
        console.log(`   📊 数据库连接: ${result.data.HAS_DATABASE_URL ? '✅' : '❌'}`);
        console.log(`   📊 Clerk配置: ${result.data.HAS_CLERK_SECRET ? '✅' : '❌'}`);
        console.log(`   📊 测试模式: ${result.data.isTestMode ? '⚠️ 测试' : '✅ 生产'}`);
        console.log(`   📊 应用URL: ${result.data.NEXT_PUBLIC_APP_URL}`);
      }
      
      if (test.path === '/api/health') {
        console.log(`   📊 健康状态: ${result.data.status || 'unknown'}`);
        console.log(`   📊 时间戳: ${result.data.timestamp || 'N/A'}`);
      }
      
      if (test.path === '/api/check-creem-config') {
        console.log(`   📊 支付环境: ${result.data.isTestMode ? '⚠️ 测试' : '✅ 生产'}`);
        console.log(`   📊 产品配置: ${result.data.productIds ? '✅' : '❌'}`);
      }
    }
    
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 3. 支付系统检查
  console.log('💳 === 支付系统检查 ===');
  const paymentTests = [
    { path: '/payment/success', desc: '支付成功页面' },
    { path: '/payment/cancel', desc: '支付取消页面' },
    { path: '/api/payments/creem', desc: 'Creem支付API', expected: 405 }, // POST only
  ];
  
  const paymentResults = [];
  for (const test of paymentTests) {
    const result = await testEndpoint(test.path, test.desc, test.expected || 200);
    paymentResults.push({ ...test, ...result });
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 4. 数据库连接详细检查
  console.log('🗄️  === 数据库连接详细检查 ===');
  const dbResult = await testEndpoint('/api/check-env', '数据库连接状态');
  if (dbResult.success && dbResult.data) {
    const hasDB = dbResult.data.HAS_DATABASE_URL;
    console.log(`数据库连接: ${hasDB ? '✅ 正常' : '❌ 失败'}`);
    
    if (hasDB) {
      console.log('尝试测试数据库操作...');
      // 测试需要数据库的API
      const dbTests = [
        { path: '/api/credits', desc: '积分查询（需要数据库）' },
        { path: '/api/user/videos', desc: '视频查询（需要数据库）' },
        { path: '/api/user/purchases', desc: '购买记录（需要数据库）' },
      ];
      
      for (const test of dbTests) {
        const result = await testEndpoint(test.path, test.desc);
        console.log(`   ${test.desc}: ${result.success ? '✅' : '❌'} (${result.status})`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }
  console.log('');
  
  // 5. 汇总报告
  console.log('📊 === 全面检查汇总报告 ===');
  
  const allResults = [...pageResults, ...apiResults, ...paymentResults];
  const totalTests = allResults.length;
  const successfulTests = allResults.filter(r => r.success).length;
  const failedTests = totalTests - successfulTests;
  
  console.log(`总测试数: ${totalTests}`);
  console.log(`✅ 成功: ${successfulTests}`);
  console.log(`❌ 失败: ${failedTests}`);
  console.log(`成功率: ${((successfulTests / totalTests) * 100).toFixed(1)}%`);
  
  // 详细失败报告
  if (failedTests > 0) {
    console.log('\n❌ 失败的测试:');
    allResults.filter(r => !r.success).forEach(result => {
      console.log(`   - ${result.desc}: ${result.status || result.error}`);
    });
  }
  
  // 关键系统状态
  console.log('\n🔍 关键系统状态:');
  const envCheck = allResults.find(r => r.path === '/api/check-env');
  if (envCheck && envCheck.success && envCheck.data) {
    const data = envCheck.data;
    console.log(`📊 数据库: ${data.HAS_DATABASE_URL ? '✅ 已连接' : '❌ 未连接'}`);
    console.log(`📊 认证: ${data.HAS_CLERK_SECRET ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`📊 环境: ${data.isTestMode ? '⚠️ 测试模式' : '✅ 生产模式'}`);
    console.log(`📊 支付: ${data.CREEM_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
  }
  
  // 最终评估
  console.log('\n🎯 最终评估:');
  if (successfulTests === totalTests) {
    console.log('🎉 所有系统完全正常！用户可以正常使用所有功能。');
  } else if (successfulTests >= totalTests * 0.9) {
    console.log('✅ 系统基本正常，有少量非关键问题。');
  } else if (successfulTests >= totalTests * 0.7) {
    console.log('⚠️  系统部分正常，存在一些问题需要关注。');
  } else {
    console.log('❌ 系统存在较多问题，需要立即修复。');
  }
  
  return successfulTests === totalTests;
}

comprehensiveCheck(); 