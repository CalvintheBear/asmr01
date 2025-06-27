#!/usr/bin/env node

/**
 * 🔍 视频生成问题诊断脚本
 * 分析视频生成失败的具体原因
 */

const https = require('https');
const fs = require('fs');

console.log('🔍 开始诊断视频生成问题...\n');

/**
 * 测试API连通性
 */
async function testApiConnectivity() {
  console.log('🌐 1. 测试API连通性');
  
  const apiKeys = [
    process.env.VEO3_API_KEY,
    process.env.VEO3_API_KEY_2,
    process.env.VEO3_API_KEY_3,
    process.env.VEO3_API_KEY_4,
    process.env.VEO3_API_KEY_5
  ].filter(Boolean);

  console.log(`🔑 找到 ${apiKeys.length} 个API密钥`);
  
  if (apiKeys.length === 0) {
    console.log('❌ 没有找到任何VEO3 API密钥');
    return false;
  }

  // 测试第一个密钥
  const testKey = apiKeys[0];
  console.log(`🔑 测试密钥: ${testKey.substring(0, 10)}...`);

  try {
    const testData = JSON.stringify({
      prompt: "A simple test video for API connectivity",
      model: "veo3_fast",
      aspectRatio: "16:9",
      duration: "8"
    });

    const response = await makeHttpsRequest('api.kie.ai', '/api/v1/veo/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      }
    }, testData);

    console.log(`📊 API响应状态: ${response.statusCode}`);
    console.log(`📝 响应数据: ${response.data.substring(0, 200)}...`);

    if (response.statusCode === 200 || response.statusCode === 202) {
      console.log('✅ API连通性正常');
      return true;
    } else if (response.statusCode === 401) {
      console.log('❌ API密钥无效或已过期');
      return false;
    } else if (response.statusCode === 429) {
      console.log('⚠️ 速率限制，但API连通性正常');
      return true;
    } else {
      console.log(`⚠️ 意外响应: ${response.statusCode}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ 连接失败: ${error.message}`);
    return false;
  }
}

/**
 * 发送HTTPS请求
 */
function makeHttpsRequest(hostname, path, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      path,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && (options.method === 'POST' || options.method === 'PUT')) {
      req.write(data);
    }

    req.end();
  });
}

/**
 * 检查生产环境配置
 */
async function checkProductionConfig() {
  console.log('\n🔧 2. 检查生产环境配置');
  
  try {
    const response = await makeHttpsRequest('cuttingasmr.org', '/api/check-env', {
      method: 'GET',
      headers: {
        'User-Agent': 'Diagnostic-Tool/1.0'
      }
    });

    if (response.statusCode === 200) {
      const config = JSON.parse(response.data);
      console.log('✅ 环境配置可访问');
      console.log(`🌍 环境: ${config.NODE_ENV}`);
      console.log(`🔑 Creem API: ${config.CREEM_API_KEY ? '已配置' : '未配置'}`);
      console.log(`🔒 Webhook Secret: ${config.CREEM_WEBHOOK_SECRET ? '已配置' : '未配置'}`);
      console.log(`🎯 测试模式: ${config.isTestMode}`);
      
      // 检查VEO3配置
      if (config.VEO3_API_KEY || config.HAS_VEO3_KEYS) {
        console.log('✅ VEO3 API密钥已配置');
      } else {
        console.log('❌ VEO3 API密钥未配置');
      }
      
      return true;
    } else {
      console.log(`❌ 环境配置检查失败: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 环境配置检查错误: ${error.message}`);
    return false;
  }
}

/**
 * 检查数据库连接
 */
async function checkDatabaseConnection() {
  console.log('\n🗄️ 3. 检查数据库连接');
  
  try {
    const response = await makeHttpsRequest('cuttingasmr.org', '/api/health', {
      method: 'GET',
      headers: {
        'User-Agent': 'Diagnostic-Tool/1.0'
      }
    });

    if (response.statusCode === 200) {
      const health = JSON.parse(response.data);
      console.log('✅ 健康检查通过');
      console.log(`📊 状态: ${health.status}`);
      console.log(`⏰ 时间: ${health.timestamp}`);
      return true;
    } else {
      console.log(`❌ 健康检查失败: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 健康检查错误: ${error.message}`);
    return false;
  }
}

/**
 * 检查最近的失败记录
 */
async function checkRecentFailures() {
  console.log('\n📋 4. 分析最近的失败记录');
  
  // 检查本地数据库连接（如果可用）
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const recentVideos = await prisma.video.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        user: true
      }
    });

    console.log(`📊 最近24小时的视频记录: ${recentVideos.length}个`);
    
    const failedVideos = recentVideos.filter(v => 
      v.status === 'pending' && !v.taskId || 
      v.status === 'failed'
    );
    
    console.log(`❌ 失败的视频: ${failedVideos.length}个`);
    
    if (failedVideos.length > 0) {
      console.log('\n失败视频详情:');
      failedVideos.forEach((video, index) => {
        console.log(`${index + 1}. ID: ${video.id}`);
        console.log(`   用户: ${video.user?.email || 'Unknown'}`);
        console.log(`   状态: ${video.status}`);
        console.log(`   TaskID: ${video.taskId || 'None'}`);
        console.log(`   创建时间: ${video.createdAt}`);
        console.log(`   积分消耗: ${video.creditsUsed}`);
        console.log('');
      });
    }

    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.log(`⚠️ 无法连接本地数据库: ${error.message}`);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  const results = {
    apiConnectivity: await testApiConnectivity(),
    productionConfig: await checkProductionConfig(),
    databaseConnection: await checkDatabaseConnection(),
    recentFailures: await checkRecentFailures()
  };

  console.log('\n📊 诊断结果汇总:');
  console.log('═══════════════════════════════════════');
  console.log(`🌐 API连通性: ${results.apiConnectivity ? '✅ 正常' : '❌ 异常'}`);
  console.log(`🔧 生产配置: ${results.productionConfig ? '✅ 正常' : '❌ 异常'}`);
  console.log(`🗄️ 数据库连接: ${results.databaseConnection ? '✅ 正常' : '❌ 异常'}`);
  console.log(`📋 失败记录: ${results.recentFailures ? '✅ 已检查' : '⚠️ 无法检查'}`);

  console.log('\n💡 建议操作:');
  
  if (!results.apiConnectivity) {
    console.log('1. 检查VEO3 API密钥是否正确配置在生产环境');
    console.log('2. 验证网络连接和防火墙设置');
    console.log('3. 检查kie.ai服务状态');
  }
  
  if (!results.productionConfig) {
    console.log('1. 检查CloudFlare/Railway环境变量配置');
    console.log('2. 重新部署应用程序');
  }
  
  if (!results.databaseConnection) {
    console.log('1. 检查数据库URL配置');
    console.log('2. 验证数据库服务器状态');
  }

  console.log('\n🎯 下一步: 根据以上建议修复问题后重新测试');
}

// 执行诊断
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testApiConnectivity, checkProductionConfig, checkDatabaseConnection }; 