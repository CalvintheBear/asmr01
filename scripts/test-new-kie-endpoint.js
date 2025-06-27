const fetch = require('node-fetch');
const dns = require('dns').promises;

async function testNewKieEndpoint() {
  console.log('🔍 测试新的 kie.ai API 端点...\n');

  const oldEndpoint = 'https://api.kie.ai';
  const newEndpoint = 'https://kieai.erweima.ai';
  const testApiKey = process.env.VEO3_API_KEY || 'c982688b5c6938943dd721ed1d576edb';

  // 1. DNS解析测试
  console.log('📍 1. DNS解析测试');
  console.log('═══════════════════════════════');
  
  const domains = [
    'api.kie.ai',
    'kieai.erweima.ai'
  ];

  for (const domain of domains) {
    try {
      const addresses = await dns.lookup(domain);
      console.log(`✅ ${domain}: 可解析 -> ${addresses.address}`);
    } catch (error) {
      console.log(`❌ ${domain}: DNS解析失败 - ${error.message}`);
    }
  }

  // 2. HTTP连通性测试
  console.log('\n🌐 2. HTTP连通性测试');
  console.log('═══════════════════════════════');
  
  const endpoints = [oldEndpoint, newEndpoint];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 测试: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'CuttingASMR-EndpointTest/1.0'
        }
      });
      console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }

  // 3. API端点测试
  console.log('\n🔧 3. API端点功能测试');
  console.log('═══════════════════════════════');
  
  // 测试VEO API端点
  const apiPaths = [
    '/api/v1/veo/generate',
    '/api/v1/veo/record-info',
    '/api/v1/veo/get1080p'
  ];

  for (const endpoint of [oldEndpoint, newEndpoint]) {
    console.log(`\n📋 测试端点: ${endpoint}`);
    
    for (const path of apiPaths) {
      try {
        const fullUrl = `${endpoint}${path}`;
        console.log(`🔍 测试路径: ${path}`);
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          timeout: 15000,
          headers: {
            'Authorization': `Bearer ${testApiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'CuttingASMR-APITest/1.0'
          }
        });
        
        console.log(`   📊 状态: ${response.status} ${response.statusText}`);
        
        if (response.status === 404) {
          console.log(`   ⚠️ 端点不存在或路径错误`);
        } else if (response.status === 401) {
          console.log(`   🔑 需要认证 (正常)`);
        } else if (response.status === 200) {
          console.log(`   ✅ 端点正常响应`);
        } else {
          console.log(`   📄 其他状态码`);
        }
        
      } catch (error) {
        console.log(`   ❌ 连接失败: ${error.message}`);
      }
    }
  }

  // 4. 实际API调用测试 (使用新端点)
  console.log('\n🎯 4. 新端点实际API调用测试');
  console.log('═══════════════════════════════');
  
  try {
    console.log('🔑 使用测试API密钥发起 VEO 生成请求...');
    
    const response = await fetch(`${newEndpoint}/api/v1/veo/generate`, {
      method: 'POST',
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${testApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CuttingASMR-VEOTest/1.0'
      },
      body: JSON.stringify({
        prompt: 'test connectivity - a simple animation',
        model: 'veo3_fast',
        aspectRatio: '16:9',
        duration: '8'
      })
    });

    console.log(`📊 API响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API调用成功!');
      console.log('📄 响应数据:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('⚠️ API返回错误:');
      console.log('📄 错误内容:', errorText);
    }
  } catch (error) {
    console.log('❌ API调用失败:', error.message);
  }

  // 5. 总结
  console.log('\n📋 5. 测试总结');
  console.log('═══════════════════════════════');
  console.log('基于测试结果：');
  console.log('');
  console.log('如果新端点 kieai.erweima.ai 可正常工作：');
  console.log('  ✅ 立即更新环境变量配置');
  console.log('  🔄 重新部署应用');
  console.log('  🧪 测试视频生成功能');
  console.log('');
  console.log('📋 需要更新的配置：');
  console.log(`  旧值: VEO3_API_BASE_URL=${oldEndpoint}`);
  console.log(`  新值: VEO3_API_BASE_URL=${newEndpoint}`);
  console.log('');
  console.log('🎯 更新位置：');
  console.log('  • CloudFlare Pages 环境变量');
  console.log('  • Railway 环境变量');
  console.log('  • 本地 .env 文件 (如果有)');
}

// 执行测试
testNewKieEndpoint().catch(console.error); 