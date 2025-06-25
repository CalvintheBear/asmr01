#!/usr/bin/env node

/**
 * 生产环境配置验证脚本
 * 确保使用真实的Creem API密钥和产品ID，而不是测试配置
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 验证生产环境Creem配置...\n');

// 1. 检查环境变量配置
console.log('📋 当前环境变量:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
console.log('- CREEM_TEST_MODE:', process.env.CREEM_TEST_MODE);
console.log('- CREEM_API_KEY存在:', !!process.env.CREEM_API_KEY);
console.log('- CREEM_WEBHOOK_SECRET存在:', !!process.env.CREEM_WEBHOOK_SECRET);
console.log('');

// 2. 模拟Creem配置逻辑
const isTestMode = process.env.NODE_ENV === 'development' || 
                  process.env.CREEM_TEST_MODE === 'true' ||
                  process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') ||
                  process.env.NEXT_PUBLIC_APP_URL?.includes('trycloudflare.com');

console.log('🎯 环境判断结果:');
console.log('- 判定为测试模式:', isTestMode);
console.log('- 应使用产品ID:', isTestMode ? '测试环境产品ID' : '生产环境产品ID');
console.log('');

// 3. 显示将要使用的产品ID
const testProductIds = {
  starter: 'prod_3ClKXTvoV2aQBMoEjTTMzM',   // $9.9 - 115积分
  standard: 'prod_67wDHjBHhgxyDUeaxr7JCG',  // $30 - 355积分
  premium: 'prod_5AkdzTWba2cogt75cngOhu'    // $99 - 1450积分
};

const productionProductIds = {
  starter: 'prod_44gUntOAeR5KU9a4wkr45U',   // $9.9 - 115积分
  standard: 'prod_2tyKrzLDOi7TLMNiIpHsj4',  // $30 - 355积分
  premium: 'prod_7aRS2kaSvk33msxNfnIAV8'    // $99 - 1450积分
};

const currentProductIds = isTestMode ? testProductIds : productionProductIds;

console.log('📦 当前使用的产品ID:');
console.log('- Starter (115积分):', currentProductIds.starter);
console.log('- Standard (355积分):', currentProductIds.standard);
console.log('- Premium (1450积分):', currentProductIds.premium);
console.log('');

// 4. 生成支付URL示例
const basePath = isTestMode ? 'test/payment' : 'payment';
console.log('🔗 支付URL示例:');
console.log('- Starter:', `https://www.creem.io/${basePath}/${currentProductIds.starter}`);
console.log('- Standard:', `https://www.creem.io/${basePath}/${currentProductIds.standard}`);
console.log('- Premium:', `https://www.creem.io/${basePath}/${currentProductIds.premium}`);
console.log('');

// 5. 验证结果和建议
console.log('✅ 验证结果:');
if (isTestMode) {
  console.log('⚠️  当前配置将使用测试环境产品ID');
  console.log('');
  console.log('🔧 如需使用生产环境配置，请确保:');
  console.log('1. NODE_ENV设置为"production"');
  console.log('2. CREEM_TEST_MODE设置为"false"或不设置');
  console.log('3. NEXT_PUBLIC_APP_URL设置为"https://cuttingasmr.org"');
  console.log('4. 在Cloudflare Pages中设置正确的CREEM_API_KEY和CREEM_WEBHOOK_SECRET');
  console.log('');
  console.log('📝 生产环境应使用的配置 (新Creem Store):');
  console.log('- CREEM_API_KEY: creem_3383jJhZ9BrQXXeHL2bxB');
  console.log('- CREEM_WEBHOOK_SECRET: whsec_bCADZ6mZaWDVnJCzwato5');
} else {
  console.log('✅ 当前配置正确，将使用生产环境产品ID');
  console.log('');
  console.log('🔑 请确保在Cloudflare Pages中设置了正确的API密钥 (新Creem Store):');
  console.log('- CREEM_API_KEY: creem_3383jJhZ9BrQXXeHL2bxB');
  console.log('- CREEM_WEBHOOK_SECRET: whsec_bCADZ6mZaWDVnJCzwato5');
}

console.log('');
console.log('🚀 配置验证完成!'); 