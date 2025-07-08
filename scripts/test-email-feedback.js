#!/usr/bin/env node

/**
 * 反馈邮件发送测试脚本
 * 验证Resend域名配置后邮件发送是否正常
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

async function testFeedbackEmail() {
  console.log('🚀 开始测试反馈邮件发送功能...\n');

  // 1. 检查环境变量
  console.log('📋 1. 检查环境变量配置...');
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('❌ RESEND_API_KEY 未配置');
    console.log('💡 请在 .env.local 中设置: RESEND_API_KEY=re_xxxxxxxxxxxxxxxx');
    process.exit(1);
  }
  
  console.log(`✅ RESEND_API_KEY: ${resendApiKey.substring(0, 10)}...`);

  // 2. 模拟反馈数据
  console.log('\n📝 2. 准备测试数据...');
  const testFeedbackData = {
    type: 'general',
    message: '这是一条测试反馈消息，用于验证新配置的send.cuttingasmr.org域名是否正常工作。',
    rating: 5,
    email: 'test@example.com',
    userInfo: {
      userId: 'test-user-123',
      userName: 'Test User',
      timestamp: new Date().toISOString(),
      userAgent: 'Test Script/1.0'
    }
  };

  console.log('✅ 测试数据准备完成');

  // 3. 发送测试请求
  console.log('\n🌐 3. 发送测试请求到反馈API...');
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${apiUrl}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFeedbackData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ 反馈API调用成功!');
      console.log(`📧 邮件应该已发送到: supportadmin@cuttingasmr.org`);
      console.log(`📤 发件人地址: noreply@send.cuttingasmr.org`);
    } else {
      console.log('❌ 反馈API调用失败:');
      console.log(`状态码: ${response.status}`);
      console.log(`错误信息: ${result.error || JSON.stringify(result)}`);
    }

  } catch (error) {
    console.error('❌ 发送请求时发生错误:', error.message);
  }

  // 4. 直接测试Resend API
  console.log('\n📮 4. 直接测试Resend API...');
  
  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CuttingASMR Test <noreply@send.cuttingasmr.org>',
        to: ['supportadmin@cuttingasmr.org'],
        subject: 'Resend域名配置测试邮件',
        text: `这是一封测试邮件，用于验证send.cuttingasmr.org域名配置是否正确。

发送时间: ${new Date().toLocaleString()}
发件人: noreply@send.cuttingasmr.org
收件人: supportadmin@cuttingasmr.org

如果您收到这封邮件，说明Resend域名配置成功！`,
        reply_to: 'test@example.com'
      })
    });

    if (resendResponse.ok) {
      const resendResult = await resendResponse.json();
      console.log('✅ Resend API调用成功!');
      console.log(`📧 邮件ID: ${resendResult.id}`);
      console.log('📬 请检查 supportadmin@cuttingasmr.org 邮箱');
    } else {
      const error = await resendResponse.text();
      console.log('❌ Resend API调用失败:');
      console.log(`状态码: ${resendResponse.status}`);
      console.log(`错误信息: ${error}`);
    }

  } catch (error) {
    console.error('❌ 直接调用Resend API时发生错误:', error.message);
  }

  // 5. 验证要点
  console.log('\n📋 5. 验证要点总结:');
  console.log('✅ 检查项目：');
  console.log('  1. RESEND_API_KEY 环境变量已配置');
  console.log('  2. 发件人地址更新为: noreply@send.cuttingasmr.org');
  console.log('  3. 收件人地址保持: supportadmin@cuttingasmr.org');
  console.log('  4. API调用格式正确');
  
  console.log('\n🔍 需要手动验证：');
  console.log('  1. 在Resend控制台检查邮件发送状态');
  console.log('  2. 检查 supportadmin@cuttingasmr.org 是否收到测试邮件');
  console.log('  3. 验证邮件发件人显示为 send.cuttingasmr.org 域名');
  
  console.log('\n🌟 测试完成！');
}

// 运行测试
testFeedbackEmail().catch(console.error); 