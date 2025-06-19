# ASMR类型编辑指南

## 📋 文档概述

本指南详细说明如何在CuttingASMR.org项目中编辑、修改和新增ASMR类型，包括名称、描述和提示词的管理。

## 🏗️ ASMR类型数据结构

### 数据存储位置
ASMR类型定义在 `src/app/page.tsx` 文件中的 `asmrCategories` 数组中。

### 数据结构说明
```typescript
const asmrCategories = [
  {
    id: '分类ID',                // 唯一标识符
    name: '分类名称',             // 显示在界面上的分类名
    icon: '🔪',                  // 分类图标 (emoji)
    types: [                     // 该分类下的所有ASMR类型
      {
        id: '类型ID',             // 唯一标识符
        name: '类型名称',          // 显示在界面上的类型名
        description: '类型描述',   // 简短描述，显示在选择界面
        prompt: '详细提示词...'    // 完整的视频生成提示词
      }
    ]
  }
]
```

## 🎯 现有分类说明

### 1. Cutting & Slicing (🔪)
**分类ID**: `cutting`  
**用途**: 各种切割、切片类型的ASMR视频

**包含类型**:
- Ice Cutting ASMR
- Hot Iron Forging  
- Golden Apple Cutting
- Lime Cutting ASMR
- Red Crystal Sphere Cutting
- Crystal Apple Cutting
- Crystal Pineapple Cutting
- Crystal Burger Cutting

### 2. Natural Environment (🌿)
**分类ID**: `nature`  
**用途**: 自然环境声音类型的ASMR视频

**包含类型**:
- Rain on Window
- Forest Rain
- Rain on Umbrella
- Ocean Waves
- Fireplace Crackling
- Flowing Water
- Forest Ambiance

### 3. Object Interaction (🔊)
**分类ID**: `objects`  
**用途**: 物体交互和触觉类型的ASMR视频

**包含类型**:
- Wood Tapping
- Metal Tapping
- Glass Tapping
- Texture Scratching
- Page Turning
- Package Unwrapping
- Small Objects
- Keyboard Typing

### 4. Personal Care (💆)
**分类ID**: `personal-care`  
**用途**: 个人护理和医疗检查类型的ASMR视频

**包含类型**:
- Hair Brushing
- Nail Care
- Medical Examination

### 5. Sleep & Relaxation (😴)
**分类ID**: `relaxation`  
**用途**: 睡眠和放松类型的ASMR视频

**包含类型**:
- White Noise
- Guided Relaxation
- Rhythmic Sounds

## ✏️ 编辑操作指南

### 修改现有类型的名称
1. 在 `src/app/page.tsx` 中找到对应的类型
2. 修改 `name` 字段
3. 保存文件

**示例**:
```typescript
{
  id: 'ice-cutting',
  name: '冰块切割ASMR',  // 原: 'Ice Cutting ASMR'
  description: 'Satisfying ice block cutting with crystal clear sounds',
  prompt: '...'
}
```

### 修改类型描述
1. 找到对应类型的 `description` 字段
2. 修改为新的描述文本
3. 描述应简洁明了，不超过50个字符

**示例**:
```typescript
{
  id: 'ice-cutting',
  name: 'Ice Cutting ASMR',
  description: '令人满足的冰块切割声音和视觉效果',  // 新描述
  prompt: '...'
}
```

### 修改提示词 (Prompt)
1. 找到对应类型的 `prompt` 字段
2. 修改为新的视频生成提示词
3. 提示词应包含：镜头角度、光照、音频描述

**提示词写作模板**:
```
[场景描述]. Camera: [镜头角度和拍摄细节]. Lighting: [光照设置]. Audio: [音频效果和声音细节].
```

**示例**:
```typescript
{
  id: 'ice-cutting',
  name: 'Ice Cutting ASMR',
  description: 'Satisfying ice block cutting with crystal clear sounds',
  prompt: 'Extreme close-up of sharp knife slicing through crystal-clear ice cubes on marble cutting board. Camera: Overhead and side angles capturing ice fragments scattering. Lighting: Bright studio lighting highlighting ice transparency and knife blade sharpness. Audio: Crisp cracking sounds, ice fragments hitting surface, knife cutting through solid ice with precision.'
}
```

## ➕ 添加新ASMR类型

### 在现有分类中添加新类型
1. 找到合适的分类
2. 在 `types` 数组中添加新对象
3. 确保 `id` 唯一

