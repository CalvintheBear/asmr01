#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 开始为Cloudflare Pages优化构建...');

// 需要删除的大文件和目录（超过25MB限制）
const filesToDelete = [
  '.next/cache',                                    // Webpack缓存
  'node_modules/@next/swc-win32-x64-msvc',         // 大型编译器文件
  'node_modules/@img/sharp-win32-x64',             // 图像处理库
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
  }
}

function optimizeForCloudflare() {
  console.log('🧹 清理大文件和缓存...');
  
  // 删除指定的文件和目录
  filesToDelete.forEach(deleteRecursive);
  
  // 检查.next目录中的大文件
  const nextDir = '.next';
  if (fs.existsSync(nextDir)) {
    checkDirectory(nextDir);
  }
  
  console.log('✨ Cloudflare Pages优化完成！');
  console.log('📝 建议：确保在Cloudflare Pages设置中配置正确的构建命令: npm run build:cloudflare');
}

function checkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
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
  });
}

// 运行优化
optimizeForCloudflare(); 