#!/usr/bin/env node

/**
 * 全面配置检查脚本
 * 根据项目架构检查所有必需配置
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

console.log('🔍 CuttingASMR.org 全面配置检查\n');
console.log('================================================\n');

// 1. 核心环境变量检查
function checkCoreEnvironmentVariables() {
    console.log('📋 1. 核心环境变量检查:');
    
    const coreVars = {
        '🗄️ 数据库配置': {
            'DATABASE_URL': process.env.DATABASE_URL
        },
        '🔐 用户认证 (Clerk)': {
            'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
            'CLERK_SECRET_KEY': process.env.CLERK_SECRET_KEY
        },
        '🎬 VEO3 AI API池': {
            'VEO3_API_KEY': process.env.VEO3_API_KEY,
            'VEO3_API_KEY_2': process.env.VEO3_API_KEY_2,
            'VEO3_API_KEY_3': process.env.VEO3_API_KEY_3,
            'VEO3_API_KEY_4': process.env.VEO3_API_KEY_4,
            'VEO3_API_KEY_5': process.env.VEO3_API_KEY_5,
            'VEO3_API_BASE_URL': process.env.VEO3_API_BASE_URL
        },
        '💳 支付系统 (Creem)': {
            'CREEM_API_KEY': process.env.CREEM_API_KEY,
            'CREEM_WEBHOOK_SECRET': process.env.CREEM_WEBHOOK_SECRET
        },
        '🌐 Google OAuth': {
            'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
            'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET
        },
        '⚙️ 应用配置': {
            'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
            'NODE_ENV': process.env.NODE_ENV
        }
    };

    let allConfigured = true;
    let totalVars = 0;
    let configuredVars = 0;

    Object.entries(coreVars).forEach(([category, vars]) => {
        console.log(`\n   ${category}:`);
        Object.entries(vars).forEach(([varName, value]) => {
            totalVars++;
            const status = value ? '✅' : '❌';
            const displayValue = value ? 
                (value.length > 30 ? value.substring(0, 25) + '...' : value) : 
                'NOT_SET';
            
            console.log(`     ${status} ${varName}: ${displayValue}`);
            
            if (value) {
                configuredVars++;
            } else {
                allConfigured = false;
            }
        });
    });

    console.log(`\n   📊 配置完成度: ${configuredVars}/${totalVars} (${Math.round(configuredVars/totalVars*100)}%)`);
    return { allConfigured, configuredVars, totalVars };
}

// 2. VEO3 API池配置详细检查
function checkVEO3ApiPool() {
    console.log('\n📋 2. VEO3 API池配置检查:');
    
    const apiKeys = [
        { name: 'VEO3_API_KEY (主密钥)', value: process.env.VEO3_API_KEY },
        { name: 'VEO3_API_KEY_2 (备用密钥1)', value: process.env.VEO3_API_KEY_2 },
        { name: 'VEO3_API_KEY_3 (备用密钥2)', value: process.env.VEO3_API_KEY_3 },
        { name: 'VEO3_API_KEY_4 (备用密钥3)', value: process.env.VEO3_API_KEY_4 },
        { name: 'VEO3_API_KEY_5 (备用密钥4)', value: process.env.VEO3_API_KEY_5 }
    ];

    const configuredKeys = apiKeys.filter(key => key.value).length;
    
    console.log(`   🔑 API密钥池状态: ${configuredKeys}/5 个密钥已配置`);
    
    apiKeys.forEach(key => {
        const status = key.value ? '✅' : '❌';
        const value = key.value ? `${key.value.substring(0, 15)}...` : 'NOT_SET';
        console.log(`     ${status} ${key.name}: ${value}`);
    });

    // 检查API池是否能正常工作
    if (configuredKeys === 0) {
        console.log('   ⚠️ 警告: 没有配置任何VEO3 API密钥，系统将使用默认密钥');
    } else if (configuredKeys < 3) {
        console.log('   ⚠️ 建议: 配置至少3个API密钥以提高系统稳定性');
    } else {
        console.log('   ✅ 优秀: API密钥池配置良好，支持负载均衡和故障转移');
    }

    return { configuredKeys, totalKeys: 5 };
}

// 3. 文件配置检查
function checkFileConfigurations() {
    console.log('\n📋 3. 关键文件配置检查:');
    
    const keyFiles = [
        {
            name: 'API密钥池管理',
            path: 'src/lib/api-key-pool.ts',
            description: 'VEO3 API密钥轮询管理'
        },
        {
            name: 'VEO3 API客户端',
            path: 'src/lib/veo3-api.ts',
            description: 'VEO3 API调用封装'
        },
        {
            name: 'Creem支付配置',
            path: 'src/lib/creem-config.ts',
            description: '支付系统配置'
        },
        {
            name: '中间件配置',
            path: 'src/middleware.ts',
            description: 'Clerk认证中间件'
        },
        {
            name: 'Prisma数据库模型',
            path: 'prisma/schema.prisma',
            description: '数据库模型定义'
        }
    ];

    let filesOk = 0;
    
    keyFiles.forEach(file => {
        const exists = fs.existsSync(file.path);
        const status = exists ? '✅' : '❌';
        console.log(`   ${status} ${file.name}: ${file.description}`);
        if (exists) filesOk++;
    });

    console.log(`   📊 文件完整性: ${filesOk}/${keyFiles.length} 个关键文件存在`);
    return { filesOk, totalFiles: keyFiles.length };
}

// 4. 部署平台配置检查
function checkDeploymentConfigurations() {
    console.log('\n📋 4. 部署平台配置检查:');
    
    console.log('   🌐 Cloudflare Pages:');
    console.log('     - 主要生产环境部署平台');
    console.log('     - 需要手动配置环境变量');
    console.log('     - 自动SSL和全球CDN');
    
    console.log('\n   🚂 Railway:');
    console.log('     - PostgreSQL数据库托管');
    console.log('     - 备用部署平台');
    console.log('     - 需要手动配置环境变量');
    
    console.log('\n   ⚠️ 待完成配置:');
    console.log('     - [ ] Cloudflare Pages环境变量');
    console.log('     - [ ] Railway环境变量');
    console.log('     - [ ] Google OAuth应用发布');
}

// 5. 安全和性能配置检查
function checkSecurityAndPerformance() {
    console.log('\n📋 5. 安全和性能配置:');
    
    const securityChecks = [
        {
            name: 'API密钥轮询',
            status: fs.existsSync('src/lib/api-key-pool.ts'),
            description: '防止单点故障和速率限制'
        },
        {
            name: 'Clerk用户认证',
            status: !!(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
            description: '企业级身份验证'
        },
        {
            name: 'Webhook安全验证',
            status: !!process.env.CREEM_WEBHOOK_SECRET,
            description: 'Creem支付回调验证'
        },
        {
            name: 'Edge Runtime优化',
            status: fs.existsSync('src/middleware.ts'),
            description: '全球边缘计算优化'
        }
    ];

    securityChecks.forEach(check => {
        const status = check.status ? '✅' : '❌';
        console.log(`   ${status} ${check.name}: ${check.description}`);
    });
}

// 6. 生成建议的完整配置
function generateRecommendedConfiguration() {
    console.log('\n📋 6. 建议的完整 .env.local 配置:');
    
    console.log('\n```env');
    console.log('# Google OAuth 配置');
    console.log('GOOGLE_CLIENT_ID=262239625253-gvo5cl5a7b1thhqaqiqutq60i9qtpbid.apps.googleusercontent.com');
    console.log('GOOGLE_CLIENT_SECRET=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Kp3');
    console.log('');
    console.log('# Clerk 用户认证配置');
    console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmFtZWQtcGVhZm93bC05My5jbGVyay5hY2NvdW50cy5kZXYk');
    console.log('CLERK_SECRET_KEY=sk_test_yGgVnAtvDEZxDmyZfMuJJLqSmteroInW');
    console.log('');
    console.log('# VEO3 AI API池配置 (5个密钥)');
    console.log('VEO3_API_KEY=c982688b5c693892fba10c89f5c7bbdc1670e936ff0c1b2e');
    console.log('VEO3_API_KEY_2=26d5d2de23b9f511998f39cda771ae4d12345678');
    console.log('VEO3_API_KEY_3=3f06398cf9d8dc02a243f2dd5f2f948912345678');
    console.log('VEO3_API_KEY_4=db092e9551f4631136cab1b141fdfd2112345678');
    console.log('VEO3_API_KEY_5=6a77fe3ca6856170f6618d4f249cfc6a12345678');
    console.log('VEO3_API_BASE_URL=https://kieai.erweima.ai');
    console.log('');
    console.log('# 数据库配置');
    console.log('DATABASE_URL=postgresql://postgres:BIptHOJQMddhPSxQNhLJSDNpKLJrRfOe@gondola.proxy.rlwy.net:10910/railway');
    console.log('');
    console.log('# Creem 支付配置');
    console.log('CREEM_API_KEY=creem_3383jJhZ9F2dUwrT6vZTZnFNqJ5YMmJUdLM7');
    console.log('CREEM_WEBHOOK_SECRET=whsec_bCADZ6mZaHJnKkjJiJj/6JpTZnSUdLM7');
    console.log('');
    console.log('# 应用配置');
    console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000');
    console.log('NODE_ENV=development');
    console.log('```');
}

// 主函数
function main() {
    console.log('🚀 开始全面配置检查...\n');
    
    // 执行所有检查
    const coreResult = checkCoreEnvironmentVariables();
    const apiPoolResult = checkVEO3ApiPool();
    const filesResult = checkFileConfigurations();
    
    checkDeploymentConfigurations();
    checkSecurityAndPerformance();
    
    // 生成总结报告
    console.log('\n================================================');
    console.log('📊 配置检查总结报告:');
    console.log('================================================');
    
    console.log(`✅ 核心环境变量: ${coreResult.configuredVars}/${coreResult.totalVars} 已配置`);
    console.log(`🔑 VEO3 API池: ${apiPoolResult.configuredKeys}/${apiPoolResult.totalKeys} 密钥已配置`);
    console.log(`📁 关键文件: ${filesResult.filesOk}/${filesResult.totalFiles} 文件存在`);
    
    // 检查是否需要添加缺失的VEO3 API密钥
    if (apiPoolResult.configuredKeys < 5) {
        console.log('\n⚠️ 重要发现: VEO3 API池配置不完整!');
        console.log(`   当前只配置了 ${apiPoolResult.configuredKeys}/5 个API密钥`);
        console.log('   建议补充其他4个备用API密钥以提高系统稳定性');
    }
    
    // 检查OAuth状态
    console.log('\n🔐 Google OAuth状态:');
    console.log('   ⏳ 当前状态: 正在验证中 (Google审核)');
    console.log('   ⏱️ 预计时间: 通常需要1-7天');
    console.log('   📋 建议: 可以先配置测试用户进行功能验证');
    
    generateRecommendedConfiguration();
    
    console.log('\n================================================');
    console.log('🎯 下一步行动计划:');
    console.log('================================================');
    console.log('1. ✅ 完善本地VEO3 API池配置 (添加备用密钥)');
    console.log('2. ⏳ 等待Google OAuth审核通过');
    console.log('3. 🌐 更新Cloudflare Pages环境变量');
    console.log('4. 🚂 更新Railway环境变量');
    console.log('5. 🧪 进行全面功能测试');
    
    console.log('\n🎉 配置检查完成！');
}

// 运行检查
if (require.main === module) {
    main();
} 