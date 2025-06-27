const dns = require('dns').promises;
const https = require('https');

async function checkKieAiStatus() {
  console.log('🔍 检查 kie.ai 服务状态...\n');

  // 1. 检查主域名
  console.log('📍 1. 检查主域名状态');
  console.log('═══════════════════════════════');
  
  const domains = [
    'kie.ai',
    'api.kie.ai',
    'docs.kie.ai',
    'www.kie.ai'
  ];

  for (const domain of domains) {
    try {
      const addresses = await dns.lookup(domain);
      console.log(`✅ ${domain}: 可解析 -> ${addresses.address}`);
    } catch (error) {
      console.log(`❌ ${domain}: DNS解析失败 - ${error.message}`);
    }
  }

  // 2. 检查HTTP访问
  console.log('\n🌐 2. 检查HTTP服务状态');
  console.log('═══════════════════════════════');
  
  const httpEndpoints = [
    'https://kie.ai',
    'http://kie.ai',
    'https://www.kie.ai',
    'https://api.kie.ai'
  ];

  for (const endpoint of httpEndpoints) {
    try {
      const response = await makeHttpRequest(endpoint);
      console.log(`✅ ${endpoint}: ${response.statusCode} ${response.statusMessage}`);
      
      if (response.headers['content-type']) {
        console.log(`   📄 Content-Type: ${response.headers['content-type']}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }

  // 3. 检查Whois信息
  console.log('\n📋 3. 域名信息检查');
  console.log('═══════════════════════════════');
  
  try {
    const whoisData = await checkWhois('kie.ai');
    console.log('📊 域名信息:', whoisData);
  } catch (error) {
    console.log('❌ 无法获取域名信息:', error.message);
  }

  // 4. 建议
  console.log('\n💡 4. 问题分析和建议');
  console.log('═══════════════════════════════');
  
  console.log('基于检查结果，可能的情况：');
  console.log('');
  console.log('如果 kie.ai 主域名可访问但 api.kie.ai 不可访问：');
  console.log('  🔍 子域名配置问题');
  console.log('  📞 联系 kie.ai 技术支持');
  console.log('  ⏰ 等待服务恢复');
  console.log('');
  console.log('如果所有域名都不可访问：');
  console.log('  🚨 服务可能已下线');
  console.log('  🔄 需要寻找替代方案');
  console.log('  📱 建议迁移到其他视频API服务');
  console.log('');
  console.log('推荐的替代视频API服务：');
  console.log('  • Google Veo (Vertex AI) - 官方 Veo API');
  console.log('  • Stability AI Video - 稳定的视频生成');
  console.log('  • Runway ML API - 专业视频生成');
  console.log('  • OpenAI Sora (即将发布) - OpenAI 的视频模型');
}

function makeHttpRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'CuttingASMR-StatusCheck/1.0'
      }
    };

    const req = (urlObj.protocol === 'https:' ? https : require('http')).request(options, (res) => {
      resolve({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        headers: res.headers
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.setTimeout(10000);
    req.end();
  });
}

async function checkWhois(domain) {
  // 简单的域名状态检查
  try {
    const addresses = await dns.lookup(domain);
    return {
      status: '域名已注册且可解析',
      ip: addresses.address,
      family: addresses.family === 4 ? 'IPv4' : 'IPv6'
    };
  } catch (error) {
    return {
      status: '域名无法解析',
      error: error.message
    };
  }
}

// 执行检查
checkKieAiStatus().catch(console.error); 