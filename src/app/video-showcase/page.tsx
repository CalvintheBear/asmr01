'use client';

import { useState } from 'react';
import { showcaseVideos } from '@/data/showcase-videos';
import { ShowcaseVideo } from '@/data/video-types';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';
import SEOHead from '@/components/SEOHead';
import StructuredData from '@/components/StructuredData';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

export default function VideoShowcasePage() {
  const [selectedVideo, setSelectedVideo] = useState<ShowcaseVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video: ShowcaseVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // 转换展示视频数据为结构化数据格式
  const videosForStructuredData = showcaseVideos.map(video => ({
    id: video.id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration,
    category: video.category
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50">
      <SEOHead
        title="Best Google Veo3 ASMR Videos Gallery - AI Generated Relaxing Content Examples"
        description="Best Google Veo3 ASMR videos for relaxation! AI generated sleep ASMR examples with glass cutting, fruit content. Veo3 stress relief videos perfect for meditation and relaxing content creation."
        canonical="https://cuttingasmr.org/video-showcase"
        keywords="google veo3, veo3, google veo3 asmr, veo3 asmr videos, best asmr videos, relaxing asmr content, sleep asmr generator, stress relief videos, meditation video creator, relaxing content, YouTube shorts, tiktok shorts, glass cutting, fruit, asmr video, relaxing video maker, ai generated asmr"
      />
      
      {/* 添加结构化数据 */}
      <StructuredData 
        type="video"
        videos={videosForStructuredData}
        pageUrl="https://cuttingasmr.org/video-showcase"
      />
      {/* Top Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            
            <div className="h-6 w-px bg-stone-300 mx-4" />
            
            <h1 className="text-xl font-bold text-gray-800">AI Generated ASMR Videos</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Play className="w-4 h-4" />
            AI Generated Collection
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Amazing ASMR Videos
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent"> Gallery</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our complete collection of AI-generated ASMR videos. Each video showcases the incredible creativity and precision of artificial intelligence technology.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {showcaseVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={handleVideoClick}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl border border-stone-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Create Your Own ASMR Video?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Use our AI generator to create professional ASMR videos in minutes.
            No recording equipment needed, no editing skills required.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            Start Creating
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
} 