# Veo3 API 集成指南

## 概述

本项目已成功集成 Veo3 文本到视频和图片到视频 API，将原本的 ASMR 视频生成器升级为真正的 AI 视频生成平台。

## 🚀 主要功能

### 1. 文本到视频生成
- 通过描述文字生成 ASMR 视频
- 支持多种 ASMR 风格（冰块切割、火炉锻造、键盘敲击等）
- 可自定义视频时长（15秒-120秒）
- 支持多种分辨率（720p, 1080p, 4K）

### 2. 图片到视频生成  
- 上传图片生成动态视频
- 支持拖拽上传，JPG/PNG/WebP 格式
- 图片预览和管理功能
- 结合文本提示增强生成效果

### 3. 实时状态监控
- 视频生成进度实时显示
- 状态轮询机制，自动更新进度
- 错误处理和重试机制
- 预计时间估算

## 📁 项目结构

```
src/
├── lib/
│   └── veo3-api.ts          # Veo3 API 客户端封装
├── app/
│   ├── api/
│   │   ├── generate-video/  # 视频生成 API 路由
│   │   └── video-status/    # 状态查询 API 路由
│   └── page.tsx             # 主页面（已更新）
├── components/
│   └── ImageUploader.tsx    # 图片上传组件
└── hooks/
    └── useVideoGeneration.ts # 视频生成状态管理 Hook
```

## ⚙️ 配置说明

### 1. 环境变量设置

创建 `.env.local` 文件：

```env
# Veo3 API 配置
VEO3_API_KEY=your_veo3_api_key_here
VEO3_API_BASE_URL=https://api.kie.ai

# Next.js 配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. 获取 API 密钥

1. 访问 [API Key Management Page](https://kie.ai/api-keys)
2. 注册账户并获取 API 密钥
3. 将密钥添加到环境变量中

## 🔧 API 集成详情

### Veo3ApiClient 类

```typescript
// 创建客户端实例
const client = createVeo3Client();

// 文本到视频
await client.generateTextToVideo({
  prompt: "创建放松的 ASMR 视频",
  duration: 30,
  resolution: "1080p",
  watermark: "可选水印"
});

// 图片到视频  
await client.generateImageToVideo({
  image: file, // File 对象或 URL
  prompt: "基于图片生成动态视频",
  duration: 30,
  resolution: "1080p"
});
```

### API 路由

#### POST /api/generate-video
```json
{
  "prompt": "视频描述",
  "type": "text-to-video" | "image-to-video",
  "image": "base64图片数据（图片到视频时）",
  "watermark": "可选水印",
  "duration": 30,
  "resolution": "1080p",
  "style": "ASMR风格"
}
```

#### GET /api/video-status/[id]
```json
{
  "success": true,
  "id": "视频ID",
  "status": "pending" | "processing" | "completed" | "failed",
  "progress": 85,
  "videoUrl": "生成的视频URL",
  "thumbnailUrl": "缩略图URL"
}
```

## 🎯 用户界面更新

### 新增功能
1. **生成类型选择**: 文本到视频 vs 图片到视频
2. **图片上传器**: 支持拖拽上传，实时预览
3. **视频设置**: 时长和分辨率选择
4. **实时进度**: 进度条和状态显示
5. **结果展示**: 视频播放器和下载功能

### 界面改进
- 中文界面适配
- 现代化 UI 设计
- 响应式布局
- 错误处理和用户反馈
- 加载状态和进度指示

## 🔄 状态管理

### useVideoGeneration Hook

```typescript
const {
  generationStatus,    // 当前状态
  generateVideo,       // 生成函数
  resetGeneration,     // 重置状态
  isGenerating         // 是否正在生成
} = useVideoGeneration();

// 状态对象结构
interface VideoGenerationStatus {
  status: 'idle' | 'generating' | 'polling' | 'completed' | 'failed';
  progress: number;           // 0-100
  videoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  estimatedTime?: number;     // 预计完成时间（秒）
}
```

## 🚀 启动和测试

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 到 `.env.local` 并填入真实的 API 密钥

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 测试功能
1. 访问 http://localhost:3000
2. 选择生成类型（文本到视频或图片到视频）
3. 输入提示词或上传图片
4. 点击生成按钮测试

## 🔒 安全考虑

### API 密钥保护
- 环境变量仅在服务端可访问
- 客户端无法获取真实 API 密钥
- 通过 Next.js API 路由代理请求

### 错误处理
- API 请求失败时的优雅降级
- 超时和重试机制
- 用户友好的错误提示

### 文件上传安全
- 文件类型验证（仅支持图片）
- 文件大小限制（最大 10MB）
- Base64 编码传输

## 📊 监控和日志

### 开发环境
- 控制台详细日志
- 错误堆栈追踪
- API 请求/响应日志

### 生产环境
- 简化的错误信息
- 性能监控点
- 用户行为追踪

## 🎬 演示场景

### 文本到视频示例
```
提示词: "创建一个放松的冰块切割 ASMR 视频，包含清脆的切割声音和满足感的视觉效果"
结果: 30秒的高质量 ASMR 视频，包含音频和视觉元素
```

### 图片到视频示例
```
上传: 一张静态的冰块图片
提示词: "让冰块动起来，添加切割动作和声音效果"
结果: 基于图片生成的动态 ASMR 视频
```

## 🚀 部署建议

### 环境变量
确保生产环境中正确设置所有必要的环境变量

### 性能优化
- 启用 Next.js 构建优化
- 配置 CDN 用于视频文件
- 实现缓存策略

### 监控
- 添加 API 使用量监控
- 设置错误报警
- 跟踪用户转化率

## 📞 技术支持

如有技术问题，请联系：
- 技术支持: support@kie.ai
- API 文档: https://api.kie.ai/docs

---

*这个集成方案将您的 ASMR 生成器升级为功能完整的 AI 视频平台，支持真实的视频生成能力。* 