# Cloudflare Pages 环境配置指南

## 🎯 环境说明

现在Cloudflare Pages支持两个环境：

### 📋 Preview环境（测试模式）
- **用途**: 开发和测试
- **域名**: `https://preview.cuttingasmr.org`
- **配置**: `CREEM_TEST_MODE=true`
- **支付**: 使用Creem测试模式

### 🚀 Production环境（生产模式）
- **用途**: 正式上线
- **域名**: `https://cuttingasmr.org`
- **配置**: `CREEM_TEST_MODE=false`
- **支付**: 使用Creem正式环境

## ⚙️ 环境变量配置

### 在Cloudflare Pages控制面板中设置：

#### Preview环境变量：
```
CREEM_API_KEY=creem_test_GKMtqafu2trplagJwPT7KG
CREEM_WEBHOOK_SECRET=whsec_7f0rJaepEmBRixuDutTRw
DATABASE_URL=your_test_database_url
CLERK_SECRET_KEY=your_test_clerk_secret
VEO3_API_KEY=your_veo3_api_key
```

#### Production环境变量：
```
CREEM_API_KEY=creem_3383jJhZ9BrQXXeHL2bxB
CREEM_WEBHOOK_SECRET=whsec_bCADZ6mZaWDVnJCzwato5
DATABASE_URL=your_production_database_url
CLERK_SECRET_KEY=sk_live_IHF9Y65N6Q6NUtJU5FNmlges6IBrFPFwzwXwqb3Qxf
VEO3_API_KEY=your_veo3_api_key
```

## 🔄 部署流程

### 测试部署：
1. 推送到`preview`分支或使用Preview链接
2. 系统自动使用Preview环境配置
3. 支付将跳转到Creem测试页面

### 生产部署：
1. 推送到`main`分支
2. 系统自动使用Production环境配置
3. 支付将跳转到Creem正式页面

## 🧪 测试建议

1. **在Preview环境测试完整支付流程**
2. **确认测试模式下的支付链接包含`test/payment`**
3. **验证积分分配是否正常工作**
4. **检查webhook接收是否正常**

## ⚠️ 注意事项

- Preview和Production环境使用不同的数据库
- 测试时使用Preview环境，避免影响生产数据
- 确保两个环境的环境变量都正确设置 