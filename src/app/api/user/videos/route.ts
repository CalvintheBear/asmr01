import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { getUserTaskRecords } from '@/lib/taskid-storage';

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: '用户未登录', success: false },
        { status: 401 }
      );
    }

    // 查找用户
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在', success: false },
        { status: 404 }
      );
    }

    // 获取用户的所有视频记录，按创建时间倒序
    const videos = await db.video.findMany({
      where: { 
        userId: user.id
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // 限制返回最近50个视频
    });

    // 获取TaskID记录
    const taskRecords = await getUserTaskRecords(user.id);
    const taskMap = new Map(taskRecords.map(record => [record.videoId, record]));

    return NextResponse.json({
      success: true,
      data: {
        videos: videos.map(video => {
          const taskRecord = taskMap.get(video.id);
          return {
            id: video.id,
            taskId: taskRecord?.taskId || null,
            title: video.title,
            type: video.type,
            prompt: video.prompt,
            status: taskRecord?.status || video.status, // 优先使用TaskRecord中的状态
            videoUrl: taskRecord?.videoUrl || video.videoUrl,
            videoUrl1080p: taskRecord?.videoUrl1080p || null,
            thumbnailUrl: video.thumbnailUrl,
            creditsUsed: video.creditsUsed,
            createdAt: video.createdAt.toISOString(),
            completedAt: video.completedAt?.toISOString() || null
          };
        })
      }
    });

  } catch (error) {
    console.error('获取用户视频失败:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '获取视频历史失败',
        success: false
      },
      { status: 500 }
    );
  }
} 