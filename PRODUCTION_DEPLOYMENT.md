# 🚀 CuttingASMR.org 生产环境部署指南

## 🔑 Creem正式环境配置

### 产品信息更新完成 ✅
- **Starter**: `prod_7jHfoQZh5FuYUbIJgIM9ZQ` - $9.9 (115积分)
- **Standard**: `prod_7E4i1f1bV8CPMYc7gRx67l` - $30 (355积分)  
- **Premium**: `prod_6mI2w4gJN4FfZ6FuOFzfcr` - $99 (1450积分)

### 支付链接验证
- **Premium**: https://www.creem.io/payment/prod_6mI2w4gJN4FfZ6FuOFzfcr
- **Standard**: https://www.creem.io/payment/prod_7E4i1f1bV8CPMYc7gRx67l
- **Starter**: https://www.creem.io/payment/prod_7jHfoQZh5FuYUbIJgIM9ZQ

## 🌐 域名配置

### Creem后台设置 (正式环境)
```
Webhook URL: https://cuttingasmr.org/api/webhooks/creem
Return URL: https://cuttingasmr.org/payment/success
```

## ⚙️ 环境变量配置

### 必需的生产环境变量
```bash
# Creem Payment Configuration
CREEM_SECRET_KEY=creem_4bO7LLLWie17BD2i7qTNNA
CREEM_WEBHOOK_SECRET=whsec_6jovyxtbgdcdNEMdH0nspT

# Application Configuration
NEXT_PUBLIC_APP_URL=https://cuttingasmr.org
NODE_ENV=production
CREEM_TEST_MODE=false

# Database
DATABASE_URL="your_production_database_url"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# VEO3 API
VEO3_API_KEY=your_veo3_api_key
VEO3_API_BASE_URL=https://api.kie.ai
```

## 🔄 环境检测逻辑

项目会自动检测环境：
- **开发环境**: localhost, trycloudflare.com → 使用测试产品ID
- **生产环境**: cuttingasmr.org → 使用正式产品ID

## 📋 部署前检查清单

### ✅ 代码配置
- [x] Creem产品ID已更新
- [x] 环境检测逻辑已配置
- [x] Webhook处理支持新产品ID
- [x] 支付成功页面配置完整

### ⚠️ 待配置项目
- [ ] 生产数据库URL
- [ ] Clerk生产环境密钥
- [ ] VEO3 API密钥
- [ ] DNS解析设置
- [ ] SSL证书配置

### 🧪 测试流程
1. **本地测试**: 使用cloudflare隧道 + 测试产品ID
2. **生产部署**: 使用正式域名 + 正式产品ID
3. **支付测试**: 验证三个套餐的支付流程

## 🚀 推荐部署平台

### Vercel (推荐)
```bash
# 1. 连接GitHub仓库
# 2. 配置环境变量
# 3. 自动部署
```

### Cloudflare Pages
```bash
# 1. 构建命令: npm run build
# 2. 输出目录: out
# 3. 配置环境变量
```

## 🔍 监控和日志

### 生产环境监控
- Creem webhook日志记录
- 用户支付流程跟踪
- 积分分配成功率监控
- API响应时间监控

### 错误处理
- 支付失败自动重试
- 用户匹配失败人工处理
- API调用失败降级方案

## 🎯 上线后验证

### 功能测试
1. 三个套餐的支付链接正常工作
2. Webhook接收支付通知
3. 积分自动分配到用户账户
4. 支付成功页面正确显示
5. 用户协议检查正常工作

### 性能测试
1. 页面加载速度 < 3秒
2. API响应时间 < 1秒
3. 数据库查询优化
4. CDN缓存配置

**�� 配置完成，项目已准备好正式上线！** 