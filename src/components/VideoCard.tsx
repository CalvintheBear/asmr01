'use client';

import { useState, useRef, useEffect } from 'react';
import { VideoCardProps } from '@/data/video-types';
import { Play, Eye } from 'lucide-react';

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 检测设备类型
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // 生成腾讯云视频截图URL（真正的缩略图）
  const getThumbnailUrl = (videoUrl: string): string => {
    if (videoUrl.includes('myqcloud.com')) {
      // 腾讯云视频截图服务：在2秒处截取，尺寸640x360，格式jpg
      return `${videoUrl}?vframe/jpg/offset/2/w/640/h/360/quality/80`;
    }
    return video.thumbnailUrl || videoUrl;
  };

  // 懒加载检测
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = e.target as HTMLVideoElement;
    // 设置到0.1秒获取第一帧作为缩略图
    videoElement.currentTime = 0.1;
    setThumbnailLoaded(true);
  };

  const handleImageLoad = () => {
    setThumbnailLoaded(true);
  };

  const handleImageError = () => {
    console.log('Thumbnail image loading error for:', video.title);
    setThumbnailError(true);
  };

  const handleVideoError = () => {
    console.log('Video loading error for:', video.title);
    setThumbnailError(true);
  };

  const handleVideoSeeked = () => {
    // 当video seek到指定时间后，第一帧就会显示
    setThumbnailLoaded(true);
  };

  const thumbnailUrl = getThumbnailUrl(video.videoUrl);
  const shouldUseThumbnailImage = isMobile() || video.thumbnailUrl;

  return (
    <div 
      ref={cardRef}
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(video)}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-gray-100">
        {isInView && !thumbnailError && (
          <>
            {shouldUseThumbnailImage ? (
              // 移动端或有缩略图时使用图片
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ 
                  display: thumbnailLoaded ? 'block' : 'none'
                }}
                loading="lazy"
              />
            ) : (
              // 桌面端使用video第一帧
              <video
                src={video.videoUrl}
                muted
                preload="metadata"
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onLoadedMetadata={handleVideoLoadedMetadata}
                onSeeked={handleVideoSeeked}
                onError={handleVideoError}
                style={{ 
                  display: thumbnailLoaded ? 'block' : 'none'
                }}
              />
            )}
          </>
        )}
        
        {/* 加载状态占位符 */}
        {(!isInView || !thumbnailLoaded || thumbnailError) && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              {!isInView ? (
                // 未进入视口时显示简单占位符
                <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
              ) : (
                // 加载中显示播放图标
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-gray-500 text-sm">{video.duration}</p>
              <p className="text-gray-400 text-xs mt-1">{video.asmrType}</p>
              {!isInView && (
                <p className="text-gray-400 text-xs mt-1">Loading...</p>
              )}
            </div>
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-white bg-opacity-90 rounded-full p-4 transform transition-transform duration-300 hover:scale-110">
            <Play className="w-8 h-8 text-emerald-600 fill-emerald-600" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300 flex-grow">
          {video.title}
        </h3>
        
        {/* View Prompt Template Button - 固定在底部 */}
        <div className="mt-auto">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
            <Eye className="w-4 h-4" />
            View Prompt Template
          </button>
        </div>
      </div>
    </div>
  );
} 