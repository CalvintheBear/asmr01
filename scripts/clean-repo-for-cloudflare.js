#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧹 开始清理仓库以符合Cloudflare 25MB限制...');

// 需要从Git历史中移除的大文件
const filesToRemove = [
    'ASMR_Video_Result_集成总结.md',
    'ASMR用户系统架构设计.md', 
    'ASMR类型编辑指南.md',
    'SEO关键词策略报告.md',
    'VEO3_API_集成指南.md',
    '.eslintrc.json',
    'railway.json',
    'railway-config-template.txt',
    '.github/workflows/deploy.yml',
    '.vscode/settings.json',
    'src/lib/privacy-updates.md'
];

console.log('📋 将移除以下文件:');
filesToRemove.forEach(file => console.log(`  - ${file}`));

try {
    // 从Git缓存中移除文件
    console.log('\n🗑️  从Git缓存中移除文件...');
    filesToRemove.forEach(file => {
        try {
            execSync(`git rm --cached "${file}"`, { stdio: 'inherit' });
            console.log(`✅ 移除: ${file}`);
        } catch (error) {
            console.log(`⚠️  文件不存在或已移除: ${file}`);
        }
    });

    // 删除本地文件（如果存在）
    console.log('\n🧹 删除本地文件...');
    filesToRemove.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`✅ 删除本地文件: ${file}`);
        }
    });

    // 提交更改
    console.log('\n📝 提交更改...');
    execSync('git add .gitignore', { stdio: 'inherit' });
    execSync('git commit -m "清理仓库：移除大型文档文件以符合Cloudflare 25MB限制"', { stdio: 'inherit' });

    console.log('\n✨ 清理完成！');
    console.log('📊 仓库现在应该符合Cloudflare Pages的大小限制');
    console.log('🚀 可以重新尝试部署到Cloudflare Pages');

} catch (error) {
    console.error('❌ 清理过程中出现错误:', error.message);
    process.exit(1);
} 