'use client';

import { useState, useRef, useEffect } from 'react';
import { VideoCardProps as _VideoCardProps } from '@/data/video-types';
import { Play, Eye } from 'lucide-react';
import Link from 'next/link';

type VideoCardProps = Omit<_VideoCardProps, 'onClick'> & { onClick?: (video: any) => void }

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 客户端挂载检测
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 检测设备类型（仅在客户端）
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // 懒加载检测（仅在客户端）
  useEffect(() => {
    if (!isMounted) return;
    
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      // 如果不支持IntersectionObserver，直接设置为可见
      setIsInView(true);
      return;
    }

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
  }, [isMounted]);

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = e.target as HTMLVideoElement;
    try {
      // 设置到0.1秒获取第一帧作为缩略图
      videoElement.currentTime = 0.1;
    } catch (error) {
      console.warn('Failed to set video currentTime:', error);
      setThumbnailLoaded(true); // 即使失败也显示video元素
    }
  };

  const handleImageLoad = () => {
    setThumbnailLoaded(true);
  };

  const handleImageError = () => {
    console.log('Thumbnail image loading error for:', video.title);
    setThumbnailError(true);
  };

  // 移除 video 回退逻辑相关函数

  // 仅加载thumbnail图片；失败时保留占位符
  const shouldLoadImage = isMounted && isInView && !!video.thumbnailUrl && !thumbnailError;

  const handleCardClick = () => {
    window.open(`/video-showcase/${video.id}`, '_blank')
  }

  return (
    <div 
      ref={cardRef}
      className="group relative bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full border border-stone-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-stone-700">
        {/* 尝试加载静态封面图 */}
        {shouldLoadImage && (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: thumbnailLoaded ? 'block' : 'none' }}
          />
        )}
        {/* 若图片加载失败或尚未加载，则显示占位符（保持现有灰色块） */}
        
        {/* 加载状态占位符 */}
        {(!isMounted || !isInView || !thumbnailLoaded || thumbnailError) && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              {!isMounted || !isInView ? (
                // 未挂载或未进入视口时显示简单占位符
                <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
              ) : (
                // 加载中显示播放图标
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-gray-500 text-sm">{video.duration}</p>
              <p className="text-gray-400 text-xs mt-1">{video.asmrType}</p>
              {(!isMounted || !isInView) && (
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
            <Play className="w-8 h-8 text-cyan-500 fill-cyan-500" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="font-semibold text-lg text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 flex-grow">
          {video.title}
        </h2>
        
        {/* View Prompt Template Button - 固定在底部 */}
        <div className="mt-auto">
          <Link
            href={`/video-showcase/${video.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            scroll={false}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye className="w-4 h-4" />
            View Prompt Template
          </Link>
        </div>
      </div>
    </div>
  );
} 