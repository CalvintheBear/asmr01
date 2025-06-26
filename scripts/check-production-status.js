#!/usr/bin/env node

const https = require('https');

console.log('🔍 检查生产环境状态...\n');

// 检查的API端点
const endpoints = [
  {
    name: '环境配置检查',
    url: 'https://cuttingasmr.org/api/check-creem-config',
    checkFn: (data) => {
      if (data.environment?.isTestMode === false) {
        return '✅ 生产环境配置正确';
      } else {
        return '❌ 仍在测试模式';
      }
    }
  },
  {
    name: '购买历史API',
    url: 'https://cuttingasmr.org/api/user/purchases',
    checkFn: (data, statusCode) => {
      if (statusCode === 401) {
        return '✅ API受保护 (需要登录)';
      }
      if (data.error === '未授权访问') {
        return '✅ API正常（需要登录）';
      } else if (data.success) {
        return '✅ API正常，有购买记录';
      } else {
        return '❌ API错误: ' + (data.error || '未知错误');
      }
    }
  },
  {
    name: '积分API',
    url: 'https://cuttingasmr.org/api/credits',
    checkFn: (data, statusCode) => {
      if (statusCode === 401) {
        return '✅ API受保护 (需要登录)';
      }
      if (data.error === '未授权访问') {
        return '✅ API正常（需要登录）';
      } else if (data.success) {
        return '✅ API正常，积分: ' + data.data?.remainingCredits;
      } else {
        return '❌ API错误: ' + (data.error || '未知错误');
      }
    }
  },
  {
    name: '健康检查',
    url: 'https://cuttingasmr.org/api/health',
    checkFn: (data) => {
      if (data.status === 'healthy') {
        return '✅ 服务正常';
      } else {
        return '❌ 服务异常';
      }
    }
  },
  {
    name: 'Creem Webhook',
    url: 'https://cuttingasmr.org/api/webhooks/creem',
    checkFn: (data, statusCode) => {
      if (statusCode === 405) {
        return '✅ Webhook端点存在 (仅接受POST)';
      }
      if (statusCode >= 400 && statusCode < 500) {
        return `✅ Webhook端点有响应 (状态码: ${statusCode})`;
      }
      if (statusCode === 200) {
        return '✅ Webhook端点存在';
      }
      return `❌ Webhook检查失败，状态码: ${statusCode}`;
    }
  }
];

// 检查单个端点
function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = https.get(endpoint.url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          const result = endpoint.checkFn(jsonData, res.statusCode);
          resolve({ name: endpoint.name, result, status: res.statusCode });
        } catch (error) {
          // 如果JSON解析失败，但我们有特定的状态码检查，仍然可以进行
          const result = endpoint.checkFn({}, res.statusCode);
          if (result.startsWith('✅')) {
            resolve({ name: endpoint.name, result, status: res.statusCode });
          } else {
            resolve({ name: endpoint.name, result: '❌ 响应格式错误', status: res.statusCode });
          }
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ name: endpoint.name, result: '❌ 连接失败: ' + error.message, status: 'ERROR' });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ name: endpoint.name, result: '❌ 请求超时', status: 'TIMEOUT' });
    });
  });
}

// 执行所有检查
async function runChecks() {
  console.log('📡 开始检查API端点...\n');
  
  for (const endpoint of endpoints) {
    console.log(`🔄 检查 ${endpoint.name}...`);
    const result = await checkEndpoint(endpoint);
    console.log(`   ${result.result} (状态码: ${result.status})`);
    console.log('');
  }
  
  console.log('🎯 检查完成！');
  console.log('\n📋 下一步操作：');
  console.log('1. 如果显示"仍在测试模式"，请检查环境变量是否正确设置');
  console.log('2. 如果API错误，请检查Cloudflare Pages构建日志');
  console.log('3. 修改环境变量后，需要重新部署应用');
}

runChecks().catch(console.error); 