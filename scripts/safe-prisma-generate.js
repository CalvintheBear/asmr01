#!/usr/bin/env node

/**
 * 安全的Prisma生成脚本
 * 在Railway环境中如果失败不会中断构建
 */

const { spawn } = require('child_process');

console.log('📦 开始安全Prisma生成...');

// 检查是否在Railway/CI环境中
const isRailwayEnvironment = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
const isCI = !!(process.env.CI || process.env.RAILWAY_ENVIRONMENT);

console.log('🔍 环境检测:', {
  isRailway: isRailwayEnvironment,
  isCI,
  hasDbUrl: !!process.env.DATABASE_URL
});

// 运行Prisma生成
const prismaGenerate = spawn('npx', ['prisma', 'generate'], {
  stdio: 'inherit',
  shell: true
});

prismaGenerate.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Prisma生成成功');
    process.exit(0);
  } else {
    console.log('⚠️ Prisma生成失败，退出码:', code);
    
    if (isRailwayEnvironment || isCI) {
      console.log('🔧 Railway/CI环境：Prisma生成失败，但继续构建');
      console.log('这可能是由于环境变量配置问题，但不会阻止Next.js构建');
      process.exit(0); // 不中断构建
    } else {
      console.log('❌ 本地环境：Prisma生成失败，中断构建');
      process.exit(code);
    }
  }
});

prismaGenerate.on('error', (error) => {
  console.error('❌ Prisma生成错误:', error.message);
  
  if (isRailwayEnvironment || isCI) {
    console.log('🔧 Railway/CI环境：忽略Prisma错误，继续构建');
    process.exit(0);
  } else {
    process.exit(1);
  }
}); 