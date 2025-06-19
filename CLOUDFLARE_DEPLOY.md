# Cloudflare Pages 部署指南

## 问题解决
之前部署失败的原因是构建文件超过了Cloudflare Pages的25MB单文件限制。

## 解决方案

### 1. 使用优化的构建命令
在Cloudflare Pages设置中使用以下构建命令：
```bash
npm run build:cloudflare
```

### 2. 构建设置
- **框架预设**: Next.js
- **构建命令**: `npm run build:cloudflare`
- **构建输出目录**: `.next`
- **Root目录**: `/`

### 3. 环境变量设置
在Cloudflare Pages中配置以下环境变量：

```
NEXTAUTH_URL=https://your-domain.pages.dev
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
VEO3_API_KEY=your-veo3-api-key
VEO3_API_BASE_URL=https://api.kie.ai
NODE_ENV=production
```

### 4. 文件大小优化
优化脚本会自动删除以下大文件：
- ✅ Webpack缓存文件 (26MB+)
- ✅ Next.js编译器文件 (175MB)
- ✅ 图像处理库文件 (18MB)
- ✅ 构建跟踪文件

### 5. 已删除的功能
- ✅ VideoHistory组件及相关代码已完全删除
- ✅ 历史视频数据和硬编码任务ID已清理
- ✅ 视频下载和历史记录功能已移除

## 部署步骤

1. **提交代码到GitHub**
   ```bash
   git add .
   git commit -m "优化Cloudflare Pages部署配置"
   git push origin main
   ```

2. **连接Cloudflare Pages**
   - 登录Cloudflare Dashboard
   - 选择Pages > 创建项目
   - 连接GitHub仓库

3. **配置构建设置**
   - 构建命令: `npm run build:cloudflare`
   - 输出目录: `.next`

4. **添加环境变量**
   - 在Pages设置中添加上述环境变量

5. **触发部署**
   - 手动触发部署或推送代码自动部署

## 注意事项

- ⚠️ 确保所有环境变量都正确配置
- ⚠️ Google OAuth回调URL需要更新为Cloudflare域名
- ⚠️ 如果仍有大文件问题，可能需要进一步优化依赖

## 替代方案

如果Cloudflare Pages仍然有问题，建议使用：
1. **Vercel** - 对Next.js支持最好
2. **Netlify** - 也支持Next.js部署
3. **Railway** - 之前已配置成功

## 验证部署

部署成功后验证以下功能：
- ✅ 主页加载正常
- ✅ Google OAuth登录功能
- ✅ ASMR视频生成功能
- ✅ API路由正常工作 