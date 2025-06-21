import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { CREDITS_CONFIG } from '@/lib/credits-config'
import { saveTaskRecord } from '@/lib/taskid-storage'
import https from 'https';

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户登录
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json();
    const { prompt, aspectRatio, duration } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '提示词是必需的' },
        { status: 400 }
      );
    }

    // 2. 检查用户积分是否足够
    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        email: true,
        totalCredits: true,
        usedCredits: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const remainingCredits = user.totalCredits - user.usedCredits
    
    if (!CREDITS_CONFIG.canCreateVideo(remainingCredits)) {
      return NextResponse.json({
        error: `积分不足，需要${CREDITS_CONFIG.VIDEO_COST}积分，当前剩余${remainingCredits}积分`,
        needCredits: CREDITS_CONFIG.VIDEO_COST,
        currentCredits: remainingCredits
      }, { status: 402 }) // 402 Payment Required
    }

    // 准备请求数据
    const requestData = JSON.stringify({
      prompt,
      model: 'veo3_fast',
      aspectRatio: aspectRatio || '16:9',
      duration: duration || '8',
    });

    // 直接使用Node.js https模块调用Kie.ai API
    const result = await new Promise<any>((resolve, reject) => {
      const options = {
        hostname: 'kieai.erweima.ai',
        port: 443,
        path: '/api/v1/veo/generate',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer c982688b5c6938943dd721ed1d576edb',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData),
          'User-Agent': 'Veo3-Client/1.0',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('Kie.ai API Response:', response);
            resolve(response);
          } catch (error) {
            console.error('Failed to parse response:', data);
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      req.on('error', (error) => {
        console.error('HTTPS Request Error:', error);
        reject(error);
      });

      req.write(requestData);
      req.end();
    });

    // 检查API响应
    if (result.code !== 200) {
      throw new Error(result.msg || result.message || '视频生成失败');
    }

    // 3. 扣除积分并创建视频记录
    const videoRecord = await db.$transaction(async (tx: any) => {
      // 扣除用户积分
      await tx.user.update({
        where: { id: user.id },
        data: {
          usedCredits: {
            increment: CREDITS_CONFIG.VIDEO_COST
          }
        }
      })

      // 创建视频记录
      const video = await tx.video.create({
        data: {
          userId: user.id,
          title: `ASMR Video - ${new Date().toLocaleString()}`,
          type: 'ASMR',
          prompt: prompt,
          status: 'processing',
          creditsUsed: CREDITS_CONFIG.VIDEO_COST,
        }
      })
      
      return video;
    })

    // 保存TaskID映射到临时存储
    const taskId = result.data?.taskId;
    if (taskId) {
      await saveTaskRecord({
        taskId: taskId,
        userId: user.id,
        userEmail: user.email,
        videoId: videoRecord.id,
        prompt: prompt,
        createdAt: new Date().toISOString(),
        status: 'processing'
      });
    }

    console.log(`✅ 用户 ${clerkUserId} 生成视频成功，扣除${CREDITS_CONFIG.VIDEO_COST}积分`)

    return NextResponse.json({
      success: true,
      videoId: taskId,
      taskId: taskId,
      status: 'pending',
      message: result.msg || 'Video generation started',
      creditsUsed: CREDITS_CONFIG.VIDEO_COST,
      remainingCredits: remainingCredits - CREDITS_CONFIG.VIDEO_COST
    });

  } catch (error) {
    console.error('视频生成失败:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '视频生成失败',
        success: false
      },
      { status: 500 }
    );
  }
} 