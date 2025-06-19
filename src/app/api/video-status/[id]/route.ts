import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: Params
) {
  try {
    const { id: videoId } = await context.params;

    if (!videoId) {
      return NextResponse.json(
        { error: '视频ID是必需的' },
        { status: 400 }
      );
    }

    // 使用正确的Veo3 record-info端点查询视频状态，GET请求方法
    const result = await new Promise<any>((resolve, reject) => {
      const options = {
        hostname: 'kieai.erweima.ai',
        port: 443,
        path: `/api/v1/veo/record-info?taskId=${videoId}`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer c982688b5c6938943dd721ed1d576edb',
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
            console.log('Video Status API Response:', response);
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

      req.end();
    });

    // 检查响应格式
    if (result.code !== 200) {
      throw new Error(result.msg || result.message || '获取视频状态失败');
    }

    // 处理响应数据
    const data = result.data;
    if (!data) {
      throw new Error('响应数据为空');
    }

    // 根据实际响应结构解析状态
    const successFlag = data.successFlag;
    const completeTime = data.completeTime;
    const errorCode = data.errorCode;
    const errorMessage = data.errorMessage;
    const resultUrls = data.response?.resultUrls || [];

    let processedStatus = 'processing';
    let progress = 50;
    let videoUrl = null;
    
    if (errorCode) {
      // 有错误码，生成失败
      processedStatus = 'failed';
      progress = 0;
    } else if (successFlag === 1 && completeTime && resultUrls.length > 0) {
      // 成功标志为1，有完成时间，且有结果URL，表示完成
      processedStatus = 'completed';
      progress = 100;
      videoUrl = resultUrls[0]; // 取第一个视频URL
    } else if (successFlag === 1) {
      // 有成功标志但可能还在处理中
      processedStatus = 'processing';
      progress = 80;
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
      progress: progress,
      // 添加详细信息便于调试
      details: {
        successFlag,
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
        error: error instanceof Error ? error.message : '获取视频状态失败',
        success: false
      },
      { status: 500 }
    );
  }
} 