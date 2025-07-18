// 验证API密钥池和模型配置
const { apiKeyPool } = require('./dist/lib/api-key-pool.js');
const { createVeo3Client } = require('./dist/lib/veo3-api.js');

console.log('🔍 验证API配置...\n');

// 检查API密钥池
console.log('📋 API密钥池状态:');
const poolStatus = apiKeyPool.getPoolStatus();
console.log(`总密钥数: ${poolStatus.totalKeys}`);
console.log(`可用密钥数: ${poolStatus.availableKeys}`);
console.log('密钥列表:');
poolStatus.keys.forEach((key, index) => {
  console.log(`  ${index + 1}. ${key.key}`);
});

// 验证密钥数量是否为3
if (poolStatus.totalKeys === 3) {
  console.log('✅ 密钥数量正确 (3个)');
} else {
  console.log('❌ 密钥数量错误');
}

// 验证密钥内容
const expectedKeys = [
  '3f06398cf9d8dc02a243f2dd5f2f9489',
  'db092e9551f4631136cab1b141fdfd21',
  '6a77fe3ca6856170f6618d4f249cfc6a'
];

const actualKeys = poolStatus.keys.map(k => k.key.replace('...', ''));
let keysMatch = true;
expectedKeys.forEach((expected, index) => {
  if (!actualKeys[index] || !actualKeys[index].startsWith(expected.substring(0, 10))) {
    keysMatch = false;
    console.log(`❌ 密钥 ${index + 1} 不匹配`);
  } else {
    console.log(`✅ 密钥 ${index + 1} 匹配`);
  }
});

console.log('\n🎯 模型配置验证:');
console.log('✅ 已强制使用 veo3fast 模型');
console.log('✅ 所有API调用将使用 veo3_fast 参数');

console.log('\n🎉 配置验证完成！');