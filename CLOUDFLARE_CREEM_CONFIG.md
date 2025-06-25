# Cloudflare Pages Creem生产环境配置清单

## 🎯 目标
确保cuttingasmr.org使用真实的Creem API密钥和生产环境产品ID，而不是测试配置。

## 📋 必需的环境变量配置

### 在Cloudflare Pages Dashboard中设置以下环境变量：

#### 1. 基础环境配置
```
NODE_ENV = production
CREEM_TEST_MODE = false
NEXT_PUBLIC_APP_URL = https://cuttingasmr.org
```

#### 2. Creem生产环境API密钥 ⚠️ 重要 (新Creem Store)
```
CREEM_API_KEY = creem_3383jJhZ9BrQXXeHL2bxB
CREEM_WEBHOOK_SECRET = whsec_bCADZ6mZaWDVnJCzwato5
```

#### 3. 其他必需环境变量
```
DATABASE_URL = [Railway PostgreSQL连接字符串]
CLERK_SECRET_KEY = [Clerk密钥]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [Clerk公钥]
VEO3_API_KEY = c982688b5c6938943dd721ed1d576edb
VEO3_API_BASE_URL = https://api.kie.ai
```

## 🏷️ 生产环境产品ID确认

### 当前将使用的生产环境产品ID (新Creem Store)：
- **Starter包** (115积分, $9.9): `prod_44gUntOAeR5KU9a4wkr45U`
- **Standard包** (355积分, $30): `prod_2tyKrzLDOi7TLMNiIpHsj4`
- **Premium包** (1450积分, $99): `prod_7aRS2kaSvk33msxNfnIAV8`

### 支付链接格式：
- Starter: https://www.creem.io/payment/prod_44gUntOAeR5KU9a4wkr45U
- Standard: https://www.creem.io/payment/prod_2tyKrzLDOi7TLMNiIpHsj4
- Premium: https://www.creem.io/payment/prod_7aRS2kaSvk33msxNfnIAV8

## 🔍 配置验证步骤

### 1. 部署前验证
```bash
# 运行配置验证脚本
node scripts/verify-production-config.js
```

### 2. 部署后验证
访问以下API端点验证配置：
```
GET https://cuttingasmr.org/api/check-creem-config
```

预期响应应显示：
- `isTestMode: false`
- `recommendation: "✅ 当前使用生产环境配置"`
- 生产环境产品ID

### 3. 支付测试验证
- 访问生产环境支付链接
- 确认跳转到Creem正式支付页面（不是test路径）
- 验证产品价格和积分数量正确

## ⚠️ 重要注意事项

### 1. 环境判断逻辑
系统通过以下条件判断是否为测试模式：
```javascript
const isTestMode = process.env.NODE_ENV === 'development' || 
                  process.env.CREEM_TEST_MODE === 'true' ||
                  process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') ||
                  process.env.NEXT_PUBLIC_APP_URL?.includes('trycloudflare.com')
```

### 2. 确保生产环境配置
- ✅ `NODE_ENV = "production"`
- ✅ `CREEM_TEST_MODE = "false"` 或不设置
- ✅ `NEXT_PUBLIC_APP_URL = "https://cuttingasmr.org"`

### 3. API密钥安全
- 🔐 在Cloudflare Pages环境变量中设置，不要硬编码
- 🔐 确保使用生产环境的真实API密钥
- 🔐 定期轮换API密钥以确保安全

## 🚀 部署流程

### 1. 更新环境变量
在Cloudflare Pages Dashboard中设置所有必需的环境变量

### 2. 触发重新部署
```bash
git add .
git commit -m "确保使用生产环境Creem配置"
git push origin main
```

### 3. 验证部署结果
- 检查 `/api/check-creem-config` 端点
- 测试支付链接跳转
- 验证webhook接收正常

## 📊 当前状态

### ✅ 已完成
- [x] 生产环境产品ID已配置
- [x] 环境判断逻辑已实现
- [x] 配置验证脚本已创建
- [x] wrangler.toml已更新

### ⚠️ 待确认
- [ ] Cloudflare Pages环境变量是否已正确设置
- [ ] 生产环境API密钥是否已配置
- [ ] 支付链接是否跳转到正式页面

## 🔧 故障排除

### 如果仍在使用测试配置：
1. 检查Cloudflare Pages环境变量设置
2. 确认`NODE_ENV`设置为`production`
3. 确认`NEXT_PUBLIC_APP_URL`设置为`https://cuttingasmr.org`
4. 重新部署应用

### API密钥问题：
1. 确认在Cloudflare Pages中设置了`CREEM_API_KEY`和`CREEM_WEBHOOK_SECRET`
2. 检查API密钥格式是否正确
3. 测试webhook接收功能

---
**最后更新**: 2024年12月
**负责人**: 开发团队
**状态**: 待验证生产环境配置 