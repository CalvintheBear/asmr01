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
    <section className="py-20 bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl mx-4 md:mx-6 lg:mx-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        {showHeader && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
              <Play className="w-4 h-4" />
              AI Veo3 Powered
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white">
              AI Veo3 <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">ASMR Video & Prompt Gallery</span>
            </h2>
            
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore professional AI-generated ASMR videos created with Google Veo3 technology. 
              Each veo3 ASMR video prompt and AI video prompt has been carefully crafted to generate stunning results - copy and customize them for your own ASMR creations.
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            >
              View All ASMR Videos
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <p className="text-slate-400 mt-4 text-sm">
              Discover more veo3 ASMR video prompt and AI video prompt templates
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