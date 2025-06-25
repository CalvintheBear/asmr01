#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function checkCreditsHistory() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('📊 检查积分消耗历史...\n');
    
    // 查看所有视频记录的积分消耗
    const videos = await prisma.video.findMany({
      select: {
        id: true,
        creditsUsed: true,
        createdAt: true,
        status: true,
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('🎥 所有视频的积分消耗记录:');
    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.user.email} - ${video.creditsUsed}积分 - ${video.status} - ${video.createdAt.toLocaleString()}`);
    });
    
    // 查看积分消耗统计
    console.log('\n📈 积分消耗统计:');
    const creditStats = {};
    videos.forEach(video => {
      const credits = video.creditsUsed;
      creditStats[credits] = (creditStats[credits] || 0) + 1;
    });
    
    Object.entries(creditStats).forEach(([credits, count]) => {
      console.log(`- ${credits}积分: ${count}次`);
    });
    
    // 查看审计日志中的积分相关操作
    console.log('\n📝 积分相关的审计日志:');
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { action: { contains: 'credit' } },
          { action: { contains: 'video' } },
          { action: { contains: 'manual' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    auditLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log.action} - ${log.createdAt.toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCreditsHistory(); 