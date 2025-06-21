#!/usr/bin/env node

// 测试Railway数据库连接
const { PrismaClient } = require('@prisma/client');

console.log('🗄️  测试Railway数据库连接...\n');

// Railway数据库连接字符串
const RAILWAY_DB_URL = 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway';

async function testDatabaseConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: RAILWAY_DB_URL,
      },
    },
  });

  try {
    console.log('🔍 连接数据库...');
    
    // 测试基本连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');

    // 测试查询
    console.log('\n🔍 测试数据库查询...');
    
    // 检查用户表
    const userCount = await prisma.user.count();
    console.log(`✅ 用户表: ${userCount} 条记录`);

    // 检查视频表
    const videoCount = await prisma.video.count();
    console.log(`✅ 视频表: ${videoCount} 条记录`);

    // 检查购买记录表
    const purchaseCount = await prisma.purchase.count();
    console.log(`✅ 购买记录表: ${purchaseCount} 条记录`);

    // 检查审计日志表
    const auditCount = await prisma.auditLog.count();
    console.log(`✅ 审计日志表: ${auditCount} 条记录`);

    console.log('\n📊 数据库状态总结:');
    console.log(`- 总用户数: ${userCount}`);
    console.log(`- 总视频数: ${videoCount}`);
    console.log(`- 总购买数: ${purchaseCount}`);
    console.log(`- 审计日志: ${auditCount}`);

    console.log('\n✅ Railway数据库完全正常，可以安全删除Railway网站部署');
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.log('\n🔧 可能的解决方案:');
    console.log('1. 检查Railway数据库是否在运行');
    console.log('2. 验证数据库连接字符串是否正确');
    console.log('3. 检查网络连接');
  } finally {
    await prisma.$disconnect();
  }
}

console.log('📋 当前测试的数据库:');
console.log(`   URL: ${RAILWAY_DB_URL.replace(/:[^:@]*@/, ':****@')}`);
console.log('');

testDatabaseConnection(); 