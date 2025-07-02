# Go Video API 独立部署与项目集成完整指南

## 📖 **概述**

本指南将帮助您完成以下任务：
1. 在 `\study\蛋壳api` 目录中独立部署Go Video API服务
2. 将部署好的API服务集成到您的Next.js项目中

---

## 🚀 **第一部分：独立部署**

### **步骤1：环境准备**

#### **1.1 安装Go语言环境**
```bash
# 方式1：使用winget安装（推荐）
winget install GoLang.Go

# 方式2：手动下载安装
# 访问 https://golang.org/dl/ 下载Windows安装包
# 下载 go1.21.windows-amd64.msi 并安装

# 验证安装
go version
```

#### **1.2 设置Go环境变量**
```powershell
# 在PowerShell中设置（临时）
$env:GOPATH = "C:\Users\$env:USERNAME\go"
$env:GOPROXY = "https://goproxy.cn,direct"  # 使用国内代理加速
$env:GO111MODULE = "on"

# 永久设置：在系统环境变量中添加
# GOPATH: C:\Users\YourName\go
# GOPROXY: https://goproxy.cn,direct
# GO111MODULE: on
```

### **步骤2：项目部署**

#### **2.1 创建项目目录并克隆代码**
```bash
# 切换到您的目录
cd "E:\佛山code\study\蛋壳api"

# 克隆项目
git clone https://github.com/danaigc/videoapi.git

# 进入项目目录
cd videoapi

# 查看项目结构
dir
```

#### **2.2 创建配置文件**
在 `videoapi` 目录下创建 `.env` 文件：

```env
# VEO3 API配置
VEO3_API_BASE_URL=https://api.veo3.com
VEO3_API_TOKEN=your_veo3_token_here

# 服务器配置
SERVER_PORT=8080
SERVER_HOST=0.0.0.0

# 代理配置（如果需要）
HTTP_PROXY=http://proxy.example.com:8080
HTTPS_PROXY=http://proxy.example.com:8080

# 认证配置
JWT_SECRET=your_jwt_secret_here
API_TOKEN=your_api_token_here

# 日志配置
LOG_LEVEL=info
LOG_FORMAT=json

# CORS配置
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

#### **2.3 安装依赖并构建**
```bash
# 下载Go模块依赖
go mod download

# 整理依赖
go mod tidy

# 构建项目
go build -o videoapi.exe .

# 或者直接运行（开发模式）
go run main.go
```

### **步骤3：启动和测试**

#### **3.1 启动服务**
```bash
# 方式1：直接运行构建的可执行文件
./videoapi.exe

# 方式2：开发模式运行
go run main.go

# 服务将在 http://localhost:8080 启动
```

#### **3.2 测试API服务**
```bash
# 测试健康检查
curl http://localhost:8080/health

# 测试视频生成API
curl -X POST http://localhost:8080/api/v1/video/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_token_here" \
  -d '{
    "prompt": "一只可爱的小猫在花园里玩耍",
    "aspect_ratio": "16:9",
    "duration": 5,
    "quality": "720p"
  }'
```

---

## 🔄 **第二部分：集成到Next.js项目**

### **步骤1：创建API客户端**

#### **1.1 创建Go API客户端文件**
创建 `src/lib/go-videoapi-client.ts`：

```typescript
export interface GoVideoApiConfig {
  baseUrl: string;
  apiToken: string;
  timeout?: number;
}

export interface VideoGenerateRequest {
  prompt: string;
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  duration?: number;
  quality?: '360p' | '720p' | '1080p';
  model?: string;
  sound_effect_switch?: 0 | 1;
}

export interface VideoGenerateResponse {
  video_id: string;
  status: 'processing' | 'completed' | 'failed';
  message: string;
  estimated_time?: number;
}

export interface VideoStatusResponse {
  video_id: string;
  status: 'processing' | 'completed' | 'failed';
  video_url?: string;
  progress?: number;
  error_message?: string;
}

export class GoVideoApiClient {
  private config: GoVideoApiConfig;

