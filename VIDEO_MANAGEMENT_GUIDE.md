# 🎬 视频展示管理指南

## 📋 概述

你的网站现在有两个视频展示区域：
1. **首页视频展示** - 显示6个精选视频
2. **完整视频展示页面** - 显示所有视频

## 🎯 如何控制首页显示的视频

### 当前首页显示的6个视频（featured: true）：
- ✅ 捏捏乐 (Squeeze Toy ASMR)
- ✅ 切数码产品 (Digital Product Cutting ASMR)
- ✅ 切割玻璃水果 (Glass Fruit Cutting ASMR)
- ✅ 猩猩切石头 (Gorilla Stone Cutting ASMR)
- ✅ 面包涂抹黄金酱 (Bread with Golden Sauce ASMR)
- ✅ 切mc方块 (Minecraft Block Cutting ASMR)

### 新增的8个视频（featured: false）：
- ❌ 冰晶切割 (Ice Crystal Cutting ASMR)
- ❌ 金属锻造 (Metal Forging ASMR)
- ❌ 泡泡纸戳破 (Bubble Wrap Popping ASMR)
- ❌ 动力沙游戏 (Kinetic Sand Play ASMR)
- ❌ 纸张撕裂 (Paper Tearing ASMR)
- ❌ 史莱姆拉伸 (Slime Stretching ASMR)
- ❌ 木材雕刻 (Wood Carving ASMR)
- ❌ 雨声 (Rain Sounds ASMR)

## 🔧 如何修改首页展示的视频

### 方法1：替换现有视频
在 `src/data/showcase-videos.ts` 中：

```typescript
// 例如：想用"冰晶切割"替换"捏捏乐"在首页显示
{
  id: 'squeeze-toy-1',
  // ...其他配置
  featured: false, // ❌ 从首页移除
},
{
  id: 'ice-crystal-cutting-1',
  // ...其他配置
  featured: true, // ✅ 添加到首页
}
```

### 方法2：调整显示顺序
`getFeaturedVideos()` 函数会按照数组顺序选择前6个 `featured: true` 的视频。
想要调整显示顺序，可以移动数组中视频的位置。

## 📥 如何添加新的腾讯云视频

### 步骤1：获取腾讯云视频信息
确保你有：
- 腾讯云视频URL
- 视频时长
- 合适的缩略图URL（可选）

### 步骤2：添加到 showcase-videos.ts
```typescript
{
  id: 'your-new-video-id', // 唯一标识符
  title: '你的视频标题',
  description: '视频描述',
  thumbnailUrl: 'https://your-thumbnail-url.jpg', // 或使用placeholder
  videoUrl: 'https://your-tencent-cloud-bucket.cos.region.myqcloud.com/your-video.mp4',
  duration: '1:30', // 视频时长
  category: 'texture', // 选择合适的分类
  asmrType: '你的ASMR类型',
  featured: true, // true=首页显示, false=仅在展示页面显示
  createdAt: '2024-12-27T10:00:00Z', // 创建时间
  viewCount: 0, // 观看次数（可选）
  tags: ['tag1', 'tag2', 'tag3'] // 标签
}
```

### 步骤3：选择分类 (category)
可用分类：
- `'ice-cutting'` - 冰块切割
- `'metal-forging'` - 金属锻造  
- `'crystal'` - 水晶相关
- `'nature'` - 自然声音
- `'texture'` - 纹理材质
- `'satisfying'` - 解压视频

## 🚀 立即更换首页视频示例

如果你想立即看到效果，可以这样做：

### 示例：用"冰晶切割"和"泡泡纸戳破"替换首页的两个视频

```typescript
// 在 src/data/showcase-videos.ts 中修改：

// 1. 将某个原有视频设为 featured: false
{
  id: 'squeeze-toy-1',
  // ...
  featured: false, // ❌ 从首页移除
},

// 2. 将新视频设为 featured: true  
{
  id: 'ice-crystal-cutting-1',
  // ...
  featured: true, // ✅ 添加到首页
},
{
  id: 'bubble-wrap-pop-1', 
  // ...
  featured: true, // ✅ 添加到首页
}
```

## 📝 需要替换的占位符URL

新增的8个视频使用了占位符URL，你需要替换为实际的腾讯云链接：

```
🔄 需要替换：
https://your-tencent-cloud-bucket.cos.region.myqcloud.com/ice-crystal-cutting.mp4
https://your-tencent-cloud-bucket.cos.region.myqcloud.com/metal-forging.mp4
... 等等
```

## 🎨 缩略图建议

- 使用 400x300 像素的图片
- 可以继续使用 placeholder URL 或上传真实缩略图
- 格式：`https://your-image-hosting.com/thumbnail.jpg`

## 📊 文件位置总结

- **视频数据配置**: `src/data/showcase-videos.ts`
- **首页视频展示**: `src/app/page.tsx` (第629行左右)
- **视频展示组件**: `src/components/VideoShowcase.tsx`
- **完整展示页面**: `src/app/video-showcase/page.tsx`

修改完 `showcase-videos.ts` 后，网站会自动更新显示！🎉 