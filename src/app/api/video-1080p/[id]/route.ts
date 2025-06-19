import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;

    if (!videoId) {
      return NextResponse.json(
        { error: '视频ID是必需的' },
        { status: 400 }
      );
    }

    // 直接调用我们的video-status API来获取视频信息
    const statusResponse = await fetch(`http://localhost:3000/api/video-status/${videoId}`);
    const statusResult = await statusResponse.json();

    if (!statusResult.success) {
      throw new Error(statusResult.error || '获取视频状态失败');
    }

    // 从status API的响应中提取视频URL作为1080p版本
    let videoUrl1080p = null;
    
    // 尝试从多个可能的位置获取视频URL
    if (statusResult.details?.resultUrls && statusResult.details.resultUrls.length > 0) {
      videoUrl1080p = statusResult.details.resultUrls[0];
    } else if (statusResult.videoUrl) {
      videoUrl1080p = statusResult.videoUrl;
    }
    
    console.log('从status API获取的1080p URL:', videoUrl1080p);

    return NextResponse.json({
      success: true,
      id: videoId,
      videoUrl1080p: videoUrl1080p,
      status: statusResult.status || 'completed',
    });

  } catch (error) {
    console.error('获取1080P视频失败:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '获取1080P视频失败',
        success: false
      },
      { status: 500 }
    );
  }
} 