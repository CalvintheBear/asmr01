import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { CREDITS_CONFIG } from '@/lib/credits-config'
import { saveTaskRecord } from '@/lib/taskid-storage'
import { getApiKey, reportApiSuccess, reportApiError } from '@/lib/api-key-pool'
import { rateLimiter, getClientIP, RATE_LIMITS, createRateLimitResponse } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户登录
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. 🔒 速率限制检查 - 仅针对用户级别，确保不同IP用户都能正常使用
    const userIdentifier = `user:${clerkUserId}`;
    
    // 只检查用户级别限制，不限制IP（因为真实用户可能来自不同IP）
    if (!rateLimiter.isAllowed(userIdentifier, RATE_LIMITS.VIDEO_GENERATION.limit, RATE_LIMITS.VIDEO_GENERATION.windowMs)) {
      console.log(`🚫 User ${clerkUserId} video generation frequency too high, please try again later`);
      return createRateLimitResponse(userIdentifier, RATE_LIMITS.VIDEO_GENERATION.limit);
    }

    const body = await request.json();
    const { prompt, aspectRatio, duration } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 2. 使用数据库事务进行原子性操作（积分检查 + 预扣除）
    let user: any;
    let videoRecord: any;
    
    try {
      const result = await db.$transaction(async (tx: any) => {
        // 首先获取并锁定用户记录（防止并发问题）
        const userRecord = await tx.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        email: true,
        totalCredits: true,
        usedCredits: true
      }
    })

        if (!userRecord) {
          throw new Error('User does not exist')
    }

        const remainingCredits = userRecord.totalCredits - userRecord.usedCredits
    
    if (!CREDITS_CONFIG.canCreateVideo(remainingCredits)) {
          throw new Error(`Insufficient credits, need ${CREDITS_CONFIG.VIDEO_COST} credits, current remaining ${remainingCredits} credits`)
        }

        // 预扣除积分（确保并发安全）
        await tx.user.update({
          where: { id: userRecord.id },
          data: {
            usedCredits: {
              increment: CREDITS_CONFIG.VIDEO_COST
            }
          }
        })

        // 创建视频记录（状态为pending，等待API调用结果）
        const video = await tx.video.create({
          data: {
            userId: userRecord.id,
            title: `ASMR Video - ${new Date().toLocaleString()}`,
            type: 'ASMR',
            prompt: prompt,
            status: 'pending', // 先设为pending，API成功后更新为processing
            creditsUsed: CREDITS_CONFIG.VIDEO_COST,
          }
        })
        
        return { user: userRecord, video };
      }, {
        // 设置事务隔离级别，确保并发安全
        isolationLevel: 'Serializable'
      })
      
      user = result.user;
      videoRecord = result.video;
      
    } catch (transactionError: any) {
      if (transactionError.message.includes('Insufficient credits')) {
        const currentUser = await db.user.findUnique({
          where: { clerkUserId },
          select: { totalCredits: true, usedCredits: true }
        })
        const remainingCredits = currentUser ? currentUser.totalCredits - currentUser.usedCredits : 0;
        
      return NextResponse.json({
        error: `Insufficient credits, need ${CREDITS_CONFIG.VIDEO_COST} credits, current remaining ${remainingCredits} credits`,
        needCredits: CREDITS_CONFIG.VIDEO_COST,
        currentCredits: remainingCredits
        }, { status: 402 })
      }
      throw transactionError;
    }

    // 3. 准备请求数据（按照kie.ai官方文档格式）
    const requestData = {
      prompt: prompt,
      // 备注：为了确保使用正确的模型并控制成本，此处显式指定 model 为 'veo3_fast'。
      // 旧有逻辑依赖服务端的默认模型，但实践证明这可能导致调用到价格更高的模型。
      model: 'veo3_fast',
      aspectRatio: aspectRatio || '16:9',
      duration: duration || '8',
    };

    // 4. 获取API密钥并调用Kie.ai Veo3 API
    const apiKey = getApiKey();
    console.log(`🎬 User ${user.email} starting to generate veo3_fast video, using key: ${apiKey.substring(0, 10)}...`);
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    
    const baseUrl = process.env.VEO3_API_BASE_URL || 'https://api.kie.ai';
    const response = await fetch(`${baseUrl}/api/v1/veo/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Veo3Fast-Client/1.0',
      },
      body: JSON.stringify(requestData)
    });

    console.log(`🔗 API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API request failed: ${response.status} ${response.statusText}`, errorText);
      
      // API失败时回滚积分和删除视频记录
      await db.$transaction(async (tx: any) => {
        await tx.user.update({
          where: { id: user.id },
          data: {
            usedCredits: {
              decrement: CREDITS_CONFIG.VIDEO_COST
            }
          }
        })
        
        await tx.video.delete({
          where: { id: videoRecord.id }
        })
      })
      
      const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
      reportApiError(apiKey, error);
      throw error;
    }

    const result = await response.json();
    console.log('✅ Kie.ai Veo3 API response:', result);

    // 5. 检查API响应格式
    if (result.code !== 200) {
      console.error(`❌ API returned error: ${result.code} - ${result.msg || result.message}`);

      // API失败时回滚积分和删除视频记录
      await db.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          usedCredits: {
              decrement: CREDITS_CONFIG.VIDEO_COST
          }
        }
      })

        await tx.video.delete({
          where: { id: videoRecord.id }
        })
      })
      
      const error = new Error(result.msg || result.message || 'veo3_fast video generation failed');
      reportApiError(apiKey, error);
      throw error;
    }

    // 6. API成功，报告成功并更新视频状态
    reportApiSuccess(apiKey);
    
    // 更新视频记录状态为processing
    await db.video.update({
      where: { id: videoRecord.id },
      data: {
          status: 'processing',
        taskId: result.data?.taskId || null
        }
    })

    // 7. 保存TaskID映射到临时存储
    const taskId = result.data?.taskId;
    if (taskId) {
      await saveTaskRecord({
        taskId: taskId,
        userId: user.id,
        userEmail: user.email,
        videoId: videoRecord.id,
        prompt: prompt,
        createdAt: new Date().toISOString(),
        status: 'processing',
        model: 'veo3_fast' // 明确记录使用的模型
      });
      
      console.log(`📝 TaskID ${taskId} saved to temporary storage`);
    }

    const remainingCredits = user.totalCredits - user.usedCredits - CREDITS_CONFIG.VIDEO_COST;
    
    console.log(`✅ User ${user.email} veo3_fast video generation request successful`);
    console.log(`💰 Credits consumed: ${CREDITS_CONFIG.VIDEO_COST}, remaining credits: ${remainingCredits}`);
    console.log(`🎥 Video ID: ${videoRecord.id}, TaskID: ${taskId}`);

    return NextResponse.json({
      success: true,
      videoId: taskId,
      taskId: taskId,
      status: 'pending',
      message: result.msg || 'veo3_fast video generation started',
      creditsUsed: CREDITS_CONFIG.VIDEO_COST,
      remainingCredits: remainingCredits,
      model: 'veo3_fast',
      estimatedDuration: '8 seconds',
      quality: '720p'
    });

  } catch (error) {
    console.error('❌ veo3_fast video generation failed:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'veo3_fast video generation failed',
        success: false,
        model: 'veo3_fast'
      },
      { status: 500 }
    );
  }
} 