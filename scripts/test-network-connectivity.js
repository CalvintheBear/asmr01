const fetch = require('node-fetch');
const dns = require('dns').promises;

async function testNetworkConnectivity() {
  console.log('🌐 开始测试网络连通性...\n');

  // 1. DNS解析测试
  console.log('🔍 1. DNS解析测试');
  console.log('═══════════════════════════════');
  try {
    const addresses = await dns.lookup('api.kie.ai');
    console.log('✅ DNS解析成功:', addresses);
  } catch (error) {
    console.log('❌ DNS解析失败:', error.message);
  }

  // 2. 基础连通性测试
  console.log('\n🔗 2. 基础连通性测试');
  console.log('═══════════════════════════════');
  const endpoints = [
    'https://api.kie.ai',
    'https://api.kie.ai/v1',
    'https://api.kie.ai/health',
    'https://kie.ai'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🌐 测试端点: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'CuttingASMR-NetworkTest/1.0'
        }
      });
      console.log(`✅ 响应状态: ${response.status} ${response.statusText}`);
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.text();
        console.log(`📄 响应内容: ${data.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ 连接失败: ${error.message}`);
      if (error.code) {
        console.log(`🔍 错误代码: ${error.code}`);
      }
    }
    console.log('');
  }

  // 3. 完整API调用测试
  console.log('🔧 3. 完整API调用测试');
  console.log('═══════════════════════════════');
  const testApiKey = 'c982688b5c6938943dd721ed1d576edb';
  
  try {
    console.log('🔑 使用测试API密钥发起请求...');
    const response = await fetch('https://api.kie.ai/v1/veo3_fast/generate', {
      method: 'POST',
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${testApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CuttingASMR-ConnectivityTest/1.0'
      },
      body: JSON.stringify({
        prompt: 'test connectivity',
        style: 'minimal'
      })
    });

    console.log(`✅ API响应状态: ${response.status} ${response.statusText}`);
    
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
    if (error.code) {
      console.log(`🔍 错误代码: ${error.code}`);
    }
  }

  // 4. 其他API服务测试（对比）
  console.log('\n🌍 4. 对比测试其他服务');
  console.log('═══════════════════════════════');
  const compareEndpoints = [
    'https://httpbin.org/get',
    'https://api.github.com',
    'https://jsonplaceholder.typicode.com/posts/1'
  ];

  for (const endpoint of compareEndpoints) {
    try {
      console.log(`🔍 测试: ${endpoint}`);
      const response = await fetch(endpoint, { timeout: 10000 });
      console.log(`✅ 状态: ${response.status} - 网络连接正常`);
    } catch (error) {
      console.log(`❌ 失败: ${error.message}`);
    }
  }

  console.log('\n📊 测试总结');
  console.log('═══════════════════════════════');
  console.log('如果上述测试显示其他API正常但kie.ai失败，');
  console.log('则问题可能是：');
  console.log('1. 🔒 kie.ai服务临时不可用');
  console.log('2. 🌐 网络防火墙限制');
  console.log('3. 🚫 IP地址被封禁');
  console.log('4. 📍 地区访问限制');
  console.log('\n💡 建议联系kie.ai技术支持确认服务状态');
}

// 执行测试
testNetworkConnectivity().catch(console.error); 