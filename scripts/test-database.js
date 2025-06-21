#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 验证数据库连接是否正常工作
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('🔍 测试数据库连接...\n');
  
  const prisma = new PrismaClient();
  
  try {
    // 测试基本连接
    console.log('📡 尝试连接数据库...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功！');
    
    // 测试查询用户表
    console.log('\n📊 测试用户表查询...');
    const userCount = await prisma.user.count();
    console.log(`✅ 用户表查询成功，当前用户数: ${userCount}`);
    
    // 测试查询视频表
    console.log('\n🎥 测试视频表查询...');
    const videoCount = await prisma.video.count();
    console.log(`✅ 视频表查询成功，当前视频数: ${videoCount}`);
    
    // 测试查询购买记录表
    console.log('\n💰 测试购买记录表查询...');
    const purchaseCount = await prisma.purchase.count();
    console.log(`✅ 购买记录表查询成功，当前订单数: ${purchaseCount}`);
    
    // 测试查询审计日志表
    console.log('\n📝 测试审计日志表查询...');
    const auditLogCount = await prisma.auditLog.count();
    console.log(`✅ 审计日志表查询成功，当前日志数: ${auditLogCount}`);
    
    console.log('\n🎉 所有数据库测试通过！');
    console.log('📊 数据库统计:');
    console.log(`- 用户: ${userCount}`);
    console.log(`- 视频: ${videoCount}`);
    console.log(`- 订单: ${purchaseCount}`);
    console.log(`- 日志: ${auditLogCount}`);
    
  } catch (error) {
    console.error('❌ 数据库测试失败:', error.message);
    console.error('\n🔧 可能的解决方案:');
    console.error('1. 检查DATABASE_URL是否正确');
    console.error('2. 确认Railway数据库服务是否正常运行');
    console.error('3. 检查网络连接是否正常');
    console.error('4. 运行 npx prisma migrate deploy 同步数据库结构');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行测试
testDatabase(); 