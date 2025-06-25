#!/usr/bin/env node

/**
 * 用户视频记录检查脚本
 * 专门检查 dhumalsatyam035@gmail.com 用户的视频生成记录
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function checkUserVideos() {
  console.log('🔍 检查用户视频记录...\n');
  
  const prisma = new PrismaClient();
  const targetEmail = 'dhumalsatyam035@gmail.com';
  
  try {
    await prisma.$connect();
    console.log('✅ 数据库连接成功！\n');
    
    // 1. 查找用户是否存在
    console.log(`👤 查找用户: ${targetEmail}`);
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: {
        videos: {
          orderBy: { createdAt: 'desc' }
        },
        purchases: {
          orderBy: { createdAt: 'desc' }
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    
    if (!user) {
      console.log('❌ 用户不存在于数据库中');
      console.log('\n可能的原因:');
      console.log('1. 用户还未完成首次登录同步');
      console.log('2. 邮箱地址可能有误');
      console.log('3. 用户使用了不同的邮箱地址');
      
      // 列出所有用户邮箱供对比
      console.log('\n📋 当前数据库中的所有用户邮箱:');
      const allUsers = await prisma.user.findMany({
        select: { email: true, createdAt: true, totalCredits: true, usedCredits: true }
      });
      allUsers.forEach((u, index) => {
        console.log(`${index + 1}. ${u.email} (创建: ${u.createdAt.toLocaleString()}, 积分: ${u.totalCredits}/${u.usedCredits})`);
      });
      
    } else {
      console.log('✅ 用户存在！');
      console.log('\n👤 用户信息:');
      console.log(`- ID: ${user.id}`);
      console.log(`- Clerk ID: ${user.clerkUserId}`);
      console.log(`- 邮箱: ${user.email}`);
      console.log(`- 姓名: ${user.googleFullName || '未设置'}`);
      console.log(`- 创建时间: ${user.createdAt.toLocaleString()}`);
      console.log(`- 最后登录: ${user.lastLoginAt.toLocaleString()}`);
      console.log(`- 总积分: ${user.totalCredits}`);
      console.log(`- 已用积分: ${user.usedCredits}`);
      console.log(`- 剩余积分: ${user.totalCredits - user.usedCredits}`);
      console.log(`- 账户状态: ${user.isActive ? '活跃' : '停用'}`);
      
      // 2. 检查视频记录
      console.log(`\n🎥 视频记录 (共${user.videos.length}个):`);
      if (user.videos.length === 0) {
        console.log('❌ 没有找到任何视频记录！');
      } else {
        user.videos.forEach((video, index) => {
          console.log(`\n${index + 1}. 视频 ${video.id}:`);
          console.log(`   - TaskID: ${video.taskId || '无'}`);
          console.log(`   - 标题: ${video.title}`);
          console.log(`   - 提示词: ${video.prompt.substring(0, 100)}...`);
          console.log(`   - 状态: ${video.status}`);
          console.log(`   - 消耗积分: ${video.creditsUsed}`);
          console.log(`   - 创建时间: ${video.createdAt.toLocaleString()}`);
          console.log(`   - 完成时间: ${video.completedAt ? video.completedAt.toLocaleString() : '未完成'}`);
          console.log(`   - 视频URL: ${video.videoUrl || '无'}`);
          console.log(`   - 1080p URL: ${video.videoUrl1080p || '无'}`);
        });
      }
      
      // 3. 检查购买记录
      console.log(`\n💰 购买记录 (共${user.purchases.length}个):`);
      if (user.purchases.length === 0) {
        console.log('ℹ️ 没有购买记录');
      } else {
        user.purchases.forEach((purchase, index) => {
          console.log(`${index + 1}. ${purchase.packageName} - $${purchase.amount} (${purchase.creditsAdded}积分)`);
        });
      }
      
      // 4. 检查最近的审计日志
      console.log(`\n📝 最近的审计日志 (最近10条):`);
      user.auditLogs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.action} - ${log.createdAt.toLocaleString()}`);
        if (log.details) {
          console.log(`   详情: ${JSON.stringify(log.details).substring(0, 100)}...`);
        }
      });
    }
    
    // 5. 检查TaskID存储文件
    console.log('\n📁 检查TaskID存储文件...');
    try {
      if (fs.existsSync('task-storage.json')) {
        const taskData = JSON.parse(fs.readFileSync('task-storage.json', 'utf8'));
        const userTasks = taskData.filter(task => task.userEmail === targetEmail);
        
        console.log(`📋 TaskID存储文件中的记录 (共${userTasks.length}个):`);
        if (userTasks.length === 0) {
          console.log('❌ TaskID存储文件中没有该用户的记录');
        } else {
          userTasks.forEach((task, index) => {
            console.log(`${index + 1}. TaskID: ${task.taskId}`);
            console.log(`   - 用户ID: ${task.userId}`);
            console.log(`   - 视频ID: ${task.videoId}`);
            console.log(`   - 状态: ${task.status}`);
            console.log(`   - 创建时间: ${task.createdAt}`);
            console.log(`   - 视频URL: ${task.videoUrl || '无'}`);
          });
        }
        
        // 显示所有TaskID记录供对比
        console.log(`\n📋 所有TaskID记录 (共${taskData.length}个):`);
        taskData.forEach((task, index) => {
          console.log(`${index + 1}. ${task.userEmail} - TaskID: ${task.taskId} - ${task.status}`);
        });
      } else {
        console.log('❌ TaskID存储文件不存在');
      }
    } catch (error) {
      console.log('❌ 读取TaskID存储文件失败:', error.message);
    }
    
    // 6. 总结和建议
    console.log('\n📋 诊断总结:');
    if (!user) {
      console.log('❌ 主要问题: 用户未在数据库中找到');
      console.log('\n🔧 建议解决方案:');
      console.log('1. 检查用户是否使用正确的邮箱地址登录');
      console.log('2. 请求用户重新登录以触发用户同步');
      console.log('3. 检查Clerk认证是否正常工作');
      console.log('4. 手动调用用户同步API');
    } else if (user.videos.length === 0) {
      console.log('❌ 主要问题: 用户存在但没有视频记录');
      console.log('\n🔧 建议解决方案:');
      console.log('1. 检查视频生成API是否正常工作');
      console.log('2. 查看API调用日志确认是否有错误');
      console.log('3. 检查积分是否足够生成视频');
      console.log('4. 验证数据库事务是否正常提交');
    } else {
      console.log('✅ 用户和视频记录都存在');
      console.log('ℹ️ 如果用户报告看不到视频，可能是前端查询问题');
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行检查
checkUserVideos(); 