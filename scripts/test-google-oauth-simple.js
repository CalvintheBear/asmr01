#!/usr/bin/env node

/**
 * 简单的Google OAuth配置测试
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Google OAuth 配置验证\n');

// 读取 .env.local 文件
function loadEnvFile() {
    const envPath = path.join(process.cwd(), '.env.local');
    const envVars = {};
    
    try {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
        
        return envVars;
    } catch (error) {
        console.log('❌ 无法读取 .env.local 文件:', error.message);
        return {};
    }
}

// 验证环境变量
function validateEnvironment() {
    console.log('📋 检查环境变量配置:');
    
    const envVars = loadEnvFile();
    
    const required = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET'
    ];
    
    let allValid = true;
    
    required.forEach(key => {
        if (envVars[key]) {
            const masked = envVars[key].substring(0, 20) + '...';
            console.log(`✅ ${key}: ${masked}`);
        } else {
            console.log(`❌ ${key}: 未配置`);
            allValid = false;
        }
    });
    
    return { allValid, envVars };
}

// 验证格式
function validateFormat(envVars) {
    console.log('\n🔐 验证配置格式:');
    
    const clientId = envVars.GOOGLE_CLIENT_ID;
    const clientSecret = envVars.GOOGLE_CLIENT_SECRET;
    
    let formatValid = true;
    
    if (clientId && clientId.includes('.apps.googleusercontent.com')) {
        console.log('✅ Google Client ID 格式正确');
    } else {
        console.log('❌ Google Client ID 格式错误');
        formatValid = false;
    }
    
    if (clientSecret && clientSecret.startsWith('GOCSPX-')) {
        console.log('✅ Google Client Secret 格式正确');
    } else {
        console.log('❌ Google Client Secret 格式错误');
        formatValid = false;
    }
    
    return formatValid;
}

// 生成测试URL
function generateTestUrls(envVars) {
    console.log('\n🔗 生成测试URL:');
    
    const clientId = envVars.GOOGLE_CLIENT_ID;
    if (!clientId) {
        console.log('❌ 无法生成测试URL - Client ID 缺失');
        return;
    }
    
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback/google');
    const scope = encodeURIComponent('openid profile email');
    const state = 'test_state_' + Date.now();
    
    const authUrl = `https://accounts.google.com/oauth2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `response_type=code&` +
        `state=${state}`;
    
    console.log('📋 OAuth 配置信息:');
    console.log(`   🔗 客户端ID: ${clientId}`);
    console.log(`   🔗 重定向URI: http://localhost:3000/api/auth/callback/google`);
    console.log(`   🔗 授权范围: openid profile email`);
    console.log('\n🌐 测试授权URL:');
    console.log(`   ${authUrl}`);
    
    return authUrl;
}

// 主函数
async function main() {
    console.log('🚀 开始 Google OAuth 配置验证\n');
    
    // 步骤1: 验证环境变量
    const { allValid, envVars } = validateEnvironment();
    
    if (!allValid) {
        console.log('\n❌ 环境变量配置不完整');
        return;
    }
    
    // 步骤2: 验证格式
    const formatValid = validateFormat(envVars);
    
    if (!formatValid) {
        console.log('\n❌ 配置格式验证失败');
        return;
    }
    
    // 步骤3: 生成测试URL
    const testUrl = generateTestUrls(envVars);
    
    // 总结
    console.log('\n📊 配置验证结果:');
    console.log('================================');
    console.log('✅ 环境变量: 配置完成');
    console.log('✅ 格式验证: 通过');
    console.log('✅ 测试URL: 已生成');
    
    console.log('\n🎉 Google OAuth 配置验证成功！');
    
    console.log('\n📋 下一步测试:');
    console.log('1. 确保开发服务器运行在 http://localhost:3000');
    console.log('2. 在浏览器中访问您的应用');
    console.log('3. 点击 Google 登录按钮');
    console.log('4. 验证是否正确跳转到 Google 授权页面');
    
    console.log('\n================================');
}

if (require.main === module) {
    main().catch(console.error);
} 