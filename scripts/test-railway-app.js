#!/usr/bin/env node

const https = require('https');

const RAILWAY_URL = 'https://asmr01-production.up.railway.app';

console.log('🚂 测试Railway应用状态...\n');

// 测试主页
function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${RAILWAY_URL}${path}`;
    console.log(`🔍 测试 ${description}: ${url}`);
    
    https.get(url, (res) => {
      console.log(`   状态码: ${res.statusCode}`);
      console.log(`   响应头: ${JSON.stringify(res.headers['content-type'])}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ ${description} 正常`);
        } else {
          console.log(`   ❌ ${description} 异常`);
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`   ❌ ${description} 连接失败: ${err.message}`);
      resolve();
    });
  });
}

async function runTests() {
  await testEndpoint('/', '主页');
  await testEndpoint('/api/health', '健康检查');
  await testEndpoint('/api/check-env', '环境检查');
  await testEndpoint('/api/check-creem-config', 'Creem配置检查');
  
  console.log('\n📋 Railway配置建议:');
  console.log('1. 在Railway Variables中添加所有生产环境变量');
  console.log('2. 特别是Clerk的生产环境密钥');
  console.log('3. 确保CREEM_API_KEY和CREEM_WEBHOOK_SECRET已设置');
  console.log('4. 检查数据库连接是否正常');
  
  console.log('\n🔧 下一步操作:');
  console.log('1. 登录Railway Dashboard');
  console.log('2. 进入asmr01项目');
  console.log('3. 在Variables标签页添加缺失的环境变量');
  console.log('4. 重新部署应用');
}

runTests(); 