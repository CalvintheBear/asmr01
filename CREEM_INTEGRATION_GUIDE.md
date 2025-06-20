# Creem支付系统集成指南

## 概述

本指南介绍如何在CuttingASMR.org项目中集成Creem支付系统。Creem是专为AI初创公司设计的金融操作系统，提供全球税务合规、支付处理等功能。

## 当前套餐结构

### 💰 定价层级

1. **Starter** - $9.9 (原价$12)
   - 115个Credits (11+视频)
   - 720p-1080p质量
   - 所有ASMR类型
   - Credits永不过期

2. **Standard** - $30 (原价$40) ⭐ 最热门
   - 355个Credits (35+视频)
   - 1080p HD质量
   - 优先处理、商业使用权
   - Credits永不过期

3. **Premium** - $99 (原价$120)
   - 1450个Credits (145+视频)
   - 4K质量（即将推出）
   - API访问、优先支持
   - Credits永不过期

### 💡 计算规则
- **每10个Credits = 1个AI ASMR视频**
- **Credits永不过期**，随时使用

## 环境变量配置

在`.env.local`文件中添加以下配置：

```bash
# Creem 支付系统
CREEM_API_URL=https://api.creem.io
CREEM_API_KEY=your_creem_api_key_here
CREEM_SECRET_KEY=your_creem_secret_key_here  
CREEM_WEBHOOK_SECRET=your_creem_webhook_secret_here

# 应用URL（用于回调）
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 获取Creem API密钥

1. 访问 [Creem.io](https://creem.io) 注册账户
2. 在仪表板中找到"API Keys"部分
3. 生成以下密钥：
   - **API Key** - 用于创建支付会话
   - **Secret Key** - 用于服务器端操作
   - **Webhook Secret** - 用于验证webhook签名

## 已集成的组件

### 1. API路由

- `src/app/api/payments/creem/route.ts` - 支付会话创建和查询
- `src/app/api/webhooks/creem/route.ts` - Webhook事件处理

### 2. 前端组件

- `src/components/CreemPaymentButton.tsx` - 支付按钮组件
- `src/app/payment/success/page.tsx` - 支付成功页面
- `src/app/payment/cancel/page.tsx` - 支付取消页面

### 3. 主页集成

已创建独立的定价页面(`/pricing`)，集成Creem支付按钮，支持：
- Starter套餐：$9.9 (115 Credits)
- Standard套餐：$30 (355 Credits) 
- Premium套餐：$99 (1450 Credits)

## 支付流程

### 用户端流程

1. 用户点击购买按钮
2. 系统创建Creem支付会话
3. 重定向到Creem支付页面
4. 用户完成支付
5. 重定向回成功/取消页面

### 服务器端流程

1. **创建支付会话**
   ```typescript
   POST /api/payments/creem
   {
     amount: 9.99,
     description: "Pro Monthly Plan",
     planType: "pro-monthly"
   }
   ```

2. **接收Webhook事件**
   ```typescript
   POST /api/webhooks/creem
   // 处理 payment.succeeded 事件
   // 更新用户积分和订阅状态
   ```

## Webhook配置

在Creem控制台中配置webhook：

1. URL: `https://your-domain.com/api/webhooks/creem`
2. 事件类型：
   - `payment.succeeded`
   - `payment.failed`
   - `payment.cancelled`

## 安全性

### 签名验证

所有webhook请求都经过HMAC-SHA256签名验证：

```typescript
function verifyCreemSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

### 用户认证

所有支付API都需要Clerk用户认证，确保只有登录用户才能创建支付会话。

## 数据库集成

支付成功后，系统会自动：

1. 更新用户订阅类型（pro/premium）
2. 增加用户积分余额
3. 创建订阅记录
4. 记录支付历史

### 积分分配

- Starter套餐：115个Credits (可生成11+视频)
- Standard套餐：355个Credits (可生成35+视频)
- Premium套餐：1450个Credits (可生成145+视频)

**计算公式**: 每10个Credits = 1个AI ASMR视频

## 错误处理

### 支付失败

- 显示用户友好的错误消息
- 记录详细的错误日志
- 提供重试机制

### Webhook失败

- 实现重试逻辑
- 记录失败事件
- 发送管理员通知

## 测试

### 测试模式

Creem提供测试模式，可以在不实际收费的情况下测试支付流程：

1. 使用测试API密钥
2. 在支付页面点击QR码模拟支付
3. 验证webhook事件处理

### 本地测试

使用ngrok等工具暴露本地开发服务器来测试webhook：

```bash
ngrok http 3000
# 将生成的URL配置到Creem webhook设置中
```

## 监控和日志

### 支付监控

- 在Creem控制台查看支付状态
- 监控支付成功率和失败原因
- 设置异常告警

### 系统日志

关键事件都有详细日志记录：
- 支付会话创建
- Webhook事件处理
- 数据库更新操作

## 故障排除

### 常见问题

1. **签名验证失败**
   - 检查webhook secret是否正确
   - 验证请求头格式

2. **支付重定向失败**
   - 确认success_url和cancel_url正确
   - 检查域名配置

3. **积分未更新**
   - 查看webhook日志
   - 验证数据库连接

### 联系支持

- Creem技术支持：[support@creem.io](mailto:support@creem.io)
- 项目Issue：在GitHub仓库提交问题

## 部署注意事项

### 生产环境

1. 使用生产API密钥
2. 配置正确的webhook URL
3. 启用SSL证书
4. 设置环境变量

### 安全检查清单

- [ ] API密钥安全存储
- [ ] Webhook签名验证启用
- [ ] HTTPS强制使用
- [ ] 错误信息不泄露敏感数据
- [ ] 支付金额验证

## 总结

Creem支付系统已完全集成到CuttingASMR.org项目中，提供安全、高效的支付处理能力。用户可以无缝购买Pro和Creator套餐，系统会自动处理积分分配和订阅管理。 