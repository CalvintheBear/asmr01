import Link from 'next/link';
import { Check, X, Zap, ArrowLeft, BrainCircuit, Clock, Radio, Video, SlidersHorizontal, Volume2, Ear, TrendingUp, Languages } from 'lucide-react';
import type { Metadata } from 'next';
import { showcaseVideos } from '@/data/showcase-videos';
import VideoCard from '@/components/VideoCard';

export const metadata: Metadata = {
  title: 'AI vs. Traditional ASMR: The Future of Content Creation',
  description: 'A detailed comparison between AI-powered ASMR video generation using Google\'s Veo3 and traditional methods. Discover the advantages in cost, speed, quality, and scalability.',
  keywords: ['AI ASMR', 'Traditional ASMR', 'Veo3 AI', 'ASMR creation', 'AI video generator', 'content creation', 'ASMR comparison', 'ice cutting asmr', 'how to create ai asmr video'],
};


const comparisonData = [
  {
    feature: 'Equipment Cost',
    traditional: '$2,000 - $10,000',
    ai: '$0',
    icon: 'dollar-sign',
    explanation: 'Traditional ASMR requires expensive gear: high-fidelity microphones (like the Blue Yeti or 3Dio), 4K cameras, lighting, and soundproofing. With our AI, all you need is an idea—the generation happens on our powerful cloud servers, eliminating any hardware cost for you.',
  },
  {
    feature: 'Time to Create Video',
    traditional: '4-8 hours',
    ai: '30-60 seconds',
    icon: 'clock',
    explanation: 'A single traditional ASMR video involves setup, recording multiple takes, editing, sound mixing, and rendering. This can take half a day or more. Our Veo3-powered AI streamlines this entire process into under a minute, turning your text prompt into a ready-to-publish video instantly.',
  },
  {
    feature: 'Audio Quality',
    traditional: 'Depends on equipment',
    ai: 'Studio-grade 3D spatial',
    icon: 'audio-lines',
    explanation: 'Achieving immersive audio traditionally is difficult and depends heavily on microphone quality and placement. Our AI is trained on vast datasets to generate crisp, clear, and spatially-aware 3D audio that creates a truly tingly, immersive experience every time, without any technical setup.',
  },
  {
    feature: 'Video Quality',
    traditional: 'Up to 4K (with camera)',
    ai: '4K HDR guaranteed',
    icon: 'video',
    explanation: 'While you can shoot in 4K with a traditional camera, our AI guarantees perfect, noise-free 4K HDR video for every single creation. The visuals are vibrant, detailed, and optimized for modern displays, ensuring a premium viewing experience.',
  },
  {
    feature: 'ASMR Styles Available',
    traditional: 'Limited by skills',
    ai: '200+ instant styles',
    icon: 'sparkles',
    explanation: 'A traditional creator is limited by their physical props and skills. Our AI unlocks over 200 distinct ASMR styles, from classic triggers like soap cutting and slime to imaginative concepts like "glass fruit" or "cosmic nebula," giving you limitless creative freedom.',
  },
  {
    feature: 'Background Noise',
    traditional: '✓ (A common issue)',
    ai: '✗ (Never an issue)',
    icon: 'wind',
    explanation: 'Unwanted background noise (like traffic, pets, or computer fans) is a constant battle for traditional creators, often requiring expensive soundproofing. Our AI generates video in a pure digital environment, meaning your audio is always pristine and free of any distracting sounds.',
  },
  {
    feature: 'Consistency',
    traditional: 'Varies by mood/energy',
    ai: 'Perfect every time',
    icon: 'repeat',
    explanation: 'The quality of a traditional recording can be affected by the creator\'s mood, energy levels, or even a slight cold. The AI performs with perfect consistency 24/7, delivering the exact same high-quality output whenever you need it.',
  },
  {
    feature: 'Scalability',
    traditional: '1-2 videos/day max',
    ai: '50+ videos/day',
    icon: 'trending-up',
    explanation: 'Due to the lengthy production process, a creator can realistically only produce one or two high-quality videos per day. With AI, you can scale your content production massively, generating dozens of unique videos daily to feed multiple platforms like TikTok, YouTube Shorts, and Instagram Reels.',
  },
  {
    feature: 'Viral Optimization',
    traditional: '✗ (Manual effort)',
    ai: '✓ (Built-in)',
    icon: 'share-2',
    explanation: 'Traditional creators must manually research trends and optimize for virality. Our platform analyzes trending ASMR triggers and visual styles, and our pre-built templates are designed to be eye-catching and shareable, increasing your chances of going viral.',
  },
  {
    feature: 'Multiple Languages',
    traditional: '✗ (Language barrier)',
    ai: '✓ (Globally accessible)',
    icon: 'languages',
    explanation: 'Our AI understands prompts in multiple languages, allowing you to create content for a global audience without being a polyglot. This breaks down language barriers and dramatically expands your potential reach.',
  },
];

