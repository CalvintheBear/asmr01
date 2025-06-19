# GitHub上传核心文件清单

## ✅ 必需上传的文件（保持网站正常运行）

### 📁 核心配置文件
- `package.json` - 依赖定义（必需）
- `next.config.js` - Next.js配置
- `tailwind.config.ts` - 样式配置
- `tsconfig.json` - TypeScript配置
- `postcss.config.js` - PostCSS配置
- `.gitignore` - 忽略文件配置

### 📁 源代码目录 (src/)
```
src/
├── app/                    # Next.js App Router页面
│   ├── api/               # API路由
│   │   ├── auth/          # Google OAuth认证
│   │   ├── generate-video/ # 视频生成API
│   │   ├── video-status/  # 视频状态查询
│   │   ├── video-details/ # 视频详情
│   │   ├── video-1080p/   # 高清视频
│   │   └── health/        # 健康检查
│   ├── dashboard/         # 用户仪表板
│   ├── privacy/          # 隐私政策页面
│   ├── refund/           # 退款政策页面
│   ├── terms/            # 服务条款页面
│   ├── test/             # 测试页面
│   ├── test-auth/        # 认证测试页面
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 主页
│   └── globals.css       # 全局样式
├── components/            # React组件
│   ├── ASMRVideoResult.tsx    # 视频结果展示
│   ├── ImageUploader.tsx      # 图片上传
│   ├── UserDashboard.tsx      # 用户仪表板
│   └── providers/             # 上下文提供者
├── hooks/                 # 自定义Hooks
│   └── useVideoGeneration.ts # 视频生成逻辑
└── lib/                   # 工具库
    ├── auth.ts           # NextAuth配置
    ├── privacy-content.ts # 隐私政策内容
    ├── privacy-updates.md # 隐私更新记录
    └── veo3-api.ts       # VEO3 API客户端
```

### 📁 静态资源 (public/)
- `favicon.ico` - 网站图标（需要优化大小）
- `logo.png` - 网站Logo（需要优化大小）

### 📁 部署脚本
- `scripts/optimize-for-cloudflare.js` - Cloudflare优化脚本

### 📁 文档文件
- `README.md` - 项目说明
- `CLOUDFLARE_DEPLOY.md` - Cloudflare部署指南
- `privacy-policy.md` - 隐私政策
- `Refund Policy.md` - 退款政策

## ❌ 不需要上传的文件（已在.gitignore中排除）

### 🚫 依赖和构建文件
- `node_modules/` - 依赖包目录（526MB+）
- `package-lock.json` - 锁定文件（自动生成）
- `.next/` - 构建输出（自动生成）
- `*.tsbuildinfo` - TypeScript缓存

### 🚫 环境配置
- `.env.local` - 本地环境变量
- `.env` - 环境变量文件

### 🚫 大型依赖
- `**/swc-*` - Next.js编译器（175MB+）
- `**/sharp-*` - 图像处理库（18MB+）

### 🚫 开发工具文件
- `.vscode/` - VS Code配置
- `*.log` - 日志文件

## 📊 文件大小统计
当前核心文件大小：
- **最大文件**: `src/app/page.tsx` (41KB)
- **图片资源**: favicon.ico + logo.png (需要优化到<50KB)
- **总计预估**: <1MB（优化后）

## 🎯 优化建议
1. **图片压缩**: 将favicon.ico和logo.png压缩到<50KB
2. **代码分割**: 保持组件文件小于50KB
3. **文档精简**: 只保留核心文档

## 🚀 部署效果
优化后的仓库将：
- ✅ 符合Cloudflare Pages 25MB限制
- ✅ 快速克隆和下载
- ✅ 保持所有核心功能
- ✅ 支持视频生成和Google OAuth登录 