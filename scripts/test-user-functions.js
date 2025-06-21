#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://cuttingasmr.org';

console.log('👤 测试用户功能...\n');

// 测试API端点
async function testAPI(path, description) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    console.log(`🔍 测试 ${description}: ${path}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`   状态码: ${res.statusCode}`);
          
          if (res.statusCode === 200) {
            console.log(`   ✅ ${description} 正常`);
            
            // 特殊处理不同API的响应
            if (path === '/api/check-env') {
              console.log(`   📊 数据库连接: ${result.HAS_DATABASE_URL ? '✅' : '❌'}`);
              console.log(`   📊 Clerk配置: ${result.HAS_CLERK_SECRET ? '✅' : '❌'}`);
              console.log(`   📊 测试模式: ${result.isTestMode ? '⚠️ 测试' : '✅ 生产'}`);
            }
            
            if (path === '/api/health') {
              console.log(`   📊 健康状态: ${result.status || 'unknown'}`);
            }
            
          } else {
            console.log(`   ❌ ${description} 异常: ${result.error || '未知错误'}`);
          }
          
          resolve({ success: res.statusCode === 200, data: result });
        } catch (error) {
          console.log(`   ❌ ${description} 响应解析失败: ${error.message}`);
          resolve({ success: false, error: error.message });
        }
      });
    }).on('error', (err) => {
      console.log(`   ❌ ${description} 连接失败: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
  });
}

async function runTests() {
  console.log(`🌐 测试目标: ${BASE_URL}`);
  console.log(`⏰ 测试时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  const tests = [
    { path: '/api/health', desc: '系统健康检查' },
    { path: '/api/check-env', desc: '环境配置检查' },
    { path: '/api/check-creem-config', desc: 'Creem支付配置' },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testAPI(test.path, test.desc);
    results.push({ ...test, ...result });
    console.log(''); // 空行
    
    // 添加延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 汇总结果
  console.log('📊 测试结果汇总:');
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ 成功: ${successful}/${total}`);
  console.log(`❌ 失败: ${total - successful}/${total}`);
  
  // 关键问题检查
  const envCheck = results.find(r => r.path === '/api/check-env');
  if (envCheck && envCheck.success) {
    const hasDB = envCheck.data.HAS_DATABASE_URL;
    const hasClerk = envCheck.data.HAS_CLERK_SECRET;
    const isTest = envCheck.data.isTestMode;
    
    console.log('\n🔍 关键配置状态:');
    console.log(`📊 数据库连接: ${hasDB ? '✅ 已配置' : '❌ 缺失（这是主要问题！）'}`);
    console.log(`📊 用户认证: ${hasClerk ? '✅ 已配置' : '❌ 缺失'}`);
    console.log(`📊 运行模式: ${isTest ? '⚠️ 测试模式' : '✅ 生产模式'}`);
    
    if (!hasDB) {
      console.log('\n🚨 数据库连接缺失解释了以下问题:');
      console.log('- 用户登录后看不到积分余额');
      console.log('- 无法查看视频历史记录');
      console.log('- 无法查看购买记录');
      console.log('- 可能无法生成新视频');
      
      console.log('\n💡 解决方案:');
      console.log('1. 确认在Cloudflare Pages中添加了DATABASE_URL环境变量');
      console.log('2. 触发重新部署（推送代码或手动重新部署）');
      console.log('3. 等待几分钟后重新测试');
    }
  }
  
  return successful === total;
}

runTests(); 