**示例 - 在切割分类中添加新类型**:
```typescript
{
  id: 'cutting',
  name: 'Cutting & Slicing',
  icon: '🔪',
  types: [
    // ... 现有类型
    {
      id: 'soap-cutting',           // 新类型
      name: 'Soap Cutting ASMR',
      description: 'Satisfying soap cutting with smooth textures',
      prompt: 'Close-up of knife cutting through colorful soap bars with smooth texture. Camera: Macro lens capturing soap curls and cutting precision. Lighting: Soft diffused lighting highlighting soap colors. Audio: Soft cutting sounds, soap curling, and gentle slicing through smooth material.'
    }
  ]
}
```

### 创建新分类
1. 在 `asmrCategories` 数组中添加新分类对象
2. 选择合适的图标和ID
3. 添加至少一个类型

**示例 - 添加食物分类**:
```typescript
{
  id: 'food',
  name: 'Food & Cooking',
  icon: '🍳',
  types: [
    {
      id: 'vegetable-chopping',
      name: 'Vegetable Chopping',
      description: 'Fresh vegetable cutting with crisp sounds',
      prompt: 'Close-up of chef knife chopping fresh vegetables on wooden cutting board. Camera: Overhead angle capturing knife movement and vegetable pieces. Lighting: Natural kitchen lighting. Audio: Crisp chopping sounds, vegetable crunching, and rhythmic cutting patterns.'
    }
  ]
}
```

## 🎨 界面显示逻辑

### 简化视图 (Simple View)
- 显示每个分类的第一个类型
- 显示"View All ASMR Types"按钮
- 2列网格布局

### 完整视图 (All Categories)
- 显示所有分类和类型
- 按分类分组显示
- 可滚动界面
- 详细描述显示

### 切换机制
```typescript
const [showAllTypes, setShowAllTypes] = useState(false)

// 切换显示模式
<button onClick={() => setShowAllTypes(!showAllTypes)}>
  {showAllTypes ? 'Simple View' : 'All Categories'}
</button>
```

## 🔧 最佳实践

### 提示词编写原则
1. **结构清晰**: 按 场景→镜头→光照→音频 的顺序
2. **细节丰富**: 包含足够的视觉和听觉细节
3. **风格统一**: 保持与现有提示词的风格一致
4. **长度适中**: 控制在200-300字符之间

### 命名规范
1. **ID命名**: 使用kebab-case (如: ice-cutting)
2. **名称**: 简洁明了，包含ASMR关键词
3. **描述**: 突出核心特色，吸引用户

### 分类组织
1. **相关性**: 同一分类下的类型应有相关性
2. **平衡性**: 各分类下的类型数量尽量平衡
3. **扩展性**: 为未来添加新类型预留空间

## 🚀 开发流程

### 1. 编辑前准备
- 备份现有文件
- 确定要修改的内容
- 准备新的提示词内容

### 2. 修改步骤
1. 打开 `src/app/page.tsx`
2. 找到 `asmrCategories` 数组
3. 进行相应修改
4. 保存文件

### 3. 测试验证
1. 启动开发服务器 `npm run dev`
2. 验证界面显示正常
3. 测试类型选择功能
4. 检查提示词是否正确更新

### 4. 部署上线
1. 提交代码到Git
2. 部署到生产环境
3. 验证线上功能

## 📝 示例：完整的编辑操作

### 场景：添加"音乐器械"分类

```typescript
// 在 asmrCategories 数组中添加
{
  id: 'instruments',
  name: 'Musical Instruments',
  icon: '🎵',
  types: [
    {
      id: 'piano-keys',
      name: 'Piano Key Tapping',
      description: 'Gentle piano key pressing with resonant tones',
      prompt: 'Close-up of fingers gently pressing piano keys with soft resonant tones. Camera: Side angle capturing finger movement and key depression. Lighting: Warm studio lighting highlighting piano texture. Audio: Soft piano notes, key clicking, and gentle musical resonance.'
    },
    {
      id: 'guitar-strings',
      name: 'Guitar String Plucking',
      description: 'Acoustic guitar string plucking with harmonic vibrations',
      prompt: 'Macro shot of fingers plucking acoustic guitar strings with visible vibrations. Camera: Close-up focusing on string movement and finger technique. Lighting: Natural lighting highlighting guitar wood grain. Audio: Clear string plucking, harmonic vibrations, and gentle guitar resonance.'
    }
  ]
}
```

## 🔍 故障排除

### 常见问题
1. **ID冲突**: 确保所有ID唯一
2. **语法错误**: 检查JSON语法正确性
3. **显示异常**: 验证所有必需字段都已填写

### 调试方法
1. 查看浏览器控制台错误信息
2. 检查网络请求是否正常
3. 验证数据结构完整性

---

**更新时间**: 2024年12月  
**文档版本**: v1.0  
**维护者**: CuttingASMR开发团队 