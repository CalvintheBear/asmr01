import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { findTaskRecord, updateTaskRecord } from '@/lib/taskid-storage';
import { getApiKey, reportApiSuccess, reportApiError } from '@/lib/api-key-pool';

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
    const resolvedParams = await params;
    const videoId = resolvedParams.id;

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // 使用正确的Veo3 record-info端点查询视频状态，GET请求方法
    const apiKey = getApiKey();
    const response = await fetch(`https://kieai.erweima.ai/api/v1/veo/record-info?taskId=${videoId}`, {
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

    // 根据kie.ai文档的状态码解析
    // 0: 生成中, 1: 成功, 2: 失败, 3: 生成失败
    const statusCode = data.successFlag; // 实际是状态码
    const completeTime = data.completeTime;
    const errorCode = data.errorCode;
    const errorMessage = data.errorMessage;
    const resultUrls = data.response?.resultUrls || [];

    let processedStatus = 'processing';
    let progress = 50;
    let videoUrl = null;
    let videoUrl1080p = null;
    
    if (statusCode === 2 || statusCode === 3 || errorCode) {
      // 状态码2或3表示失败
      processedStatus = 'failed';
      progress = 0;
      console.log('❌ 视频生成失败:', errorMessage || '未知错误');
    } else if (statusCode === 1 && resultUrls.length > 0) {
      // 状态码1表示成功完成
      processedStatus = 'completed';
      progress = 100;
      videoUrl = resultUrls[0]; // 720p视频URL
      
      // 尝试获取1080p版本
      try {
        const video1080pUrl = await get1080PVideo(videoId);
        if (video1080pUrl) {
          videoUrl1080p = video1080pUrl;
          console.log('✅ 成功获取1080p视频:', video1080pUrl);
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
    } else if (statusCode === 0) {
      // 状态码0表示正在生成
      processedStatus = 'processing';
      progress = 75;
    } else {
      // 其他情况视为处理中
      processedStatus = 'processing';
      progress = 50;
    }

    return NextResponse.json({
      success: true,
      id: data.taskId || videoId,
      status: processedStatus,
      videoUrl: videoUrl,
      videoUrl1080p: videoUrl1080p,
      progress: progress,
      // 添加详细信息便于调试
      details: {
        statusCode,
        completeTime,
        createTime: data.createTime,
        errorCode,
        errorMessage,
        resultUrls,
        originalTaskId: data.response?.taskId
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