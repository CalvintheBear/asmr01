'use client'

import { useState, useEffect } from 'react';
import { Play, Download, Clock, CheckCircle } from 'lucide-react';

interface HistoryVideo {
  taskId: string;
  status: string;
  videoUrl?: string;
  progress: number;
  createTime?: number;
  completeTime?: number;
}

export default function VideoHistory() {
  const [videos, setVideos] = useState<HistoryVideo[]>([]);
  const [loading, setLoading] = useState(false);

  // 历史taskId列表
  const HISTORY_TASK_IDS = [
    '39a8d6a2c6d7cce34771860fac83e4cc',
    '3602c97b7d5a24dc2ac1ccef79f0dd49', 
    '8cc3520cf8a6ddfac4ea4816428c8290',
    '3fe305f1b8e211b0602547efbd63ee6b',
    '2cc9e2c70c9420ed448e2c1d5cee8b27',
    '5e8b6f4e83c17a36f78e0371b4d682cd',
    'eca72cbab71a4448314431747d31a71b',
    '5ee3590121e8d36d9c4872434be77e0',
    '14a9855dbb6accfa9f8d809ed172fc2e',
    '04f03da8d9e84128b5215783c5d08e1a'
  ];

  const loadHistoryVideos = async () => {
    setLoading(true);
    const videoData: HistoryVideo[] = [];

    for (const taskId of HISTORY_TASK_IDS) {
      try {
        const response = await fetch(`/api/video-status/${taskId}`);
        const result = await response.json();
        
        if (result.success) {
          videoData.push({
            taskId,
            status: result.status,
            videoUrl: result.videoUrl,
            progress: result.progress,
            createTime: result.details?.createTime,
            completeTime: result.details?.completeTime
          });
        }
      } catch (error) {
        console.error(`获取视频${taskId}失败:`, error);
      }
    }

    // 按完成时间排序（最新的在前）
    videoData.sort((a, b) => (b.completeTime || 0) - (a.completeTime || 0));
    setVideos(videoData);
    setLoading(false);
  };

  useEffect(() => {
    loadHistoryVideos();
  }, []);

  const downloadVideo = (videoUrl: string, taskId: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `asmr-video-${taskId.substring(0, 8)}.mp4`;
    link.click();
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '未知时间';
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">历史生成视频</h3>
        <button
          onClick={loadHistoryVideos}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '加载中...' : '刷新'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">加载历史视频...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无历史视频</p>
          ) : (
            videos.map((video) => (
              <div
                key={video.taskId}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900">
                      {video.taskId.substring(0, 16)}...
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {video.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {video.progress}%
                  </div>
                </div>

                {video.videoUrl && (
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      您的浏览器不支持视频播放
                    </video>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>创建: {formatDate(video.createTime)}</span>
                    </div>
                    {video.completeTime && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>完成: {formatDate(video.completeTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {video.videoUrl && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadVideo(video.videoUrl!, video.taskId)}
                      className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      下载视频
                    </button>
                    <button
                      onClick={() => window.open(video.videoUrl, '_blank')}
                      className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      新窗口播放
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 