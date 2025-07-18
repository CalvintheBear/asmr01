import { showcaseVideos } from '@/data/showcase-videos';
import VideoShowcaseGrid from '@/components/VideoShowcaseGrid';
import StructuredData from '@/components/StructuredData';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

export default function VideoShowcasePage() {
  // 转换展示视频数据为结构化数据格式
  const videosForStructuredData = showcaseVideos.map(video => ({
    id: video.id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration,
    category: video.category,
    createdAt: video.createdAt
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      
      {/* 添加结构化数据 */}
      <StructuredData 
        type="video"
        videos={videosForStructuredData}
        pageUrl="https://cuttingasmr.org/video-showcase"
      />
      {/* Top Navigation */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            
            <div className="h-6 w-px bg-slate-600 mx-4" />
            
            <span className="text-xl font-bold text-white">Veo3 Video Prompt Templates</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">AI Veo3 Video & Prompt Gallery</span>
          </h1>
          
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore professional videos created with Google Veo3 AI and copy their exact veo3 video prompt templates. 
            Each ai video prompt in our gallery has been tested and optimized for maximum quality - simply copy, customize, and generate your own stunning content.
          </p>

          {/* Start Create Button - 放大并置于标题介绍下方 */}
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Play className="w-6 h-6" />
            Start Create Now
          </Link>
        </div>

        {/* Video Grid */}
        <VideoShowcaseGrid videos={showcaseVideos} />

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Use These Veo3 Video Prompt Templates?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Copy any veo3 video prompt or ai video prompt from our gallery and create stunning videos instantly. 
            Our Google Veo3 AI generator uses these exact prompt templates to deliver professional results every time.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            Start Creating
          </Link>
        </div>
      </div>
    </div>
  );
} 