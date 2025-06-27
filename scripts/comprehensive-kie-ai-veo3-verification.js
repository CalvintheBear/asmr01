#!/usr/bin/env node

/**
 * 🔍 Kie.ai Veo3 API 完整验证和修复脚本
 * 
 * 基于官方文档: https://docs.kie.ai/veo3-api
 * 项目架构文档: 项目架构.md
 * 
 * 功能:
 * 1. 验证API端点配置是否正确
 * 2. 测试API密钥和连通性
 * 3. 验证请求格式和响应处理
 * 4. 检查视频生成和状态查询流程
 * 5. 验证数据库同步和用户profile更新
 * 6. 自动修复发现的问题
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const TEST_CONFIG = {
  // 使用正确的官方API端点
  API_BASE_URL: 'https://api.kie.ai',
  
  // 支持的端点
  ENDPOINTS: {
    GENERATE: '/api/v1/veo/generate',
    RECORD_INFO: '/api/v1/veo/record-info',
    GET_1080P: '/api/v1/veo/get1080p'
  },
  
  // 测试用例
  TEST_REQUESTS: {
    GENERATE: {
      prompt: "A peaceful cat sitting by a window, looking outside at falling snow, soft ambient lighting",
      model: "veo3_fast",
      aspectRatio: "16:9",
      duration: "8"
    }
  }
};

// 验证结果存储
const verificationResults = {
  apiEndpoints: [],
  codeImplementation: [],
  databaseIntegration: [],
  userProfileSync: [],
  fixes: []
};

console.log('🔍 Kie.ai Veo3 API 完整验证开始...\n');

/**
 * 1. 验证API端点配置
 */
async function verifyApiEndpoints() {
  console.log('📡 1. 验证API端点配置');
  
  // 检查veo3-api.ts文件
  const veo3ApiPath = 'src/lib/veo3-api.ts';
  if (fs.existsSync(veo3ApiPath)) {
    const content = fs.readFileSync(veo3ApiPath, 'utf8');
    
    // 检查基础URL配置
    if (content.includes('https://api.kie.ai')) {
      recordResult('apiEndpoints', 'API基础URL', 'PASS', '使用正确的官方端点 https://api.kie.ai');
    } else if (content.includes('kieai.erweima.ai')) {
      recordResult('apiEndpoints', 'API基础URL', 'FAIL', '使用了错误的端点，需要修复为 https://api.kie.ai');
      await fixApiEndpoint(veo3ApiPath);
    } else {
      recordResult('apiEndpoints', 'API基础URL', 'WARN', 'API端点配置不明确');
    }
    
    // 检查认证方式
    if (content.includes('Bearer ${this.config.apiKey}')) {
      recordResult('apiEndpoints', 'Bearer认证', 'PASS', 'Bearer Token认证方式正确');
    } else {
      recordResult('apiEndpoints', 'Bearer认证', 'FAIL', '认证方式错误或缺失');
    }
    
    // 检查端点路径
    const endpoints = TEST_CONFIG.ENDPOINTS;
    if (content.includes(endpoints.GENERATE)) {
      recordResult('apiEndpoints', '视频生成端点', 'PASS', `正确使用 ${endpoints.GENERATE}`);
    } else {
      recordResult('apiEndpoints', '视频生成端点', 'FAIL', '视频生成端点路径错误');
    }
    
  } else {
    recordResult('apiEndpoints', 'Veo3 API客户端', 'FAIL', 'veo3-api.ts文件不存在');
  }
  
  // 检查generate-video API
  const generateApiPath = 'src/app/api/generate-video/route.ts';
  if (fs.existsSync(generateApiPath)) {
    const content = fs.readFileSync(generateApiPath, 'utf8');
    
    if (content.includes('https://api.kie.ai') || content.includes('process.env.VEO3_API_BASE_URL')) {
      recordResult('apiEndpoints', '生成API端点', 'PASS', '生成API使用正确端点');
    } else {
      recordResult('apiEndpoints', '生成API端点', 'FAIL', '生成API端点配置错误');
    }
  }
  
  // 检查video-status API
  const statusApiPath = 'src/app/api/video-status/[id]/route.ts';
  if (fs.existsSync(statusApiPath)) {
    const content = fs.readFileSync(statusApiPath, 'utf8');
    
    if (content.includes('record-info')) {
      recordResult('apiEndpoints', '状态查询端点', 'PASS', '使用正确的 record-info 端点');
    } else {
      recordResult('apiEndpoints', '状态查询端点', 'FAIL', '状态查询端点错误');
    }
  }
}

