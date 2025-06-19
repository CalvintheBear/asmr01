export interface Veo3Config {
  apiKey: string;
  baseUrl: string;
}

export interface TextToVideoRequest {
  prompt: string;
  model?: 'veo3' | 'veo3_fast';
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: string;
  callBackUrl?: string;
}

export interface VideoGenerationResponse {
  code: number;
  msg: string;
  message?: string;
  data?: {
    taskId: string;
    id?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    videoUrl?: string;
    thumbnailUrl?: string;
    progress?: number;
  };
  error?: string;
}

export interface VideoDetailsResponse {
  code: number;
  message: string;
  data?: {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    prompt: string;
    model: string;
    aspectRatio: string;
    duration: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    createdAt: string;
    completedAt?: string;
    progress?: number;
  };
  error?: string;
}

export interface Video1080PResponse {
  code: number;
  message: string;
  data?: {
    id: string;
    videoUrl1080p?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
  };
  error?: string;
}

export class Veo3ApiClient {
  private config: Veo3Config;

  constructor(config: Veo3Config) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    try {
      // 对于服务端环境，确保使用正确的fetch polyfill
      const globalFetch = globalThis.fetch;
      
      const response = await globalFetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Veo3-Client/1.0',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Veo3 API Error Response: ${response.status} - ${errorText}`);
        throw new Error(`Veo3 API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Veo3 API Success Response:', result);
      return result;
    } catch (error) {
      console.error('Veo3 API Request Failed:', error);
      console.error('Request URL:', url);
      console.error('Request Options:', JSON.stringify(options, null, 2));
      throw error;
    }
  }

  async generateTextToVideo(request: TextToVideoRequest): Promise<VideoGenerationResponse> {
    return this.makeRequest('/api/v1/veo/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: request.prompt,
        model: request.model || 'veo3_fast',
        aspectRatio: request.aspectRatio || '16:9',
        duration: request.duration || '8',
        callBackUrl: request.callBackUrl,
      }),
    });
  }

  async getVideoStatus(videoId: string): Promise<VideoGenerationResponse> {
    return this.makeRequest(`/api/v1/veo/video/${videoId}`);
  }

  async getVideoDetails(videoId: string): Promise<VideoDetailsResponse> {
    return this.makeRequest(`/api/v1/veo/video/${videoId}/details`);
  }

  async get1080PVideo(videoId: string): Promise<Video1080PResponse> {
    return this.makeRequest(`/api/v1/veo/video/${videoId}/1080p`);
  }

  async pollVideoStatus(videoId: string, onProgress?: (progress: VideoGenerationResponse) => void): Promise<VideoGenerationResponse> {
    const maxAttempts = 60; // 最多轮询5分钟
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await this.getVideoStatus(videoId);
        
        if (onProgress) {
          onProgress(status);
        }

        if (status.data?.status === 'completed' || status.data?.status === 'failed') {
          return status;
        }

        // 等待5秒后再次检查
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        console.error('轮询状态时出错:', error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    throw new Error('视频生成超时');
  }
}

// 创建默认客户端实例
export function createVeo3Client(): Veo3ApiClient {
  const apiKey = process.env.VEO3_API_KEY || 'c982688b5c6938943dd721ed1d576edb';
  const baseUrl = process.env.VEO3_API_BASE_URL || 'https://kieai.erweima.ai';

  if (!apiKey) {
    throw new Error('VEO3_API_KEY 环境变量未设置');
  }

  return new Veo3ApiClient({
    apiKey,
    baseUrl,
  });
} 