const Icon = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case 'dollar-sign': return <span className={className}>💰</span>;
    case 'clock': return <Clock className={className} />;
    case 'audio-lines': return <Volume2 className={className} />;
    case 'video': return <Video className={className} />;
    case 'sparkles': return <span className={className}>✨</span>;
    case 'wind': return <span className={className}>🌬️</span>;
    case 'repeat': return <span className={className}>🔄</span>;
    case 'trending-up': return <TrendingUp className={className} />;
    case 'share-2': return <BrainCircuit className={className} />;
    case 'languages': return <Languages className={className} />;
    default: return <Zap className={className} />;
  }
};

const featuredVideos = showcaseVideos.filter(v => v.id === 'glass-fruit-cutting-1' || v.id === 'ice-cutting-asmr-1');


export default function AiVsTraditionalPage() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="relative isolate overflow-hidden pt-14">
        <div 
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
          aria-hidden="true"
        >
          <div 
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8085ff] to-[#46caff] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="w-full flex justify-between items-center mb-8">
            <div className="w-1/3 flex justify-start">
              <Link 
                  href="/"
                  className="inline-flex items-center text-cyan-300 hover:text-cyan-200 text-base font-semibold group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back to Home
              </Link>
            </div>
            <div className="w-1/3 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium border border-cyan-400/30">
                <Zap className="w-4 h-4" />
                AI vs Traditional
              </div>
            </div>
            <div className="w-1/3"></div> {/*占位，确保中间元素居中*/}
          </div>

          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              The Future of ASMR is Here
            </h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
              Discover why AI-powered creation with Google's Veo3 isn't just an alternative—it's a massive leap forward. See the detailed breakdown of how it revolutionizes every aspect of ASMR content creation compared to traditional methods.
            </p>
          </div>

          {/* Featured Videos Section */}
          {featuredVideos.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center text-white mb-8">
                Examples of AI Magic
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {featuredVideos.map(video => (
                  <div key={video.id}>
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/#main-generator" target="_blank" rel="noopener noreferrer">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                    <Zap className="w-5 h-5 mr-2" />
                    Start Creating for Free
                  </button>
                </Link>
                <Link href="/video-showcase" target="_blank" rel="noopener noreferrer">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-slate-700/80 hover:bg-slate-700 text-white rounded-lg font-semibold text-base transition-all duration-300 border border-slate-600">
                     <Video className="w-5 h-5 mr-2" />
                     More AI Prompts & Videos
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Detailed Comparison Sections */}
          <div className="mt-20 space-y-16">
            {comparisonData.map((item, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className={index % 2 === 0 ? 'md:order-1' : 'md:order-2'}>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-slate-800/80 border border-slate-700/50 rounded-xl flex items-center justify-center">
                       <Icon name={item.icon} className="w-6 h-6 text-cyan-400" />
                     </div>
                    <h2 className="text-3xl font-bold text-white">{item.feature}</h2>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-lg">{item.explanation}</p>
                </div>
                <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} relative`}>
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-lg">
                      <div className="flex justify-between items-center">
                        <div className="text-center w-1/2">
                          <p className="text-sm text-slate-400 mb-2">Traditional</p>
                          <p className={`text-xl font-semibold ${item.feature === 'Background Noise' ? 'text-emerald-400' : 'text-slate-200'}`}>{item.traditional}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-600"></div>
                        <div className="text-center w-1/2">
                          <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400 font-medium mb-2">AI-Powered</p>
                          <p className={`text-xl font-bold ${item.feature === 'Background Noise' ? 'text-red-400' : 'text-purple-400'}`}>{item.ai}</p>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Table */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-white text-center mb-12">At a Glance: AI vs. Traditional ASMR</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 sm:p-6 text-white font-semibold text-base sm:text-lg">Feature</th>
                      <th className="text-center p-4 sm:p-6 text-slate-300 font-medium">Traditional ASMR Creation</th>
                      <th className="text-center p-4 sm:p-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 font-semibold">AI-Powered with Veo3</th>
                    </tr>
                  </thead>
                  <tbody className="text-white divide-y divide-slate-800">
                    {comparisonData.map((item) => (
                      <tr key={item.feature} className="hover:bg-slate-800/40 transition-colors duration-200">
                        <td className="p-4 sm:p-6 font-medium text-slate-200">{item.feature}</td>
                        <td className="p-4 sm:p-6 text-center text-slate-400">{item.traditional === '✓ (A common issue)' ? <Check className="mx-auto text-emerald-400" /> : item.traditional === '✗ (Never an issue)' ? <X className="mx-auto text-red-400" /> : item.traditional}</td>
                        <td className="p-4 sm:p-6 text-center font-bold text-purple-400">{item.ai === '✗ (Never an issue)' ? <X className="mx-auto text-red-400" /> : item.ai === '✓ (Built-in)' ? <Check className="mx-auto text-emerald-400" /> : item.ai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-24">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Revolutionize Your Content?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
              Stop waiting, start creating. Experience the speed, power, and creative freedom of AI-powered ASMR generation today.
            </p>
            <Link href="/#main-generator">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                Start Creating for Free
                <Zap className="w-5 h-5 ml-2" />
              </button>
            </Link>
          </div>
        </div>

         <div 
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" 
          aria-hidden="true"
        >
          <div 
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#667eea] to-[#764ba2] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>
      </div>
    </div>
  );
} 