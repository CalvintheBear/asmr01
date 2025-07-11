'use client'

import { useState } from 'react';
import { Play, Download, Volume2, Pause } from 'lucide-react';

interface ASMRVideoResultProps {
  isGenerating: boolean;
  progress: number;
  videoUrl?: string;
  videoUrl1080p?: string;
  thumbnailUrl?: string;
  title?: string;
  videoId?: string;
  details?: {
    prompt: string;
    model: string;
    aspectRatio: string;
    duration: string;
    createdAt: string;
    completedAt?: string;
  };
  onDownload?: () => void;
  onDownload1080p?: () => void;
  onOpenAssets?: () => void;
}

export default function ASMRVideoResult({
  isGenerating,
  progress,
  videoUrl,
  videoUrl1080p,
  thumbnailUrl,
  title = "ASMR Video Generator",
  videoId,
  details,
  onDownload,
  onDownload1080p,
  onOpenAssets
}: ASMRVideoResultProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // 总是显示组件，根据状态显示不同内容
  const hasContent = isGenerating || videoUrl;

  return (
    <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl shadow-2xl border border-stone-700 p-4 sm:p-6 lg:p-8 flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">ASMR Video Result</h2>
      
      {!hasContent ? (
        /* 默认状态 - 等待生成 */
        <div className="space-y-4">
          <div className="aspect-video bg-stone-700/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* 背景装饰效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-600/30 to-stone-700/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,113,108,0.2),transparent_50%)]"></div>
            </div>
            
            <div className="relative z-10 text-center px-4">
              {/* 播放按钮 */}
              <div className="w-12 h-12 bg-stone-600/40 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Play className="w-4 h-4 text-slate-300 ml-1" aria-hidden="true" />
              </div>
              
              <h3 className="text-base font-medium text-white mb-2">Ready to Generate</h3>
              <p className="text-sm text-slate-300 mb-3">
                Choose an ASMR type and enter a prompt to generate your relaxing ASMR video content
              </p>
              
              {/* 特性说明 */}
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                <Volume2 className="w-3 h-3" />
                <span>8-second videos with high-quality audio</span>
              </div>
            </div>
          </div>

          {/* 快速操作按钮 */}
          <div className="space-y-2">
            <button
              disabled
              className="w-full py-2.5 bg-stone-700/40 text-slate-400 rounded-xl font-medium cursor-not-allowed text-sm"
            >
              Generate Video First
            </button>
            <button
              disabled
              className="w-full py-2 text-slate-400 border border-stone-600 rounded-xl cursor-not-allowed text-sm"
            >
              View History
            </button>
          </div>
        </div>
      ) : isGenerating ? (
        <div className="space-y-4 flex-1 flex flex-col">
          {/* 生成状态提示 */}
          <div className="text-sm text-slate-300 mb-4" aria-live="polite">
            <span className="text-cyan-400 font-medium">
              Video generation takes 2-5 min. Please don't close this tab.
            </span>
          </div>
          
          {/* 视频预览区域 - 生成中 */}
          <div className="aspect-video bg-stone-700/50 rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* 背景动画效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-stone-600/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)] animate-pulse"></div>
            </div>
            
            <div className="relative z-10 text-center">
              {/* 大型播放按钮 */}
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Play className="w-8 h-8 text-white ml-1" aria-hidden="true" />
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
              <p className="text-sm text-slate-300 mb-4">
                Choose an ASMR type and enter a prompt to<br />
                generate relaxing ASMR video content
              </p>
              
              {/* 特性标签 */}
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                <Volume2 className="w-4 h-4" />
                <span>High-quality audio included</span>
              </div>
            </div>
          </div>
          
          {/* 进度指示器 */}
          <div className="space-y-2 mt-auto" aria-live="polite">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">正在生成视频...</span>
              <span className="text-cyan-400 font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-stone-600/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col">
          {/* 完成的视频展示 */}
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer">
            {(videoUrl1080p || videoUrl) ? (
              <video 
                controls 
                className="w-full h-full object-cover"
                poster={thumbnailUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={videoUrl1080p || videoUrl} type="video/mp4" />
                Your browser does not support video playback
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto" aria-label={isPlaying ? "Pause video" : "Play video"}>
                    {isPlaying ? (
                      <Pause className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-lg font-medium">AI Generated ASMR Video</p>
                  <p className="text-sm opacity-80 mt-1">点击播放</p>
                </div>
              </div>
            )}
          </div>
          
          {/* 视频信息 */}
          {details && (
            <div className="bg-stone-700/30 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Model:</span>
                <span className="font-medium text-white">{details.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Duration:</span>
                <span className="font-medium text-white">{details.duration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Aspect Ratio:</span>
                <span className="font-medium text-white">{details.aspectRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Created:</span>
                <span className="font-medium text-white">{new Date(details.createdAt).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="space-y-2 sm:space-y-3 mt-auto">
            {/* 主要下载按钮 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={videoUrl1080p ? onDownload1080p : onDownload}
                className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="text-sm font-medium">
                  Download Video
                </span>
              </button>
            </div>
            
            {/* 次要操作按钮 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenAssets}
                className="flex-1 px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Video History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 