  constructor(config: GoVideoApiConfig) {
    this.config = {
      timeout: 30000,
      ...config
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiToken}`,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async generateVideo(request: VideoGenerateRequest): Promise<VideoGenerateResponse> {
    return this.makeRequest<VideoGenerateResponse>('/api/v1/video/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getVideoStatus(videoId: string): Promise<VideoStatusResponse> {
    return this.makeRequest<VideoStatusResponse>(`/api/v1/video/status/${videoId}`);
  }

  async getVideoDetails(videoId: string): Promise<VideoStatusResponse> {
    return this.makeRequest<VideoStatusResponse>(`/api/v1/video/${videoId}`);
  }
}

// 创建默认实例
export const goVideoApiClient = new GoVideoApiClient({
  baseUrl: process.env.GO_VIDEO_API_URL || 'http://localhost:8080',
  apiToken: process.env.GO_VIDEO_API_TOKEN || '',
});
```

#### **1.2 创建API选择器**
创建 `src/lib/video-api-selector.ts`：

```typescript
import { veo3ApiClient } from './veo3-api';
import { goVideoApiClient } from './go-videoapi-client';

export type VideoApiProvider = 'kie-ai' | 'go-api';

export interface VideoApiConfig {
  provider: VideoApiProvider;
  fallbackProvider?: VideoApiProvider;
}

export class VideoApiSelector {
  private config: VideoApiConfig;

  constructor(config: VideoApiConfig) {
    this.config = config;
  }

  getClient() {
    switch (this.config.provider) {
      case 'kie-ai':
        return veo3ApiClient;
      case 'go-api':
        return goVideoApiClient;
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  async generateVideoWithFallback(request: any) {
    try {
      const client = this.getClient();
      return await client.generateVideo(request);
    } catch (error) {
      if (this.config.fallbackProvider) {
        console.warn(`Primary provider failed, falling back to ${this.config.fallbackProvider}`);
        this.config.provider = this.config.fallbackProvider;
        const fallbackClient = this.getClient();
        return await fallbackClient.generateVideo(request);
      }
      throw error;
    }
  }
}

// 默认配置
export const videoApiSelector = new VideoApiSelector({
  provider: (process.env.NEXT_PUBLIC_VIDEO_API_PROVIDER as VideoApiProvider) || 'go-api',
  fallbackProvider: 'kie-ai',
});
```

### **步骤2：更新环境变量**

#### **2.1 更新 `.env.local`**
```env
# Go Video API配置
GO_VIDEO_API_URL=http://localhost:8080
GO_VIDEO_API_TOKEN=your_api_token_here

# API提供商选择
NEXT_PUBLIC_VIDEO_API_PROVIDER=go-api

# 现有的kie.ai配置（作为备份）
VEO3_API_KEY_1=your_kie_ai_key_1
VEO3_API_KEY_2=your_kie_ai_key_2
# ... 其他现有配置
```

### **步骤3：更新API路由**

#### **3.1 修改视频生成API路由**
更新 `src/app/api/generate-video/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { videoApiSelector } from '@/lib/video-api-selector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, duration, userId } = body;

    // 使用API选择器生成视频
    const result = await videoApiSelector.generateVideoWithFallback({
      prompt,
      aspect_ratio: aspectRatio,
      duration,
      quality: '720p',
    });

    return NextResponse.json({
      success: true,
      videoId: result.video_id,
      status: result.status,
      estimatedTime: result.estimated_time,
    });

  } catch (error) {
    console.error('Video generation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Video generation failed' },
      { status: 500 }
    );
  }
}
```

### **步骤4：更新前端组件**

#### **4.1 创建视频生成表单组件**
创建 `src/components/VideoGenerationForm.tsx`：

```typescript
'use client';

import { useState } from 'react';

export interface VideoGenerationFormProps {
  onGenerate: (data: any) => void;
  loading?: boolean;
}

export default function VideoGenerationForm({ onGenerate, loading }: VideoGenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState(5);
  const [quality, setQuality] = useState('720p');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      prompt,
      aspectRatio,
      duration,
      quality,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          视频描述
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 border rounded-md"
          rows={3}
          placeholder="描述您想要生成的视频内容..."
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            宽高比
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="16:9">16:9 (横屏)</option>
            <option value="9:16">9:16 (竖屏)</option>
            <option value="1:1">1:1 (方形)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            时长(秒)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          >
            <option value={3}>3秒</option>
            <option value={5}>5秒</option>
            <option value={10}>10秒</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            质量
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="360p">360p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md disabled:opacity-50"
      >
        {loading ? '生成中...' : '生成视频'}
      </button>
    </form>
  );
}
```

### **步骤5：测试集成**

#### **5.1 启动服务**
```bash
# 终端1：启动Go API服务
cd "E:\佛山code\study\蛋壳api\videoapi"
go run main.go

# 终端2：启动Next.js开发服务器
cd "E:\佛山code"
npm run dev
```

#### **5.2 测试流程**
1. 访问 http://localhost:3000
2. 尝试生成视频
3. 检查API调用是否正常
4. 验证视频生成状态

---

## 🔧 **故障排除**

### **常见问题及解决方案**

#### **1. Go API服务启动失败**
```bash
# 检查端口是否被占用
netstat -an | findstr :8080

# 更换端口
set SERVER_PORT=8081
go run main.go
```

#### **2. API调用失败**
- 检查API Token是否正确
- 确认Go服务正在运行
- 检查防火墙设置
- 验证CORS配置

#### **3. 依赖安装问题**
```bash
# 清理模块缓存
go clean -modcache

# 重新下载依赖
go mod download
```

---

## 📝 **部署检查清单**

### **独立部署检查**
- [ ] Go环境安装成功
- [ ] 项目克隆完成
- [ ] 环境变量配置正确
- [ ] 依赖安装成功
- [ ] 服务启动正常
- [ ] API测试通过

### **项目集成检查**
- [ ] API客户端创建完成
- [ ] 环境变量更新
- [ ] API路由修改
- [ ] 前端组件更新
- [ ] 端到端测试通过

---

## 🚀 **后续优化建议**

1. **生产环境部署**: 使用Docker容器化部署
2. **负载均衡**: 配置多个API实例
3. **监控告警**: 添加服务监控和日志
4. **缓存优化**: 实现视频生成结果缓存
5. **错误处理**: 完善错误处理和重试机制

---

**部署完成后，您就可以在项目中使用新的Go Video API服务了！** 