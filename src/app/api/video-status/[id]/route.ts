import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { findTaskRecord, updateTaskRecord } from '@/lib/taskid-storage';

// 更新数据库中的视频记录
async function updateVideoInDatabase(taskId: string, updateData: {
  status: string;
  videoUrl: string;
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
      videoUrl: updateData.videoUrl
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
  const resolvedParams = await params;
  const taskId = resolvedParams.id;
  
  try {

    if (!taskId) {
      return NextResponse.json(
        { error: '任务ID是必需的', success: false },
        { status: 400 }
      );
    }

    // 使用Veo3 record-info端点查询视频状态
    const response = await fetch(`https://kieai.erweima.ai/api/v1/veo/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer c982688b5c6938943dd721ed1d576edb',
        'User-Agent': 'Veo3-Client/1.0',
      }
    });

    if (!response.ok) {
      // 如果是404，说明taskId不存在
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: '任务不存在',
          id: taskId,
          status: 'not_found'
        }, { status: 404 });
      }
      
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Video Status API Response:', result);

    // 检查响应格式
    if (result.code !== 200) {
      // 如果是任务不存在的错误
      if (result.code === 404 || result.msg?.includes('not found') || result.msg?.includes('不存在')) {
        return NextResponse.json({
          success: false,
          error: '任务不存在或已过期',
          id: taskId,
          status: 'not_found'
        }, { status: 404 });
      }
      
      throw new Error(result.msg || result.message || '获取视频状态失败');
    }

    // 处理响应数据
    const data = result.data;
    if (!data) {
      return NextResponse.json({
        success: false,
        error: '任务不存在或数据为空',
        id: taskId,
        status: 'not_found'
      }, { status: 404 });
    }

    // 根据Kie.ai文档的状态码解析
    // 0: 生成中, 1: 成功, 2: 失败, 3: 生成失败
    const statusCode = data.successFlag;
    const completeTime = data.completeTime;
    const errorCode = data.errorCode;
    const errorMessage = data.errorMessage;
    const resultUrls = data.response?.resultUrls || [];

    let processedStatus = 'processing';
    let progress = 50;
    let videoUrl = null;
    
    if (statusCode === 2 || statusCode === 3 || errorCode) {
      // 状态码2或3表示失败
      processedStatus = 'failed';
      progress = 0;
      console.log('❌ 视频生成失败:', errorMessage || '未知错误');
    } else if (statusCode === 1 && resultUrls.length > 0) {
      // 状态码1表示成功完成，veo3_fast只返回720p视频
      processedStatus = 'completed';
      progress = 100;
      videoUrl = resultUrls[0]; // 720p视频URL（veo3_fast的默认输出）

      // 更新数据库记录
      try {
        await updateVideoInDatabase(taskId, {
          status: 'completed',
          videoUrl: videoUrl,
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
      id: data.taskId || taskId,
      status: processedStatus,
      videoUrl: videoUrl,
      progress: progress,
      // 添加详细信息便于调试
      details: {
        statusCode,
        completeTime,
        createTime: data.createTime,
        errorCode,
        errorMessage,
        resultUrls,
        model: 'veo3_fast' // 明确标注使用的模型
      }
    });

  } catch (error) {
    console.error('获取视频状态失败:', error);
    
    // 改善错误响应
    const errorMessage = error instanceof Error ? error.message : '获取视频状态失败';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
        id: resolvedParams.id || 'unknown'
      },
      { status: 500 }
    );
  }
} 