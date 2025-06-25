# 🔒 环境变量安全配置指南

## 📋 必需的环境变量

为了确保应用安全运行，需要在 `.env.local` 文件中配置以下环境变量：

### 1. Clerk 认证配置
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### 2. VEO3 API 密钥配置
```bash
# 至少需要配置主密钥，其他为可选的备用密钥
VEO3_API_KEY=your_primary_api_key_here
VEO3_API_KEY_2=your_backup_api_key_2 
VEO3_API_KEY_3=your_backup_api_key_3
VEO3_API_KEY_4=your_backup_api_key_4
VEO3_API_KEY_5=your_backup_api_key_5
```

### 3. 数据库配置
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

### 4. Creem 支付配置
```bash
CREEM_API_KEY=creem_your_api_key_here
CREEM_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 5. 应用URL配置
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## ⚠️ 重要安全提醒

1. **永远不要**将 `.env.local` 文件提交到 Git 仓库
2. **永远不要**在代码中硬编码敏感信息
3. **确保**所有团队成员都使用相同的环境变量名
4. **定期轮换** API 密钥和其他敏感凭据

## 🔧 本地开发设置

1. 复制此配置到 `.env.local` 文件
2. 填入真实的密钥和配置值
3. 重启开发服务器使配置生效

## 🚀 生产环境部署

1. 在部署平台设置相应的环境变量
2. 不要在构建时暴露敏感信息
3. 使用平台的密钥管理服务

## 🔍 验证配置

应用启动时会自动验证必需的环境变量，如果缺少会显示错误信息。 