'use client';

import { useState } from 'react';
import { VideoCardProps } from '@/data/video-types';
import { Play } from 'lucide-react';

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(video)}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <video
          src={video.videoUrl}
          muted
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          aria-label={`AI generated ASMR video: ${video.title} - Created with Google Veo3 AI for relaxation and sleep`}
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            video.currentTime = 0.1; // 设置到0.1秒获取第一帧
          }}
        />
        
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
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
          {video.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
} 