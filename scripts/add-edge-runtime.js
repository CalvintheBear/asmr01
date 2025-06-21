const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 查找所有API路由文件
const apiFiles = glob.sync('src/app/api/**/route.ts');

console.log(`找到 ${apiFiles.length} 个API路由文件`);

apiFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经有 runtime 配置
    if (content.includes('export const runtime')) {
      console.log(`跳过 ${filePath} - 已有runtime配置`);
      return;
    }
    
    // 在第一个import之前添加runtime配置
    const lines = content.split('\n');
    const runtimeLine = 'export const runtime = "edge";';
    
    // 找到第一个非空行的位置
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        insertIndex = i;
        break;
      }
    }
    
    // 插入runtime配置
    lines.splice(insertIndex, 0, runtimeLine, '');
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ 更新 ${filePath}`);
  } catch (error) {
    console.error(`❌ 更新 ${filePath} 失败:`, error.message);
  }
});

console.log('完成添加Edge Runtime配置'); 