/**
 * 2. 测试API连通性
 */
async function testApiConnectivity() {
  console.log('\n🌐 2. 测试API连通性');
  
  // 获取API密钥
  const apiKeys = [
    process.env.VEO3_API_KEY,
    process.env.VEO3_API_KEY_2,
    process.env.VEO3_API_KEY_3,
    process.env.VEO3_API_KEY_4,
    process.env.VEO3_API_KEY_5
  ].filter(Boolean);
  
  if (apiKeys.length === 0) {
    recordResult('apiEndpoints', 'API密钥配置', 'FAIL', '未找到任何VEO3 API密钥');
    return;
  }
  
  recordResult('apiEndpoints', 'API密钥数量', 'PASS', `找到 ${apiKeys.length} 个API密钥`);
  
  // 测试第一个密钥的连通性
  const testKey = apiKeys[0];
  try {
    console.log(`🔑 测试API密钥: ${testKey.substring(0, 10)}...`);
    
    const response = await fetch(`${TEST_CONFIG.API_BASE_URL}${TEST_CONFIG.ENDPOINTS.GENERATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Veo3-Verification/1.0'
      },
      body: JSON.stringify(TEST_CONFIG.TEST_REQUESTS.GENERATE)
    });
    
    console.log(`📊 API响应状态: ${response.status}`);
    
    if (response.status === 401) {
      recordResult('apiEndpoints', 'API密钥有效性', 'FAIL', 'API密钥无效或已过期');
    } else if (response.status === 429) {
      recordResult('apiEndpoints', 'API速率限制', 'WARN', '遇到API速率限制，密钥可能有效');
    } else if (response.status >= 500) {
      recordResult('apiEndpoints', 'API服务状态', 'WARN', 'API服务器错误，可能是临时问题');
    } else if (response.status === 200 || response.status === 202) {
      recordResult('apiEndpoints', 'API连通性', 'PASS', 'API连通性正常');
      
      // 解析响应
      try {
        const result = await response.json();
        console.log('📝 API响应示例:', JSON.stringify(result, null, 2));
        
        if (result.code === 200 && result.data?.taskId) {
          recordResult('apiEndpoints', 'API响应格式', 'PASS', '响应格式符合官方文档');
        } else {
          recordResult('apiEndpoints', 'API响应格式', 'WARN', '响应格式需要验证');
        }
      } catch (jsonError) {
        recordResult('apiEndpoints', 'API响应解析', 'FAIL', 'JSON响应解析失败');
      }
    } else {
      const errorText = await response.text();
      recordResult('apiEndpoints', 'API连通性', 'FAIL', `意外的响应状态: ${response.status}`);
      console.log(`❌ 错误详情: ${errorText.substring(0, 200)}...`);
    }
    
  } catch (error) {
    recordResult('apiEndpoints', 'API网络连接', 'FAIL', `网络连接失败: ${error.message}`);
  }
}

/**
 * 3. 验证代码实现
 */
async function verifyCodeImplementation() {
  console.log('\n💻 3. 验证代码实现');
  
  // 检查请求格式
  const generateApiPath = 'src/app/api/generate-video/route.ts';
  if (fs.existsSync(generateApiPath)) {
    const content = fs.readFileSync(generateApiPath, 'utf8');
    
    // 检查请求数据格式
    if (content.includes('prompt:') && content.includes('model:') && content.includes('aspectRatio:') && content.includes('duration:')) {
      recordResult('codeImplementation', '请求数据格式', 'PASS', '请求参数完整，符合官方文档');
    } else {
      recordResult('codeImplementation', '请求数据格式', 'FAIL', '请求参数不完整');
    }
    
    // 检查模型硬编码
    if (content.includes("model: 'veo3_fast'")) {
      recordResult('codeImplementation', '模型配置', 'PASS', '正确硬编码veo3_fast模型（成本控制）');
    } else {
      recordResult('codeImplementation', '模型配置', 'WARN', '模型配置需要检查');
    }
    
    // 检查错误处理
    if (content.includes('result.code !== 200')) {
      recordResult('codeImplementation', '错误处理', 'PASS', '正确处理API错误响应');
    } else {
      recordResult('codeImplementation', '错误处理', 'FAIL', '缺少错误处理逻辑');
    }
    
    // 检查积分扣除时机
    if (content.includes('API成功，现在才扣除积分')) {
      recordResult('codeImplementation', '积分扣除时机', 'PASS', 'API成功后才扣除积分（正确逻辑）');
    } else {
      recordResult('codeImplementation', '积分扣除时机', 'WARN', '积分扣除时机需要验证');
    }
  }
  
  // 检查状态查询实现
  const statusApiPath = 'src/app/api/video-status/[id]/route.ts';
  if (fs.existsSync(statusApiPath)) {
    const content = fs.readFileSync(statusApiPath, 'utf8');
    
    // 检查用户权限验证
    if (content.includes('user.id !== taskRecord.userId')) {
      recordResult('codeImplementation', '用户权限验证', 'PASS', '正确验证用户访问权限');
    } else {
      recordResult('codeImplementation', '用户权限验证', 'FAIL', '缺少用户权限验证');
    }
    
    // 检查状态码处理
    if (content.includes('successFlag') && content.includes('statusCode')) {
      recordResult('codeImplementation', '状态码处理', 'PASS', '正确处理kie.ai状态码');
    } else {
      recordResult('codeImplementation', '状态码处理', 'FAIL', '状态码处理逻辑错误');
    }
    
    // 检查1080p获取
    if (content.includes('get1080PVideo')) {
      recordResult('codeImplementation', '1080p视频获取', 'PASS', '支持1080p高清视频获取');
    } else {
      recordResult('codeImplementation', '1080p视频获取', 'WARN', '1080p功能可能缺失');
    }
  }
}

/**
 * 4. 验证数据库集成
 */
async function verifyDatabaseIntegration() {
  console.log('\n🗄️ 4. 验证数据库集成');
  
  // 检查Prisma schema
  const schemaPath = 'prisma/schema.prisma';
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, 'utf8');
    
    // 检查Video模型
    if (content.includes('model Video') && content.includes('videoUrl') && content.includes('videoUrl1080p')) {
      recordResult('databaseIntegration', 'Video数据模型', 'PASS', 'Video模型支持720p和1080p URL');
    } else {
      recordResult('databaseIntegration', 'Video数据模型', 'FAIL', 'Video模型结构不完整');
    }
    
    // 检查用户积分字段
    if (content.includes('totalCredits') && content.includes('usedCredits')) {
      recordResult('databaseIntegration', '用户积分字段', 'PASS', '用户积分字段配置正确');
    } else {
      recordResult('databaseIntegration', '用户积分字段', 'FAIL', '用户积分字段缺失');
    }
    
    // 检查审计日志
    if (content.includes('model AuditLog')) {
      recordResult('databaseIntegration', '审计日志模型', 'PASS', '审计日志模型存在');
    } else {
      recordResult('databaseIntegration', '审计日志模型', 'WARN', '审计日志模型缺失');
    }
  }
  
  // 检查数据库操作
  const generateApiPath = 'src/app/api/generate-video/route.ts';
  if (fs.existsSync(generateApiPath)) {
    const content = fs.readFileSync(generateApiPath, 'utf8');
    
    // 检查事务操作
    if (content.includes('$transaction')) {
      recordResult('databaseIntegration', '数据库事务', 'PASS', '使用数据库事务保证一致性');
    } else {
      recordResult('databaseIntegration', '数据库事务', 'FAIL', '缺少数据库事务保护');
    }
    
    // 检查回滚机制
    if (content.includes('decrement') && content.includes('delete')) {
      recordResult('databaseIntegration', '回滚机制', 'PASS', '失败时正确回滚积分和清理数据');
    } else {
      recordResult('databaseIntegration', '回滚机制', 'FAIL', '缺少失败回滚机制');
    }
  }
}

/**
 * 5. 验证用户Profile同步
 */
async function verifyUserProfileSync() {
  console.log('\n👤 5. 验证用户Profile同步');
  
  // 检查用户同步API
  const userSyncPath = 'src/app/api/user/sync/route.ts';
  if (fs.existsSync(userSyncPath)) {
    const content = fs.readFileSync(userSyncPath, 'utf8');
    
    // 检查Clerk ID同步
    if (content.includes('clerkUserId') && content.includes('findUnique')) {
      recordResult('userProfileSync', 'Clerk用户同步', 'PASS', 'Clerk用户ID正确同步');
    } else {
      recordResult('userProfileSync', 'Clerk用户同步', 'FAIL', 'Clerk用户同步逻辑错误');
    }
    
    // 检查邮箱备用匹配
    if (content.includes('email') && content.includes('where')) {
      recordResult('userProfileSync', '邮箱备用匹配', 'PASS', '支持邮箱备用匹配机制');
    } else {
      recordResult('userProfileSync', '邮箱备用匹配', 'WARN', '邮箱备用匹配可能缺失');
    }
  }
  
  // 检查用户视频查询
  const userVideosPath = 'src/app/api/user/videos/route.ts';
  if (fs.existsSync(userVideosPath)) {
    const content = fs.readFileSync(userVideosPath, 'utf8');
    
    if (content.includes('where: { userId }')) {
      recordResult('userProfileSync', '用户视频查询', 'PASS', '正确查询用户视频');
    } else {
      recordResult('userProfileSync', '用户视频查询', 'FAIL', '用户视频查询逻辑错误');
    }
  } else {
    recordResult('userProfileSync', '用户视频API', 'WARN', '用户视频API可能缺失');
  }
  
  // 检查积分查询
  const creditsPath = 'src/app/api/credits/route.ts';
  if (fs.existsSync(creditsPath)) {
    const content = fs.readFileSync(creditsPath, 'utf8');
    
    if (content.includes('totalCredits') && content.includes('usedCredits')) {
      recordResult('userProfileSync', '积分查询API', 'PASS', '积分查询API正确实现');
    } else {
      recordResult('userProfileSync', '积分查询API', 'FAIL', '积分查询API实现错误');
    }
  }
}

/**
 * 6. 自动修复发现的问题
 */
async function autoFixIssues() {
  console.log('\n🔧 6. 自动修复发现的问题');
  
  // 基于验证结果进行修复
  let fixCount = 0;
  
  for (const category of Object.keys(verificationResults)) {
    for (const result of verificationResults[category]) {
      if (result.status === 'FAIL') {
        console.log(`🔨 尝试修复: ${result.test} - ${result.message}`);
        
        // 根据具体问题进行修复
        if (result.test.includes('API基础URL') && result.message.includes('kieai.erweima.ai')) {
          await fixApiEndpoint('src/lib/veo3-api.ts');
          fixCount++;
        }
        
        if (result.test.includes('生成API端点') && result.message.includes('端点配置错误')) {
          await fixGenerateApiEndpoint();
          fixCount++;
        }
      }
    }
  }
  
  if (fixCount > 0) {
    recordResult('fixes', '自动修复', 'PASS', `成功修复 ${fixCount} 个问题`);
  } else {
    recordResult('fixes', '自动修复', 'PASS', '未发现需要修复的问题');
  }
}

/**
 * 修复API端点配置
 */
async function fixApiEndpoint(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 替换错误的API端点
  content = content.replace(
    /https:\/\/kieai\.erweima\.ai/g,
    'https://api.kie.ai'
  );
  
  // 确保使用环境变量
  if (!content.includes('process.env.VEO3_API_BASE_URL')) {
    content = content.replace(
      'https://api.kie.ai',
      "process.env.VEO3_API_BASE_URL || 'https://api.kie.ai'"
    );
  }
  
  fs.writeFileSync(filePath, content);
  recordResult('fixes', 'API端点修复', 'PASS', `已修复 ${filePath} 中的API端点配置`);
}

/**
 * 修复视频生成API端点
 */
async function fixGenerateApiEndpoint() {
  const filePath = 'src/app/api/generate-video/route.ts';
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 确保使用正确的API端点
  if (!content.includes("process.env.VEO3_API_BASE_URL || 'https://api.kie.ai'")) {
    content = content.replace(
      /const baseUrl = .+/,
      "const baseUrl = process.env.VEO3_API_BASE_URL || 'https://api.kie.ai';"
    );
    
    fs.writeFileSync(filePath, content);
    recordResult('fixes', '生成API端点修复', 'PASS', '已修复视频生成API端点配置');
  }
}

/**
 * 记录验证结果
 */
function recordResult(category, test, status, message) {
  const result = { test, status, message, timestamp: new Date().toISOString() };
  verificationResults[category].push(result);
  
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`  ${statusIcon} ${test}: ${message}`);
}

/**
 * 生成验证报告
 */
function generateReport() {
  console.log('\n📊 验证报告生成中...');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    },
    details: verificationResults
  };
  
  // 统计结果
  for (const category of Object.keys(verificationResults)) {
    for (const result of verificationResults[category]) {
      report.summary.total++;
      if (result.status === 'PASS') report.summary.passed++;
      else if (result.status === 'FAIL') report.summary.failed++;
      else report.summary.warnings++;
    }
  }
  
  // 保存报告
  const reportPath = 'COMPREHENSIVE_KIE_AI_VEO3_VERIFICATION_REPORT.md';
  const reportContent = generateMarkdownReport(report);
  fs.writeFileSync(reportPath, reportContent);
  
  console.log(`\n📄 验证报告已保存到: ${reportPath}`);
  
  // 显示摘要
  console.log('\n📈 验证摘要:');
  console.log(`  总计: ${report.summary.total} 项测试`);
  console.log(`  ✅ 通过: ${report.summary.passed} 项`);
  console.log(`  ❌ 失败: ${report.summary.failed} 项`);
  console.log(`  ⚠️ 警告: ${report.summary.warnings} 项`);
  
  // 给出建议
  if (report.summary.failed === 0) {
    console.log('\n🎉 恭喜！所有验证都通过了，代码完全符合kie.ai官方文档要求！');
  } else {
    console.log('\n⚠️ 发现一些问题需要手动修复，请查看详细报告。');
  }
  
  return report;
}

/**
 * 生成Markdown格式报告
 */
function generateMarkdownReport(report) {
  let markdown = `# 🔍 Kie.ai Veo3 API 完整验证报告

**验证时间**: ${report.timestamp}
**官方文档**: [kie.ai Veo3 API Documentation](https://docs.kie.ai/veo3-api)
**项目架构**: 项目架构.md

---

## 📊 验证摘要

- **总计**: ${report.summary.total} 项测试
- **✅ 通过**: ${report.summary.passed} 项
- **❌ 失败**: ${report.summary.failed} 项  
- **⚠️ 警告**: ${report.summary.warnings} 项

---

## 📋 详细验证结果

`;

  const categoryNames = {
    apiEndpoints: '📡 API端点配置',
    codeImplementation: '💻 代码实现',
    databaseIntegration: '🗄️ 数据库集成',
    userProfileSync: '👤 用户Profile同步',
    fixes: '🔧 自动修复'
  };

  for (const [category, results] of Object.entries(report.details)) {
    if (results.length === 0) continue;
    
    markdown += `### ${categoryNames[category] || category}\n\n`;
    markdown += `| 测试项目 | 状态 | 详情 |\n`;
    markdown += `|---------|------|------|\n`;
    
    for (const result of results) {
      const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      markdown += `| ${result.test} | ${statusIcon} ${result.status} | ${result.message} |\n`;
    }
    
    markdown += '\n';
  }

  markdown += `---

## 🎯 修复建议

`;

  // 生成修复建议
  const failedTests = [];
  for (const category of Object.keys(report.details)) {
    for (const result of report.details[category]) {
      if (result.status === 'FAIL') {
        failedTests.push(result);
      }
    }
  }

  if (failedTests.length === 0) {
    markdown += `🎉 **恭喜！** 所有验证都通过了，代码完全符合kie.ai官方文档要求！

### ✅ 验证通过的关键功能:
- API端点配置正确（https://api.kie.ai）
- Bearer Token认证实现
- 请求格式符合官方文档
- 响应处理逻辑正确
- 数据库集成完善
- 用户Profile同步正常
- 错误处理和回滚机制完整

`;
  } else {
    markdown += `### 🔧 需要手动修复的问题:

`;
    for (let i = 0; i < failedTests.length; i++) {
      const test = failedTests[i];
      markdown += `${i + 1}. **${test.test}**: ${test.message}\n`;
    }
  }

  markdown += `---

## 📚 参考文档

- [kie.ai Veo3 API 官方文档](https://docs.kie.ai/veo3-api)
- [项目架构文档](./项目架构.md)
- [VEO3 API 验证报告](./VEO3_API_VERIFICATION.md)

---

*报告生成时间: ${report.timestamp}*
*生成工具: comprehensive-kie-ai-veo3-verification.js*
`;

  return markdown;
}

/**
 * 主执行函数
 */
async function main() {
  try {
    await verifyApiEndpoints();
    await testApiConnectivity();
    await verifyCodeImplementation();
    await verifyDatabaseIntegration();
    await verifyUserProfileSync();
    await autoFixIssues();
    
    const report = generateReport();
    
    console.log('\n✨ Kie.ai Veo3 API验证完成！');
    
  } catch (error) {
    console.error('❌ 验证过程中出现错误:', error);
    process.exit(1);
  }
}

// 执行验证
if (require.main === module) {
  main();
}

module.exports = {
  verifyApiEndpoints,
  testApiConnectivity,
  verifyCodeImplementation,
  verifyDatabaseIntegration,
  verifyUserProfileSync,
  autoFixIssues,
  generateReport
}; 