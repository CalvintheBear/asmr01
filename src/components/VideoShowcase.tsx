'use client';

import { useState } from 'react';
import { VideoShowcaseProps, ShowcaseVideo } from '@/data/video-types';
import { getFeaturedVideos } from '@/data/showcase-videos';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function VideoShowcase({ 
  maxVideos = 6, 
  showHeader = true, 
  showViewMore = true,
  columns = 2 
}: VideoShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<ShowcaseVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videos = getFeaturedVideos(maxVideos);

  const handleVideoClick = (video: ShowcaseVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        {showHeader && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-100">
              <Play className="w-4 h-4" />
              AI Veo3 Powered
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">AI Veo3 Video & Prompt Gallery</span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore professional AI-generated videos created with Google Veo3 technology. 
              Each veo3 video prompt and ai video prompt has been carefully crafted to generate stunning results - copy and customize them for your own creations.
            </p>
          </div>
        )}

        {/* 视频网格 */}
        <div className={`grid ${getGridCols()} gap-8 mb-12 items-stretch`}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={handleVideoClick}
            />
          ))}
        </div>

        {/* 查看更多按钮 */}
        {showViewMore && videos.length >= maxVideos && (
          <div className="text-center">
            <Link
              href="/video-showcase"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-medium text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            >
              View All Videos
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <p className="text-gray-600 mt-4 text-sm">
              Discover more veo3 video prompt and ai video prompt templates
            </p>
          </div>
        )}


      </div>

      {/* 视频播放模态窗口 */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
} 