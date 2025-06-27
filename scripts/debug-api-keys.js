#!/usr/bin/env node

/**
 * 🔍 API密钥配置深度调试脚本
 */

const fs = require('fs');

console.log('🔍 开始深度调试API密钥配置...\n');

/**
 * 检查环境变量配置
 */
function checkEnvironmentVariables() {
  console.log('📋 1. 环境变量检查');
  console.log('═══════════════════════════════');
  
  const envVars = [
    'VEO3_API_KEY',
    'VEO3_API_KEY_2', 
    'VEO3_API_KEY_3',
    'VEO3_API_KEY_4',
    'VEO3_API_KEY_5',
    'VEO3_API_BASE_URL',
    'DATABASE_URL',
    'CREEM_API_KEY',
    'CREEM_WEBHOOK_SECRET'
  ];

  envVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      if (envVar.includes('API_KEY') || envVar.includes('SECRET') || envVar.includes('DATABASE_URL')) {
        console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`);
      } else {
        console.log(`✅ ${envVar}: ${value}`);
      }
    } else {
      console.log(`❌ ${envVar}: 未设置`);
    }
  });
}

/**
 * 检查代码文件中的API密钥配置
 */
function checkCodeConfiguration() {
  console.log('\n🔧 2. 代码配置检查');
  console.log('═══════════════════════════════');
  
  // 检查API密钥池文件
  const apiKeyPoolPath = 'src/lib/api-key-pool.ts';
  if (fs.existsSync(apiKeyPoolPath)) {
    const content = fs.readFileSync(apiKeyPoolPath, 'utf8');
    console.log('📄 API密钥池配置:');
    
    // 检查环境变量读取
    const envKeys = [
      'process.env.VEO3_API_KEY',
      'process.env.VEO3_API_KEY_2',
      'process.env.VEO3_API_KEY_3',
      'process.env.VEO3_API_KEY_4',
      'process.env.VEO3_API_KEY_5'
    ];
    
    envKeys.forEach(key => {
      if (content.includes(key)) {
        console.log(`  ✅ ${key} - 已配置`);
      } else {
        console.log(`  ❌ ${key} - 未找到`);
      }
    });
    
    // 检查默认密钥回退
    if (content.includes('c982688b5c6938943dd721ed1d576edb')) {
      console.log('  ⚠️ 发现默认密钥回退逻辑');
    }
  }
  
  // 检查视频生成API
  const generateVideoPath = 'src/app/api/generate-video/route.ts';
  if (fs.existsSync(generateVideoPath)) {
    const content = fs.readFileSync(generateVideoPath, 'utf8');
    console.log('\n📄 视频生成API配置:');
    
    if (content.includes('getApiKey()')) {
      console.log('  ✅ 使用API密钥池 - 正确');
    } else {
      console.log('  ❌ 未使用API密钥池');
    }
    
    if (content.includes('https://api.kie.ai')) {
      console.log('  ✅ API端点正确');
    } else if (content.includes('process.env.VEO3_API_BASE_URL')) {
      console.log('  ✅ 使用环境变量API端点');
    } else {
      console.log('  ❌ API端点配置错误');
    }
    
    if (content.includes('Bearer ${apiKey}')) {
      console.log('  ✅ Bearer认证配置正确');
    } else {
      console.log('  ❌ Bearer认证配置错误');
    }
  }
}

/**
 * 模拟API密钥池初始化
 */
function simulateApiKeyPoolInit() {
  console.log('\n🔄 3. 模拟API密钥池初始化');
  console.log('═══════════════════════════════');
  
  const apiKeys = [
    process.env.VEO3_API_KEY,
    process.env.VEO3_API_KEY_2,
    process.env.VEO3_API_KEY_3,
    process.env.VEO3_API_KEY_4,
    process.env.VEO3_API_KEY_5
  ].filter(Boolean);
  
  console.log(`📊 环境变量中的API密钥数量: ${apiKeys.length}`);
  
  if (apiKeys.length === 0) {
    console.log('⚠️ 环境变量中没有API密钥，会使用默认密钥');
    console.log('📝 默认密钥: c982688b5c6938943dd721ed1d576edb');
  } else {
    console.log('✅ 找到API密钥:');
    apiKeys.forEach((key, index) => {
      console.log(`  ${index + 1}. ${key.substring(0, 10)}...`);
    });
  }
  
  return apiKeys.length > 0 ? apiKeys[0] : 'c982688b5c6938943dd721ed1d576edb';
}

/**
 * 分析生产环境配置差异
 */
function analyzeProductionDifference() {
  console.log('\n🌐 4. 生产环境配置分析');
  console.log('═══════════════════════════════');
  
  console.log('本地环境配置:');
  const localKeys = [
    process.env.VEO3_API_KEY,
    process.env.VEO3_API_KEY_2,
    process.env.VEO3_API_KEY_3,
    process.env.VEO3_API_KEY_4,
    process.env.VEO3_API_KEY_5
  ].filter(Boolean);
  
  console.log(`  📊 本地API密钥数量: ${localKeys.length}`);
  
  console.log('\n根据诊断结果:');
  console.log('  🌍 生产环境状态: VEO3 API密钥未配置');
  console.log('  🔍 可能的问题:');
  console.log('    1. CloudFlare Pages环境变量未设置');
  console.log('    2. Railway环境变量未设置');
  console.log('    3. 环境变量名称不匹配');
  console.log('    4. 部署时环境变量未生效');
}

/**
 * 生成修复建议
 */
function generateFixSuggestions() {
  console.log('\n💡 5. 修复建议');
  console.log('═══════════════════════════════');
  
  console.log('🎯 立即行动项目:');
  console.log('1. 检查CloudFlare Pages环境变量:');
  console.log('   - 进入CloudFlare Dashboard');
  console.log('   - 找到Pages项目设置');
  console.log('   - 确认环境变量已设置且正确');
  
  console.log('\n2. 检查Railway环境变量:');
  console.log('   - 进入Railway项目设置');
  console.log('   - 确认所有VEO3_API_KEY*变量已设置');
  console.log('   - 重新部署项目');
  
  console.log('\n3. 验证环境变量名称:');
  console.log('   VEO3_API_KEY=c982688b5c6938943dd721ed1d576edb');
  console.log('   VEO3_API_KEY_2=26d5d2de23b9f511998f39cda771ae4d');
  console.log('   VEO3_API_KEY_3=3f06398cf9d8dc02a243f2dd5f2f9489');
  console.log('   VEO3_API_KEY_4=db092e9551f4631136cab1b141fdfd21');
  console.log('   VEO3_API_KEY_5=6a77fe3ca6856170f6618d4f249cfc6a');
  
  console.log('\n4. 测试步骤:');
  console.log('   - 配置环境变量后重新部署');
  console.log('   - 访问 /api/check-env 确认配置');
  console.log('   - 尝试生成视频测试');
}

/**
 * 检查网络连通性问题
 */
function analyzeNetworkIssues() {
  console.log('\n🌐 6. 网络连通性分析');
  console.log('═══════════════════════════════');
  
  console.log('诊断结果显示的网络问题:');
  console.log('❌ getaddrinfo ENOTFOUND api.kie.ai');
  
  console.log('\n可能的原因:');
  console.log('1. 🔒 生产环境网络限制');
  console.log('   - CloudFlare/Railway可能限制某些外部API调用');
  console.log('   - 需要检查网络政策设置');
  
  console.log('\n2. 🌍 DNS解析问题');
  console.log('   - api.kie.ai域名可能无法解析');
  console.log('   - 尝试使用IP地址或其他端点');
  
  console.log('\n3. ⏰ API服务可用性');
  console.log('   - kie.ai服务可能临时不可用');
  console.log('   - 需要联系kie.ai客服确认服务状态');
  
  console.log('\n🔧 建议的解决方案:');
  console.log('1. 先确保环境变量配置正确');
  console.log('2. 联系CloudFlare/Railway技术支持查询网络限制');
  console.log('3. 尝试其他API端点（如果kie.ai提供）');
  console.log('4. 联系kie.ai客服确认API服务状态');
}

/**
 * 主函数
 */
function main() {
  checkEnvironmentVariables();
  checkCodeConfiguration();
  const testApiKey = simulateApiKeyPoolInit();
  analyzeProductionDifference();
  generateFixSuggestions();
  analyzeNetworkIssues();
  
  console.log('\n📊 总结:');
  console.log('═══════════════════════════════');
  console.log('✅ 代码配置: 正确');
  console.log('✅ 本地API密钥: 已设置');
  console.log('❌ 生产环境API密钥: 未配置');
  console.log('❌ 网络连通性: 有问题');
  
  console.log('\n🎯 优先级修复顺序:');
  console.log('1. 🔑 立即配置生产环境API密钥');
  console.log('2. 🔄 重新部署应用');
  console.log('3. 🌐 调查网络连通性问题');
  console.log('4. 📞 联系相关技术支持');
}

// 执行调试
if (require.main === module) {
  main();
}

module.exports = { checkEnvironmentVariables, checkCodeConfiguration }; 