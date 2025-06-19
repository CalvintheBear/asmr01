import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, duration } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '提示词是必需的' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      videoId: result.data?.taskId,
      status: 'pending',
      message: result.msg || 'Video generation started',
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