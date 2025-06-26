'use client'

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

interface VideoGenerationOptions {
  prompt: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: string;
}

interface VideoGenerationStatus {
  status: 'idle' | 'generating' | 'polling' | 'completed' | 'failed';
  progress: number;
  videoId?: string;
  videoUrl?: string;
  videoUrl1080p?: string;
  thumbnailUrl?: string;
  error?: string;
  estimatedTime?: number;
  details?: {
    prompt: string;
    model: string;
    aspectRatio: string;
    duration: string;
    createdAt: string;
    completedAt?: string;
  };
}

export function useVideoGeneration() {
  const { getToken } = useAuth();
  const [generationStatus, setGenerationStatus] = useState<VideoGenerationStatus>({
    status: 'idle',
    progress: 0,
  });

  const generateVideo = useCallback(async (options: VideoGenerationOptions) => {
    try {
      setGenerationStatus({
        status: 'generating',
        progress: 0,
      });

      // 准备请求数据
      const requestData = {
        prompt: options.prompt,
        aspectRatio: options.aspectRatio || '16:9',
        duration: options.duration || '8',
      };

      // 🔥 关键修复：在API调用前，强制刷新并获取最新的认证令牌
      const token = await getToken();

      // 发起生成请求
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 将令牌加入请求头
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '视频生成失败');
      }

      setGenerationStatus({
        status: 'polling',
        progress: 10,
        videoId: result.videoId,
        estimatedTime: result.estimatedTime,
      });

      // 开始轮询状态
      await pollVideoStatus(result.videoId);

    } catch (error) {
      console.error('视频生成失败:', error);
      setGenerationStatus({
        status: 'failed',
        progress: 0,
        error: error instanceof Error ? error.message : '视频生成失败',
      });
    }
  }, [getToken]);

  const pollVideoStatus = useCallback(async (videoId: string) => {
    const maxAttempts = 60; // 最多轮询5分钟
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`/api/video-status/${videoId}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || '获取视频状态失败');
        }

        // 更新状态
        setGenerationStatus(prev => ({
          ...prev,
          progress: result.progress || prev.progress,
        }));

        if (result.status === 'completed') {
          setGenerationStatus({
            status: 'completed',
            progress: 100,
            videoId,
            videoUrl: result.videoUrl,
            thumbnailUrl: result.thumbnailUrl,
          });
          return;
        }

        if (result.status === 'failed') {
          throw new Error(result.error || '视频生成失败');
        }

        // 等待5秒后再次检查
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

        // 更新进度（模拟进度增长）
        setGenerationStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 2, 90),
        }));

      } catch (error) {
        console.error('轮询状态时出错:', error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          setGenerationStatus({
            status: 'failed',
            progress: 0,
            error: '视频生成超时',
            videoId,
          });
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }, []);

  const getVideoDetails = useCallback(async (videoId: string) => {
    try {
      const response = await fetch(`/api/video-details/${videoId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '获取视频详细信息失败');
      }

      setGenerationStatus(prev => ({
        ...prev,
        details: {
          prompt: result.prompt,
          model: result.model,
          aspectRatio: result.aspectRatio,
          duration: result.duration,
          createdAt: result.createdAt,
          completedAt: result.completedAt,
        },
      }));

      return result;
    } catch (error) {
      console.error('获取视频详细信息失败:', error);
      throw error;
    }
  }, []);

  const get1080PVideo = useCallback(async (videoId: string) => {
    try {
      const response = await fetch(`/api/video-1080p/${videoId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '获取1080P视频失败');
      }

      setGenerationStatus(prev => ({
        ...prev,
        videoUrl1080p: result.videoUrl1080p,
      }));

      return result;
    } catch (error) {
      console.error('获取1080P视频失败:', error);
      throw error;
    }
  }, []);

  const resetGeneration = useCallback(() => {
    setGenerationStatus({
      status: 'idle',
      progress: 0,
    });
  }, []);

  return {
    generationStatus,
    generateVideo,
    getVideoDetails,
    get1080PVideo,
    resetGeneration,
    isGenerating: generationStatus.status === 'generating' || generationStatus.status === 'polling',
  };
} 