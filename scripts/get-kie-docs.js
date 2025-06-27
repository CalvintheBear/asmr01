const https = require('https');

async function getKieDocs() {
  console.log('📖 获取 kie.ai API 文档...\n');

  try {
    const html = await getWebsiteContent('https://docs.kie.ai');
    
    console.log('✅ 成功获取 docs.kie.ai 内容');
    console.log('📄 正在分析API端点信息...\n');
    
    // 查找API端点
    const apiEndpoints = [];
    
    // 查找URL模式
    const urlPatterns = [
      /https?:\/\/[a-zA-Z0-9.-]+\.kie\.ai[\/\w\-._~:/?#[\]@!$&'()*+,;=]*/g,
      /https?:\/\/api[a-zA-Z0-9.-]*\.kie\.ai[\/\w\-._~:/?#[\]@!$&'()*+,;=]*/g,
      /https?:\/\/[a-zA-Z0-9.-]*api[a-zA-Z0-9.-]*[\/\w\-._~:/?#[\]@!$&'()*+,;=]*/g
    ];
    
    for (const pattern of urlPatterns) {
      const matches = html.match(pattern) || [];
      apiEndpoints.push(...matches);
    }
    
    // 去重并过滤
    const uniqueEndpoints = [...new Set(apiEndpoints)]
      .filter(url => url && !url.includes('docs.kie.ai'))
      .sort();
    
    if (uniqueEndpoints.length > 0) {
      console.log('🔗 发现的API端点:');
      console.log('═══════════════════════════════');
      uniqueEndpoints.forEach(endpoint => {
        console.log(`   📍 ${endpoint}`);
      });
    }
    
    // 查找具体的API信息
    console.log('\n🔍 查找VEO3相关API信息:');
    console.log('═══════════════════════════════');
    
    const veoPatterns = [
      /veo[^"'\s<>]*generate[^"'\s<>]*/gi,
      /generate[^"'\s<>]*veo[^"'\s<>]*/gi,
      /\/api\/[^"'\s<>]*veo[^"'\s<>]*/gi,
      /\/v\d+\/[^"'\s<>]*veo[^"'\s<>]*/gi
    ];
    
    const veoEndpoints = [];
    for (const pattern of veoPatterns) {
      const matches = html.match(pattern) || [];
      veoEndpoints.push(...matches);
    }
    
    if (veoEndpoints.length > 0) {
      console.log('📹 VEO相关端点:');
      [...new Set(veoEndpoints)].forEach(endpoint => {
        console.log(`   🎬 ${endpoint}`);
      });
    }
    
    // 查找端口或其他域名
    console.log('\n🌐 查找其他可能的域名或端口:');
    console.log('═══════════════════════════════');
    
    const domainPatterns = [
      /[a-zA-Z0-9.-]+\.kie\.ai/g,
      /kie\.ai:\d+/g,
      /\d+\.\d+\.\d+\.\d+:\d+/g
    ];
    
    const domains = [];
    for (const pattern of domainPatterns) {
      const matches = html.match(pattern) || [];
      domains.push(...matches);
    }
    
    const uniqueDomains = [...new Set(domains)].sort();
    if (uniqueDomains.length > 0) {
      uniqueDomains.forEach(domain => {
        console.log(`   🌍 ${domain}`);
      });
    } else {
      console.log('   ❌ 未发现其他域名');
    }
    
    // 查找认证信息
    console.log('\n🔑 查找API认证信息:');
    console.log('═══════════════════════════════');
    
    const authKeywords = ['bearer', 'api key', 'token', 'authorization', 'auth'];
    const foundAuth = [];
    
    for (const keyword of authKeywords) {
      if (html.toLowerCase().includes(keyword)) {
        foundAuth.push(keyword);
      }
    }
    
    if (foundAuth.length > 0) {
      console.log('🔐 发现认证相关信息:', foundAuth.join(', '));
    } else {
      console.log('❌ 未发现认证信息');
    }
    
    // 查找错误信息或维护通知
    console.log('\n⚠️ 查找服务状态信息:');
    console.log('═══════════════════════════════');
    
    const statusKeywords = [
      'maintenance', 'unavailable', 'down', 'offline', 
      'temporarily', 'service', 'error', '404', '503'
    ];
    
    const statusInfo = [];
    for (const keyword of statusKeywords) {
      if (html.toLowerCase().includes(keyword)) {
        statusInfo.push(keyword);
      }
    }
    
    if (statusInfo.length > 0) {
      console.log('⚠️ 发现状态相关信息:', statusInfo.join(', '));
    } else {
      console.log('✅ 未发现服务异常信息');
    }
    
  } catch (error) {
    console.log('❌ 无法获取文档:', error.message);
  }

  console.log('\n📋 总结建议:');
  console.log('═══════════════════════════════');
  console.log('基于文档分析结果，建议：');
  console.log('1. 使用上述发现的API端点替换 api.kie.ai');
  console.log('2. 如果没有发现有效端点，联系kie.ai技术支持');
  console.log('3. 考虑备用方案：迁移到其他视频API服务');
  console.log('4. 检查你的API密钥是否仍然有效');
}

function getWebsiteContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
      
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 执行获取
getKieDocs().catch(console.error); 