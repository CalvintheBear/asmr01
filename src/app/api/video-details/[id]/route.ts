export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const videoId = params.id;

    if (!videoId) {
      return NextResponse.json(
        { error: '视频ID是必需的' },
        { status: 400 }
      );
    }

    // 直接调用我们的video-status API来获取视频详情
    const statusResponse = await fetch(`http://localhost:3000/api/video-status/${videoId}`);
    const statusResult = await statusResponse.json();

    if (!statusResult.success) {
      throw new Error(statusResult.error || '获取视频状态失败');
    }

    // 从status API响应中构建详细信息
    const details = statusResult.details || {};
    
    return NextResponse.json({
      success: true,
      id: videoId,
      prompt: "ASMR video generated with AI", // 默认提示词
      model: "veo3_fast",
      aspectRatio: "16:9",
      duration: "8",
      createdAt: details.createTime ? new Date(details.createTime).toISOString() : new Date().toISOString(),
      completedAt: details.completeTime ? new Date(details.completeTime).toISOString() : null,
      status: statusResult.status,
      videoUrl: statusResult.videoUrl,
      originalTaskId: details.originalTaskId
    });

  } catch (error) {
    console.error('获取视频详细信息失败:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '获取视频详细信息失败',
        success: false
      },
      { status: 500 }
    );
  }
} 