import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { findTaskRecord, updateTaskRecord } from '@/lib/taskid-storage';
import { getApiKey, reportApiSuccess, reportApiError } from '@/lib/api-key-pool';
import { auth } from '@clerk/nextjs/server';

// 获取1080p视频的函数
async function get1080PVideo(taskId: string): Promise<string | null> {
  const apiKey = getApiKey();
  try {
    // 根据kie.ai文档，调用获取1080p视频的API
    const response = await fetch(`https://kieai.erweima.ai/api/v1/veo/get1080p?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Veo3-Client/1.0',
      }
    });

    if (!response.ok) {
      const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
      reportApiError(apiKey, error);
      throw error;
    }

    const result = await response.json();

    if (result.code === 200 && result.data?.videoUrl1080p) {
      reportApiSuccess(apiKey);
      return result.data.videoUrl1080p;
    }
    return null;
  } catch (error) {
    console.error('获取1080p视频失败:', error);
    reportApiError(apiKey, error);
    return null;
  }
}

// 更新数据库中的视频记录
async function updateVideoInDatabase(taskId: string, updateData: {
  status: string;
  videoUrl: string;
  videoUrl1080p: string;
  completedAt: Date;
}): Promise<void> {
  try {
    // 首先从临时存储中找到对应的记录
    const taskRecord = await findTaskRecord(taskId);
    if (!taskRecord) {
      console.log('⚠️ 未找到TaskID记录:', taskId);
      return;
    }

    // 更新数据库中的视频记录 (通过videoId)
    await db.video.update({
      where: {
        id: taskRecord.videoId
      },
      data: {
        status: updateData.status,
        videoUrl: updateData.videoUrl,
        completedAt: updateData.completedAt
      }
    });

    // 同时更新临时存储
    await updateTaskRecord(taskId, {
      status: updateData.status,
      videoUrl: updateData.videoUrl,
      videoUrl1080p: updateData.videoUrl1080p
    });

    console.log('✅ 视频记录已更新 - VideoID:', taskRecord.videoId, 'TaskID:', taskId);
  } catch (error) {
    console.error('❌ 数据库更新失败:', error);
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const videoId = resolvedParams.id;

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // 安全性增强：验证用户是否有权查询此视频
    const taskRecord = await findTaskRecord(videoId);
    if (!taskRecord) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const user = await db.user.findUnique({ where: { clerkUserId } });
    if (!user || user.id !== taskRecord.userId) {
      return NextResponse.json({ error: 'You do not have access permissions' }, { status: 403 });
    }

    // 修正API端点：使用与veo3-api.ts一致的 /api/v1/veo/video/{taskId} 端点
    const apiKey = getApiKey();
    const response = await fetch(`https://kieai.erweima.ai/api/v1/veo/video/${videoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Veo3-Client/1.0',
      }
    });

    if (!response.ok) {
      const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
      reportApiError(apiKey, error);
      throw error;
    }

    const result = await response.json();
    console.log('Video Status API Response:', result);

    // 检查响应格式
    if (result.code !== 200) {
      const error = new Error(result.msg || result.message || 'Failed to get video status');
      reportApiError(apiKey, error);
      throw error;
    }

    // 报告API调用成功
    reportApiSuccess(apiKey);

    // 处理响应数据
    const data = result.data;
    if (!data) {
      throw new Error('Response data is empty');
    }

    const { status, videoUrl, progress } = data;
    let videoUrl1080p: string | null = null;
    
    if (status === 'failed') {
      console.log('❌ 视频生成失败:', result.msg || '未知错误');
      await updateVideoInDatabase(videoId, {
        status: 'failed',
        videoUrl: '',
        videoUrl1080p: '',
        completedAt: new Date()
      });
    } else if (status === 'completed' && videoUrl) {
      // 尝试获取1080p版本
      try {
        const video1080pUrlResult = await get1080PVideo(videoId);
        if (video1080pUrlResult) {
          videoUrl1080p = video1080pUrlResult;
          console.log('✅ 成功获取1080p视频:', video1080pUrlResult);
        }
      } catch (error) {
        console.log('⚠️ 获取1080p视频失败，使用720p版本:', error);
        videoUrl1080p = videoUrl; // fallback到720p
      }

      // 更新数据库记录
      try {
        await updateVideoInDatabase(videoId, {
          status: 'completed',
          videoUrl: videoUrl,
          videoUrl1080p: videoUrl1080p || videoUrl,
          completedAt: new Date()
        });
      } catch (dbError) {
        console.error('❌ 更新数据库失败:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      id: data.taskId || videoId,
      status: status,
      videoUrl: videoUrl,
      videoUrl1080p: videoUrl1080p,
      progress: progress || (status === 'completed' ? 100 : (status === 'processing' ? 75 : 50)),
      details: {
        originalMessage: result.msg,
      }
    });

  } catch (error) {
    console.error('获取视频状态失败:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get video status',
        success: false
      },
      { status: 500 }
    );
  }
} 