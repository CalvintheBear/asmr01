#!/usr/bin/env node

/**
 * 测试Google OAuth配置
 * 验证新的GCP账户配置是否正确
 */

// 加载环境变量
try {
    require('dotenv').config({ path: '.env.local' });
} catch (error) {
    console.log('⚠️ 注意: 无法加载dotenv，将使用系统环境变量');
}

const http = require('http');
const https = require('https');

console.log('🔍 测试Google OAuth配置...\n');

// 检查环境变量
function checkEnvironmentVariables() {
    console.log('📋 检查环境变量:');
    
    const requiredVars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET'
    ];
    
    const results = {};
    
    requiredVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            results[varName] = value.substring(0, 20) + '...';
            console.log(`✅ ${varName}: ${results[varName]}`);
        } else {
            results[varName] = null;
            console.log(`❌ ${varName}: 未设置`);
        }
    });
    
    return results;
}

// 测试本地服务器响应
function testLocalServer() {
    return new Promise((resolve) => {
        console.log('\n🌐 测试本地服务器:');
        
        const req = http.get('http://localhost:3000/api/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ 本地服务器响应正常');
                    console.log(`📊 状态码: ${res.statusCode}`);
                    resolve(true);
                } else {
                    console.log(`❌ 服务器响应异常: ${res.statusCode}`);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log('❌ 本地服务器连接失败:', err.message);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ 连接超时');
            req.destroy();
            resolve(false);
        });
    });
}

// 验证Google OAuth客户端ID格式
function validateGoogleConfig() {
    console.log('\n🔐 验证Google OAuth配置格式:');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    let isValid = true;
    
    // 验证客户端ID格式
    if (clientId) {
        if (clientId.includes('.apps.googleusercontent.com')) {
            console.log('✅ Google Client ID 格式正确');
        } else {
            console.log('❌ Google Client ID 格式不正确');
            isValid = false;
        }
    } else {
        console.log('❌ Google Client ID 未设置');
        isValid = false;
    }
    
    // 验证客户端密钥格式
    if (clientSecret) {
        if (clientSecret.startsWith('GOCSPX-')) {
            console.log('✅ Google Client Secret 格式正确');
        } else {
            console.log('❌ Google Client Secret 格式不正确');
            isValid = false;
        }
    } else {
        console.log('❌ Google Client Secret 未设置');
        isValid = false;
    }
    
    return isValid;
}

// 测试Google OAuth授权端点
function testGoogleOAuthEndpoint() {
    return new Promise((resolve) => {
        console.log('\n🔗 测试Google OAuth端点:');
        
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.log('❌ 无法测试 - 客户端ID未设置');
            resolve(false);
            return;
        }
        
        // 构造OAuth URL
        const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback/google');
        const scope = encodeURIComponent('openid profile email');
        const oauthUrl = `https://accounts.google.com/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        
        console.log('📋 OAuth配置信息:');
        console.log(`   🔗 客户端ID: ${clientId.substring(0, 20)}...`);
        console.log(`   🔗 重定向URI: http://localhost:3000/api/auth/callback/google`);
        console.log(`   🔗 授权范围: openid profile email`);
        
        // 简单的HTTP HEAD请求测试Google是否可达
        const url = new URL('https://accounts.google.com');
        const req = https.request({
            hostname: url.hostname,
            port: 443,
            path: '/',
            method: 'HEAD'
        }, (res) => {
            if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
                console.log('✅ Google OAuth服务可达');
                resolve(true);
            } else {
                console.log(`❌ Google OAuth服务响应异常: ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', (err) => {
            console.log('❌ 无法连接到Google OAuth服务:', err.message);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Google OAuth服务连接超时');
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// 主测试函数
async function main() {
    console.log('🚀 开始Google OAuth配置测试\n');
    
    // 步骤1: 检查环境变量
    const envVars = checkEnvironmentVariables();
    
    // 步骤2: 验证配置格式
    const isValidConfig = validateGoogleConfig();
    
    // 步骤3: 测试本地服务器
    const isServerRunning = await testLocalServer();
    
    // 步骤4: 测试Google OAuth端点
    const isGoogleReachable = await testGoogleOAuthEndpoint();
    
    // 总结结果
    console.log('\n📊 测试结果总结:');
    console.log('================================');
    
    if (envVars.GOOGLE_CLIENT_ID && envVars.GOOGLE_CLIENT_SECRET) {
        console.log('✅ 环境变量配置: 完成');
    } else {
        console.log('❌ 环境变量配置: 缺失');
    }
    
    if (isValidConfig) {
        console.log('✅ 配置格式验证: 通过');
    } else {
        console.log('❌ 配置格式验证: 失败');
    }
    
    if (isServerRunning) {
        console.log('✅ 本地服务器: 运行正常');
    } else {
        console.log('❌ 本地服务器: 连接失败');
    }
    
    if (isGoogleReachable) {
        console.log('✅ Google OAuth服务: 可达');
    } else {
        console.log('❌ Google OAuth服务: 不可达');
    }
    
    const allTestsPassed = envVars.GOOGLE_CLIENT_ID && 
                          envVars.GOOGLE_CLIENT_SECRET && 
                          isValidConfig && 
                          isServerRunning && 
                          isGoogleReachable;
    
    if (allTestsPassed) {
        console.log('\n🎉 所有测试通过！Google OAuth配置正确');
        console.log('\n📋 下一步操作:');
        console.log('1. 打开浏览器访问: http://localhost:3000');
        console.log('2. 点击登录按钮');
        console.log('3. 选择"使用Google登录"');
        console.log('4. 验证能否正常跳转到Google授权页面');
    } else {
        console.log('\n⚠️ 部分测试失败，请检查配置');
    }
    
    console.log('\n================================');
}

// 运行测试
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { checkEnvironmentVariables, testLocalServer, validateGoogleConfig, testGoogleOAuthEndpoint }; 