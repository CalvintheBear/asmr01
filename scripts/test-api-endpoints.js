require('dotenv').config({ path: '.env.local' });

const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://cuttingasmr.org' 
  : 'http://localhost:3000';

async function testAPIEndpoints() {
  console.log('🔍 测试所有API端点...\n');

  const endpoints = [
    {
      name: '健康检查',
      url: '/api/health',
      method: 'GET'
    },
    {
      name: '环境变量检查',
      url: '/api/check-env',
      method: 'GET'
    },
    {
      name: 'Creem配置检查',
      url: '/api/check-creem-config',
      method: 'GET'
    },
    {
      name: '积分信息',
      url: '/api/credits',
      method: 'GET'
    },
    {
      name: '积分检查',
      url: '/api/credits-check',
      method: 'GET'
    },
    {
      name: '用户同步(GET)',
      url: '/api/user/sync',
      method: 'GET'
    },
    {
      name: '用户视频',
      url: '/api/user/videos',
      method: 'GET'
    },
    {
      name: '用户购买记录',
      url: '/api/user/purchases',
      method: 'GET'
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 测试 ${endpoint.name}...`);
      
      const response = await fetch(`${baseUrl}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name} - 状态: ${response.status}`);
        
        // 显示关键数据结构
        if (endpoint.url === '/api/credits') {
          console.log(`   数据格式: ${data.success ? '✅ 标准格式' : '❌ 旧格式'}`);
          if (data.success && data.data) {
            console.log(`   积分信息: 总${data.data.totalCredits} 已用${data.data.usedCredits} 剩余${data.data.remainingCredits}`);
          }
        }
        
        if (endpoint.url === '/api/user/videos') {
          console.log(`   视频数量: ${data.success && data.data ? data.data.videos.length : '未知'}`);
        }
        
        if (endpoint.url === '/api/user/purchases') {
          console.log(`   购买记录: ${data.success && data.data ? data.data.purchases.length : '未知'}`);
        }
        
      } else {
        console.log(`⚠️ ${endpoint.name} - 状态: ${response.status}`);
        console.log(`   错误: ${data.error || data.message || '未知错误'}`);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name} - 网络错误:`);
      console.log(`   ${error.message}`);
    }
    
    console.log(''); // 空行分隔
  }

  console.log('🎉 API端点测试完成！');
}

// 运行测试
testAPIEndpoints().catch(error => {
  console.error('💥 测试失败:', error);
  process.exit(1);
}); 