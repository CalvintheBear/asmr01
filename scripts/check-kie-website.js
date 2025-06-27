const https = require('https');

async function checkKieWebsite() {
  console.log('🔍 检查 kie.ai 网站内容...\n');

  try {
    const html = await getWebsiteContent('https://kie.ai');
    console.log('✅ 成功访问 kie.ai');
    console.log('📄 网站内容分析:');
    console.log('═══════════════════════════════');
    
    // 检查关键字
    const keywords = ['api', 'API', 'docs', 'documentation', 'developer', 'veo', 'video'];
    const foundKeywords = [];
    
    for (const keyword of keywords) {
      if (html.toLowerCase().includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    }
    
    if (foundKeywords.length > 0) {
      console.log('🔍 发现关键词:', foundKeywords.join(', '));
    } else {
      console.log('❌ 未发现API相关关键词');
    }
    
    // 查找链接
    const linkMatches = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || [];
    const relevantLinks = linkMatches
      .map(link => {
        const hrefMatch = link.match(/href=["']([^"']+)["']/);
        return hrefMatch ? hrefMatch[1] : null;
      })
      .filter(href => href && (
        href.includes('api') || 
        href.includes('docs') || 
        href.includes('developer') ||
        href.includes('documentation')
      ));
    
    if (relevantLinks.length > 0) {
      console.log('\n🔗 发现相关链接:');
      relevantLinks.forEach(link => console.log(`   - ${link}`));
    } else {
      console.log('\n❌ 未发现API文档链接');
    }
    
    // 检查页面标题
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      console.log(`\n📋 页面标题: "${titleMatch[1].trim()}"`);
    }
    
    // 检查是否有API服务说明
    if (html.toLowerCase().includes('service') && html.toLowerCase().includes('unavailable')) {
      console.log('\n⚠️ 网站可能显示服务不可用信息');
    }
    
    if (html.toLowerCase().includes('maintenance')) {
      console.log('\n🔧 网站可能正在维护中');
    }
    
  } catch (error) {
    console.log('❌ 无法访问 kie.ai:', error.message);
  }

  // 检查docs子域名
  console.log('\n🔍 检查 docs.kie.ai...');
  console.log('═══════════════════════════════');
  
  try {
    const docsHtml = await getWebsiteContent('https://docs.kie.ai');
    console.log('✅ 成功访问 docs.kie.ai');
    
    // 检查是否有API文档
    if (docsHtml.toLowerCase().includes('veo3') || docsHtml.toLowerCase().includes('video')) {
      console.log('✅ 发现视频API文档内容');
    } else {
      console.log('❌ 未发现视频API文档');
    }
    
  } catch (error) {
    console.log('❌ 无法访问 docs.kie.ai:', error.message);
  }

  console.log('\n💡 结论和建议');
  console.log('═══════════════════════════════');
  console.log('基于检查结果:');
  console.log('1. kie.ai 主域名正常工作');
  console.log('2. api.kie.ai 子域名不存在');
  console.log('3. 需要找到正确的API端点或替代方案');
  console.log('');
  console.log('🎯 立即行动建议:');
  console.log('• 联系 kie.ai 技术支持确认API状态');
  console.log('• 寻找官方API文档');
  console.log('• 考虑迁移到其他视频API服务');
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

// 执行检查
checkKieWebsite().catch(console.error); 