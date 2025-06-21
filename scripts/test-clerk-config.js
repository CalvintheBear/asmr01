#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://cuttingasmr.org';

console.log('🔑 Clerk配置诊断开始...\n');

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
            resolve({ success: true, data: result });
          } else {
            console.log(`   ❌ ${description} 异常: ${result.error || '未知错误'}`);
            resolve({ success: false, data: result });
          }
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

async function testClerkConfig() {
  console.log(`🌐 检查目标: ${BASE_URL}`);
  console.log(`⏰ 检查时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  // 1. 检查环境配置
  console.log('🔧 === Clerk环境配置检查 ===');
  const envResult = await testAPI('/api/check-env', 'Clerk环境配置');
  
  if (envResult.success && envResult.data) {
    const data = envResult.data;
    console.log('\n📊 Clerk配置详情:');
    console.log(`   公钥: ${data.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'NOT_FOUND'}`);
    console.log(`   私钥: ${data.CLERK_SECRET_KEY || 'NOT_FOUND'}`);
    console.log(`   公钥存在: ${data.HAS_CLERK_PUBLISHABLE ? '✅' : '❌'}`);
    console.log(`   私钥存在: ${data.HAS_CLERK_SECRET ? '✅' : '❌'}`);
    console.log(`   环境类型: ${data.CLERK_ENV_TYPE || 'UNKNOWN'}`);
    
    // 验证密钥格式
    const pubKey = data.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const secKey = data.CLERK_SECRET_KEY;
    
    console.log('\n🔍 密钥格式验证:');
    if (pubKey) {
      const pubKeyValid = pubKey.startsWith('pk_live_') || pubKey.startsWith('pk_test_');
      console.log(`   公钥格式: ${pubKeyValid ? '✅ 正确' : '❌ 错误'}`);
      console.log(`   公钥前缀: ${pubKey.substring(0, 8)}`);
    }
    
    if (secKey) {
      const secKeyValid = secKey.startsWith('sk_live_') || secKey.startsWith('sk_test_');
      console.log(`   私钥格式: ${secKeyValid ? '✅ 正确' : '❌ 错误'}`);
      console.log(`   私钥前缀: ${secKey.substring(0, 8)}`);
    }
    
    // 检查环境一致性
    console.log('\n🔍 环境一致性检查:');
    if (pubKey && secKey) {
      const pubIsLive = pubKey.includes('_live_');
      const secIsLive = secKey.includes('_live_');
      const consistent = pubIsLive === secIsLive;
      
      console.log(`   公钥环境: ${pubIsLive ? 'LIVE' : 'TEST'}`);
      console.log(`   私钥环境: ${secIsLive ? 'LIVE' : 'TEST'}`);
      console.log(`   环境一致: ${consistent ? '✅ 一致' : '❌ 不一致'}`);
    }
  }
  
  console.log('\n');
  
  // 2. 测试需要认证的API
  console.log('🔐 === Clerk认证API测试 ===');
  const authTests = [
    { path: '/api/credits', desc: '积分查询API（需要认证）' },
    { path: '/api/user/sync', desc: '用户同步API（需要认证）' },
    { path: '/api/user/videos', desc: '视频查询API（需要认证）' },
  ];
  
  for (const test of authTests) {
    const result = await testAPI(test.path, test.desc);
    if (result.success) {
      console.log(`   ⚠️  ${test.desc}: 意外成功（应该需要认证）`);
    } else if (result.data && result.data.error) {
      if (result.data.error.includes('Unauthorized') || result.data.error.includes('401')) {
        console.log(`   ✅ ${test.desc}: 正确要求认证`);
      } else {
        console.log(`   ❌ ${test.desc}: 未知错误 - ${result.data.error}`);
      }
    } else {
      console.log(`   ❌ ${test.desc}: 连接失败`);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 3. 诊断建议
  console.log('\n💡 === Clerk问题诊断建议 ===');
  
  if (envResult.success && envResult.data) {
    const data = envResult.data;
    
    if (!data.HAS_CLERK_PUBLISHABLE || !data.HAS_CLERK_SECRET) {
      console.log('❌ 缺少必要的Clerk密钥');
      console.log('   解决方案: 在Railway环境变量中添加正确的Clerk密钥');
    } else if (data.CLERK_ENV_TYPE === 'UNKNOWN') {
      console.log('❌ Clerk密钥格式不正确');
      console.log('   解决方案: 检查密钥是否以pk_live_或sk_live_开头');
    } else if (data.CLERK_ENV_TYPE === 'LIVE') {
      console.log('✅ Clerk配置正确（生产环境）');
      console.log('');
      console.log('🔍 可能的Clerk加载失败原因:');
      console.log('1. 网络问题 - Clerk CDN无法访问');
      console.log('2. 域名配置 - Clerk应用中未添加cuttingasmr.org域名');
      console.log('3. 版本兼容性 - Next.js 15.2.3与Clerk 6.22.0兼容性');
      console.log('4. CSP策略 - 内容安全策略阻止Clerk脚本');
      console.log('');
      console.log('🔧 建议检查:');
      console.log('1. 登录Clerk Dashboard检查域名配置');
      console.log('2. 检查浏览器网络标签页的具体错误');
      console.log('3. 尝试降级Clerk版本到6.20.x');
      console.log('4. 检查是否有广告拦截器或安全软件干扰');
    }
  }
  
  console.log('\n🎯 诊断完成');
}

testClerkConfig(); 