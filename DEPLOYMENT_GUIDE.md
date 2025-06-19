# 🚀 部署指南 - Cloudflare Pages & Railway

## 📊 当前状态确认

✅ **所有核心功能正常**  
✅ **UTF-8编码问题已修复**  
✅ **文件大小优化到179.53KB**  
✅ **Git仓库已更新** (提交: a7be7fb)

---

## 🌐 方案1: Cloudflare Pages 部署

### 第一步：登录Cloudflare
1. 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 使用你的Cloudflare账号登录

### 第二步：连接GitHub仓库
1. 点击 "Create a project"
2. 选择 "Connect to Git"
3. 授权Cloudflare访问你的GitHub
4. 选择仓库: `CalvintheBear/asmr01`

### 第三步：配置构建设置
```
Project name: cuttingasmr-org
Production branch: main
Build command: npm run build
Build output directory: .next/
Root directory: /
```

### 第四步：环境变量配置
在 "Environment variables" 部分添加：

```env
# VEO3 API配置
VEO3_API_KEY=c982688b5c6938943dd721ed1d576edb
VEO3_API_BASE_URL=https://api.kie.ai

# NextAuth配置
NEXTAUTH_SECRET=your-random-secret-string-here
NEXTAUTH_URL=https://your-domain.pages.dev

# Google OAuth (需要从Google Cloud Console获取)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 第五步：部署
1. 点击 "Save and Deploy"
2. 等待构建完成（约2-3分钟）
3. 获取部署URL: `https://cuttingasmr-org.pages.dev`

---

## 🚂 方案2: Railway 部署

### 第一步：登录Railway
1. 访问 [Railway](https://railway.app/)
2. 使用GitHub账号登录

### 第二步：创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择仓库: `CalvintheBear/asmr01`

### 第三步：配置环境变量
在项目设置中添加环境变量：

```env
# VEO3 API配置
VEO3_API_KEY=c982688b5c6938943dd721ed1d576edb
VEO3_API_BASE_URL=https://api.kie.ai

# NextAuth配置
NEXTAUTH_SECRET=your-random-secret-string-here
NEXTAUTH_URL=https://your-railway-domain.railway.app

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Railway特定配置
PORT=3000
NODE_ENV=production
```

### 第四步：部署设置
Railway会自动检测Next.js项目并配置：
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: 3000

---

## 🔐 Google OAuth 配置

### 获取Google OAuth凭据
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "Google+ API"
4. 创建OAuth 2.0客户端ID

### 配置授权重定向URI
添加以下URL到授权重定向URI列表：

**Cloudflare Pages:**
```
https://your-domain.pages.dev/api/auth/callback/google
```

**Railway:**
```
https://your-railway-domain.railway.app/api/auth/callback/google
```

---

## ⚡ 快速部署命令

### 如果需要重新构建和推送：
```bash
# 确保所有修改已保存
git add .
git commit -m "准备部署"
git push origin main
```

### 检查部署状态：
```bash
# 本地测试
npm run build
npm start

# 访问 http://localhost:3000 确认功能正常
```

---

## 🔍 部署后验证

### 功能测试清单
- [ ] 主页正常加载
- [ ] Google OAuth登录功能
- [ ] ASMR类型选择
- [ ] 视频生成功能
- [ ] 用户仪表板
- [ ] API健康检查: `/api/health`

### 测试URL
```
主页: https://your-domain/
登录: https://your-domain/dashboard  
健康检查: https://your-domain/api/health
测试页面: https://your-domain/test
```

---

## 🚨 常见问题解决

### 1. 构建失败
- 检查环境变量是否正确设置
- 确认Node.js版本兼容 (推荐18+)

### 2. OAuth登录失败
- 确认NEXTAUTH_URL指向正确的域名
- 检查Google OAuth重定向URI配置

### 3. 视频生成失败
- 验证VEO3_API_KEY是否正确
- 检查API网络连接

### 4. 文件大小问题 (Cloudflare)
- 当前179.53KB远小于25MB限制
- 如果出现问题，运行优化脚本: `npm run build:cloudflare`

---

## 🎯 推荐部署顺序

1. **优先选择 Cloudflare Pages**
   - 免费额度更大
   - CDN性能更好
   - 更适合静态网站

2. **备选 Railway**
   - 更适合需要服务器端功能的应用
   - 部署更简单
   - 对Node.js支持更好

---

## 📞 部署支持

如果部署过程中遇到问题，可以检查：
1. `DEPLOYMENT_STATUS.md` - 当前状态
2. `CLOUDFLARE_DEPLOY.md` - Cloudflare详细指南
3. GitHub Actions (如果配置了CI/CD)

**现在你可以开始部署了！** 🚀 