#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 开始为Cloudflare Pages优化构建...');

// 需要删除的大文件和目录（超过25MB限制）
const filesToDelete = [
  '.next/cache',                                    // Webpack缓存
  '.next/cache/webpack',                           // 具体的webpack缓存目录
  '.next/cache/webpack/server-production',         // 服务端生产缓存
  '.next/trace',                                   // 构建跟踪文件
];

// 需要保留的关键文件（即使较大）
const keepFiles = [
  '.next/static',
  '.next/server',
  '.next/app-build-manifest.json',
  '.next/BUILD_ID',
];

function deleteRecursive(filePath) {
  if (fs.existsSync(filePath)) {
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`✅ 删除目录: ${filePath}`);
    } else {
      const sizeInMB = stats.size / (1024 * 1024);
      if (sizeInMB > 25) {
        fs.unlinkSync(filePath);
        console.log(`✅ 删除大文件: ${filePath} (${sizeInMB.toFixed(2)}MB)`);
      }
    }
  } else {
    console.log(`⚠️  文件不存在: ${filePath}`);
  }
}

function optimizeForCloudflare() {
  console.log('🧹 清理大文件和缓存...');
  
  // 删除指定的文件和目录
  filesToDelete.forEach(deleteRecursive);
  
  // 检查.next目录中的所有大文件
  const nextDir = '.next';
  if (fs.existsSync(nextDir)) {
    checkDirectory(nextDir);
  }
  
  console.log('✨ Cloudflare Pages优化完成！');
  console.log('📝 所有超过25MB的文件已被删除');
}

function checkDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    try {
      const stats = fs.lstatSync(filePath);
      
      if (stats.isDirectory()) {
        // 递归检查子目录
        checkDirectory(filePath);
      } else {
        const sizeInMB = stats.size / (1024 * 1024);
        if (sizeInMB > 25) {
          // 检查是否是需要保留的文件
          const shouldKeep = keepFiles.some(keepPattern => 
            filePath.includes(keepPattern)
          );
          
          if (!shouldKeep) {
            fs.unlinkSync(filePath);
            console.log(`✅ 删除大文件: ${filePath} (${sizeInMB.toFixed(2)}MB)`);
          } else {
            console.log(`⚠️  保留关键大文件: ${filePath} (${sizeInMB.toFixed(2)}MB)`);
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  无法访问文件: ${filePath} - ${error.message}`);
    }
  });
}

// 执行优化
optimizeForCloudflare(); 