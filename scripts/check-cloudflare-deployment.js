#!/usr/bin/env node

const https = require('https');

const CLOUDFLARE_URL = 'https://cuttingasmr.org';

console.log('☁️  检查Cloudflare Pages部署状态...\n');

// 测试端点
function testEndpoint(path, description, timeout = 10000) {
  return new Promise((resolve) => {
    const url = `${CLOUDFLARE_URL}${path}`;
    console.log(`🔍 测试 ${description}: ${url}`);
    
    const req = https.get(url, { timeout }, (res) => {
      console.log(`   状态码: ${res.statusCode}`);
      console.log(`   响应头: ${res.headers['content-type'] || 'N/A'}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ ${description} 正常`);
          
          // 检查关键内容
          if (path === '/') {
            if (data.includes('ASMR') || data.includes('视频生成')) {
              console.log('   ✅ 主页内容正常');
            } else {
              console.log('   ⚠️  主页内容可能异常');
            }
          }
        } else if (res.statusCode === 404) {
          console.log(`   ❌ ${description} 页面不存在`);
        } else if (res.statusCode >= 500) {
          console.log(`   ❌ ${description} 服务器错误`);
        } else {
          console.log(`   ⚠️  ${description} 状态异常`);
        }
        resolve({ status: res.statusCode, success: res.statusCode === 200 });
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ ${description} 连接失败: ${err.message}`);
      resolve({ status: 0, success: false });
    });
    
    req.on('timeout', () => {
      console.log(`   ⏰ ${description} 请求超时`);
      req.destroy();
      resolve({ status: 0, success: false });
    });
  });
}

async function checkDeploymentStatus() {
  console.log('📋 检查部署状态...\n');
  
  const tests = [
    { path: '/', desc: '主页' },
    { path: '/api/health', desc: '健康检查API' },
    { path: '/api/check-env', desc: '环境检查API' },
    { path: '/api/check-creem-config', desc: 'Creem配置检查API' },
    { path: '/dashboard', desc: '仪表板页面' },
    { path: '/pricing', desc: '定价页面' },
    { path: '/profile', desc: '个人中心页面' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.desc);
    results.push({ ...test, ...result });
    console.log(''); // 空行分隔
    
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 汇总结果
  console.log('📊 部署状态汇总:');
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ 成功: ${successful}/${total}`);
  console.log(`❌ 失败: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 Cloudflare Pages部署完全成功！');
  } else if (successful > total / 2) {
    console.log('\n⚠️  Cloudflare Pages部分功能正常，可能需要等待部署完成');
  } else {
    console.log('\n❌ Cloudflare Pages部署可能存在问题');
  }
  
  // 详细结果
  console.log('\n📋 详细结果:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.desc}: ${result.status}`);
  });
  
  // 检查建议
  console.log('\n💡 检查建议:');
  console.log('1. 如果部署刚开始，请等待2-3分钟再检查');
  console.log('2. 检查Cloudflare Pages构建日志');
  console.log('3. 确认环境变量配置正确');
  console.log('4. 验证Railway数据库连接');
  
  return successful === total;
}

// 检查环境变量配置
async function checkEnvironmentConfig() {
  console.log('🔧 检查环境配置...\n');
  
  try {
    const result = await testEndpoint('/api/check-env', '环境配置检查');
    if (result.success) {
      console.log('✅ 环境配置API可访问');
    } else {
      console.log('❌ 环境配置API不可访问');
    }
  } catch (error) {
    console.log('❌ 环境配置检查失败:', error.message);
  }
}

async function main() {
  console.log(`🌐 目标网站: ${CLOUDFLARE_URL}`);
  console.log(`⏰ 检查时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  // 先检查基本连通性
  console.log('🔍 基本连通性检查...');
  const basicCheck = await testEndpoint('/', '网站基本访问');
  
  if (!basicCheck.success) {
    console.log('\n❌ 网站基本访问失败，可能原因:');
    console.log('1. Cloudflare Pages还在部署中');
    console.log('2. DNS解析问题');
    console.log('3. 构建失败');
    console.log('\n建议等待几分钟后重试');
    return;
  }
  
  console.log('\n✅ 网站基本访问正常，继续详细检查...\n');
  
  // 详细检查
  const allGood = await checkDeploymentStatus();
  
  // 环境配置检查
  await checkEnvironmentConfig();
  
  if (allGood) {
    console.log('\n🎯 部署验证完成！可以开始测试应用功能');
  } else {
    console.log('\n⚠️  部署可能需要更多时间，建议稍后再检查');
  }
}

main(); 