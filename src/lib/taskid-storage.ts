import { db } from './prisma';

interface TaskRecord {
  taskId: string;
  userId: string;
  userEmail: string;
  videoId: string;
  prompt: string;
  createdAt: string;
  status?: string;
  videoUrl?: string;
  videoUrl1080p?: string;
}

// 保存TaskID记录 - 直接更新数据库中的video记录
export async function saveTaskRecord(record: TaskRecord): Promise<void> {
  try {
    // 更新视频记录，添加taskId
    await db.video.update({
      where: { id: record.videoId },
      data: {
        taskId: record.taskId,
        status: record.status || 'processing'
      }
    });
    
    console.log('✅ TaskID记录已保存到数据库:', record.taskId);
  } catch (error) {
    console.error('❌ 保存TaskID记录失败:', error);
  }
}

// 根据TaskID查找记录
export async function findTaskRecord(taskId: string): Promise<TaskRecord | null> {
  try {
    const video = await db.video.findFirst({
      where: { taskId },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });
    
    if (!video) return null;
    
    return {
      taskId: video.taskId!,
      userId: video.userId,
      userEmail: video.user.email || '',
      videoId: video.id,
      prompt: video.prompt,
      createdAt: video.createdAt.toISOString(),
      status: video.status,
              videoUrl: video.videoUrl || undefined,
        videoUrl1080p: video.videoUrl1080p || undefined
    };
  } catch (error) {
    console.error('❌ 查找TaskID记录失败:', error);
    return null;
  }
}

// 根据用户ID获取所有记录
export async function getUserTaskRecords(userId: string): Promise<TaskRecord[]> {
  try {
    const videos = await db.video.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return videos
      .filter(video => video.taskId)
      .map(video => ({
        taskId: video.taskId!,
        userId: video.userId,
        userEmail: video.user.email || '',
        videoId: video.id,
        prompt: video.prompt,
        createdAt: video.createdAt.toISOString(),
        status: video.status,
        videoUrl: video.videoUrl,
        videoUrl1080p: video.videoUrl1080p
      }));
  } catch (error) {
    console.error('❌ 获取用户TaskID记录失败:', error);
    return [];
  }
}

// 更新TaskID记录状态
export async function updateTaskRecord(taskId: string, updates: Partial<TaskRecord>): Promise<void> {
  try {
    await db.video.updateMany({
      where: { taskId },
      data: {
        status: updates.status,
        videoUrl: updates.videoUrl,
        videoUrl1080p: updates.videoUrl1080p,
        ...(updates.status === 'completed' && { completedAt: new Date() })
      }
    });
    
    console.log('✅ TaskID记录已更新:', taskId);
  } catch (error) {
    console.error('❌ 更新TaskID记录失败:', error);
  }
} 