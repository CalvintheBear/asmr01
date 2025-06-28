# 🎬 视频展示功能实施计划

## 📋 项目概述

在CuttingASMR.org首页的主生成器和"How to Create"指南之间添加一个视频展示部分，展示AI生成的ASMR视频示例。

## 🎯 页面布局结构

```
┌─────────────────────────────────────┐
│        Hero Section                 │ 
│        (头部介绍区域)                │
├─────────────────────────────────────┤
│        Main Generator               │
│        (主视频生成器)                │
├─────────────────────────────────────┤
│        Video Showcase               │
│        (AI生成视频展示)              │
│  ┌─────────┐  ┌─────────┐           │
│  │ Video 1 │  │ Video 2 │           │
│  └─────────┘  └─────────┘           │
│  ┌─────────┐  ┌─────────┐           │
│  │ Video 3 │  │ Video 4 │           │
│  └─────────┘  └─────────┘           │
│  ┌─────────┐  ┌─────────┐           │
│  │ Video 5 │  │ Video 6 │           │
│  └─────────┘  └─────────┘           │
├─────────────────────────────────────┤
│        How to Create Guide          │
│        (操作指南)                    │
├─────────────────────────────────────┤
│        FAQ Section                  │
│        (常见问题)                    │
├─────────────────────────────────────┤
│        Technology Section           │
│        (技术介绍)                    │
└─────────────────────────────────────┘
```

## 📁 文件结构

```
src/
├── app/
│   ├── page.tsx                     # 首页 - 集成VideoShowcase
│   └── video-showcase/
│       └── page.tsx                 # 完整视频展示页面
├── components/
│   ├── VideoShowcase.tsx            # 主视频展示组件
│   ├── VideoCard.tsx                # 单个视频卡片组件
│   └── VideoModal.tsx               # 视频播放弹窗组件
├── data/
│   ├── showcase-videos.ts           # 视频数据配置
│   └── video-types.ts               # TypeScript类型定义
└── utils/
    └── tencent-cloud.ts             # 腾讯云视频工具函数
```

## 🏗️ 数据结构设计

### 视频数据类型定义 (`src/data/video-types.ts`)

```typescript
export interface ShowcaseVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;            // 视频缩略图
  videoUrl: string;                // 腾讯云视频链接
  duration: string;                // 例: "0:30"
  category: VideoCategory;
  asmrType: string;                // 对应的ASMR类型
  featured: boolean;               // 是否在首页展示
  createdAt: string;               // ISO日期格式
  viewCount?: number;              // 可选：观看次数
  tags: string[];                  // 标签数组
}

export type VideoCategory = 
  | 'ice-cutting'     // 冰块切割
  | 'metal-forging'   // 金属锻造
  | 'crystal'         // 水晶相关
  | 'nature'          // 自然声音
  | 'texture'         // 纹理材质
  | 'satisfying';     // 解压视频

export interface VideoShowcaseProps {
  maxVideos?: number;              // 最大显示数量 (首页6个)
  showHeader?: boolean;            // 是否显示标题
  showViewMore?: boolean;          // 是否显示"查看更多"按钮
  columns?: 1 | 2 | 3;            // 网格列数
}
```

## 🧩 组件开发计划

### 1. VideoCard 组件功能
- 视频缩略图展示
- 悬停播放按钮效果
- 时长和分类标签
- 点击触发播放弹窗

### 2. VideoModal 组件功能
- 全屏视频播放
- 视频信息展示
- 分享和下载功能
- ESC键和背景点击关闭

### 3. VideoShowcase 主组件功能
- 响应式网格布局
- 首页限制6个视频
- 完整页面显示所有视频
- "查看更多"按钮

## 🔧 首页集成位置

在 `src/app/page.tsx` 中找到生成器部分结束的位置（大约第512行），添加：

```typescript
// 导入组件
import VideoShowcase from '@/components/VideoShowcase'

// 在生成器和指南之间插入
{/* Video Showcase Section - 新增 */}
<VideoShowcase 
  maxVideos={6}
  showHeader={true}
  showViewMore={true}
  columns={2}
/>
```

## 🛠️ 开发步骤

### Phase 1: 基础设置 (第1天)
- [ ] 创建 `src/data/video-types.ts`
- [ ] 创建 `src/data/showcase-videos.ts`
- [ ] 准备示例数据结构

### Phase 2: 核心组件 (第2天)
- [ ] 开发 `VideoCard.tsx`
- [ ] 开发 `VideoModal.tsx`
- [ ] 开发 `VideoShowcase.tsx`

### Phase 3: 页面集成 (第3天)
- [ ] 在首页集成VideoShowcase
- [ ] 创建 `video-showcase/page.tsx`
- [ ] 测试功能完整性

### Phase 4: 优化完善 (第4天)
- [ ] 腾讯云视频优化
- [ ] 响应式调整
- [ ] SEO和性能优化

## 📝 待办清单

### 准备工作
- [ ] 收集6个腾讯云视频链接
- [ ] 准备对应的缩略图
- [ ] 确定视频标题和描述

### 开发任务
- [ ] 创建基础文件结构
- [ ] 实现所有组件
- [ ] 首页集成测试
- [ ] 完整页面开发

### 优化任务
- [ ] 移动端适配
- [ ] 加载性能优化
- [ ] 错误处理
- [ ] SEO优化

## 🎨 设计要求

- **视觉风格**: 与现有首页保持一致
- **卡片设计**: 现代化圆角卡片，悬停效果
- **响应式**: 桌面2列，移动端1列
- **动画效果**: 流畅的过渡和交互反馈

## 📚 技术要点

1. **腾讯云视频**: 确保视频链接格式正确
2. **懒加载**: 优化首屏加载速度
3. **SEO友好**: 添加正确的meta标签
4. **可访问性**: 支持键盘导航

---

📅 **创建时间**: 2024年12月26日  
📝 **文档版本**: v1.0  
✅ **状态**: 等待开发

## 🚀 开始开发

准备好开始了吗？我们从第一步开始：创建数据类型定义！ 