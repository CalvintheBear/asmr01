export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';

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

    // 使用Veo3 record-info端点查询视频详情
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
    console.log('Video Details API Response:', result);

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
      
      throw new Error(result.msg || result.message || '获取视频详情失败');
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
    const statusCode = data.successFlag;
    const resultUrls = data.response?.resultUrls || [];
    
    let status = 'processing';
    let videoUrl = null;
    
    if (statusCode === 2 || statusCode === 3 || data.errorCode) {
      status = 'failed';
    } else if (statusCode === 1 && resultUrls.length > 0) {
      status = 'completed';
      videoUrl = resultUrls[0]; // veo3_fast只返回720p视频
    } else if (statusCode === 0) {
      status = 'processing';
    }

    return NextResponse.json({
      success: true,
      id: data.taskId || taskId,
      status: status,
      prompt: data.prompt || '',
      model: 'veo3_fast',
      aspectRatio: data.aspectRatio || '16:9',
      duration: data.duration || '8s',
      videoUrl: videoUrl,
      createdAt: data.createTime,
      completedAt: data.completeTime,
      details: {
        statusCode,
        errorCode: data.errorCode,
        errorMessage: data.errorMessage,
        resultUrls
      }
    });

  } catch (error) {
    console.error('获取视频详情失败:', error);
    
    const errorMessage = error instanceof Error ? error.message : '获取视频详情失败';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false,
        id: taskId
      },
      { status: 500 }
    );
  }
} 