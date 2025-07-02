#!/usr/bin/env node

/**
 * OAuth客户端故障排除指南
 * 解决 "disabled_client" 错误
 */

console.log('🔧 OAuth客户端故障排除指南\n');

console.log('📋 错误分析:');
console.log('❌ 错误代码: disabled_client');
console.log('❌ 含义: OAuth 2.0客户端已被禁用');
console.log('❌ 影响: 无法完成Google登录流程\n');

console.log('🔍 可能的原因:');
console.log('1. OAuth同意屏幕未完成配置');
console.log('2. OAuth应用尚未发布');
console.log('3. 域名验证未完成');
console.log('4. OAuth客户端状态异常\n');

console.log('✅ 解决步骤:\n');

console.log('步骤1: 检查OAuth同意屏幕');
console.log('1. 访问: https://console.cloud.google.com/apis/credentials/consent');
console.log('2. 确认"发布状态"不是"需要验证"');
console.log('3. 如果显示"测试中"，点击"发布应用"');
console.log('4. 填写所有必填字段:\n');

console.log('   应用信息:');
console.log('   - 应用名称: CuttingASMR');
console.log('   - 用户支持电子邮件: [您的Gmail]');
console.log('   - 开发者联系信息: [您的Gmail]\n');

console.log('   应用域名:');
console.log('   - 应用首页: https://cuttingasmr.org');
console.log('   - 隐私政策: https://cuttingasmr.org/privacy');
console.log('   - 服务条款: https://cuttingasmr.org/terms\n');

console.log('   已获授权的域名:');
console.log('   - cuttingasmr.org');
console.log('   - localhost\n');

console.log('步骤2: 检查OAuth客户端状态');
console.log('1. 访问: https://console.cloud.google.com/apis/credentials');
console.log('2. 找到您的OAuth 2.0客户端');
console.log('3. 确认状态为"已启用"');
console.log('4. 检查重定向URI配置:\n');

console.log('   生产环境:');
console.log('   - https://cuttingasmr.org/api/auth/callback/google');
console.log('   开发环境:');
console.log('   - http://localhost:3000/api/auth/callback/google\n');

console.log('步骤3: 发布OAuth应用');
console.log('1. 返回OAuth同意屏幕页面');
console.log('2. 点击"发布应用"');
console.log('3. 确认发布（如果有警告，选择继续）');
console.log('4. 等待状态变为"已发布"\n');

console.log('步骤4: 验证域名所有权（如需要）');
console.log('1. 访问: https://search.google.com/search-console');
console.log('2. 添加属性: cuttingasmr.org');
console.log('3. 完成域名验证\n');

console.log('🧪 测试步骤:');
console.log('1. 等待5-10分钟让更改生效');
console.log('2. 清除浏览器缓存和Cookie');
console.log('3. 重新访问: https://cuttingasmr.org');
console.log('4. 点击Google登录进行测试\n');

console.log('⚠️ 重要提示:');
console.log('- OAuth应用发布可能需要Google审核（1-7天）');
console.log('- 测试期间可以使用"测试用户"功能');
console.log('- 确保所有链接（隐私政策、服务条款）都可访问\n');

console.log('🔗 有用链接:');
console.log('- GCP控制台: https://console.cloud.google.com');
console.log('- OAuth同意屏幕: https://console.cloud.google.com/apis/credentials/consent');
console.log('- OAuth凭据: https://console.cloud.google.com/apis/credentials');
console.log('- Search Console: https://search.google.com/search-console\n');

console.log('================================'); 